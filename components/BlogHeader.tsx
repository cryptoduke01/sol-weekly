'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { Roundup } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface BlogHeaderProps {
  roundup: Roundup;
}

export default function BlogHeader({ roundup }: BlogHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="mb-8 flex items-center gap-4 text-sm text-text-muted font-light">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(roundup.date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{roundup.readingTime} min read</span>
        </div>
      </div>

      <h1 className="text-5xl font-light text-text-primary mb-6 tracking-tight">
        {roundup.title}
      </h1>

      <p className="text-xl text-text-secondary font-light leading-relaxed mb-8">
        {roundup.description}
      </p>

      {/* Featured Image Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full h-96 border border-bg-card/50 rounded-lg overflow-hidden bg-bg-card/30"
      >
        <div className="w-full h-full bg-gradient-to-br from-bg-card/50 to-bg-card/30 flex items-center justify-center">
          <p className="text-text-muted text-sm font-light">Featured image placeholder</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

