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

export default function AINewsSummary() {
  const { data: news, error, isLoading } = useSWR<NewsItem[]>(
    '/api/news',
    fetcher,
    {
      refreshInterval: 300000, // 5 minutes
      revalidateOnFocus: true,
    }
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (news && news.length > 0 && news[currentIndex]?.publishedAt) {
      const updateTimeAgo = () => {
        const published = new Date(news[currentIndex].publishedAt!);
        const now = new Date();
        const diffMs = now.getTime() - published.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) setTimeAgo('Just now');
        else if (diffMins < 60) setTimeAgo(`${diffMins}m ago`);
        else if (diffMins < 1440) setTimeAgo(`${Math.floor(diffMins / 60)}h ago`);
        else setTimeAgo(`${Math.floor(diffMins / 1440)}d ago`);
      };

      updateTimeAgo();
      const interval = setInterval(updateTimeAgo, 60000);
      return () => clearInterval(interval);
    }
  }, [news, currentIndex]);

  useEffect(() => {
    if (news && news.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [news]);

  if (isLoading) {
    return null;
  }

  if (error || !news || news.length === 0) {
    return null;
  }

  const currentNews = news[currentIndex];

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
          <h2 className="text-2xl font-light text-text-primary">AI News Summary</h2>
          {timeAgo && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted font-light">
              <Clock className="h-3 w-3" />
              <span>Updated {timeAgo}</span>
            </div>
          )}
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="border border-bg-card/50 bg-bg-card/30 p-6 rounded-lg"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="text-xs text-text-muted font-light uppercase tracking-wide">
              {currentNews.source}
            </span>
          </div>
          <h3 className="text-lg font-light text-text-primary mb-3 leading-relaxed">
            {currentNews.title}
          </h3>
          <a
            href={currentNews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <span>Read more</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>

        {news.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  index === currentIndex
                    ? 'w-6 bg-text-primary'
                    : 'w-1.5 bg-text-muted hover:bg-text-secondary'
                )}
                aria-label={`Go to news ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
