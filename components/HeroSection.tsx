'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Roundup } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import RoundupCard from './RoundupCard';

interface HeroSectionProps {
  latestRoundup: Roundup | null;
}

export default function HeroSection({ latestRoundup }: HeroSectionProps) {
  return (
    <section className="border-b border-bg-card/50 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-6xl font-light text-text-primary mb-6 tracking-tight">
            Solana Weekly Roundup
          </h1>
          <p className="text-xl text-text-secondary font-light leading-relaxed max-w-2xl">
            Weekly updates from the Solana ecosystem. Curated every Friday.
          </p>
        </motion.div>

        {latestRoundup && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-4 text-sm text-text-muted font-light tracking-wide uppercase">
              Latest • {formatDate(latestRoundup.date)}
            </div>
            <RoundupCard roundup={latestRoundup} featured />
            <Link
              href="/blog"
              className="mt-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors font-light"
            >
              <span>Read more roundups</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
