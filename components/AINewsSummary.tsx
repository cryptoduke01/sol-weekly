'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock } from 'lucide-react';
import useSWR from 'swr';

interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Fallback news data
const fallbackNews: NewsItem[] = [
  {
    title: 'Morgan Stanley files ETF applications for bitcoin and solana',
    source: 'Yahoo Finance',
    url: 'https://finance.yahoo.com',
  },
  {
    title: 'US spot Solana ETFs record $10.43M net inflow in single day',
    source: 'AMBCrypto',
    url: 'https://ambcrypto.com',
  },
  {
    title: 'Solana RWA ecosystem hits record $873M in January 2026, up 325% in one year',
    source: 'Cryptonews',
    url: 'https://cryptonews.com',
  },
  {
    title: 'Alpenglow upgrade to reduce finality from 12.8s to 100-150ms launching early-mid 2026',
    source: 'Allinvest',
    url: 'https://allinvest.com',
  },
  {
    title: 'Short liquidation imbalance soars 19,138% as SOL rebounds to $126.57 daily high',
    source: 'TradingView',
    url: 'https://tradingview.com',
  },
  {
    title: 'Jupiter launches new perpetuals trading platform with zero slippage',
    source: 'The Block',
    url: 'https://theblock.co',
  },
  {
    title: 'Solana network processes record 65M transactions in single day',
    source: 'CoinDesk',
    url: 'https://coindesk.com',
  },
  {
    title: 'New DeFi protocols on Solana attract $500M in first week',
    source: 'Decrypt',
    url: 'https://decrypt.co',
  },
];

export default function AINewsSummary() {
  const [news, setNews] = useState<NewsItem[]>(fallbackNews);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Try to fetch news from API (you can replace this with actual API)
  // For now, we'll use fallback and rotate news items
  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate and shuffle news items to simulate live updates
      const shuffled = [...fallbackNews].sort(() => Math.random() - 0.5);
      setNews(shuffled.slice(0, 5));
      setLastUpdate(new Date());
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (date: Date) => {
    const minutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

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
            AI News Summary
          </h2>
          <div className="flex items-center gap-2 text-xs text-text-muted font-light">
            <Clock className="h-3 w-3" />
            <span>updated {getTimeAgo(lastUpdate)}</span>
          </div>
        </div>

        <div className="space-y-4">
          {news.map((item, index) => (
            <motion.a
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-b border-bg-card/50 pb-4 last:border-0 last:pb-0 transition-colors hover:border-text-muted/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-base text-text-primary font-light mb-1 group-hover:text-text-secondary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-muted font-light">{item.source}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-text-muted group-hover:text-text-primary transition-colors flex-shrink-0 mt-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
