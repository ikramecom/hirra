import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'brass' | 'cream';
  className?: string;
  as?: 'span' | 'p' | 'div';
}

/**
 * Editorial eyebrow — small uppercase label that sits above big headings.
 *
 * Replaces the dropshipping "🐾 Now launching" pill with a proper magazine-
 * style category mark. Brass on light surfaces; cream on dark sections.
 */
export function Eyebrow({ children, tone = 'brass', className, as: As = 'span' }: EyebrowProps) {
  return (
    <As
      className={cn(
        'inline-flex items-center gap-2 text-eyebrow uppercase font-semibold',
        tone === 'brass' ? 'text-brass' : 'text-cream/70',
        'before:content-[""] before:inline-block before:h-px before:w-6',
        tone === 'brass' ? 'before:bg-brass/60' : 'before:bg-cream/30',
        className,
      )}
    >
      {children}
    </As>
  );
}
