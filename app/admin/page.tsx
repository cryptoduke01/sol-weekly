'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Download, Trash2, Loader2, Lock, Eye, EyeOff, Send, TestTube, Check, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriberData {
  count: number;
  subscribers: string[];
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SubscriberData | null>(null);
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError('Please enter an admin key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/subscribe?key=${encodeURIComponent(adminKey)}`);
      
      if (response.ok) {
        const subscriberData = await response.json();
        setData(subscriberData);
        setIsAuthenticated(true);
        localStorage.setItem('admin_key', adminKey);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Invalid admin key';
        const hint = errorData.hint || '';
        
        // Show specific error messages with hints
        if (errorMessage.includes('not configured')) {
          setError('Admin authentication is not configured on the server. Please contact the administrator.');
        } else if (errorMessage.includes('Invalid admin key') || errorMessage.includes('Unauthorized')) {
          const fullMessage = hint ? `${errorMessage}. ${hint}` : errorMessage;
          setError(fullMessage);
          console.error('Admin login failed:', { error: errorMessage, hint });
        } else {
          setError(errorMessage);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError('Failed to connect. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    const savedKey = localStorage.getItem('admin_key') || adminKey;
    if (!savedKey) return;

    try {
      const response = await fetch(`/api/subscribe?key=${encodeURIComponent(savedKey)}`);
      if (response.ok) {
        const subscriberData = await response.json();
        setData(subscriberData);
      }
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    }
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('admin_key');
    if (savedKey) {
      setAdminKey(savedKey);
      fetchSubscribers().then(() => {
        setIsAuthenticated(true);
      });
    }
  }, []);

  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;

    const savedKey = localStorage.getItem('admin_key') || adminKey;
    try {
      const response = await fetch('/api/subscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, key: savedKey }),
      });

      if (response.ok) {
        // Refresh the list
        await fetchSubscribers();
      } else {
        alert('Failed to delete email');
      }
    } catch (err) {
      alert('Failed to delete email');
    }
  };

  const handleExport = () => {
    if (!data || !data.subscribers.length) return;

    const csv = data.subscribers.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
    setData(null);
    setError('');
    setNewsletterStatus(null);
    setShowTestModal(false);
    setTestEmail('');
  };

  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsTestingEmail(true);
    setNewsletterStatus(null);

    try {
      const savedKey = localStorage.getItem('admin_key') || adminKey;
      const response = await fetch('/api/newsletter/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminKey: savedKey,
          testEmail: testEmail.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNewsletterStatus({
          type: 'success',
          message: `Test email sent to ${testEmail}! Check your inbox and spam folder.`,
        });
        setTestEmail('');
        setShowTestModal(false);
      } else {
        setNewsletterStatus({
          type: 'error',
          message: result.error || 'Failed to send test email',
        });
      }
    } catch (err: any) {
      setNewsletterStatus({
        type: 'error',
        message: `Failed to send test email: ${err.message || 'Unknown error'}`,
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!confirm(`Send newsletter to all ${data?.count || 0} subscribers?`)) {
      return;
    }

    setIsSendingNewsletter(true);
    setNewsletterStatus(null);

    try {
      const savedKey = localStorage.getItem('admin_key') || adminKey;
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminKey: savedKey,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setNewsletterStatus({
          type: 'success',
          message: `Newsletter sent successfully! ${result.sent || 0} emails sent${result.failed > 0 ? ` (${result.failed} failed)` : ''}.`,
        });
      } else {
        setNewsletterStatus({
          type: 'error',
          message: result.error || 'Failed to send newsletter',
        });
      }
    } catch (err: any) {
      setNewsletterStatus({
        type: 'error',
        message: `Failed to send newsletter: ${err.message || 'Unknown error'}`,
      });
    } finally {
      setIsSendingNewsletter(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-bg-card/50 rounded-lg p-8"
        >
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-bg-card mb-4">
              <Lock className="h-6 w-6 text-text-muted" />
            </div>
            <h1 className="text-2xl font-light text-text-primary mb-2">
              Admin Access
            </h1>
            <p className="text-sm text-text-muted font-light">
              Enter your admin key to view subscribers
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
              <input
                type={showKey ? 'text' : 'password'}
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
                className="w-full pl-10 pr-10 py-3 bg-bg-primary border border-bg-card/50 rounded-lg text-text-primary placeholder:text-text-muted font-light text-sm focus:outline-none focus:border-text-muted/50 transition-colors"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-light text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full py-3 border border-bg-card/50 rounded-lg text-sm font-light transition-colors flex items-center justify-center gap-2',
                isLoading
                  ? 'bg-bg-card text-text-muted cursor-not-allowed'
                  : 'bg-bg-card hover:bg-bg-card/80 text-text-primary hover:border-text-muted/50 cursor-pointer'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Admin Panel</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-light text-text-primary mb-2">
              Email Subscribers
            </h1>
            <p className="text-sm text-text-muted font-light">
              Manage your mailing list
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-bg-card/50 rounded-lg text-sm font-light text-text-muted hover:text-text-primary hover:border-text-muted/50 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        {data && (
          <div className="border border-bg-card/50 rounded-lg p-6 mb-8 bg-bg-card/30">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-bg-card flex items-center justify-center">
                  <Mail className="h-5 w-5 text-text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-light text-text-primary">
                    {data.count}
                  </p>
                  <p className="text-xs text-text-muted font-light">
                    Total Subscribers
                  </p>
                </div>
              </div>
              <button
                onClick={handleExport}
                disabled={!data.count}
                className={cn(
                  'px-4 py-2 border border-bg-card/50 rounded-lg text-sm font-light transition-colors flex items-center gap-2',
                  data.count
                    ? 'bg-bg-card hover:bg-bg-card/80 text-text-primary hover:border-text-muted/50 cursor-pointer'
                    : 'bg-bg-card/50 text-text-muted cursor-not-allowed'
                )}
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Newsletter Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-bg-card/50">
              <button
                onClick={() => setShowTestModal(true)}
                disabled={isTestingEmail || isSendingNewsletter}
                className={cn(
                  'px-4 py-2 border border-bg-card/50 rounded-lg text-sm font-light transition-colors flex items-center gap-2',
                  isTestingEmail || isSendingNewsletter
                    ? 'bg-bg-card/50 text-text-muted cursor-not-allowed'
                    : 'bg-bg-card hover:bg-bg-card/80 text-text-primary hover:border-text-muted/50 cursor-pointer'
                )}
              >
                {isTestingEmail ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4" />
                    <span>Test Email</span>
                  </>
                )}
              </button>
              <button
                onClick={handleSendNewsletter}
                disabled={!data.count || isSendingNewsletter || isTestingEmail}
                className={cn(
                  'px-4 py-2 border border-bg-card/50 rounded-lg text-sm font-light transition-colors flex items-center gap-2',
                  !data.count || isSendingNewsletter || isTestingEmail
                    ? 'bg-bg-card/50 text-text-muted cursor-not-allowed'
                    : 'bg-bg-card hover:bg-bg-card/80 text-text-primary hover:border-text-muted/50 cursor-pointer'
                )}
              >
                {isSendingNewsletter ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Newsletter</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {newsletterStatus && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'mt-4 p-3 rounded-lg flex items-center gap-2 text-sm',
                  newsletterStatus.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/50 text-green-500'
                    : 'bg-red-500/20 border border-red-500/50 text-red-500'
                )}
              >
                {newsletterStatus.type === 'success' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <p className="font-light">{newsletterStatus.message}</p>
                <button
                  onClick={() => setNewsletterStatus(null)}
                  className="ml-auto text-current hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Test Email Modal */}
        {showTestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-bg-card border border-bg-card/50 rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-light text-text-primary">Send Test Email</h3>
                <button
                  onClick={() => {
                    setShowTestModal(false);
                    setTestEmail('');
                  }}
                  className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-bg-primary border border-bg-card/50 rounded-lg text-text-primary placeholder:text-text-muted font-light text-sm focus:outline-none focus:border-text-muted/50 transition-colors"
                    disabled={isTestingEmail}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isTestingEmail) {
                        handleTestEmail();
                      }
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleTestEmail}
                    disabled={isTestingEmail || !testEmail.includes('@')}
                    className={cn(
                      'flex-1 px-4 py-2 border border-bg-card/50 rounded-lg text-sm font-light transition-colors flex items-center justify-center gap-2',
                      isTestingEmail || !testEmail.includes('@')
                        ? 'bg-bg-card/50 text-text-muted cursor-not-allowed'
                        : 'bg-bg-card hover:bg-bg-card/80 text-text-primary hover:border-text-muted/50 cursor-pointer'
                    )}
                  >
                    {isTestingEmail ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Test</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowTestModal(false);
                      setTestEmail('');
                    }}
                    disabled={isTestingEmail}
                    className="px-4 py-2 border border-bg-card/50 rounded-lg text-sm font-light text-text-muted hover:text-text-primary hover:border-text-muted/50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Email List */}
        {data && data.subscribers.length > 0 ? (
          <div className="border border-bg-card/50 rounded-lg overflow-hidden">
            <div className="divide-y divide-bg-card/50">
              {data.subscribers.map((email, index) => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-bg-card/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-bg-card flex items-center justify-center flex-shrink-0">
                      <Mail className="h-4 w-4 text-text-muted" />
                    </div>
                    <p className="text-sm md:text-base font-light text-text-primary truncate">
                      {email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(email)}
                    className="p-2 text-text-muted hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Delete email"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-bg-card/50 rounded-lg p-12 text-center">
            <Mail className="h-12 w-12 text-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-base font-light text-text-secondary">
              No subscribers yet
            </p>
            <p className="text-sm text-text-muted font-light mt-2">
              Subscribers will appear here once they sign up
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

