import { notFound } from 'next/navigation';
import { getRoundupBySlug, getAllRoundups } from '@/lib/mdx';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import BlogHeader from '@/components/BlogHeader';
import BlogContent from '@/components/BlogContent';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const roundups = await getAllRoundups();
  return roundups.map((roundup) => ({
    slug: roundup.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const roundup = await getRoundupBySlug(slug);

  if (!roundup) {
    return {
      title: 'Roundup Not Found',
    };
  }

  return {
    title: roundup.title,
    description: roundup.description,
    openGraph: {
      title: roundup.title,
      description: roundup.description,
      type: 'article',
      publishedTime: roundup.date,
    },
  };
}

export default async function RoundupPage({ params }: PageProps) {
  const { slug } = await params;
  const roundup = await getRoundupBySlug(slug);

  if (!roundup) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-muted font-light hover:text-text-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Link>
      </div>

      <BlogHeader roundup={roundup} />

      <BlogContent 
        content={roundup.content} 
        title={roundup.title}
        author="duke.sol"
        date={roundup.date}
      />

      <ShareButtons title={roundup.title} url={`/roundup/${roundup.slug}`} />
    </div>
  );
}
