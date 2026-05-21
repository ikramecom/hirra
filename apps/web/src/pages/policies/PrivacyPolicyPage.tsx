import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  return (
    <>
      <Helmet>
        <title>{t('footer.privacy')} — {t('brand.name')}</title>
      </Helmet>
      <article className="container-content py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-walnut heading-display mb-6">{t('footer.privacy')}</h1>

        {isAr ? (
          <div className="space-y-4 text-walnut/80 leading-relaxed">
            <p>
              نحن في هِرّة نأخذ خصوصيتك على محمل الجد. هذه السياسة توضح أي معلومات نجمعها، كيف نستخدمها، ومن يستطيع
              الوصول إليها. تخضع هذه السياسة لـ <strong>نظام حماية البيانات الشخصية</strong> في المملكة العربية السعودية.
            </p>

            <h2 className="text-xl font-bold text-walnut">المعلومات اللي نجمعها</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>الاسم، رقم الجوال، البريد الإلكتروني (اختياري)</li>
              <li>عنوان التوصيل (المدينة، الحي، الشارع)</li>
              <li>تاريخ الطلبات السابقة والمعاملات</li>
              <li>معلومات تقنية (نوع المتصفح، الجهاز، عنوان IP)</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">كيف نستخدم معلوماتك</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>تنفيذ طلباتك وتوصيلها</li>
              <li>التواصل معك عبر واتساب لتأكيد الطلبات والتحديثات</li>
              <li>تحسين تجربتك في موقعنا</li>
              <li>إرسال عروض حصرية (يمكنك إلغاء الاشتراك في أي وقت)</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">من يستطيع الوصول لمعلوماتك؟</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>فريق هِرّة فقط (الموظفين المخولين)</li>
              <li>شركات الشحن (سمسا، أرامكس) — العنوان فقط</li>
              <li>مزودي الخدمات التقنية (Supabase، Cloudflare) — مشفّر</li>
            </ul>
            <p>
              <strong>نحن لا نبيع معلوماتك لأي طرف ثالث.</strong> أبداً.
            </p>

            <h2 className="text-xl font-bold text-walnut">حقوقك</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>الوصول لمعلوماتك المخزنة عندنا</li>
              <li>تصحيح أي معلومات خاطئة</li>
              <li>حذف حسابك ومعلوماتك (راسلينا على hello@hirra.com)</li>
              <li>إلغاء الاشتراك في الرسائل التسويقية</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">الاستفسارات</h2>
            <p>للاستفسار عن سياسة الخصوصية: راسلينا على hello@hirra.com.</p>
          </div>
        ) : (
          <div className="space-y-4 text-walnut/80 leading-relaxed">
            <p>
              At Hirra, we take your privacy seriously. This policy explains what we collect, how we use it, and who has
              access. It complies with Saudi Arabia’s <strong>Personal Data Protection Law (PDPL)</strong>.
            </p>

            <h2 className="text-xl font-bold text-walnut">What we collect</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>Name, phone, email (optional)</li>
              <li>Shipping address (city, district, street)</li>
              <li>Order history and transactions</li>
              <li>Technical info (browser, device, IP)</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">How we use it</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>Fulfill and deliver your orders</li>
              <li>Contact you via WhatsApp to confirm orders and updates</li>
              <li>Improve our website experience</li>
              <li>Send exclusive offers (you can unsubscribe any time)</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">Who has access?</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>The Hirra team only (authorized staff)</li>
              <li>Couriers (SMSA, Aramex) — address only</li>
              <li>Service providers (Supabase, Cloudflare) — encrypted</li>
            </ul>
            <p>
              <strong>We never sell your data.</strong> Ever.
            </p>

            <h2 className="text-xl font-bold text-walnut">Your rights</h2>
            <ul className="list-disc ps-6 space-y-1">
              <li>Access the data we have</li>
              <li>Correct any incorrect data</li>
              <li>Delete your account and data (email hello@hirra.com)</li>
              <li>Unsubscribe from marketing</li>
            </ul>

            <h2 className="text-xl font-bold text-walnut">Questions</h2>
            <p>Email hello@hirra.com.</p>
          </div>
        )}
      </article>
    </>
  );
}
