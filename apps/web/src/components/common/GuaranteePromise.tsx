import { useTranslation } from 'react-i18next';
import { ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { StoreLocale } from '@/i18n';

interface GuaranteePromiseProps {
  variant?: 'inline' | 'stacked';
  className?: string;
}

export function GuaranteePromise({ variant = 'inline', className }: GuaranteePromiseProps) {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;

  const items = [
    {
      icon: ShieldCheck,
      title: locale === 'ar' ? 'ضمان رضا 14 يوم' : 'Satisfait 14 jours',
      sub:
        locale === 'ar'
          ? 'استبدال أو استرجاع بعد التواصل معنا'
          : 'Échange ou remboursement après contact',
    },
    {
      icon: Truck,
      title: t('trust.fast_shipping'),
      sub:
        locale === 'ar'
          ? 'الدار البيضاء · الرباط · مراكش'
          : 'Casablanca · Rabat · Marrakech',
    },
    {
      icon: MessageCircle,
      title: locale === 'ar' ? 'دعم واتساب' : 'Support WhatsApp',
      sub: locale === 'ar' ? 'نرد بسرعة وبلطف' : 'Réponse rapide et soignée',
    },
  ];

  return (
    <div
      className={cn(
        'grid gap-4',
        variant === 'stacked' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3',
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.title}
          className="flex items-start gap-4 rounded-2xl border border-gold/15 bg-charcoal/50 px-5 py-4"
        >
          <div className="h-10 w-10 shrink-0 rounded-full border border-gold/25 text-gold grid place-items-center">
            <item.icon className="h-4 w-4" strokeWidth={1.25} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-pearl leading-tight">{item.title}</p>
            <p className="text-xs text-smoke mt-1">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
