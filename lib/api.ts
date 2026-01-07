import { SolanaStats } from './types';

export async function fetchSolanaPrice(): Promise<{
  usd: number;
  usd_market_cap: number;
  usd_24h_change: number;
}> {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_market_cap=true&include_24hr_change=true',
    { next: { revalidate: 30 } }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch SOL price');
  }

  const data = await response.json();
  return {
    usd: data.solana.usd,
    usd_market_cap: data.solana.usd_market_cap,
    usd_24h_change: data.solana.usd_24h_change,
  };
}

export async function fetchTVL(): Promise<number> {
  try {
    const response = await fetch('https://api.llama.fi/chains', {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch TVL');
    }

    const data = await response.json();
    const solana = data.find((chain: any) => chain.name === 'Solana');
    return solana?.tvl || 0;
  } catch (error) {
    console.error('Error fetching TVL:', error);
    return 0;
  }
}

export async function fetchSolanaStats(): Promise<SolanaStats> {
  try {
    const [priceData, tvl] = await Promise.all([
      fetchSolanaPrice(),
      fetchTVL(),
    ]);

    // Mock data for metrics not easily available via free APIs
    // In production, you'd use Helius API or other services
    return {
      price: priceData.usd,
      priceChange24h: priceData.usd_24h_change,
      marketCap: priceData.usd_market_cap,
      tvl: tvl,
      activeWallets: 2100000, // Mock - use Helius API in production
      volume24h: 45000000000, // Mock - use CoinGecko pro API in production
      tps: 3500, // Mock - use Solana RPC in production
    };
  } catch (error) {
    console.error('Error fetching Solana stats:', error);
    throw error;
  }
}

