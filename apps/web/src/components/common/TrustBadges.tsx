import { useTranslation } from 'react-i18next';
import { Truck, ShieldCheck, MessageSquare, Banknote, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TrustBadgesProps {
  variant?: 'row' | 'grid';
  className?: string;
}

export function TrustBadges({ variant = 'row', className }: TrustBadgesProps) {
  const { t } = useTranslation();
  const items = [
    { icon: Sparkles, label: t('trust.maghreb_crafted') },
    { icon: Truck, label: t('trust.fast_shipping') },
    { icon: ShieldCheck, label: t('trust.guarantee') },
    { icon: MessageSquare, label: t('trust.arabic_support') },
    { icon: Banknote, label: t('trust.cod_label') },
    { icon: Lock, label: t('trust.secure_payment') },
  ];

  return (
    <div
      className={cn(
        variant === 'row'
          ? 'flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-walnut/80'
          : 'grid grid-cols-2 sm:grid-cols-3 gap-4',
        className,
      )}
    >
      {items.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-emerald shrink-0" />
          <span className="font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
