import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SectionHeader } from '@/components/brand/SectionHeader';
import { BRAND } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';

export default function PrivacyPolicyPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;

  return (
    <>
      <Helmet>
        <title>
          {t('footer.privacy')} — {t('brand.name')}
        </title>
      </Helmet>
      <article className="container-content section-y-tight max-w-3xl">
        <SectionHeader title={t('footer.privacy')} className="mb-8" />
        <div className="luxury-card p-6 md:p-8 space-y-6 text-champagne/90 leading-relaxed">
          {locale === 'ar' ? (
            <>
              <p className="text-smoke">
                نحن في ريانا لوكس نحترم خصوصيتكم. هذه السياسة توضّح البيانات التي نجمعها وكيف نستخدمها.
              </p>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">ما نجمع</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>الاسم ورقم الهاتف</li>
                  <li>المدينة للتوصيل</li>
                  <li>سجل الطلبات</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">الاستخدام</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>تنفيذ الطلب والتوصيل</li>
                  <li>التأكيد عبر واتساب</li>
                  <li>تحسين الخدمة</li>
                </ul>
              </section>
              <p className="text-smoke">
                <strong className="text-pearl">لا نبيع بياناتكم لأطراف ثالثة.</strong>
              </p>
              <p className="text-smoke">
                للاستفسار:{' '}
                <a href={`mailto:${BRAND.email}`} className="text-gold hover:underline">
                  {BRAND.email}
                </a>
              </p>
            </>
          ) : (
            <>
              <p className="text-smoke">
                RIYANALUXE respecte votre vie privée. Cette politique décrit les données collectées et leur usage.
              </p>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">Collecte</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>Nom et téléphone</li>
                  <li>Ville de livraison</li>
                  <li>Historique de commandes</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">Usage</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>Exécution et livraison</li>
                  <li>Confirmation WhatsApp</li>
                  <li>Amélioration du service</li>
                </ul>
              </section>
              <p className="text-smoke">
                <strong className="text-pearl">Nous ne vendons pas vos données.</strong>
              </p>
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
