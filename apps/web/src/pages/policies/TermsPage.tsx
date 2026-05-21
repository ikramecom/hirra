import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  return (
    <>
      <Helmet>
        <title>{t('footer.terms')} — {t('brand.name')}</title>
      </Helmet>
      <article className="container-content py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-walnut heading-display mb-6">{t('footer.terms')}</h1>

        {isAr ? (
          <div className="space-y-4 text-walnut/80 leading-relaxed">
            <p>
              مرحباً بك في هِرّة. باستخدامك لموقعنا أو طلبك من منتجاتنا، أنت توافقين على هذه الشروط والأحكام.
            </p>

            <h2 className="text-xl font-bold text-walnut">١. عن هِرّة</h2>
            <p>
              هِرّة براند سعودي متخصص في منتجات القطط الفاخرة. مقرنا الرياض، المملكة العربية السعودية. نخضع للأنظمة
              السعودية المعمول بها، بما فيها نظام التجارة الإلكترونية ونظام حماية المستهلك.
            </p>

            <h2 className="text-xl font-bold text-walnut">٢. الطلبات والدفع</h2>
            <p>
              الأسعار بالريال السعودي شاملة ضريبة القيمة المضافة. نقبل الدفع عند الاستلام، والتحويل البنكي، ومدى/آبل
              باي (قريباً).
            </p>

            <h2 className="text-xl font-bold text-walnut">٣. الشحن والتوصيل</h2>
            <p>
              راجعي <a href="/policies/shipping" className="text-emerald underline">سياسة الشحن</a> للتفاصيل الكاملة.
            </p>

            <h2 className="text-xl font-bold text-walnut">٤. الإرجاع والاسترداد</h2>
            <p>
              ضمان رضا ٣٠ يوم. التفاصيل في{' '}
              <a href="/policies/refunds" className="text-emerald underline">
                سياسة الإرجاع
              </a>.
            </p>

            <h2 className="text-xl font-bold text-walnut">٥. الخصوصية</h2>
            <p>
              نحمي بياناتك حسب نظام حماية البيانات الشخصية السعودي. راجعي{' '}
              <a href="/policies/privacy" className="text-emerald underline">
                سياسة الخصوصية
              </a>.
            </p>

            <h2 className="text-xl font-bold text-walnut">٦. الملكية الفكرية</h2>
            <p>كل المحتوى على موقع هِرّة (نصوص، صور، شعار) ملك حصري لهِرّة. ممنوع استخدامه بدون إذن خطي.</p>

            <h2 className="text-xl font-bold text-walnut">٧. تعديل الشروط</h2>
            <p>
              نحتفظ بحقنا في تعديل هذه الشروط في أي وقت. التعديلات تسري فور نشرها على هذه الصفحة.
            </p>

            <h2 className="text-xl font-bold text-walnut">٨. القانون المعمول به</h2>
            <p>
              تخضع هذه الشروط لأنظمة المملكة العربية السعودية. أي نزاع يحال إلى المحاكم السعودية المختصة.
            </p>

            <h2 className="text-xl font-bold text-walnut">٩. التواصل</h2>
            <p>للاستفسار: hello@hirra.com أو واتساب على رقم الدعم.</p>
          </div>
        ) : (
          <div className="space-y-4 text-walnut/80 leading-relaxed">
            <p>Welcome to Hirra. By using our site or placing an order, you agree to these terms.</p>

            <h2 className="text-xl font-bold text-walnut">1. About Hirra</h2>
            <p>
              Hirra is a Saudi brand specialized in premium cat-care essentials. Based in Riyadh, Saudi Arabia.
              We comply with Saudi regulations including e-commerce and consumer protection laws.
            </p>

            <h2 className="text-xl font-bold text-walnut">2. Orders & payment</h2>
            <p>Prices in SAR, VAT-inclusive. We accept cash on delivery, bank transfer, and Mada/Apple Pay (soon).</p>

            <h2 className="text-xl font-bold text-walnut">3. Shipping</h2>
            <p>See our <a href="/policies/shipping" className="text-emerald underline">Shipping Policy</a>.</p>

            <h2 className="text-xl font-bold text-walnut">4. Returns</h2>
            <p>30-day satisfaction guarantee. See <a href="/policies/refunds" className="text-emerald underline">Refund Policy</a>.</p>

            <h2 className="text-xl font-bold text-walnut">5. Privacy</h2>
            <p>We protect your data per Saudi PDPL. See <a href="/policies/privacy" className="text-emerald underline">Privacy Policy</a>.</p>

            <h2 className="text-xl font-bold text-walnut">6. Intellectual property</h2>
            <p>All site content (text, images, logo) is Hirra’s exclusive property. No use without written permission.</p>

            <h2 className="text-xl font-bold text-walnut">7. Changes</h2>
            <p>We may update these terms at any time. Changes take effect immediately when published.</p>

            <h2 className="text-xl font-bold text-walnut">8. Governing law</h2>
            <p>Governed by the laws of Saudi Arabia. Disputes go to competent Saudi courts.</p>

            <h2 className="text-xl font-bold text-walnut">9. Contact</h2>
            <p>hello@hirra.com or WhatsApp our support number.</p>
          </div>
        )}
      </article>
    </>
  );
}
