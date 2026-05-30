import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Accordion } from '@/components/ui/Accordion';
import { SectionHeader } from '@/components/brand/SectionHeader';
import type { StoreLocale } from '@/i18n';

export default function FAQPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;

  const items =
    locale === 'ar'
      ? [
          {
            question: 'كم يستغرق التوصيل؟',
            answer:
              'الدار البيضاء والرباط: 2-3 أيام. مراكش، طنجة، فاس: 3-4 أيام. باقي المدن المغربية: 4-5 أيام. الجزائر وتونس حسب المدينة.',
          },
          {
            question: 'كم تكلفة التوصيل؟',
            answer:
              'من 25 درهم حسب المدينة. التوصيل مجاني ابتداءً من 349 درهم.',
          },
          {
            question: 'هل الدفع عند التسليم متاح؟',
            answer:
              'نعم — في المغرب والجزائر وتونس. نؤكد الطلبية معك على واتساب قبل الإرسال.',
          },
          {
            question: 'كيف يتم تأكيد الطلب؟',
            answer:
              'بعد الطلب، نتواصل معكم هاتفياً أو عبر واتساب لتأكيد التفاصيل — ثم نرسل القطعة بتغليف ريانا لوكس الفاخر.',
          },
          {
            question: 'ما هي سياسة الإرجاع؟',
            answer:
              'ضمان رضا 14 يوم — استبدال أو استرجاع بعد التواصل معنا.',
          },
          {
            question: 'هل المبخرة بدون فحم؟',
            answer:
              'نعم. تسخين كهربائي نظيف — بخور بلا رماد ولا فوضى في الصالون.',
          },
          {
            question: 'كيف أتواصل معكم؟',
            answer: 'واتساب أو صفحة التواصل — نرد بسرعة وبلطف.',
          },
        ]
      : [
          {
            question: 'Délais de livraison ?',
            answer:
              'Casa/Rabat : 2–3 jours. Marrakech, Tanger, Fès : 3–4 jours. Autres villes : 4–5 jours.',
          },
          {
            question: 'Frais de livraison ?',
            answer: 'À partir de 25 MAD. Gratuit dès 349 MAD.',
          },
          {
            question: 'Paiement à la livraison ?',
            answer: 'Oui — confirmation WhatsApp avant envoi.',
          },
          {
            question: 'Confirmation de commande ?',
            answer: 'Nous vous contactons par WhatsApp ou téléphone avant l’expédition.',
          },
          {
            question: 'Retours ?',
            answer: 'Satisfait 14 jours — échange ou remboursement après contact.',
          },
          {
            question: 'Sans charbon ?',
            answer: 'Oui — chauffage électrique, bakhoor propre.',
          },
          {
            question: 'Nous contacter ?',
            answer: 'WhatsApp ou page Contact.',
          },
        ];

  return (
    <>
      <Helmet>
        <title>
          {t('footer.faq')} — {t('brand.name')}
        </title>
      </Helmet>
      <div className="container-content section-y-tight max-w-3xl">
        <SectionHeader title={t('footer.faq')} align="center" className="mb-10" />
        <div className="luxury-card p-4 md:p-6">
          <Accordion items={items} />
        </div>
      </div>
    </>
  );
}
