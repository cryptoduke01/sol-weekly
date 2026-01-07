'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentData {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  description?: string;
}

export default function MarketSentiment() {
  // Mock sentiment data - in production, fetch from API
  const sentiment: SentimentData[] = [
    {
      label: 'Funding Rate',
      value: '+0.0100%',
      trend: 'up',
      description: 'Slightly bullish',
    },
    {
      label: 'Open Interest',
      value: '$1.38B',
      trend: 'up',
      description: 'Rising (+3.7%)',
    },
    {
      label: 'Positioning',
      value: '2.55 L/S',
      trend: 'up',
      description: 'Heavy longs',
    },
    {
      label: 'Taker Flow',
      value: '1.16',
      trend: 'up',
      description: 'Buyers lead',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-bg-card/50 py-12"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-light text-text-primary uppercase tracking-wide">
            Leverage Sentiment
          </h2>
          <span className="text-xs text-text-muted font-light">via Binance</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sentiment.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass border border-bg-card/50 p-4 rounded-lg"
            >
              <div className="mb-2 text-xs text-text-muted font-light uppercase tracking-wide">
                {item.label}
              </div>
              <div className="mb-1 text-lg text-text-primary font-light">
                {item.value}
              </div>
              {item.description && (
                <div className="flex items-center gap-1.5 text-xs text-text-muted font-light">
                  {item.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {item.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                  {item.trend === 'neutral' && <Minus className="h-3 w-3" />}
                  <span>{item.description}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

