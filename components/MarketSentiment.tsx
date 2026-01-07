'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import useSWR from 'swr';
import { cn } from '@/lib/utils';

interface SentimentData {
  fundingRate: number;
  openInterest: number;
  openInterestChange: number;
  longShortRatio: number;
  takerFlow: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MarketSentiment() {
  const { data: sentiment, error, isLoading } = useSWR<SentimentData>(
    '/api/sentiment',
    fetcher,
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: true,
    }
  );

  if (isLoading || error || !sentiment) {
    // Fallback to mock data
    const mockSentiment = [
      {
        label: 'Funding Rate',
        value: '+0.0100%',
        trend: 'up' as const,
        description: 'Slightly bullish',
      },
      {
        label: 'Open Interest',
        value: '$1.38B',
        trend: 'up' as const,
        description: 'Rising (+3.7%)',
      },
      {
        label: 'Positioning',
        value: '2.55 L/S',
        trend: 'up' as const,
        description: 'Heavy longs',
      },
      {
        label: 'Taker Flow',
        value: '1.16',
        trend: 'up' as const,
        description: 'Buyers lead',
      },
    ];

    return <SentimentDisplay data={mockSentiment} />;
  }

  // Format real data
  const sentimentDisplay = [
    {
      label: 'Funding Rate',
      value: `${sentiment.fundingRate >= 0 ? '+' : ''}${sentiment.fundingRate.toFixed(4)}%`,
      trend: sentiment.fundingRate >= 0 ? ('up' as const) : ('down' as const),
      description: sentiment.fundingRate >= 0 ? 'Bullish' : 'Bearish',
    },
    {
      label: 'Open Interest',
      value: `$${(sentiment.openInterest / 1e9).toFixed(2)}B`,
      trend: sentiment.openInterestChange >= 0 ? ('up' as const) : ('down' as const),
      description: `${sentiment.openInterestChange >= 0 ? '+' : ''}${sentiment.openInterestChange.toFixed(1)}%`,
    },
    {
      label: 'Positioning',
      value: `${sentiment.longShortRatio.toFixed(2)} L/S`,
      trend: sentiment.longShortRatio > 1 ? ('up' as const) : ('down' as const),
      description: sentiment.longShortRatio > 1 ? 'Heavy longs' : 'Heavy shorts',
    },
    {
      label: 'Taker Flow',
      value: sentiment.takerFlow.toFixed(2),
      trend: sentiment.takerFlow > 1 ? ('up' as const) : ('down' as const),
      description: sentiment.takerFlow > 1 ? 'Buyers lead' : 'Sellers lead',
    },
  ];

  return <SentimentDisplay data={sentimentDisplay} />;
}

function SentimentDisplay({ data }: { data: Array<{ label: string; value: string; trend: 'up' | 'down' | 'neutral'; description?: string }> }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-bg-card/50 py-12"
    >
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-2xl font-light text-text-primary mb-8">Market Sentiment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-bg-card/50 bg-bg-card/30 p-6 rounded-lg"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-text-muted font-light uppercase tracking-wide">
                  {item.label}
                </span>
                {item.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
                {item.trend === 'down' && (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                {item.trend === 'neutral' && (
                  <Minus className="h-4 w-4 text-text-muted" />
                )}
              </div>
              <div className="mb-1 text-2xl font-light text-text-primary">
                {item.value}
              </div>
              {item.description && (
                <div className="text-xs text-text-muted font-light">
                  {item.description}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
