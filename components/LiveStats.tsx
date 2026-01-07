'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { SolanaStats } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LiveStats() {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div className="border-t border-bg-card/50 bg-bg-primary relative overflow-hidden">
      {/* Animated Live Indicator Lines */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />

      <div className="mx-auto max-w-7xl px-6">
        {/* Collapsed View */}
        <div
          className={cn(
            'flex items-center justify-center py-4',
            isExpanded && 'hidden'
          )}
        >
          <div className="flex items-center gap-8 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-light">SOL</span>
              <span className="text-base text-text-primary font-light">
                ${data.price.toFixed(2)}
              </span>
              <div className={cn(
                'flex items-center gap-1 text-xs font-light',
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

            <div className="hidden md:flex items-center gap-6 text-xs text-text-muted font-light">
              <div>
                <span className="text-text-subtle">MCap: </span>
                {formatNumber(data.marketCap)}
              </div>
              <div>
                <span className="text-text-subtle">TVL: </span>
                {formatNumber(data.tvl)}
              </div>
              <div>
                <span className="text-text-subtle">TPS: </span>
                {formatNumber(data.tps)}
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(true)}
              className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Expand stats"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-light text-text-primary uppercase tracking-wide">
                    Live Market Data
                  </h3>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Collapse stats"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
                  <div className="space-y-1 text-center">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      Price
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      ${data.price.toFixed(2)}
                    </div>
                    <div className={cn(
                      'text-xs font-light flex items-center justify-center gap-1',
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

                  <div className="space-y-1 text-center">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      Market Cap
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.marketCap)}
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      TVL
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.tvl)}
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      TPS
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.tps)}
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      Active Wallets
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.activeWallets)}
                    </div>
                  </div>

                  <div className="space-y-1 text-center">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      24h Volume
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.volume24h)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
