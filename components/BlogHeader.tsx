'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
      <div className="mb-6 md:mb-8 flex items-center gap-4 text-xs md:text-sm text-text-muted font-light">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          <span>{formatDate(roundup.date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3 md:h-4 md:w-4" />
          <span>{roundup.readingTime} min read</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary mb-4 md:mb-6 tracking-tight">
        {roundup.title}
      </h1>

      <p className="text-base md:text-lg lg:text-xl text-text-secondary font-light leading-relaxed mb-6 md:mb-8">
        {roundup.description}
      </p>

      {/* Featured Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden border border-bg-card/50"
      >
        <Image
          src="/placeholder.PNG"
          alt={roundup.title}
          fill
          className="object-cover object-top"
          priority
        />
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />
      </motion.div>
    </motion.div>
  );
}
