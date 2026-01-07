import { getAllRoundups } from '@/lib/mdx';
import HeroSection from '@/components/HeroSection';
import MarketSentiment from '@/components/MarketSentiment';
import AINewsSummary from '@/components/AINewsSummary';

export default async function Home() {
  const roundups = await getAllRoundups();
  const latestRoundup = roundups[0] || null;

  return (
    <div>
      <HeroSection latestRoundup={latestRoundup} />

      <MarketSentiment />

      <AINewsSummary />
    </div>
  );
}
