import { NextResponse } from 'next/server';
import { fetchSolanaPrice } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 30;

export async function GET() {
  try {
    const priceData = await fetchSolanaPrice();
    return NextResponse.json(
      {
        solana: {
          usd: priceData.usd,
          usd_market_cap: priceData.usd_market_cap,
          usd_24h_change: priceData.usd_24h_change,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching price:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}

