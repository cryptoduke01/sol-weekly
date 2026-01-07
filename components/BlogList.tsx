'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { Roundup } from '@/lib/types';
import { formatDateShort } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BlogListProps {
  roundups: Roundup[];
}

export default function BlogList({ roundups }: BlogListProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const router = useRouter();

  const sortedRoundups = useMemo(() => {
    const sorted = [...roundups].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Group by week
    const grouped: { [key: string]: Roundup[] } = {};
    sorted.forEach((roundup) => {
      const week = `Week ${roundup.week}`;
      if (!grouped[week]) {
        grouped[week] = [];
      }
      grouped[week].push(roundup);
    });

    return grouped;
  }, [roundups, sortBy]);

  const handleClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    setLoadingSlug(slug);
    router.push(`/roundup/${slug}`);
  };

  return (
    <div>
      {/* Sort Controls */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSortBy('newest')}
            className={cn(
              'text-sm font-light transition-colors',
              sortBy === 'newest'
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            Newest
          </button>
          <span className="text-text-muted">/</span>
          <button
            onClick={() => setSortBy('oldest')}
            className={cn(
              'text-sm font-light transition-colors',
              sortBy === 'oldest'
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Blog List */}
      <div className="space-y-8">
        {Object.entries(sortedRoundups).map(([week, weekRoundups], index) => (
          <motion.div
            key={week}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <button
              onClick={() => setSelectedWeek(selectedWeek === week ? null : week)}
              className="flex w-full items-center justify-between mb-4 text-left"
            >
              <h2 className="text-2xl font-light text-text-primary">{week}</h2>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-text-muted transition-transform',
                  selectedWeek === week && 'rotate-180'
                )}
              />
            </button>

            {selectedWeek === week && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pl-4 border-l border-bg-card/50"
              >
                {weekRoundups.map((roundup) => (
                  <Link
                    key={roundup.slug}
                    href={`/roundup/${roundup.slug}`}
                    onClick={(e) => handleClick(e, roundup.slug)}
                    className="block group relative"
                  >
                    <div className="flex items-center gap-4 py-4 border-b border-bg-card/50 group-hover:border-text-muted/30 transition-colors">
                      {loadingSlug === roundup.slug && (
                        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50 z-10">
                          <Loader2 className="h-5 w-5 text-text-primary animate-spin" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-text-muted font-light">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateShort(roundup.date)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-light text-text-primary group-hover:text-text-secondary transition-colors">
                          {roundup.title}
                        </h3>
                        <p className="text-sm text-text-secondary font-light mt-1 line-clamp-1">
                          {roundup.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
