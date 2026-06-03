import { cn } from '@/lib/cn';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  /** LCP / hero images should use eager + high */
  priority?: boolean;
  sizes?: string;
  aspectClassName?: string;
  /** contain = full image visible in frame; cover = fill crop (default) */
  fit?: 'cover' | 'contain';
}

/**
 * Production image wrapper — lazy by default, no layout shift when used with aspect parent.
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px',
  aspectClassName,
  fit = 'cover',
}: ResponsiveImageProps) {
  const contain = fit === 'contain';

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        contain && 'flex items-center justify-center bg-ink',
        aspectClassName,
      )}
    >
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn(
          contain
            ? 'h-full w-full max-h-full max-w-full object-contain object-center'
            : 'h-full w-full object-cover',
          className,
        )}
      />
    </div>
  );
}
