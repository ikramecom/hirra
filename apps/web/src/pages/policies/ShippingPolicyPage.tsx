import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function ShippingPolicyPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  return (
    <>
      <Helmet>
        <title>{t('footer.shipping')} — {t('brand.name')}</title>
      </Helmet>
      <article className="container-content py-12 md:py-16 max-w-3xl prose prose-walnut">
        <h1 className="text-3xl font-bold text-walnut heading-display">{t('footer.shipping')}</h1>

        {isAr ? (
          <div className="space-y-4 text-walnut/80 leading-relaxed">
            <h2 className="text-xl font-bold text-walnut">مدة التوصيل</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>الرياض: ١-٢ يوم عمل</li>
              <li>جدة، الدمام، الخبر، الظهران: ٢-٣ أيام عمل</li>
              <li>مكة، المدينة، الطائف: ٢-٤ أيام عمل</li>
              <li>باقي المدن: ٣-٥ أيام عمل</li>
              <li>المناطق النائية: ٤-٧ أيام عمل</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">رسوم الشحن</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>المدن الكبرى: ١٨ ر.س</li>
              <li>مكة، المدينة، الطائف: ٢٣ ر.س</li>
              <li>المناطق الأبعد: ٢٨ ر.س</li>
              <li>
                <strong>شحن مجاني</strong> للطلبات اللي ٢٠٠ ر.س فأكثر
              </li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">شركة الشحن</h2>
            <p>نشحن عبر سمسا إكسبرس وأرامكس — كلهم موثوقين ومتتبعين.</p>

            <h2 className="text-xl font-bold text-walnut">تتبع الطلب</h2>
            <p>
              حنرسل لك رقم تتبع على واتساب فور شحن طلبك. تقدري دايماً تراسلينا على واتساب لمعرفة آخر تحديث.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-walnut/80 leading-relaxed">
            <h2 className="text-xl font-bold text-walnut">Delivery times</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>Riyadh: 1–2 business days</li>
              <li>Jeddah, Dammam, Khobar, Dhahran: 2–3 days</li>
              <li>Mecca, Medina, Taif: 2–4 days</li>
              <li>Other cities: 3–5 days</li>
              <li>Remote areas: 4–7 days</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">Shipping fees</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>Major cities: SAR 18</li>
              <li>Mecca, Medina, Taif: SAR 23</li>
              <li>Further areas: SAR 28</li>
              <li><strong>Free shipping</strong> on orders over SAR 200</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">Courier partners</h2>
            <p>SMSA Express and Aramex — trusted and trackable.</p>

            <h2 className="text-xl font-bold text-walnut">Tracking</h2>
            <p>You'll get a tracking number on WhatsApp the moment we ship. Reply any time for an update.</p>
          </div>
        )}
      </article>
    </>
  );
}
