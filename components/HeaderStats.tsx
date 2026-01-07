'use client';

import useSWR from 'swr';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { SolanaStats } from '@/lib/types';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HeaderStats() {
  const { data, error, isLoading } = useSWR<SolanaStats>(
    '/api/solana-stats',
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    }
  );

  if (error || isLoading || !data) {
    return null;
  }

  const priceChange = data.priceChange24h;
  const isPositive = priceChange >= 0;

  return (
    <div className="flex items-center gap-4 text-xs font-light">
      <div className="flex items-center gap-2">
        <span className="text-text-muted">SOL</span>
        <span className="text-text-primary">${data.price.toFixed(2)}</span>
        <div className={cn(
          'flex items-center gap-1',
          isPositive ? 'text-green-500' : 'text-red-500'
        )}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{Math.abs(priceChange).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}

