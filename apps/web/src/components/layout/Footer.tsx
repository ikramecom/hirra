import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, MessageCircle } from 'lucide-react';

import { RiyanaluxeLogo } from '@/components/brand/RiyanaluxeLogo';
import { BRAND, buildWhatsAppLink } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';

export function Footer() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const year = new Date().getFullYear();
  const wa = buildWhatsAppLink(import.meta.env.VITE_WHATSAPP_PHONE || BRAND.whatsappDigits);

  return (
    <footer className="border-t border-gold/10 bg-charcoal mt-20">
      <div className="container-content py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2 space-y-4">
          <RiyanaluxeLogo size="lg" />
          <p className="text-smoke text-sm leading-relaxed max-w-sm">
            {locale === 'ar'
              ? 'ريانا لوكس — دار العطر والضيافة. مبخرة فاخرة ومنتجات منزلية للمغرب العربي.'
              : 'RIYANALUXE — maison du parfum et de l’hospitalité maghrébine.'}
          </p>
          <div className="flex gap-3">
            <a
              href={`https://instagram.com/${BRAND.instagram.replace('@', '')}`}
              className="h-10 w-10 rounded-full border border-gold/20 grid place-items-center text-champagne hover:text-gold"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={wa}
              className="h-10 w-10 rounded-full border border-gold/20 grid place-items-center text-champagne hover:text-gold"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <p className="text-eyebrow text-gold mb-4">{locale === 'ar' ? 'تسوق' : 'Boutique'}</p>
          <ul className="space-y-2 text-sm text-champagne">
            <li>
              <Link to="/products/riyanaluxe-mabkhara-luxe" className="hover:text-gold">
                {t('nav.mabkhara')}
              </Link>
            </li>
            <li>
              <Link to="/bundles" className="hover:text-gold">
                {t('nav.bundles')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gold">
                {t('nav.about')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-eyebrow text-gold mb-4">{t('footer.policies')}</p>
          <ul className="space-y-2 text-sm text-champagne">
            <li>
              <Link to="/policies/shipping" className="hover:text-gold">
                {t('footer.shipping')}
              </Link>
            </li>
            <li>
              <Link to="/policies/refunds" className="hover:text-gold">
                {locale === 'ar' ? 'الاسترجاع' : 'Retours'}
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-gold">
                {t('footer.faq')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                {t('nav.contact')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/10 py-6 text-center text-xs text-smoke">
        © {year} {BRAND.name}. {t('footer.rights')}.
      </div>
    </footer>
  );
}
