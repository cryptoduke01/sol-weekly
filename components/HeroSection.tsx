'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Roundup } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import RoundupCard from './RoundupCard';

interface HeroSectionProps {
  latestRoundup: Roundup | null;
}

export default function HeroSection({ latestRoundup }: HeroSectionProps) {
  return (
    <section className="border-b border-bg-card/50 py-12 md:py-20">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-text-primary mb-4 md:mb-6 tracking-tight">
            Solana Weekly Roundup
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-text-secondary font-light leading-relaxed max-w-2xl mb-6">
            Weekly updates from the Solana ecosystem. Curated every Friday.
          </p>
          
          {/* HR Line */}
          <hr className="border-bg-card/50 mb-6" />

          {latestRoundup && (
            <div className="mb-4 text-sm text-text-muted font-light tracking-wide uppercase">
              Latest • {formatDate(latestRoundup.date)}
            </div>
          )}
        </motion.div>

        {latestRoundup && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Featured Image with Gradient Overlay */}
            <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 rounded-lg overflow-hidden border border-bg-card/50">
              <Image
                src="/placeholder.PNG"
                alt={latestRoundup.title}
                fill
                className="object-cover object-top"
                priority
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
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
