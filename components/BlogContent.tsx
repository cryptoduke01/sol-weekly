'use client';

import MarkdownContent from './MarkdownContent';
import ReadingMode from './ReadingMode';
import { formatDate } from '@/lib/utils';

interface BlogContentProps {
  content: string;
  title: string;
  author: string;
  date: string;
}

export default function BlogContent({ content, title, author, date }: BlogContentProps) {
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <ReadingMode title={title} content={content} author={author} date={formatDate(date)} />
      </div>
      <MarkdownContent content={content} readingMode={false} />
    </div>
  );
}
