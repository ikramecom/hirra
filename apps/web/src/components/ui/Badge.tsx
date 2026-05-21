import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'emerald' | 'gold' | 'sand' | 'signal';

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  emerald: 'bg-emerald/10 text-emerald',
  gold: 'bg-gold/20 text-walnut',
  sand: 'bg-sand text-walnut',
  signal: 'bg-signal/10 text-signal',
};

export function Badge({ children, variant = 'emerald', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
