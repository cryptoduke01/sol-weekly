import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt?: string;
}

// Fallback news data
const fallbackNews: NewsItem[] = [
  {
    title: 'Morgan Stanley files ETF applications for bitcoin and solana',
    source: 'Yahoo Finance',
    url: 'https://finance.yahoo.com',
  },
  {
    title: 'US spot Solana ETFs record $10.43M net inflow in single day',
    source: 'AMBCrypto',
    url: 'https://ambcrypto.com',
  },
  {
    title: 'Solana RWA ecosystem hits record $873M in January 2026, up 325% in one year',
    source: 'Cryptonews',
    url: 'https://cryptonews.com',
  },
  {
    title: 'Alpenglow upgrade to reduce finality from 12.8s to 100-150ms launching early-mid 2026',
    source: 'Allinvest',
    url: 'https://allinvest.com',
  },
  {
    title: 'Short liquidation imbalance soars 19,138% as SOL rebounds to $126.57 daily high',
    source: 'TradingView',
    url: 'https://tradingview.com',
  },
  {
    title: 'Jupiter launches new perpetuals trading platform with zero slippage',
    source: 'The Block',
    url: 'https://theblock.co',
  },
  {
    title: 'Solana network processes record 65M transactions in single day',
    source: 'CoinDesk',
    url: 'https://coindesk.com',
  },
  {
    title: 'New DeFi protocols launch on Solana with $50M+ TVL',
    source: 'DeFi Pulse',
    url: 'https://defipulse.com',
  },
];

export async function GET() {
  try {
    // Option 1: NewsAPI (if key is provided) - Primary source
    if (process.env.NEWS_API_KEY) {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=solana+crypto&apiKey=${process.env.NEWS_API_KEY}&sortBy=publishedAt&pageSize=10&language=en`,
          { 
            next: { revalidate: 300 },
            headers: {
              'User-Agent': 'Solana Weekly Roundup',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Check for API errors
          if (data.status === 'error') {
            console.error('NewsAPI error:', data.message);
            throw new Error(data.message || 'NewsAPI error');
          }
          
          if (data.articles && data.articles.length > 0) {
            const news: NewsItem[] = data.articles
              .filter((article: any) => article.title && article.url) // Filter out invalid articles
              .map((article: any) => ({
                title: article.title || '',
                source: article.source?.name || 'Unknown',
                url: article.url || '',
                publishedAt: article.publishedAt || '',
              }));

            if (news.length > 0) {
              return NextResponse.json(news, {
                headers: {
                  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
              });
            }
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('NewsAPI response error:', response.status, errorData);
        }
      } catch (error) {
        console.error('NewsAPI fetch error:', error);
        // Fall through to CryptoCompare fallback
      }
    }

    // Option 2: CryptoCompare (free, no key needed)
    try {
      const response = await fetch(
        'https://min-api.cryptocompare.com/data/v2/news/?categories=SOL&lang=EN',
        { next: { revalidate: 300 } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.Data && data.Data.length > 0) {
          const news: NewsItem[] = data.Data.slice(0, 10).map((article: any) => ({
            title: article.title || '',
            source: article.source || 'CryptoCompare',
            url: article.url || '',
            publishedAt: article.published_on ? new Date(article.published_on * 1000).toISOString() : '',
          }));

          return NextResponse.json(news, {
            headers: {
              'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
          });
        }
      }
    } catch (error) {
      console.error('CryptoCompare API error:', error);
    }

    // Fallback to mock data
    return NextResponse.json(fallbackNews, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('News API error:', error);
    // Return fallback data on error
    return NextResponse.json(fallbackNews, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  }
}

