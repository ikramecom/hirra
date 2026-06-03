import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'gold' | 'pearl' | 'brass' | 'cream';
  className?: string;
  as?: 'span' | 'p' | 'div';
}

export function Eyebrow({ children, tone = 'gold', className, as: As = 'span' }: EyebrowProps) {
  return (
    <As
      className={cn(
        'inline-flex items-center gap-2 text-eyebrow uppercase font-semibold tracking-[0.22em]',
        (tone === 'gold' || tone === 'brass') && 'text-gold',
        (tone === 'pearl' || tone === 'cream') && 'text-champagne/70',
        'before:content-[""] before:inline-block before:h-px before:w-6',
        tone === 'pearl' || tone === 'cream' ? 'before:bg-champagne/25' : 'before:bg-gold/40',
        className,
      )}
    >
      {children}
    </As>
  );
}
