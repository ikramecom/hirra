import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SectionHeader } from '@/components/brand/SectionHeader';
import { BRAND } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';

export default function TermsPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;

  return (
    <>
      <Helmet>
        <title>
          {t('footer.terms')} — {t('brand.name')}
        </title>
      </Helmet>
      <article className="container-content section-y-tight max-w-3xl">
        <SectionHeader title={t('footer.terms')} className="mb-8" />
        <div className="luxury-card p-6 md:p-8 space-y-6 text-champagne/90 leading-relaxed">
          {locale === 'ar' ? (
            <>
              <p>مرحباً بكم في ريانا لوكس. باستخدام الموقع أو تقديم طلب، فإنكم توافقون على هذه الشروط.</p>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">1. عن ريانا لوكس</h2>
                <p className="text-smoke">
                  ريانا لوكس علامة مغاربية متخصصة في عطور المنزل والضيافة — مبخرة فاخرة وطقوس منزلية. مقرنا
                  المغرب. نلتزم بقوانين التجارة وحماية المستهلك المعمول بها.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">2. الطلبات والدفع</h2>
                <p className="text-smoke">
                  الأسعار بالدرهم المغربي. الدفع عند التسليم متاح. نؤكد كل طلبية على واتساب قبل
                  الإرسال.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">3. التوصيل والإرجاع</h2>
                <p className="text-smoke">
                  راجعوا <a href="/policies/shipping" className="text-gold underline">سياسة التوصيل</a> و{' '}
                  <a href="/policies/refunds" className="text-gold underline">سياسة الإرجاع</a>.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">4. التواصل</h2>
                <p className="text-smoke">
                  {BRAND.email} — واتساب عبر الموقع.
                </p>
              </section>
            </>
          ) : (
            <>
              <p>Bienvenue chez RIYANALUXE. En utilisant le site ou en commandant, vous acceptez ces conditions.</p>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">1. À propos</h2>
                <p className="text-smoke">
                  RIYANALUXE est une maison maghrébine du parfum et de l’hospitalité — Mabkhara et rituels
                  maison. Basée au Maroc.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">2. Commandes</h2>
                <p className="text-smoke">Prix en MAD. Paiement à la livraison. Confirmation WhatsApp avant envoi.</p>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">3. Livraison & retours</h2>
                <p className="text-smoke">
                  Voir <a href="/policies/shipping" className="text-gold underline">Livraison</a> et{' '}
                  <a href="/policies/refunds" className="text-gold underline">Retours</a>.
                </p>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">4. Contact</h2>
                <p className="text-smoke">{BRAND.email}</p>
              </section>
            </>
          )}
        </div>
      </article>
    </>
  );
}
