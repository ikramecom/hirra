import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeTone = 'gold' | 'pearl' | 'outline';

interface PremiumBadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/** Calm luxury chip — never flash-sale energy */
export function PremiumBadge({ children, tone = 'gold', className }: PremiumBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold',
        tone === 'gold' && 'bg-gold/10 text-gold border border-gold/25',
        tone === 'pearl' && 'bg-pearl/5 text-champagne border border-pearl/10',
        tone === 'outline' && 'border border-gold/30 text-champagne',
        className,
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current opacity-80" aria-hidden />
      {children}
    </span>
  );
}
