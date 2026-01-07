import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Project } from '@/lib/types';
import { formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

export default function ProjectCard({
  project,
  compact = false,
}: ProjectCardProps) {
  return (
    <Link
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block rounded-lg border border-bg-card bg-bg-card p-4 transition-all hover:border-solana-purple/50',
        !compact && 'p-6'
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-bg-card bg-bg-secondary">
          {project.logo ? (
            <Image
              src={project.logo}
              alt={project.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-solana-purple/20 text-lg font-bold text-solana-purple">
              {project.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-primary group-hover:text-solana-green transition-colors">
                {project.name}
              </h3>
              <span className="mt-1 inline-block rounded-full bg-solana-blue/20 px-2 py-0.5 text-xs font-medium text-solana-blue">
                {project.category}
              </span>
            </div>
            <ExternalLink className="h-4 w-4 text-text-muted group-hover:text-solana-green transition-colors flex-shrink-0 ml-2" />
          </div>

          {!compact && (
            <p className="mt-2 text-sm text-text-secondary line-clamp-2">
              {project.description}
            </p>
          )}

          {project.tvl && (
            <p className="mt-2 text-sm font-medium text-text-primary">
              TVL: {formatNumber(project.tvl)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

