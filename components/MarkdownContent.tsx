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
            <h1 className="text-4xl font-light text-text-primary mb-6 mt-12 first:mt-0 leading-tight" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-light text-text-primary mb-4 mt-10 leading-tight" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-light text-text-primary mb-3 mt-8 leading-tight" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className={cn(
              'text-text-secondary font-light leading-relaxed mb-6',
              readingMode ? 'text-lg' : 'text-base'
            )} {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-none space-y-3 mb-6 text-text-secondary font-light" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-none space-y-3 mb-6 text-text-secondary font-light" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-text-secondary font-light relative pl-6 before:content-['•'] before:absolute before:left-0 before:text-text-muted" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-normal text-text-primary" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-text-primary border-b border-text-muted hover:border-text-primary transition-colors" {...props} />
          ),
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code className="bg-bg-card px-1.5 py-0.5 rounded text-sm font-mono text-text-primary" {...props} />
              );
            }
            return (
              <code className="block bg-bg-card p-4 rounded mb-6 overflow-x-auto text-sm font-mono text-text-primary" {...props} />
            );
          },
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-text-muted pl-6 italic text-text-secondary mb-6 my-6" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
