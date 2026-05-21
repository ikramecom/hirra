import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, Instagram, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { buildWhatsAppLink } from '@hirra/shared';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '9665XXXXXXXX';

  return (
    <>
      <Helmet>
        <title>{t('nav.contact')} — {t('brand.name')}</title>
      </Helmet>
      <div className="container-content py-12 md:py-16 max-w-3xl">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl font-bold text-walnut heading-display">{t('nav.contact')}</h1>
          <p className="text-walnut/70">
            {isAr
              ? 'حنا هنا 🐾 — راسلينا على واتساب وحنرد عليك بسرعة.'
              : 'We’re here 🐾 — WhatsApp us and we’ll reply fast.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-whisper rounded-2xl p-6 space-y-3 text-center">
            <MessageCircle className="h-8 w-8 text-[#25D366] mx-auto" />
            <h2 className="font-bold text-walnut">WhatsApp</h2>
            <p className="text-sm text-walnut/70">
              {isAr ? 'أسرع طريقة للتواصل' : 'Fastest way to reach us'}
            </p>
            <Button
              href={buildWhatsAppLink(whatsappPhone, isAr ? 'مرحبا 👋' : 'Hi 👋')}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="md"
            >
              {isAr ? 'افتحي واتساب' : 'Open WhatsApp'}
            </Button>
          </div>

          <div className="bg-whisper rounded-2xl p-6 space-y-3 text-center">
            <Mail className="h-8 w-8 text-emerald mx-auto" />
            <h2 className="font-bold text-walnut">Email</h2>
            <p className="text-sm text-walnut/70">{isAr ? 'للأسئلة الطويلة' : 'For longer questions'}</p>
            <a href="mailto:hello@hirra.com" className="block text-emerald font-semibold hover:underline">
              hello@hirra.com
            </a>
          </div>

          <div className="bg-whisper rounded-2xl p-6 space-y-3 text-center">
            <Instagram className="h-8 w-8 text-walnut mx-auto" />
            <h2 className="font-bold text-walnut">Instagram</h2>
            <p className="text-sm text-walnut/70">@hirra.ksa</p>
            <a
              href="https://instagram.com/hirra.ksa"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-emerald font-semibold hover:underline"
            >
              {isAr ? 'تابعينا' : 'Follow us'}
            </a>
          </div>

          <div className="bg-whisper rounded-2xl p-6 space-y-3 text-center">
            <MapPin className="h-8 w-8 text-emerald mx-auto" />
            <h2 className="font-bold text-walnut">{t('footer.address')}</h2>
            <p className="text-sm text-walnut/70">{t('footer.address_value')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
