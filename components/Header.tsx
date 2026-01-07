'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import HeaderStats from './HeaderStats';

export default function Header() {
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
      <div className="mx-auto max-w-7xl px-6">
        <nav className="flex items-center justify-between py-4">
          <Link href="/" className="text-base font-light text-text-primary hover:text-text-secondary transition-colors">
            Solana Weekly
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <HeaderStats />
          </div>

          <div className="flex items-center space-x-8">
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
        </nav>
      </div>
    </motion.header>
  );
}
