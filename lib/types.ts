export interface SolanaStats {
  price: number;
  priceChange24h: number;
  marketCap: number;
  tvl: number;
  activeWallets: number;
  volume24h: number;
  tps: number;
}

export interface Roundup {
  slug: string;
  title: string;
  date: string;
  week: number;
  description: string;
  content: string;
  categories: string[];
  featuredProjects: Project[];
  readingTime: number;
}

export interface Project {
  name: string;
  logo: string;
  description: string;
  url: string;
  category: 'DeFi' | 'NFT' | 'Infrastructure' | 'Gaming' | 'Other';
  tvl?: number;
}

export interface StatsCard {
  label: string;
  value: string | number;
  change?: number;
  icon: string;
}

export interface RoundupFrontmatter {
  title: string;
  date: string;
  week: number;
  description: string;
  categories: string[];
  featuredProjects: Project[];
}

