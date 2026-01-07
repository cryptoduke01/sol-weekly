import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support - Solana Weekly Roundup',
  description: 'Support the Solana Weekly Roundup',
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

