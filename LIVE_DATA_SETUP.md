# Live Data Setup Guide

## News Data

### Option 1: NewsAPI (Recommended)
1. Sign up at https://newsapi.org
2. Get your API key
3. Create API route: `app/api/news/route.ts`

```typescript
export async function GET() {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=solana&apiKey=${process.env.NEWS_API_KEY}&sortBy=publishedAt&pageSize=10`,
    { next: { revalidate: 300 } }
  );
  const data = await response.json();
  return Response.json(data.articles);
}
```

### Option 2: CryptoCompare News API
1. Sign up at https://www.cryptocompare.com
2. Get API key
3. Use endpoint: `https://min-api.cryptocompare.com/data/v2/news/?categories=SOL`

### Option 3: RSS Feeds
- CoinDesk: https://www.coindesk.com/arc/outboundfeeds/rss/
- The Block: https://www.theblock.co/rss.xml
- Parse RSS feeds server-side

## Market Sentiment Data

### Option 1: Binance API (Free)
```typescript
// Funding rate
fetch('https://fapi.binance.com/fapi/v1/premiumIndex?symbol=SOLUSDT')

// Open interest
fetch('https://fapi.binance.com/fapi/v1/openInterest?symbol=SOLUSDT')

// Long/Short ratio
fetch('https://fapi.binance.com/futures/data/topLongShortAccountRatio?symbol=SOLUSDT&period=5m')
```

### Option 2: CoinGecko Pro API
- Requires paid plan
- Provides sentiment data
- More comprehensive metrics

### Option 3: CryptoCompare
- Free tier available
- Sentiment indicators
- Social metrics

## Implementation Steps

1. **Add environment variables** to `.env.local`:
```
NEWS_API_KEY=your_key_here
BINANCE_API_KEY=optional
```

2. **Create API routes**:
- `app/api/news/route.ts` - Fetch news
- `app/api/sentiment/route.ts` - Fetch sentiment data

3. **Update components**:
- `components/AINewsSummary.tsx` - Use `/api/news`
- `components/MarketSentiment.tsx` - Use `/api/sentiment`

4. **Add error handling**:
- Fallback to mock data if API fails
- Rate limiting
- Caching strategies

## Example API Route

```typescript
// app/api/news/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=solana+crypto&apiKey=${process.env.NEWS_API_KEY}&sortBy=publishedAt&pageSize=10&language=en`,
      { next: { revalidate: 300 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    
    const data = await response.json();
    return NextResponse.json(data.articles);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
```

## Example Sentiment Route

```typescript
// app/api/sentiment/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 60; // 1 minute

export async function GET() {
  try {
    const [funding, openInterest, longShort] = await Promise.all([
      fetch('https://fapi.binance.com/fapi/v1/premiumIndex?symbol=SOLUSDT'),
      fetch('https://fapi.binance.com/fapi/v1/openInterest?symbol=SOLUSDT'),
      fetch('https://fapi.binance.com/futures/data/topLongShortAccountRatio?symbol=SOLUSDT&period=5m')
    ]);

    const fundingData = await funding.json();
    const oiData = await openInterest.json();
    const lsData = await longShort.json();

    return NextResponse.json({
      fundingRate: parseFloat(fundingData.lastFundingRate) * 100,
      openInterest: parseFloat(oiData.openInterest),
      longShortRatio: parseFloat(lsData.longShortRatio),
    });
  } catch (error) {
    console.error('Sentiment API error:', error);
    return NextResponse.json({ error: 'Failed to fetch sentiment' }, { status: 500 });
  }
}
```

## Rate Limits

- **NewsAPI**: 100 requests/day (free), 250 requests/day (developer)
- **Binance**: 1200 requests/minute
- **CoinGecko**: 10-50 calls/minute (free tier)

## Caching Strategy

- News: Cache for 5-10 minutes
- Sentiment: Cache for 1-2 minutes
- Use Next.js `revalidate` for ISR
- Client-side SWR for real-time updates

