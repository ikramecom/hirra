import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <>
      <Helmet>
        <title>{t('nav.about')} — {t('brand.name')}</title>
      </Helmet>

      <section className="bg-emerald text-cream py-16 md:py-20">
        <div className="container-content text-center max-w-3xl space-y-4">
          <p className="text-gold text-sm font-semibold uppercase tracking-wide">{t('brand.name')}</p>
          <h1 className="text-hero font-bold heading-display">
            {isAr ? 'بدأنا من حُب' : 'It started with love'}
          </h1>
          <p className="text-cream/80 text-lg">
            {isAr
              ? 'هِرّة براند سعودي بدأ من قصة بسيطة: مؤسستنا تحب قطتها، وتحب بيتها، وتعبت من المنتجات الرخيصة اللي ما تستاهلهم.'
              : 'Hirra is a Saudi brand born from a simple story: our founder loves her cat, loves her home, and was tired of cheap products that didn’t deserve them.'}
          </p>
        </div>
      </section>

      <section className="container-content py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Heart,
            titleAr: 'محبة حقيقية',
            titleEn: 'Real love',
            descAr: 'كل منتج اختير بعناية لقطتك ولبيتك السعودي.',
            descEn: 'Every product is hand-picked for your cat and your Saudi home.',
          },
          {
            icon: Sparkles,
            titleAr: 'جودة فاخرة',
            titleEn: 'Premium quality',
            descAr: 'نختار سيليكون آمن، فلاتر كربون، ومواد تتحمل البيت السعودي.',
            descEn: 'We pick food-grade silicone, activated-carbon filters, and materials made to last.',
          },
          {
            icon: ShieldCheck,
            titleAr: 'ضمان كامل',
            titleEn: 'Full guarantee',
            descAr: 'لو ما عجبك المنتج، استرجاع كامل خلال ٣٠ يوم — بدون أسئلة.',
            descEn: 'If you don’t love it, return it within 30 days for a full refund — no questions asked.',
          },
        ].map((b, i) => (
          <div key={i} className="bg-whisper rounded-2xl p-6 space-y-3 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald/10 text-emerald grid place-items-center mx-auto">
              <b.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-walnut">{isAr ? b.titleAr : b.titleEn}</h3>
            <p className="text-walnut/70 leading-relaxed">{isAr ? b.descAr : b.descEn}</p>
          </div>
        ))}
      </section>

      <section className="bg-walnut text-cream py-16">
        <div className="container-content text-center max-w-2xl space-y-4">
          <h2 className="text-h2 font-bold heading-display">
            {isAr ? 'انضمي لقبيلة هِرّة 🐾' : 'Join the Hirra tribe 🐾'}
          </h2>
          <p className="text-cream/80">
            {isAr ? 'اكتشفي منتجاتنا المختارة بحب' : 'Discover our products, chosen with love'}
          </p>
          <Button to="/products/hirra-pro-roller" variant="gold" size="lg">
            {t('cta.shop_hero')}
          </Button>
        </div>
      </section>
    </>
  );
}
