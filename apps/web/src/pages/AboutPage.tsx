import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { BRAND } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';

export default function AboutPage() {
  const { i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;

  return (
    <>
      <Helmet>
        <title>{locale === 'ar' ? 'قصتنا' : 'Notre histoire'} — {BRAND.nameAr}</title>
      </Helmet>
      <article className="section-y">
        <div className="container-content max-w-prose mx-auto space-y-8">
          <p className="text-eyebrow text-gold">RIYANALUXE — ريانا لوكس</p>
          <h1 className="text-h1 heading-display text-pearl">
            {locale === 'ar' ? 'الضيافة، بأناقة معاصرة' : 'L’hospitalité, réinventée'}
          </h1>
          <p className="text-champagne leading-relaxed text-lg">
            {locale === 'ar'
              ? 'وُلدت ريانا لوكس من إيمان بسيط: الدار المغربية تستحق ريحة فاخرة بلا فوضى الفحم. نصمم طقوساً عصرية — مبخرة لوكس، حجر يجفف الحمام، وحماية للدولاب من الرطوبة — كلها تخدم جوّ الضيافة الذي تعرفه.'
              : 'RIYANALUXE est née d’une conviction : le foyer maghrébin mérite un parfum d’exception, sans le désordre du charbon. Nous créons des rituels contemporains au service de l’hospitalité.'}
          </p>
          <p className="text-smoke leading-relaxed">
            {locale === 'ar'
              ? 'نختار كل قطعة بعناية، نغلفها كهدية، ونوصلها لباب الدار بالدفع عند التسليم — بشفافية ودفء.'
              : 'Chaque pièce est choisie avec soin, emballée comme un cadeau, livrée en paiement à la livraison.'}
          </p>
        </div>
      </article>
    </>
  );
}
