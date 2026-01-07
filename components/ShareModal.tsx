'use client';

import { X, Linkedin, Copy, Check, Instagram, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  title: string;
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ title, url, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: X,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-blue-500',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: `https://www.instagram.com/`,
      color: 'hover:text-pink-500',
      onClick: () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-green-500',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="bg-bg-card border border-bg-card/50 rounded-lg max-w-md w-full p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6">
                <h3 className="text-lg font-light text-text-primary mb-4">
                  Share
                </h3>
                <div className="border border-bg-card/50 bg-bg-card/30 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/me.jpg"
                        alt="Duke"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-light text-text-primary mb-1 line-clamp-2">
                        {title}
                      </p>
                      <p className="text-sm text-text-muted font-light">
                        by duke.sol
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {shareLinks.map((link) => {
                    const Icon = link.icon;
                    if (link.onClick) {
                      return (
                        <button
                          key={link.name}
                          onClick={link.onClick}
                          className={cn(
                            'p-4 border border-bg-card/50 rounded-lg text-text-muted hover:text-text-primary hover:border-text-muted/50 transition-colors flex flex-col items-center gap-2',
                            link.color
                          )}
                          aria-label={`Share on ${link.name}`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs font-light">{link.name}</span>
                        </button>
                      );
                    }
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          'p-4 border border-bg-card/50 rounded-lg text-text-muted hover:text-text-primary hover:border-text-muted/50 transition-colors flex flex-col items-center gap-2',
                          link.color
                        )}
                        aria-label={`Share on ${link.name}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-xs font-light">{link.name}</span>
                      </a>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-bg-card/50">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-bg-primary border border-bg-card/50 rounded text-sm text-text-primary font-light"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 border border-bg-card/50 rounded text-sm text-text-primary hover:bg-bg-card/50 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
