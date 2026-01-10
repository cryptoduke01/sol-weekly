import Link from 'next/link';
import Image from 'next/image';
import { Twitter } from 'lucide-react';
import LiveStats from './LiveStats';
import EmailSignup from './EmailSignup';

export default function Footer() {
  return (
    <>
      <EmailSignup />
      <footer className="border-t border-bg-card/50 mt-24">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src="/me.jpg"
                  alt="Duke"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-text-primary font-light">duke.sol</p>
                <p className="text-xs text-text-muted font-light">
                  © {new Date().getFullYear()} Solana Weekly Roundup
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/cryptoduke01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      <LiveStats />
    </>
  );
}
