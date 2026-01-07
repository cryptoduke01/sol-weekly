import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // 1 minute

interface SentimentData {
  fundingRate: number;
  openInterest: number;
  openInterestChange: number;
  longShortRatio: number;
  takerFlow: number;
}

// Fallback sentiment data
const fallbackSentiment: SentimentData = {
  fundingRate: 0.01,
  openInterest: 1380000000,
  openInterestChange: 3.7,
  longShortRatio: 2.55,
  takerFlow: 1.16,
};

export async function GET() {
  try {
    // Fetch from Binance API (free, no key needed)
    const [fundingResponse, openInterestResponse, longShortResponse] = await Promise.all([
      fetch('https://fapi.binance.com/fapi/v1/premiumIndex?symbol=SOLUSDT', {
        next: { revalidate: 60 },
      }),
      fetch('https://fapi.binance.com/fapi/v1/openInterest?symbol=SOLUSDT', {
        next: { revalidate: 60 },
      }),
      fetch('https://fapi.binance.com/futures/data/topLongShortAccountRatio?symbol=SOLUSDT&period=5m&limit=1', {
        next: { revalidate: 60 },
      }),
    ]);

    if (fundingResponse.ok && openInterestResponse.ok && longShortResponse.ok) {
      const [fundingData, oiData, lsData] = await Promise.all([
        fundingResponse.json(),
        openInterestResponse.json(),
        longShortResponse.json(),
      ]);

      // Calculate open interest change (would need previous value, using mock for now)
      const openInterestChange = 3.7; // In production, compare with previous value

      const sentiment: SentimentData = {
        fundingRate: parseFloat(fundingData.lastFundingRate || '0') * 100,
        openInterest: parseFloat(oiData.openInterest || '0'),
        openInterestChange,
        longShortRatio: lsData && lsData.length > 0 ? parseFloat(lsData[0].longShortRatio || '1') : 1,
        takerFlow: 1.16, // Would need taker buy/sell volume ratio from Binance
      };

      return NextResponse.json(sentiment, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      });
    }
  } catch (error) {
    console.error('Sentiment API error:', error);
  }

  // Return fallback data on error
  return NextResponse.json(fallbackSentiment, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}

