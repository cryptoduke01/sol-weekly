'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SolanaStats } from '@/lib/types';
import { formatNumber, formatLargeNumber } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LiveStats() {
  const { data, error, isLoading } = useSWR<SolanaStats>(
    '/api/solana-stats',
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  if (error || isLoading || !data) {
    return null; // Hide stats if loading or error - keep it minimal
  }

  const stats = [
    { label: 'Price', value: `$${data.price.toFixed(2)}` },
    { label: 'Market Cap', value: formatNumber(data.marketCap) },
    { label: 'TVL', value: formatNumber(data.tvl) },
    { label: '24h Change', value: `${data.priceChange24h >= 0 ? '+' : ''}${data.priceChange24h.toFixed(2)}%` },
  ];

  return (
    <div className="border-t border-bg-card/50 py-8">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-xs text-text-muted font-light mb-1 uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-sm text-text-primary font-light">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
