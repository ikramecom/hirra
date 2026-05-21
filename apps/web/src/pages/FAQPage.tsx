import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Accordion } from '@/components/ui/Accordion';

export default function FAQPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const items = isAr
    ? [
        {
          question: 'كم يستغرق التوصيل؟',
          answer:
            'الرياض: ١-٢ يوم عمل. جدة والدمام والخبر: ٢-٣ أيام. باقي المدن الكبرى: ٣-٥ أيام. المناطق النائية: ٤-٧ أيام.',
        },
        {
          question: 'كم رسوم الشحن؟',
          answer:
            '١٨ ر.س للطلبات داخل المدن الكبرى، ٢٣-٢٨ ر.س للمناطق الأبعد. شحن مجاني للطلبات اللي ٢٠٠ ر.س فأكثر.',
        },
        {
          question: 'هل أقدر أدفع كاش عند الاستلام؟',
          answer: 'نعم، الدفع عند الاستلام متاح في كل المدن السعودية. رسوم بسيطة ١٠ ر.س فقط على طلبات COD.',
        },
        {
          question: 'كيف أتأكد من طلبي؟',
          answer:
            'حنتواصل معك على واتساب خلال دقائق من إتمام الطلب لتأكيد العنوان وموعد التوصيل. تقدري ترسلي لنا أي وقت على رقم الدعم.',
        },
        {
          question: 'ما هي سياسة الإرجاع؟',
          answer:
            'ضمان رضا ٣٠ يوم — لو ما عجبك المنتج لأي سبب، تواصلي معنا ونستلمه ونرجع لك فلوسك كاملة.',
        },
        {
          question: 'هل المنتجات أصلية وآمنة؟',
          answer:
            'نعم — كل منتج تم اختياره وتجربته من قِبل فريقنا في السعودية. السيليكون آمن للأطعمة، والمضخات هادئة، والمواد تتحمل البيت السعودي.',
        },
        {
          question: 'هل تشحنون لخارج السعودية؟',
          answer: 'حالياً نشحن داخل السعودية فقط. قريباً إن شاء الله سنفتح الشحن لدول الخليج.',
        },
        {
          question: 'كيف أتواصل معكم؟',
          answer: 'راسلينا على واتساب على رقم الدعم، أو عبر صفحة "تواصلي معنا". نرد خلال ساعة في أوقات العمل.',
        },
      ]
    : [
        {
          question: 'How fast is delivery?',
          answer:
            'Riyadh: 1–2 business days. Jeddah, Dammam, Khobar: 2–3 days. Other major cities: 3–5 days. Remote areas: 4–7 days.',
        },
        {
          question: 'What does shipping cost?',
          answer: 'SAR 18 for major cities, SAR 23–28 for further areas. Free shipping on orders over SAR 200.',
        },
        {
          question: 'Can I pay cash on delivery?',
          answer: 'Yes — COD is available in every Saudi city. A small SAR 10 fee applies on COD orders.',
        },
        {
          question: 'How is my order confirmed?',
          answer: 'We’ll WhatsApp you within minutes to confirm address and delivery time. Reply any time on our support number.',
        },
        {
          question: 'What is your return policy?',
          answer:
            '30-day satisfaction guarantee — if you don’t love it, message us. We’ll pick it up and refund you in full.',
        },
        {
          question: 'Are the products genuine and safe?',
          answer:
            'Yes — every product is hand-selected and tested by our team in Saudi. Food-grade silicone, silent pumps, materials built to last in Saudi homes.',
        },
        {
          question: 'Do you ship outside Saudi Arabia?',
          answer: 'Currently we ship within Saudi only. GCC shipping is coming soon, insha’Allah.',
        },
        {
          question: 'How do I contact you?',
          answer: 'WhatsApp our support number, or visit the Contact page. We reply within an hour during business hours.',
        },
      ];

  return (
    <>
      <Helmet>
        <title>{t('footer.faq')} — {t('brand.name')}</title>
      </Helmet>
      <div className="container-content py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl font-bold text-walnut heading-display mb-8 text-center">{t('footer.faq')}</h1>
        <div className="bg-whisper rounded-2xl p-2 md:p-4">
          <Accordion items={items} />
        </div>
      </div>
    </>
  );
}
