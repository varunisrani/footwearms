import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer rounded-lg bg-gray-200/80 dark:bg-gray-700/60',
        className
      )}
    />
  );
}
