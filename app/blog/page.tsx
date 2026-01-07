import { getAllRoundups } from '@/lib/mdx';
import BlogList from '@/components/BlogList';

export const metadata = {
  title: 'Blog - Solana Weekly Roundup',
  description: 'All weekly roundups from the Solana ecosystem',
};

export default async function BlogPage() {
  const roundups = await getAllRoundups();

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6 py-12 md:py-16">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary mb-3 md:mb-4 tracking-tight">
          All Roundups
        </h1>
        <p className="text-base md:text-lg text-text-secondary font-light">
          Browse all weekly roundups sorted by date.
        </p>
      </div>

      <BlogList roundups={roundups} />
    </div>
  );
}

