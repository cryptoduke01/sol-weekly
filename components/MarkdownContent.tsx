'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-invert max-w-none"
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl font-light text-text-primary mb-4 mt-8 first:mt-0" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-3xl font-light text-text-primary mb-3 mt-6" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-2xl font-light text-text-primary mb-2 mt-4" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="text-base text-text-secondary font-light leading-relaxed mb-4" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside space-y-2 mb-4 text-text-secondary font-light" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside space-y-2 mb-4 text-text-secondary font-light" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="text-text-secondary font-light" {...props} />
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
            <code className="block bg-bg-card p-4 rounded mb-4 overflow-x-auto text-sm font-mono text-text-primary" {...props} />
          );
        },
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-2 border-text-muted pl-4 italic text-text-secondary mb-4" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

