import { useTranslation } from 'react-i18next';
import { ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface GuaranteePromiseProps {
  variant?: 'inline' | 'stacked';
  className?: string;
}

/**
 * The HIRRA promise row — three trust pillars surfaced wherever the
 * customer needs reassurance (PDP top, cart, checkout summary).
 *
 * `inline` is the default 3-up grid for desktop / wide blocks.
 * `stacked` uses 2 columns for narrow contexts.
 */
export function GuaranteePromise({ variant = 'inline', className }: GuaranteePromiseProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';

  const items = [
    {
      icon: ShieldCheck,
      title: locale === 'ar' ? 'ضمان رضا ٣٠ يوم' : '30-day guarantee',
      sub: locale === 'ar' ? 'لو ما عجبك، نسترجع طلبك' : 'Love it or send it back',
    },
    {
      icon: Truck,
      title: t('trust.fast_shipping'),
      sub: locale === 'ar' ? 'الرياض · جدة · الدمام' : 'Riyadh · Jeddah · Dammam',
    },
    {
      icon: MessageCircle,
      title: locale === 'ar' ? 'دعم واتساب بالعربي' : 'Arabic WhatsApp support',
      sub: locale === 'ar' ? 'نرد بسرعة' : 'We reply fast',
    },
  ];

  return (
    <div
      className={cn(
        'grid gap-3',
        variant === 'stacked' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-3',
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.title}
          className="flex items-start gap-3 rounded-2xl border border-walnut/10 bg-whisper/70 px-4 py-3"
        >
          <div className="h-9 w-9 shrink-0 rounded-full bg-emerald/10 text-emerald grid place-items-center">
            <item.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-walnut leading-tight">{item.title}</p>
            <p className="text-xs text-walnut/60 mt-0.5">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
