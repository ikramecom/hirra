import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Eyebrow } from './Eyebrow';

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: 'start' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Standard editorial section heading — eyebrow + display title + optional
 * description, with a consistent rhythm that anchors every page section.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'space-y-3',
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-start max-w-2xl',
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow tone={tone === 'dark' ? 'cream' : 'brass'}>{eyebrow}</Eyebrow>
      ) : null}
      <h2
        className={cn(
          'heading-display text-h2 text-balance',
          tone === 'dark' ? 'text-cream' : 'text-walnut',
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'text-pretty leading-relaxed',
            tone === 'dark' ? 'text-cream/75' : 'text-walnut/70',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
