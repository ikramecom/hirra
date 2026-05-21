import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
  rounded?: 'lg' | 'xl' | '2xl' | 'full';
}

export function Skeleton({ className, rounded = 'xl' }: SkeletonProps) {
  const roundedClass =
    rounded === 'full' ? 'rounded-full' : rounded === '2xl' ? 'rounded-2xl' : rounded === 'xl' ? 'rounded-xl' : 'rounded-lg';
  return <div className={cn('skeleton', roundedClass, className)} aria-hidden />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-whisper rounded-card overflow-hidden shadow-card">
      <Skeleton className="aspect-square" rounded="2xl" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="h-8 w-8 rounded-full border-2 border-emerald border-t-transparent animate-spin" />
    </div>
  );
}
