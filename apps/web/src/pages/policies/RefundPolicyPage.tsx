import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SectionHeader } from '@/components/brand/SectionHeader';
import { BRAND, buildWhatsAppLink } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';

export default function RefundPolicyPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;

  return (
    <>
      <Helmet>
        <title>
          {t('footer.refunds')} — {t('brand.name')}
        </title>
      </Helmet>
      <article className="container-content section-y-tight max-w-3xl">
        <SectionHeader title={t('footer.refunds')} className="mb-8" />
        <div className="luxury-card p-6 md:p-8 space-y-6 text-champagne/90 leading-relaxed">
          {locale === 'ar' ? (
            <>
              <p>
                ريانا لوكس تقدّم <strong className="text-pearl">ضمان رضا 14 يوماً</strong> على جميع المنتجات.
              </p>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">شروط الإرجاع</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>خلال 14 يوماً من التسليم</li>
                  <li>المنتج في حالة جيدة</li>
                  <li>التغليف الأصلي مفضّل وليس إلزامياً</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">كيف تطلب الإرجاع؟</h2>
                <ol className="list-decimal ps-6 space-y-1 text-smoke">
                  <li>راسِلنا على واتساب مع رقم الطلبية</li>
                  <li>نرتّب استرجاع القطعة أو نرشدك</li>
                  <li>استرداد كامل خلال 3-7 أيام عمل بعد المراجعة</li>
                </ol>
              </section>
              <p className="text-smoke">
                للاستفسار:{' '}
                <a href={`mailto:${BRAND.email}`} className="text-gold hover:underline">
                  {BRAND.email}
                </a>
              </p>
            </>
          ) : (
            <>
              <p>
                RIYANALUXE offre une <strong className="text-pearl">garantie satisfait 14 jours</strong>.
              </p>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">Conditions</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>Dans les 14 jours suivant la réception</li>
                  <li>Produit en bon état</li>
                  <li>Emballage d’origine apprécié</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">Procédure</h2>
                <ol className="list-decimal ps-6 space-y-1 text-smoke">
                  <li>Contactez-nous sur WhatsApp avec le n° de commande</li>
                  <li>Nous organisons la suite</li>
                  <li>Remboursement sous 3–7 jours ouvrés</li>
                </ol>
              </section>
              <p className="text-smoke">
                <a href={`mailto:${BRAND.email}`} className="text-gold hover:underline">
                  {BRAND.email}
                </a>
              </p>
            </>
          )}
        </div>
      </article>
    </>
  );
}
