'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9998] bg-bg-primary/80 backdrop-blur-sm pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 bg-text-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="h-1 w-1 bg-text-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="h-1 w-1 bg-text-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

