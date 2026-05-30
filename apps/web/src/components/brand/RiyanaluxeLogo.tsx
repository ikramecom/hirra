import { useId } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

type LogoSize = 'sm' | 'md' | 'lg' | 'hero';

interface RiyanaluxeLogoProps {
  className?: string;
  variant?: 'full' | 'mark';
  size?: LogoSize;
  /** Navbar: compact on mobile, standard from `sm` up. Wordmark always visible. */
  responsive?: boolean;
  /** Light wordmark for dark backgrounds (default). */
  light?: boolean;
}

interface LogoSizeTokens {
  mark: string;
  gap: string;
  title: string;
  rule: string;
  subtitle: string;
}

const SIZE: Record<LogoSize, LogoSizeTokens> = {
  sm: {
    mark: 'h-10 w-10',
    gap: 'gap-2.5',
    title: 'text-[13px] font-semibold tracking-[0.2em]',
    rule: 'max-w-[11rem]',
    subtitle: 'text-[11px] tracking-[0.1em] font-medium',
  },
  md: {
    mark: 'h-11 w-11 sm:h-12 sm:w-12',
    gap: 'gap-3',
    title: 'text-sm sm:text-base font-semibold tracking-[0.18em]',
    rule: 'max-w-[12.5rem] sm:max-w-[13.5rem]',
    subtitle: 'text-xs sm:text-sm tracking-[0.08em] font-medium',
  },
  lg: {
    mark: 'h-14 w-14 sm:h-16 sm:w-16',
    gap: 'gap-3.5',
    title: 'text-lg sm:text-xl font-semibold tracking-[0.16em]',
    rule: 'max-w-[15rem] sm:max-w-[16rem]',
    subtitle: 'text-sm sm:text-base tracking-[0.06em] font-medium',
  },
  hero: {
    mark: 'h-14 w-14 sm:h-16 sm:w-16 md:h-[4.25rem] md:w-[4.25rem]',
    gap: 'gap-3 sm:gap-4',
    title:
      'text-[1.35rem] sm:text-[1.65rem] md:text-[2rem] font-semibold tracking-[0.14em] leading-none',
    rule: 'max-w-[16rem] sm:max-w-[18rem] md:max-w-[20rem]',
    subtitle: 'text-sm sm:text-base md:text-lg tracking-[0.05em] font-medium',
  },
};

/** Navbar lockup: readable on mobile, sharper on desktop */
const NAVBAR: LogoSizeTokens = {
  mark: 'h-10 w-10 sm:h-12 sm:w-12',
  gap: 'gap-2.5 sm:gap-3',
  title: 'text-[13px] sm:text-base font-semibold tracking-[0.18em]',
  rule: 'max-w-[11rem] sm:max-w-[13.5rem]',
  subtitle: 'text-[11px] sm:text-sm tracking-[0.08em] font-medium',
};

const GOLD = {
  light: ['#F0E6C8', '#D4B87A', '#A68B45'] as const,
  dark: ['#B8954A', '#8A7238', '#5C4D28'] as const,
};

function LogoMark({ light, className }: { light: boolean; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const gradGold = `rl-gold-${uid}`;
  const gradGlow = `rl-glow-${uid}`;
  const stops = light ? GOLD.light : GOLD.dark;
  const ring = light ? '#D4B87A' : '#8A7238';
  const core = light ? '#0A0908' : '#F5F0E8';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn('shrink-0 drop-shadow-[0_2px_12px_rgba(201,169,98,0.35)]', className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradGold} x1="8" y1="4" x2="56" y2="60">
          <stop offset="0%" stopColor={stops[0]} />
          <stop offset="42%" stopColor={stops[1]} />
          <stop offset="100%" stopColor={stops[2]} />
        </linearGradient>
        <linearGradient id={gradGlow} x1="32" y1="8" x2="32" y2="52">
          <stop offset="0%" stopColor={ring} stopOpacity={0.45} />
          <stop offset="100%" stopColor={ring} stopOpacity={0} />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke={`url(#${gradGold})`}
        strokeWidth="1.35"
        fill={light ? '#0A0908' : 'none'}
      />
      <circle cx="32" cy="32" r="26" stroke={ring} strokeOpacity={0.28} strokeWidth="0.65" />
      <ellipse cx="32" cy="48" rx="10" ry="3" fill={`url(#${gradGlow})`} />
      <path
        d="M32 11.5c-1.8 7.2-8.2 12.2-8.2 19.2a8.2 8.2 0 1 0 16.4 0c0-7-6.4-12-8.2-19.2z"
        fill={`url(#${gradGold})`}
      />
      <path
        d="M32 16.5c-.9 4.2-3.8 7.2-3.8 11.5a3.8 3.8 0 1 0 7.6 0c0-4.3-2.9-7.3-3.8-11.5z"
        fill={core}
        fillOpacity={light ? 0.5 : 0.12}
      />
      <path d="M32 9.5 33.6 13.2 32 12.4 30.4 13.2Z" fill={`url(#${gradGold})`} />
    </svg>
  );
}

function LogoWordmark({
  light,
  tokens,
}: {
  light: boolean;
  tokens: LogoSizeTokens;
}) {
  return (
    <div className="min-w-0 flex flex-col gap-1 sm:gap-1.5">
      <span
        className={cn(
          'font-display uppercase whitespace-nowrap',
          tokens.title,
          light
            ? 'text-pearl [text-shadow:0_1px_2px_rgba(0,0,0,0.65),0_0_28px_rgba(201,169,98,0.12)]'
            : 'text-obsidian',
        )}
        dir="ltr"
      >
        RIYANALUXE
      </span>
      <span
        className={cn(
          'h-px w-full bg-gradient-to-r',
          tokens.rule,
          light ? 'from-gold/75 via-gold/50 to-transparent' : 'from-gold/50 to-transparent',
        )}
        aria-hidden
      />
      <span
        className={cn(
          'font-arabic whitespace-nowrap',
          tokens.subtitle,
          light ? 'text-gold-light' : 'text-gold',
        )}
      >
        ريانا لوكس
      </span>
    </div>
  );
}

/** RIYANALUXE luxury lockup — monogram + wordmark */
export function RiyanaluxeLogo({
  className,
  variant = 'full',
  size = 'md',
  responsive = false,
  light = true,
}: RiyanaluxeLogoProps) {
  const tokens = responsive ? NAVBAR : SIZE[size];

  if (variant === 'mark') {
    return (
      <Link
        to="/"
        className={cn('inline-flex items-center', className)}
        aria-label="RIYANALUXE"
      >
        <LogoMark light={light} className={tokens.mark} />
      </Link>
    );
  }

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center min-w-0', tokens.gap, className)}
      aria-label="RIYANALUXE — ريانا لوكس"
    >
      <LogoMark light={light} className={tokens.mark} />
      <LogoWordmark light={light} tokens={tokens} />
    </Link>
  );
}

/** Static asset paths for packaging, ads, and external use */
export const RIYANALUXE_LOGO_ASSETS = {
  fullSvg: '/brand/riyanaluxe-logo-full.svg',
  markSvg: '/brand/riyanaluxe-logo-mark.svg',
  fullPng: '/brand/riyanaluxe-logo-full.png',
  markPng: '/brand/riyanaluxe-logo-mark.png',
} as const;

/** @deprecated Use RiyanaluxeLogo */
export const RiyanaLogo = RiyanaluxeLogo;
