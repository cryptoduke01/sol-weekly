import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { Roundup, RoundupFrontmatter } from './types';
import { calculateReadingTime } from './utils';

const contentDirectory = path.join(process.cwd(), 'content', 'roundups');

export async function getAllRoundups(): Promise<Roundup[]> {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(contentDirectory);
  const allRoundupsData = await Promise.all(
    fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title,
          date: data.date,
          week: data.week,
          description: data.description,
          content,
          categories: data.categories || [],
          featuredProjects: data.featuredProjects || [],
          readingTime: calculateReadingTime(content),
        } as Roundup;
      })
  );

  return allRoundupsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getRoundupBySlug(
  slug: string
): Promise<Roundup | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      week: data.week,
      description: data.description,
      content,
      categories: data.categories || [],
      featuredProjects: data.featuredProjects || [],
      readingTime: calculateReadingTime(content),
    } as Roundup;
  } catch (error) {
    console.error('Error reading roundup:', error);
    return null;
  }
}

export async function serializeRoundupContent(
  content: string
): Promise<MDXRemoteSerializeResult> {
  return serialize(content, {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      format: 'mdx',
    },
  });
}

