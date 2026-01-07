'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';
import ShareModal from './ShareModal';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mt-12 pt-8 border-t border-bg-card/50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-sm font-light text-text-muted hover:text-text-primary transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      <ShareModal
        title={title}
        url={url}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
