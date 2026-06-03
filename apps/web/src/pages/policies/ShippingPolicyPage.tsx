import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SectionHeader } from '@/components/brand/SectionHeader';
import type { StoreLocale } from '@/i18n';

export default function ShippingPolicyPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;

  return (
    <>
      <Helmet>
        <title>
          {t('footer.shipping')} — {t('brand.name')}
        </title>
      </Helmet>
      <article className="container-content section-y-tight max-w-3xl">
        <SectionHeader title={t('footer.shipping')} className="mb-8" />
        <div className="luxury-card p-6 md:p-8 space-y-6 text-champagne/90 leading-relaxed">
          {locale === 'ar' ? (
            <>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">مدة التوصيل</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>الدار البيضاء، الرباط: 2-3 أيام عمل</li>
                  <li>مراكش، طنجة، فاس، أكادير: 3-4 أيام</li>
                  <li>باقي المدن المغربية: 4-5 أيام</li>
                  <li>الجزائر وتونس: 5-7 أيام حسب المدينة</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">تكلفة التوصيل</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>من 25 درهم (المدن الرئيسية)</li>
                  <li>توصيل مجاني ابتداءً من 349 درهم</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">التتبع</h2>
                <p className="text-smoke">
                  نرسل تحديثاً عبر واتساب عند إرسال الطلبية. راسِلونا في أي وقت لمعرفة الحالة.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">Délais</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>Casablanca, Rabat : 2–3 jours ouvrés</li>
                  <li>Marrakech, Tanger, Fès : 3–4 jours</li>
                  <li>Autres villes du Maroc : 4–5 jours</li>
                  <li>Algérie, Tunisie : 5–7 jours</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">Frais</h2>
                <ul className="list-disc ps-6 space-y-1 text-smoke">
                  <li>À partir de 25 MAD</li>
                  <li>Livraison offerte dès 349 MAD</li>
                </ul>
              </section>
              <section className="space-y-2">
                <h2 className="text-lg font-semibold text-pearl">Suivi</h2>
                <p className="text-smoke">
                  Mise à jour WhatsApp à l’expédition. Contactez-nous à tout moment.
                </p>
              </section>
            </>
          )}
        </div>
      </article>
    </>
  );
}
