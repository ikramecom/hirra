import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Search } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { buildWhatsAppLink } from '@hirra/shared';

export default function TrackOrderPage() {
  const { t } = useTranslation();
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');

  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '9665XXXXXXXX';
  const message = orderNumber
    ? `مرحبا 👋 أبغى أتتبع طلبي رقم ${orderNumber}`
    : 'مرحبا 👋 أبغى أتتبع طلبي';
  const whatsappLink = buildWhatsAppLink(whatsappPhone, message);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = whatsappLink;
  };

  return (
    <>
      <Helmet>
        <title>{t('nav.track')} — {t('brand.name')}</title>
      </Helmet>
      <div className="container-content py-12 md:py-20 max-w-xl">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-bold text-walnut heading-display">{t('nav.track')}</h1>
          <p className="text-walnut/70">
            راسلينا على واتساب برقم طلبك وحنرد عليك فوراً بحالة الطلب وموعد التوصيل.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-whisper rounded-2xl p-6 space-y-4">
          <Input
            label="رقم الطلب"
            placeholder="HIRRA-2026-XXXXX"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            dir="ltr"
          />
          <Input
            label="رقم جوالك"
            placeholder="05X XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            dir="ltr"
          />
          <Button type="submit" variant="whatsapp" size="lg" fullWidth leftIcon={<MessageCircle className="h-5 w-5" />}>
            {t('order_confirmation.open_whatsapp')}
          </Button>
        </form>
      </div>
    </>
  );
}
