import { cn } from '@/lib/cn';

type HirraLogoProps = {
  variant?: 'full' | 'icon';
  tone?: 'dark' | 'light';
  showTagline?: boolean;
  className?: string;
};

const tones = {
  dark: '#2E1E12',
  light: '#F4ECE0',
} as const;

function HirraMark({ color, className }: { color: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path d="M7 24V8" stroke={color} strokeWidth="2.25" strokeLinecap="round" />
      <path d="M21 24V8" stroke={color} strokeWidth="2.25" strokeLinecap="round" />
      <path d="M7 16h7.5" stroke={color} strokeWidth="2.25" strokeLinecap="round" />
      <path
        d="M17.5 8.5c5.2 1.4 8.8 5.4 9.2 11.8"
        stroke={color}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HirraLogo({
  variant = 'full',
  tone = 'dark',
  showTagline = false,
  className,
}: HirraLogoProps) {
  const color = tones[tone];

  if (variant === 'icon') {
    return (
      <span className={cn('inline-flex items-center', className)}>
        <HirraMark color={color} className="h-8 w-8 sm:h-9 sm:w-9" />
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-2.5 sm:gap-3', className)}>
      <HirraMark color={color} className="h-8 w-8 sm:h-9 sm:w-9" />
      <span className="flex min-w-0 flex-col justify-center">
        <span
          className="font-display text-[1.05rem] font-semibold leading-none tracking-[0.14em] sm:text-lg"
          style={{ color }}
        >
          HIRRA
        </span>
        {showTagline ? (
          <span
            className={cn(
              'mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.18em] sm:block',
              tone === 'light' ? 'text-cream/55' : 'text-brass/90',
            )}
          >
            KSA · Cat house
          </span>
        ) : null}
      </span>
    </span>
  );
}
