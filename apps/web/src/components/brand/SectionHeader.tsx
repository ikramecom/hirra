import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'start' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'start',
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        'space-y-4 max-w-2xl',
        align === 'center' && 'mx-auto text-center items-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-eyebrow uppercase text-gold/90 tracking-[0.28em]">{eyebrow}</p>
      ) : null}
      <h2 className="text-h1 heading-display text-pearl text-balance whitespace-pre-line">
        {title}
      </h2>
      {lead ? (
        <p className="text-base md:text-lg text-champagne/85 leading-relaxed text-pretty">
          {lead}
        </p>
      ) : null}
    </header>
  );
}
