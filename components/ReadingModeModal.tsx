'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Highlighter, Share2, Copy, Check, Scissors } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ReadingModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  author: string;
  date: string;
}

export default function ReadingModeModal({
  isOpen,
  onClose,
  title,
  content,
  author,
  date,
}: ReadingModeModalProps) {
  const [selectedText, setSelectedText] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString().trim());
      }
    };

    if (isOpen) {
      document.addEventListener('mouseup', handleSelection);
    }

    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, [isOpen]);

  const handleHighlight = () => {
    if (selectedText && !highlights.includes(selectedText)) {
      setHighlights([...highlights, selectedText]);
      setSelectedText('');
    }
  };

  const handleCreateClip = () => {
    if (selectedText) {
      const clipText = `${selectedText}\n\n— ${title}\nby ${author}`;
      navigator.clipboard.writeText(clipText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setSelectedText('');
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <div className="bg-bg-card border border-bg-card/50 rounded-lg w-full max-w-4xl h-[90vh] flex flex-col relative">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-bg-card/50">
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden">
                    <Image
                      src="/me.jpg"
                      alt={author}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-light text-text-primary">{author}</p>
                    <p className="text-xs text-text-muted font-light">{date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedText && (
                    <>
                      <button
                        onClick={handleHighlight}
                        className="p-2 text-text-muted hover:text-text-primary transition-colors border border-bg-card/50 rounded"
                        title="Highlight"
                      >
                        <Highlighter className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCreateClip}
                        className="p-2 text-text-muted hover:text-text-primary transition-colors border border-bg-card/50 rounded"
                        title="Create clip"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Scissors className="h-4 w-4" />
                        )}
                      </button>
                    </>
                  )}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-text-muted hover:text-blue-400 transition-colors border border-bg-card/50 rounded"
                    title="Share on X"
                  >
                    <Share2 className="h-4 w-4" />
                  </a>
                  <button
                    onClick={onClose}
                    className="p-2 text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto p-8 prose prose-invert max-w-none"
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.25rem',
                  lineHeight: '1.8',
                }}
              >
                <h1 className="text-4xl font-light text-text-primary mb-6 leading-tight">
                  {title}
                </h1>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-6 text-text-secondary font-light leading-relaxed" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-3xl font-light text-text-primary mb-4 mt-10 leading-tight" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-2xl font-light text-text-primary mb-3 mt-8 leading-tight" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-normal text-text-primary" {...props} />
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>

                {/* Highlighted sections */}
                {highlights.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-bg-card/50">
                    <h3 className="text-xl font-light text-text-primary mb-4">Highlights</h3>
                    <div className="space-y-3">
                      {highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="p-4 bg-bg-card/50 border-l-2 border-text-muted rounded"
                        >
                          <p className="text-text-secondary font-light italic">"{highlight}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clip Card Preview */}
              {selectedText && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute bottom-4 left-4 right-4 bg-bg-primary border border-bg-card/50 rounded-lg p-6 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src="/me.jpg"
                        alt={author}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-light text-text-primary mb-2">
                        "{selectedText}"
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-muted font-light">
                        <span>{title}</span>
                        <span>•</span>
                        <span>by {author}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

