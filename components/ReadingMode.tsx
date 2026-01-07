'use client';

import { useState } from 'react';
    import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReadingModeModal from './ReadingModeModal';

interface ReadingModeProps {
  title: string;
  content: string;
  author: string;
  date: string;
}

export default function ReadingMode({ title, content, author, date }: ReadingModeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 border border-bg-card/50 rounded-lg text-sm font-light transition-colors bg-transparent text-text-muted hover:text-text-primary hover:border-text-muted/50"
        aria-label="Open reading mode"
      >
        <BookOpen className="h-4 w-4" />
        <span>Reading Mode</span>
      </button>

      <ReadingModeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        content={content}
        author={author}
        date={date}
      />
    </>
  );
}
