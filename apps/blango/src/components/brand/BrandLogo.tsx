import { cn } from '@/lib/cn';

const LOGO_SRC = '/logo.png';
const LOGO_ALT = 'Blango Studio';
const BRAND_PRIMARY = 'BLANGO';
const BRAND_SECONDARY = 'STUDIO';

interface BrandLogoProps {
  variant?: 'header' | 'footer';
  /** Header shows wordmark by default; footer is mark-only unless overridden. */
  showWordmark?: boolean;
  className?: string;
}

export function BrandLogo({ variant = 'header', showWordmark, className = '' }: BrandLogoProps) {
  const withWordmark = showWordmark ?? variant === 'header';

  return (
    <span
      dir={withWordmark ? 'ltr' : undefined}
      lang={withWordmark ? 'en' : undefined}
      className={cn(
        'brand-logo',
        `brand-logo-${variant}`,
        withWordmark && 'brand-logo-with-wordmark brand-block',
        className,
      )}
    >
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        className="brand-logo-image brand-block-mark"
        width={withWordmark ? 112 : variant === 'footer' ? 140 : 96}
        height={withWordmark ? 112 : variant === 'footer' ? 140 : 96}
        decoding="async"
        fetchPriority={variant === 'header' ? 'high' : undefined}
        draggable={false}
      />
      {withWordmark ? (
        <span className="brand-wordmark brand-block-name" aria-hidden>
          <span className="brand-wordmark-primary">{BRAND_PRIMARY}</span>
          <span className="brand-wordmark-secondary">{BRAND_SECONDARY}</span>
        </span>
      ) : null}
    </span>
  );
}

export { LOGO_SRC, LOGO_ALT, BRAND_PRIMARY, BRAND_SECONDARY };
