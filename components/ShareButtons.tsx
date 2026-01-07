'use client';

import { Twitter, Linkedin, Copy, Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showSocial, setShowSocial] = useState(false);

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
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-blue-500',
    },
  ];

  return (
    <div className="mt-12 pt-8 border-t border-bg-card/50">
      <div className="mb-6">
        <h3 className="text-sm font-light text-text-primary mb-4 uppercase tracking-wide">
          Share this article
        </h3>
        <div className="border border-bg-card/50 bg-bg-card/30 p-6 rounded-lg">
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
            <button
              onClick={() => setShowSocial(!showSocial)}
              className="p-2 text-text-muted hover:text-text-primary transition-colors border border-bg-card/50 rounded"
              aria-label="Toggle share options"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSocial && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-4 pb-4">
              <span className="text-xs text-text-muted font-light uppercase tracking-wide">Share</span>
              <div className="flex items-center gap-3">
                {shareLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'text-text-muted hover:text-text-primary transition-colors',
                        link.color
                      )}
                      aria-label={`Share on ${link.name}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
                <button
                  onClick={handleCopy}
                  className="text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Copy link"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
