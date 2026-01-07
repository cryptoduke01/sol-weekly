'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, X } from 'lucide-react';
import { SolanaStats } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FloatingStatsBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { data, error, isLoading } = useSWR<SolanaStats>(
    '/api/solana-stats',
    fetcher,
    {
      refreshInterval: 10000, // Update every 10 seconds
      revalidateOnFocus: true,
    }
  );

  if (error || isLoading || !data || !isVisible) {
    return null;
  }

  const priceChange = data.priceChange24h;
  const isPositive = priceChange >= 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-40 border-t border-bg-card/50 bg-bg-primary/95 backdrop-blur-md transition-all duration-300 relative overflow-hidden',
            isExpanded ? 'h-[400px]' : 'h-16'
          )}
        >
          {/* Animated Live Indicator Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-transparent via-green-500 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />

          <div className="mx-auto max-w-7xl px-6 relative z-10">
            {/* Collapsed Bar */}
            <div
              className={cn(
                'flex items-center justify-between h-16',
                isExpanded && 'hidden'
              )}
            >
              <div className="flex items-center gap-8">
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
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Expand stats"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Hide stats"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Expanded View */}
            {isExpanded && (
              <div className="h-[384px] pt-4 pb-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-light text-text-primary uppercase tracking-wide">
                    Live Market Data
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                      aria-label="Collapse stats"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsVisible(false)}
                      className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
                      aria-label="Hide stats"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="space-y-1">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      Price
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      ${data.price.toFixed(2)}
                    </div>
                    <div className={cn(
                      'text-xs font-light flex items-center gap-1',
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

                  <div className="space-y-1">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      Market Cap
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.marketCap)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      TVL
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.tvl)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      TPS
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.tps)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      Active Wallets
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.activeWallets)}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs text-text-muted font-light uppercase tracking-wide">
                      24h Volume
                    </div>
                    <div className="text-xl text-text-primary font-light">
                      {formatNumber(data.volume24h)}
                    </div>
                  </div>
                </div>

                {/* Simple Chart Placeholder */}
                <div className="border-t border-bg-card/50 pt-6">
                  <div className="text-xs text-text-muted font-light mb-4 uppercase tracking-wide">
                    Price Chart (24h)
                  </div>
                  <div className="h-32 bg-bg-card/50 rounded flex items-center justify-center">
                    <p className="text-text-muted text-sm font-light">
                      Chart visualization coming soon
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
