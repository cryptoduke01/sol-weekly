'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import HeaderStats from './HeaderStats';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/support', label: 'Support' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-b border-bg-card/50"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <nav className="flex items-center justify-between py-4">
          <Link href="/" className="text-base md:text-lg font-light text-text-primary hover:text-text-secondary transition-colors">
            Solana Weekly
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <HeaderStats />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-light tracking-wide transition-colors',
                    isActive
                      ? 'text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-muted hover:text-text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-bg-card/50"
            >
              <div className="py-4 space-y-4">
                <div className="mb-4">
                  <HeaderStats />
                </div>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'block text-sm font-light tracking-wide transition-colors py-2',
                        isActive
                          ? 'text-text-primary'
                          : 'text-text-muted hover:text-text-secondary'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="pt-2">
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
