import { useTranslation } from 'react-i18next';
import { Truck, Gift, Banknote } from 'lucide-react';

export function AnnouncementBar() {
  const { t } = useTranslation();
  return (
    <div className="bg-ink border-b border-gold/10 text-champagne text-xs md:text-sm py-2.5">
      <div className="container-content flex items-center justify-center gap-6 flex-wrap">
        <span className="inline-flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-gold" />
          {t('announce.free_shipping')}
        </span>
        <span className="hidden sm:inline text-gold/30">|</span>
        <span className="inline-flex items-center gap-1.5">
          <Banknote className="h-3.5 w-3.5 text-gold" />
          {t('announce.cod_available')}
        </span>
        <span className="hidden sm:inline text-gold/30">|</span>
        <span className="inline-flex items-center gap-1.5">
          <Gift className="h-3.5 w-3.5 text-gold" />
          {t('announce.gift')}
        </span>
      </div>
    </div>
  );
}
