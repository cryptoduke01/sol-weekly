'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';
import { Roundup } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RoundupCardProps {
  roundup: Roundup;
  featured?: boolean;
}

export default function RoundupCard({
  roundup,
  featured = false,
}: RoundupCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/roundup/${roundup.slug}`}>
        <article
          className={cn(
            'group border-b border-bg-card/50 py-8 transition-colors hover:border-text-muted/30',
            featured && 'pb-12'
          )}
        >
          <div className="mb-4 flex items-center gap-4 text-sm text-text-muted font-light">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{formatDateShort(roundup.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{roundup.readingTime} min</span>
            </div>
          </div>

          <h2
            className={cn(
              'mb-4 font-light text-text-primary transition-colors group-hover:text-text-secondary',
              featured ? 'text-4xl' : 'text-3xl'
            )}
          >
            {roundup.title}
          </h2>

          <p className="text-base text-text-secondary font-light leading-relaxed mb-4">
            {roundup.description}
          </p>

          {/* Image Placeholder */}
          <div className="mt-6 w-full h-64 glass rounded-lg overflow-hidden border border-bg-card/50">
            <div className="w-full h-full bg-gradient-to-br from-bg-card/50 to-bg-card/30 flex items-center justify-center">
              <p className="text-text-muted text-sm font-light">Image placeholder</p>
            </div>
          </div>

          {roundup.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {roundup.categories.map((category) => (
                <span
                  key={category}
                  className="text-xs text-text-muted font-light"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </article>
      </Link>
    </motion.div>
  );
}
