import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

interface StickyMobileCTAProps {
  label: string;
  onClick: () => void;
  price?: string;
  /** Pixels of scroll before the bar slides in. Default 320. */
  showAfter?: number;
}

/**
 * Mobile-only sticky purchase bar.
 *
 * - Appears once the user scrolls past the inline CTA (so it never duplicates
 *   the visible Buy button).
 * - Renders the price as a brass-edged tile beside the primary action — the
 *   structure cited in luxury PDPs (Aesop, Glossier, Sahara KSA) so the
 *   offer remains in view at all times on phones.
 * - Adds safe-area padding for iOS home indicator.
 * - Hides on lg+ where the inline CTA is always visible.
 */
export function StickyMobileCTA({
  label,
  onClick,
  price,
  showAfter = 320,
}: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);
  const { i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfter]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 lg:hidden bg-cream/95 backdrop-blur border-t border-walnut/10 shadow-sticky px-4 pt-3 pb-safe transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 max-w-content mx-auto">
        {price ? (
          <div className="flex-shrink-0 px-3 py-1.5 rounded-xl border border-brass/40 bg-whisper/80 text-center min-w-[88px]">
            <div className="text-[10px] uppercase tracking-[0.16em] text-brass font-semibold leading-none">
              {locale === 'ar' ? 'السعر' : 'Price'}
            </div>
            <div className="text-base font-bold text-emerald tabular leading-snug">
              {price}
            </div>
          </div>
        ) : null}
        <Button onClick={onClick} size="lg" fullWidth>
          {label}
        </Button>
      </div>
    </div>
  );
}
