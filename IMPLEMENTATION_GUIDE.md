# Data Implementation Guide

## What Needs to Be Implemented

### 1. News API Integration
**Current State:** Using mock/rotating news data  
**Needs:**
- API route: `app/api/news/route.ts`
- Fetch from NewsAPI, CryptoCompare, or RSS feeds
- Return array of news items with: `title`, `source`, `url`, `publishedAt`
- Update `components/AINewsSummary.tsx` to use `/api/news` endpoint

**Required Data Structure:**
```typescript
interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt?: string;
}
```

### 2. Market Sentiment API Integration
**Current State:** Using mock sentiment data  
**Needs:**
- API route: `app/api/sentiment/route.ts`
- Fetch from Binance API (free) or CoinGecko Pro
- Return sentiment metrics: `fundingRate`, `openInterest`, `longShortRatio`, `takerFlow`
- Update `components/MarketSentiment.tsx` to use `/api/sentiment` endpoint

**Required Data Structure:**
```typescript
interface SentimentData {
  fundingRate: number;      // Percentage
  openInterest: number;     // USD value
  openInterestChange: number; // 24h change percentage
  longShortRatio: number;   // Ratio
  takerFlow: number;         // Ratio (buyers/sellers)
}
```

### 3. Enhanced Solana Stats
**Current State:** Basic stats from CoinGecko  
**Needs:**
- More accurate TPS from Solana RPC
- Real active wallets count (Helius API or similar)
- Real transaction volume
- Network health metrics

**API Endpoints to Add:**
- Solana RPC: `getRecentPerformanceSamples` for TPS
- Helius API: For wallet analytics (requires API key)
- CoinGecko Pro: For more detailed volume data

### 4. Price Chart Data
**Current State:** Placeholder  
**Needs:**
- Historical price data for chart visualization
- API route: `app/api/price-history/route.ts`
- Return OHLCV data (Open, High, Low, Close, Volume)
- Time ranges: 1H, 1D, 1W, 1M, 1Y

**Required Data Structure:**
```typescript
interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
```

## Implementation Priority

1. **High Priority:**
   - Market Sentiment (Binance API - free)
   - News API (NewsAPI or RSS feeds)

2. **Medium Priority:**
   - Enhanced Solana Stats
   - Price Chart Data

3. **Low Priority:**
   - Advanced analytics
   - Historical comparisons

## API Keys Needed

1. **NewsAPI** (optional, free tier available)
   - Sign up: https://newsapi.org
   - Free: 100 requests/day
   - Add to `.env.local`: `NEWS_API_KEY=your_key`

2. **Helius API** (optional, for wallet data)
   - Sign up: https://helius.dev
   - Free tier available
   - Add to `.env.local`: `HELIUS_API_KEY=your_key`

3. **Binance API** (free, no key needed for public data)
   - No authentication required for public endpoints
   - Rate limit: 1200 requests/minute

## Quick Start

1. Create `.env.local` file:
```env
NEWS_API_KEY=your_key_here
HELIUS_API_KEY=your_key_here
```

2. Create API routes (see LIVE_DATA_SETUP.md for examples)

3. Update components to fetch from API routes instead of mock data

4. Test with error handling and fallbacks

## Error Handling

All API routes should:
- Have try/catch blocks
- Return fallback data if API fails
- Log errors for debugging
- Use Next.js caching (`revalidate`)

## Caching Strategy

- News: 5-10 minutes (ISR)
- Sentiment: 1-2 minutes (ISR)
- Price data: 30 seconds (ISR)
- Client-side: SWR with 10-30 second refresh

