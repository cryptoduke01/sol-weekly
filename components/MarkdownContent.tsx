'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  readingMode?: boolean;
}

export default function MarkdownContent({ content, readingMode = false }: MarkdownContentProps) {
  return (
    <div className={cn(
      'prose prose-invert max-w-none',
      readingMode && 'max-w-3xl mx-auto'
    )}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-light text-text-primary mb-4 md:mb-6 mt-8 md:mt-12 first:mt-0 leading-tight" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-text-primary mb-3 md:mb-4 mt-6 md:mt-10 leading-tight" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg md:text-xl lg:text-2xl font-light text-text-primary mb-2 md:mb-3 mt-4 md:mt-8 leading-tight" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className={cn(
              'text-text-secondary font-light leading-relaxed mb-4 md:mb-6',
              readingMode 
                ? 'text-base md:text-lg' 
                : 'text-sm md:text-base'
            )} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-none space-y-2 md:space-y-3 mb-4 md:mb-6 text-text-secondary font-light" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-none space-y-2 md:space-y-3 mb-4 md:mb-6 text-text-secondary font-light" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-sm md:text-base text-text-secondary font-light relative pl-5 md:pl-6 before:content-['•'] before:absolute before:left-0 before:text-text-muted" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-normal text-text-primary" {...props} />
          ),
          a: ({ node, ...props }: any) => {
            const href = props.href || '';
            const isTwitter = href.includes('twitter.com') || href.includes('x.com');
            return (
              <a 
                className={cn(
                  'text-text-primary border-b border-text-muted hover:border-text-primary transition-colors',
                  isTwitter && 'hover:text-blue-400'
                )}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                {...props}
              />
            );
          },
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code className="bg-bg-card px-1.5 py-0.5 rounded text-xs md:text-sm font-mono text-text-primary" {...props} />
              );
            }
            return (
              <code className="block bg-bg-card p-3 md:p-4 rounded mb-4 md:mb-6 overflow-x-auto text-xs md:text-sm font-mono text-text-primary" {...props} />
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-text-muted pl-4 md:pl-6 italic text-sm md:text-base text-text-secondary mb-4 md:mb-6 my-4 md:my-6" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
