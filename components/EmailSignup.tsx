'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, Loader2, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully added to mailing list!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  const closeModal = () => {
    setStatus('idle');
    setMessage('');
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="border-t border-bg-card/50 py-12 md:py-16"
      >
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-light text-text-primary mb-3">
              Stay Updated
            </h2>
            <p className="text-base md:text-lg text-text-secondary font-light max-w-2xl mx-auto">
              Get the weekly roundup delivered to your inbox every Friday.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={cn(
                    'w-full pl-10 pr-4 py-3 bg-bg-primary border border-bg-card/50 rounded-lg text-text-primary placeholder:text-text-muted font-light text-sm md:text-base focus:outline-none focus:border-text-muted/50 transition-colors',
                    status === 'error' && !message && 'border-red-500/50'
                  )}
                  disabled={status === 'loading' || status === 'success'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={cn(
                  'px-4 md:px-6 py-3 border border-bg-card/50 rounded-lg text-sm md:text-base font-light transition-colors flex items-center justify-center gap-2 min-w-[120px] sm:min-w-[140px]',
                  status === 'loading'
                    ? 'bg-bg-card text-text-muted cursor-not-allowed'
                    : 'bg-bg-card hover:bg-bg-card/80 text-text-primary hover:border-text-muted/50 cursor-pointer'
                )}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Subscribing...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>

            <p className="mt-4 text-xs md:text-sm text-text-muted font-light text-center">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </motion.section>

      {/* Success Modal */}
      <AnimatePresence>
        {status === 'success' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
            >
              <div 
                className="bg-bg-card border border-bg-card/50 rounded-lg max-w-md w-full p-6 md:p-8 relative pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center text-center pt-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1
                    }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                    <div className="relative h-16 w-16 md:h-20 md:w-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500">
                      <Check className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
                    </div>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl font-light text-text-primary mb-3"
                  >
                    Successfully Added!
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm md:text-base font-light text-green-500 mb-4"
                  >
                    {message}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs md:text-sm text-text-muted font-light max-w-sm"
                  >
                    You'll receive the weekly roundup delivered to your inbox every Friday.
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={closeModal}
                    className="mt-6 px-6 py-2 border border-bg-card/50 rounded-lg text-sm font-light text-text-primary hover:bg-bg-card/80 transition-colors cursor-pointer"
                  >
                    Got it
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {status === 'error' && message && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none"
            >
              <div 
                className="bg-bg-card border border-red-500/50 rounded-lg max-w-md w-full p-6 md:p-8 relative pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center text-center pt-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1
                    }}
                    className="relative mb-6"
                  >
                    <div className="relative h-16 w-16 md:h-20 md:w-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500">
                      <AlertCircle className="h-8 w-8 md:h-10 md:w-10 text-red-500" />
                    </div>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl font-light text-text-primary mb-3"
                  >
                    {message.includes('already subscribed') ? 'Already Subscribed' : 'Oops! Something Went Wrong'}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm md:text-base font-light text-text-secondary mb-4 max-w-sm"
                  >
                    {message.includes('already subscribed') 
                      ? "This email is already on our mailing list. You'll receive the weekly roundup every Friday."
                      : message
                    }
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={closeModal}
                    className="mt-4 px-6 py-2 border border-bg-card/50 rounded-lg text-sm font-light text-text-primary hover:bg-bg-card/80 transition-colors cursor-pointer"
                  >
                    {message.includes('already subscribed') ? 'Got it' : 'Try Again'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
