import { NextResponse } from 'next/server';
import { fetchSolanaStats } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET() {
  try {
    const stats = await fetchSolanaStats();
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error fetching Solana stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Solana stats' },
      { status: 500 }
    );
  }
}

