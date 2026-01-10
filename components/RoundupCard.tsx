'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/roundup/${roundup.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/roundup/${roundup.slug}`} onClick={handleClick}>
        <article
          className={cn(
            'group border-b border-bg-card/50 py-6 md:py-8 transition-colors hover:border-text-muted/30 relative',
            featured && 'pb-8 md:pb-12',
            isLoading && 'opacity-50 pointer-events-none'
          )}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="h-6 w-6 text-text-primary animate-spin" />
            </div>
          )}

          <div className="mb-3 md:mb-4 flex items-center gap-4 text-xs md:text-sm text-text-muted font-light">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 md:h-4 md:w-4" />
              <span>{formatDateShort(roundup.date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 md:h-4 md:w-4" />
              <span>{roundup.readingTime} min</span>
            </div>
          </div>

          <h2
            className={cn(
              'mb-3 md:mb-4 font-light text-text-primary transition-colors group-hover:text-text-secondary',
              featured 
                ? 'text-2xl md:text-3xl lg:text-4xl' 
                : 'text-xl md:text-2xl lg:text-3xl'
            )}
          >
            {roundup.title}
          </h2>

          <p className="text-sm md:text-base text-text-secondary font-light leading-relaxed mb-4">
            {roundup.description}
          </p>


          {roundup.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
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
