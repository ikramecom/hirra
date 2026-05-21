import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, MessageCircle } from 'lucide-react';

import { Eyebrow } from '@/components/common/Eyebrow';
import { HirraLogo } from '@/components/brand/HirraLogo';
import { PaymentStrip } from '@/components/common/PaymentStrip';

/**
 * Editorial footer.
 *
 * Three-column on desktop. Top band: brand mark + tagline + payment strip.
 * Middle: links. Bottom: tiny legal + payment recognition strip.
 *
 * Walnut surface keeps the cream content area pristine and lifts perceived
 * premium — like the back cover of a magazine.
 */
export function Footer() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-walnut text-cream mt-20 md:mt-28">
      {/* Top band: brand statement + payment recognition */}
      <div className="container-content pt-14 md:pt-20 pb-10 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 md:gap-14">
          {/* Brand */}
          <div className="space-y-5 md:max-w-sm">
            <Link to="/" className="inline-block -ms-1 hover:opacity-90 transition-opacity">
              <HirraLogo variant="full" tone="light" showTagline className="scale-105 origin-start" />
            </Link>

            <p className="text-sm text-cream/70 leading-relaxed text-pretty">
              {locale === 'ar'
                ? 'منزل سعودي مخصص للقطط — ثلاثة منتجات مختارة بحب، لتعتني بقطتك دون أن تتنازلي عن جمال بيتك.'
                : 'A KSA cat-care house — three carefully chosen pieces so you can love your cat without compromising the home you’ve built.'}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/hirra.ksa"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-cream/15 grid place-items-center text-cream/80 hover:text-gold hover:border-gold/50 transition"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/9665XXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full border border-cream/15 grid place-items-center text-cream/80 hover:text-gold hover:border-gold/50 transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <Eyebrow tone="cream">{t('footer.products')}</Eyebrow>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <Link to="/products" className="hover:text-gold transition">
                  {locale === 'ar' ? 'كل المنتجات' : 'All products'}
                </Link>
              </li>
              <li>
                <Link to="/products/hirra-pro-roller" className="hover:text-gold transition">
                  Hirra Pro Roller
                </Link>
              </li>
              <li>
                <Link to="/products/hirra-honeycomb-mat" className="hover:text-gold transition">
                  Honeycomb Mat
                </Link>
              </li>
              <li>
                <Link to="/products/hirra-aurora-fountain" className="hover:text-gold transition">
                  Aurora Fountain
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <Eyebrow tone="cream">{t('footer.help')}</Eyebrow>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <Link to="/track" className="hover:text-gold transition">
                  {t('nav.track')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold transition">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold transition">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <Eyebrow tone="cream">{t('footer.legal')}</Eyebrow>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <Link to="/policies/shipping" className="hover:text-gold transition">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link to="/policies/refunds" className="hover:text-gold transition">
                  {t('footer.refunds')}
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy" className="hover:text-gold transition">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/policies/terms" className="hover:text-gold transition">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hairline + payment recognition strip */}
        <div className="mt-12 pt-8 border-t border-cream/10 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <Eyebrow tone="cream">
              {locale === 'ar' ? 'طرق الدفع المتاحة قريباً' : 'Payment methods'}
            </Eyebrow>
            <PaymentStrip className="text-cream/70" />
          </div>
        </div>
      </div>

      {/* Bottom legal strip */}
      <div className="border-t border-cream/10">
        <div className="container-content py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-cream/55">
          <p>{t('footer.copyright', { year })}</p>
          <p>{t('footer.address_value')}</p>
        </div>
      </div>
    </footer>
  );
}
