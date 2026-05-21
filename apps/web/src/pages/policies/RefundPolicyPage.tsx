import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function RefundPolicyPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  return (
    <>
      <Helmet>
        <title>{t('footer.refunds')} — {t('brand.name')}</title>
      </Helmet>
      <article className="container-content py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-walnut heading-display mb-6">{t('footer.refunds')}</h1>

        {isAr ? (
          <div className="space-y-4 text-walnut/80 leading-relaxed">
            <p>هِرّة تقدّم <strong>ضمان رضا ٣٠ يوم</strong> لكل المنتجات.</p>

            <h2 className="text-xl font-bold text-walnut">ما هو ضمان الرضا؟</h2>
            <p>
              لو لأي سبب ما عجبك المنتج خلال ٣٠ يوم من استلامه، تقدري ترجعينه ونرجع لك فلوسك كاملة. ما نسأل أسئلة. ما نضيع وقتك.
            </p>

            <h2 className="text-xl font-bold text-walnut">شروط الإرجاع</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>أن يكون الإرجاع خلال ٣٠ يوم من تاريخ الاستلام.</li>
              <li>أن يكون المنتج في حالة جيدة (يمكن تكوني جربتيه — مافي مشكلة).</li>
              <li>مع التغليف الأصلي إن أمكن (مش شرط).</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">كيف تطلبين الإرجاع؟</h2>
            <ol className="list-decimal ps-6 space-y-1">
              <li>راسلينا على واتساب مع رقم طلبك وسبب الإرجاع (اختياري).</li>
              <li>حنرتب لك استلام المنتج من بيتك (مجاناً).</li>
              <li>بعد استلامه ومراجعته، نرجع لك المبلغ كاملاً خلال ٢-٧ أيام عمل.</li>
            </ol>

            <h2 className="text-xl font-bold text-walnut">طريقة الاسترجاع</h2>
            <p>الاسترجاع يكون عبر تحويل بنكي إلى الحساب اللي تختارينه (مدى، STC Pay، أو بنك آخر).</p>

            <h2 className="text-xl font-bold text-walnut">المنتجات التالفة أو الخاطئة</h2>
            <p>لو وصلك المنتج تالف أو غير اللي طلبتيه، راسلينا على واتساب فوراً. حنبدلك المنتج مجاناً (بدون أي رسوم).</p>
          </div>
        ) : (
          <div className="space-y-4 text-walnut/80 leading-relaxed">
            <p>Hirra offers a <strong>30-day satisfaction guarantee</strong> on all products.</p>

            <h2 className="text-xl font-bold text-walnut">What does the guarantee cover?</h2>
            <p>
              If for any reason you don’t love the product within 30 days of delivery, return it for a full refund. No questions. No hassle.
            </p>

            <h2 className="text-xl font-bold text-walnut">Conditions</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>Return within 30 days of delivery.</li>
              <li>Product in good condition (it’s OK if you used it).</li>
              <li>Original packaging if possible (not required).</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">How to return</h2>
            <ol className="list-decimal ps-6 space-y-1">
              <li>WhatsApp us with your order number and reason (optional).</li>
              <li>We’ll arrange a free pickup from your home.</li>
              <li>After we receive and inspect the item, we refund you within 2–7 business days.</li>
            </ol>

            <h2 className="text-xl font-bold text-walnut">Refund method</h2>
            <p>Bank transfer to your preferred account (Mada, STC Pay, or any other bank).</p>

            <h2 className="text-xl font-bold text-walnut">Damaged or wrong items</h2>
            <p>If you received a damaged or wrong item, WhatsApp us immediately. We’ll replace it for free.</p>
          </div>
        )}
      </article>
    </>
  );
}
