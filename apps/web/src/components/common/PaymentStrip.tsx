import { useTranslation } from 'react-i18next';
import { Banknote } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaymentStripProps {
  className?: string;
  /** Show methods with a "coming soon" muted look — for pre-payments-launch trust signal. */
  showComingSoon?: boolean;
}

/**
 * Payment-method recognition row. Even before Mada / Apple Pay / Tabby /
 * Tamara are wired, surfacing the badges signals legitimacy. Today, COD is
 * the active method; the rest render muted with a "soon" feel.
 */
export function PaymentStrip({ className, showComingSoon = true }: PaymentStripProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-3 text-xs text-walnut/70',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-walnut/15 bg-whisper px-3 py-1.5 font-semibold text-walnut">
        <Banknote className="h-3.5 w-3.5 text-emerald" />
        {t('trust.cod_label')}
      </span>
      {showComingSoon
        ? ['Mada', 'Apple Pay', 'STC Pay', 'Tabby', 'Tamara'].map((method) => (
            <span
              key={method}
              className="inline-flex items-center gap-1.5 rounded-full border border-walnut/10 bg-whisper/60 px-3 py-1.5 font-medium text-walnut/45"
            >
              {method}
              <span className="text-[10px] text-walnut/35">
                · {locale === 'ar' ? 'قريباً' : 'soon'}
              </span>
            </span>
          ))
        : null}
    </div>
  );
}
