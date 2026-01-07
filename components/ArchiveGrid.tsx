'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Roundup } from '@/lib/types';
import RoundupCard from './RoundupCard';

interface ArchiveGridProps {
  roundups: Roundup[];
}

export default function ArchiveGrid({ roundups }: ArchiveGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoundups = useMemo(() => {
    if (!searchQuery) return roundups;
    
    return roundups.filter((roundup) => {
      const query = searchQuery.toLowerCase();
      return (
        roundup.title.toLowerCase().includes(query) ||
        roundup.description.toLowerCase().includes(query) ||
        roundup.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    });
  }, [roundups, searchQuery]);

  return (
    <div>
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-b border-bg-card/50 bg-transparent py-3 pl-6 pr-4 text-text-primary placeholder:text-text-muted focus:border-text-muted/30 focus:outline-none text-sm font-light"
          />
        </div>
      </div>

      {filteredRoundups.length > 0 ? (
        <div className="space-y-0">
          {filteredRoundups.map((roundup) => (
            <RoundupCard key={roundup.slug} roundup={roundup} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-text-muted font-light">No roundups found.</p>
        </div>
      )}
    </div>
  );
}
