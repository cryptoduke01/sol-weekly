'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

const cryptoAddresses = {
  sol: 'FccYSYWKnX7fq3JRSb74zT8oJVogzE5voVdzkeeQqPF2',
  eth: '0x8F47aE9eC148903C8535b9289ad8efA400e026B6',
};

export default function SupportPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (address: string, type: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-light text-text-primary mb-4 tracking-tight">
          Support My Work
        </h1>
        <p className="text-lg text-text-secondary font-light mb-12 leading-relaxed">
          If you find value in these weekly roundups, consider supporting the project.
          Your contributions help keep this resource free and updated.
        </p>
      </motion.div>

      <div className="space-y-12">
        {/* Solana Address */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass border border-bg-card/50 p-8 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full glass border border-bg-card/50 flex items-center justify-center">
              <span className="text-text-primary text-lg font-light">SOL</span>
            </div>
            <div>
              <h2 className="text-xl font-light text-text-primary">Solana</h2>
              <p className="text-sm text-text-muted font-light">Preferred method</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 glass-dark border border-bg-card/50 rounded">
              <code className="flex-1 text-sm text-text-primary font-mono font-light break-all">
                {cryptoAddresses.sol}
              </code>
              <button
                onClick={() => handleCopy(cryptoAddresses.sol, 'sol')}
                className="p-2 text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
                aria-label="Copy address"
              >
                {copied === 'sol' ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-6 glass-dark border border-bg-card/50 rounded">
              <div className="relative">
                <div className="bg-white p-4 rounded">
                  <QRCodeSVG
                    value={cryptoAddresses.sol}
                    size={192}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="mt-4 text-center text-xs text-text-muted font-light">
                  Scan to send SOL
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Ethereum */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-light text-text-primary mb-6">
            Other Options
          </h2>
          <div className="glass border border-bg-card/50 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full glass border border-bg-card/50 flex items-center justify-center">
                <span className="text-text-primary text-sm font-light">ETH</span>
              </div>
              <h3 className="text-lg font-light text-text-primary">Ethereum</h3>
            </div>
            <div className="flex items-center gap-2 p-3 glass-dark border border-bg-card/50 rounded">
              <code className="flex-1 text-xs text-text-primary font-mono font-light break-all">
                {cryptoAddresses.eth}
              </code>
              <button
                onClick={() => handleCopy(cryptoAddresses.eth, 'eth')}
                className="p-1.5 text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
                aria-label="Copy address"
              >
                {copied === 'eth' ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        </motion.section>

        {/* Thank You Message */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="border-t border-bg-card/50 pt-12"
        >
          <p className="text-base text-text-secondary font-light leading-relaxed text-center">
            Thank you for your support. Every contribution, no matter how small,
            helps keep this project running and the community informed.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
