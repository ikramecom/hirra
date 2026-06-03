import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Mail, MessageCircle, Instagram, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/brand/SectionHeader';
import { BRAND, buildWhatsAppLink } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const wa = buildWhatsAppLink(
    import.meta.env.VITE_WHATSAPP_PHONE || BRAND.whatsappDigits,
    locale === 'ar'
      ? 'السلام عليكم، أود التواصل مع ريانا لوكس.'
      : 'Bonjour, je souhaite contacter RIYANALUXE.',
  );

  return (
    <>
      <Helmet>
        <title>
          {t('nav.contact')} — {t('brand.name')}
        </title>
      </Helmet>
      <div className="container-content section-y-tight max-w-3xl">
        <SectionHeader
          title={t('nav.contact')}
          lead={
            locale === 'ar'
              ? 'نرد على واتساب بسرعة — بلطف وبأسلوب يليق بكم.'
              : 'Réponse WhatsApp rapide et soignée.'
          }
          align="center"
          className="mb-10"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <div className="luxury-card p-6 text-center space-y-4">
            <MessageCircle className="h-8 w-8 text-[#25D366] mx-auto" />
            <h2 className="font-semibold text-pearl">WhatsApp</h2>
            <p className="text-sm text-smoke">
              {locale === 'ar' ? 'أسرع طريقة للتواصل' : 'Le plus rapide'}
            </p>
            <Button href={wa} target="_blank" variant="whatsapp" size="md">
              {locale === 'ar' ? 'افتح واتساب' : 'Ouvrir WhatsApp'}
            </Button>
          </div>

          <div className="luxury-card p-6 text-center space-y-4">
            <Mail className="h-8 w-8 text-gold mx-auto" strokeWidth={1.25} />
            <h2 className="font-semibold text-pearl">Email</h2>
            <p className="text-sm text-smoke">
              {locale === 'ar' ? 'للاستفسارات التفصيلية' : 'Questions détaillées'}
            </p>
            <a
              href={`mailto:${BRAND.email}`}
              className="block text-gold font-medium hover:text-champagne transition"
            >
              {BRAND.email}
            </a>
          </div>

          <div className="luxury-card p-6 text-center space-y-4">
            <Instagram className="h-8 w-8 text-gold mx-auto" strokeWidth={1.25} />
            <h2 className="font-semibold text-pearl">Instagram</h2>
            <p className="text-sm text-smoke">{BRAND.instagram}</p>
            <a
              href={`https://instagram.com/${BRAND.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gold font-medium hover:text-champagne transition"
            >
              {locale === 'ar' ? 'تابعونا' : 'Suivre'}
            </a>
          </div>

          <div className="luxury-card p-6 text-center space-y-4">
            <MapPin className="h-8 w-8 text-gold mx-auto" strokeWidth={1.25} />
            <h2 className="font-semibold text-pearl">{t('footer.address')}</h2>
            <p className="text-sm text-smoke">{t('footer.address_value')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
