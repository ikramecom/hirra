import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import type { StoreLocale } from '@/i18n';

interface StickyMobileCTAProps {
  label: string;
  onClick: () => void;
  price?: string;
  showAfter?: number;
}

export function StickyMobileCTA({
  label,
  onClick,
  price,
  showAfter = 320,
}: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);
  const { i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfter);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfter]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 lg:hidden bg-obsidian/95 backdrop-blur-md border-t border-gold/15 shadow-sticky px-4 pt-3 pb-safe transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 max-w-content mx-auto">
        {price ? (
          <div className="flex-shrink-0 px-3 py-2 rounded-xl border border-gold/25 bg-charcoal/80 text-center min-w-[92px]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-semibold leading-none">
              {locale === 'ar' ? 'السعر' : 'Prix'}
            </div>
            <div className="text-base font-display text-gold tabular leading-snug mt-0.5">
              {price}
            </div>
          </div>
        ) : null}
        <Button onClick={onClick} variant="gold" size="lg" fullWidth>
          {label}
        </Button>
      </div>
    </div>
  );
}
