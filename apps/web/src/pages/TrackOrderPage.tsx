import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SectionHeader } from '@/components/brand/SectionHeader';
import { BRAND, buildWhatsAppLink } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';

export default function TrackOrderPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const [orderNumber, setOrderNumber] = useState('');

  const phone = import.meta.env.VITE_WHATSAPP_PHONE || BRAND.whatsappDigits;
  const message =
    locale === 'ar'
      ? orderNumber
        ? `السلام عليكم، أود تتبع طلبي رقم ${orderNumber} — ريانا لوكس`
        : 'السلام عليكم، أود تتبع طلبي — ريانا لوكس'
      : orderNumber
        ? `Bonjour, suivi commande ${orderNumber} — RIYANALUXE`
        : 'Bonjour, suivi de commande — RIYANALUXE';
  const whatsappLink = buildWhatsAppLink(phone, message);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = whatsappLink;
  };

  return (
    <>
      <Helmet>
        <title>
          {t('nav.track')} — {t('brand.name')}
        </title>
      </Helmet>
      <div className="container-content section-y-tight max-w-xl">
        <SectionHeader
          title={t('nav.track')}
          lead={
            locale === 'ar'
              ? 'راسِلنا على واتساب برقم الطلبية — نجاوبك فوراً على حالة التوصيل.'
              : 'Écrivez-nous sur WhatsApp avec votre n° de commande.'
          }
          align="center"
          className="mb-8"
        />

        <form onSubmit={handleSubmit} className="luxury-card p-6 space-y-4">
          <Input
            label={locale === 'ar' ? 'رقم الطلب' : 'N° de commande'}
            placeholder="RYN-2026-XXXXX"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            dir="ltr"
          />
          <Button
            type="submit"
            variant="whatsapp"
            size="lg"
            fullWidth
            leftIcon={<MessageCircle className="h-5 w-5" />}
          >
            {t('order_confirmation.open_whatsapp')}
          </Button>
        </form>
      </div>
    </>
  );
}
