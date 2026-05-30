import { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Gift,
  Sparkles,
  Truck,
  MessageCircle,
  Flame,
  Home,
  Users,
  Banknote,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';
import { useBundles } from '@/hooks/useBundles';
import { BRAND, buildWhatsAppLink, formatMAD, type Bundle } from '@hirra/shared';
import { useCartStore } from '@/store/cart';
import { HERO_SLUG, getFallbackProductBySlug } from '@/lib/fallback-data';
import { homeCopy } from '@/lib/brand-copy';
import type { StoreLocale } from '@/i18n';
import { Accordion } from '@/components/ui/Accordion';
import { SectionHeader } from '@/components/brand/SectionHeader';
import { RIYANALUXE_ASSETS } from '@/lib/assets';
import { RiyanaluxeLogo } from '@/components/brand/RiyanaluxeLogo';
import { getProductImageFallbackUrl } from '@/lib/product-utils';
import { StickyMobileCTA } from '@/components/common/StickyMobileCTA';

const orderCtaClass =
  'w-full sm:w-auto min-h-[3.5rem] text-base md:text-lg font-semibold shadow-[0_8px_32px_rgba(201,169,98,0.22)]';

const ease = [0.16, 1, 0.3, 1] as const;

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.85, ease },
};

function OrderNowButton({
  onClick,
  className,
  size = 'xl',
}: {
  onClick: () => void;
  className?: string;
  size?: 'lg' | 'xl';
}) {
  const { t } = useTranslation();
  return (
    <Button
      variant="gold"
      size={size}
      fullWidth
      onClick={onClick}
      className={className}
      rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
    >
      {t('bundles.order_now', { defaultValue: 'اطلب الآن' })}
    </Button>
  );
}

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const navigate = useNavigate();
  const copy = homeCopy(locale);
  const clear = useCartStore((s) => s.clear);
  const addLine = useCartStore((s) => s.addLine);
  const { data: products = [] } = useProducts();
  const { data: bundles = [] } = useBundles();

  const hero = getFallbackProductBySlug(HERO_SLUG) ?? products.find((p) => p.is_hero);
  const orderMabkharaNow = useCallback(() => {
    if (!hero) {
      navigate('/products/riyanaluxe-mabkhara-luxe');
      return;
    }
    const imageUrl =
      hero.images[0]?.url ?? getProductImageFallbackUrl(hero.slug);
    clear();
    addLine({
      product_id: hero.id,
      product_variant_id: null,
      slug: hero.slug,
      name_ar: hero.name_ar,
      name_en: hero.name_en,
      variant_name_ar: null,
      variant_name_en: null,
      image_url: imageUrl,
      unit_price_sar: Number(hero.price_sar) || 0,
      quantity: 1,
    });
    navigate('/checkout');
  }, [hero, clear, addLine, navigate]);

  const orderBundleNow = useCallback(
    (bundle: Bundle) => {
      clear();
      addLine({
        bundle_id: bundle.id,
        product_variant_id: null,
        slug: bundle.slug,
        name_ar: bundle.name_ar,
        name_en: bundle.name_en,
        variant_name_ar: null,
        variant_name_en: null,
        unit_price_sar: Number(bundle.price_sar) || 0,
        quantity: 1,
        image_url: bundle.image_url,
      });
      navigate('/checkout');
    },
    [clear, addLine, navigate],
  );

  const waHref = buildWhatsAppLink(
    import.meta.env.VITE_WHATSAPP_PHONE || BRAND.whatsappDigits,
    locale === 'ar'
      ? 'السلام عليكم، بغيت نعرف أكثر على مبخرة ريانا لوكس.'
      : 'Bonjour, je souhaite en savoir plus sur la Mabkhara RIYANALUXE.',
  );

  /** Strip any leaked Swiper/carousel DOM (legacy HMR or cached chunks). */
  useEffect(() => {
    document
      .querySelectorAll(
        '.swiper, .swiper-button-next, .swiper-button-prev, .swiper-pagination, .riyana-swiper, .riyana-thumbs',
      )
      .forEach((el) => el.remove());
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {BRAND.nameAr} — {BRAND.taglineAr}
        </title>
        <meta name="description" content={copy.heroLead} />
        <meta property="og:image" content={RIYANALUXE_ASSETS.social.og} />
      </Helmet>

      {/* ——— Static hero (no carousel / swiper / motion) ——— */}
      <section
        id="home-hero"
        className="border-b border-gold/10 bg-obsidian pt-24 pb-12 md:pt-28 md:pb-16"
      >
        <div className="container-content">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 lg:items-center">
            <div className="order-2 lg:order-1 space-y-6 max-w-xl">
              <RiyanaluxeLogo size="hero" className="pointer-events-none" />
              <h1 className="text-hero heading-display text-pearl text-balance">
                {locale === 'ar' ? 'الضيافة تبدأ من الريحة' : copy.heroTitle}
              </h1>
              <p className="text-2xl font-display text-gold tabular">
                {locale === 'ar' ? '249 درهم' : '249 DH'}
              </p>
              <div className="flex flex-col gap-3 w-full max-w-md">
                <OrderNowButton onClick={orderMabkharaNow} className={orderCtaClass} />
                <Button
                  to="/products/riyanaluxe-mabkhara-luxe"
                  variant="secondary"
                  size="lg"
                  fullWidth
                  className="sm:w-auto"
                >
                  {copy.ctaPrimary}
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 frame-gold rounded-hero bg-ink w-full max-w-lg mx-auto lg:max-w-none flex min-h-[280px] md:min-h-[360px] items-center justify-center p-4">
              <img
                src={RIYANALUXE_ASSETS.products.mabkhara.main}
                alt={locale === 'ar' ? 'ريانا لوكس — مبخرة لوكس' : 'RIYANALUXE Mabkhara Luxe'}
                width={800}
                height={1000}
                className="block w-full h-full max-h-[480px] object-contain object-center"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ——— Ritual quote ——— */}
      <section className="py-20 md:py-28 border-y border-gold/[0.08] bg-obsidian">
        <div className="container-content max-w-2xl mx-auto px-4 text-center space-y-8">
          <div className="hairline-gold" />
          <p className="text-lg md:text-xl lg:text-[1.35rem] text-pearl leading-[1.95] text-pretty font-normal">
            {copy.ritualQuote}
          </p>
          <div className="hairline-gold" />
        </div>
      </section>

      {/* ——— Three pillars ——— */}
      <section className="section-y">
        <div className="container-content">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Flame,
                title: locale === 'ar' ? 'طقوس نقية' : 'Rituel pur',
                text:
                  locale === 'ar'
                    ? 'بخور بلا فحم — ريحة صافية تملأ الصالون بهدوء.'
                    : 'Sans charbon — un parfum clair qui emplit le salon.',
              },
              {
                icon: Sparkles,
                title: locale === 'ar' ? 'تفاصيل ذهبية' : 'Détails dorés',
                text:
                  locale === 'ar'
                    ? 'أسود مطفي، لمسات ذهبية، وتصميم يُرى قبل أن يُلمس.'
                    : 'Noir mat, accents dorés, présence avant le toucher.',
              },
              {
                icon: Gift,
                title: locale === 'ar' ? 'هدية تُذكر' : 'Cadeau mémorable',
                text:
                  locale === 'ar'
                    ? 'للعيد، الزيارات، والمناسبات — تقديم يليق بالكرم.'
                    : 'Pour l’Aïd et les visites — un geste généreux.',
              },
            ].map((item) => (
              <motion.div key={item.title} {...reveal} className="luxury-card-hover p-8 md:p-10 space-y-5">
                <item.icon className="h-7 w-7 text-gold/90" strokeWidth={1.25} />
                <h3 className="text-h3 text-pearl">{item.title}</h3>
                <p className="prose-luxury text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Mabkhara editorial (text only — hero image is above) ——— */}
      <section id="home-product" className="section-y cinematic-gradient">
        <div className="container-content space-y-10 md:space-y-14">
          <SectionHeader title={copy.mabkharaTitle} lead={copy.mabkharaLead} />
          <div className="max-w-md mx-auto px-2 md:hidden">
            <OrderNowButton onClick={orderMabkharaNow} size="lg" />
          </div>
          <div className="max-w-2xl mx-auto">
            <ul className="space-y-5">
              {(locale === 'ar'
                ? [
                    'تسخين مستقر — بخورك جاهز في دقيقة',
                    'قفل أمان — راحة بال للعائلة',
                    'شحن USB Type-C — للدار والسفر',
                    'مثالية للعيد، الأعراس، والزيارات',
                  ]
                : [
                    'Chauffe stable — prêt en une minute',
                    'Verrou sécurité enfants',
                    'Charge Type-C',
                    'Idéale pour l’Aïd et les réceptions',
                  ]
              ).map((line, i) => (
                <li
                  key={line}
                  className="flex gap-4 text-lg text-champagne/90 border-b border-gold/10 pb-5 last:border-0"
                >
                  <span className="text-gold/60 text-sm tabular mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {line}
                </li>
              ))}
              <li className="pt-6 space-y-3">
                <OrderNowButton onClick={orderMabkharaNow} size="lg" />
                <p className="text-center sm:text-start text-sm text-smoke tabular">
                  {locale === 'ar' ? '249 درهم · الدفع عند التسليم' : '249 MAD · Paiement à la livraison'}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ——— Packaging & gift ——— */}
      <section className="section-y border-t border-gold/[0.08]">
        <div className="container-content grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'التقديم' : 'Présentation'}
            title={copy.packagingTitle}
            lead={copy.packagingLead}
          />
          <div className="frame-gold rounded-hero bg-ink flex w-full min-h-[280px] sm:min-h-[320px] md:min-h-[380px] items-center justify-center p-6 sm:p-8 md:p-10">
            <img
              src={RIYANALUXE_ASSETS.packaging}
              alt={locale === 'ar' ? 'تغليف ريانا لوكس الفاخر' : 'Emballage RIYANALUXE'}
              className="block h-auto w-full max-h-[360px] max-w-full object-contain object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="max-w-md mx-auto w-full lg:col-span-2 pt-4">
            <OrderNowButton onClick={orderMabkharaNow} />
          </div>
        </div>
      </section>

      {/* ——— Atmosphere ——— */}
      <section className="relative py-28 md:py-36 overflow-hidden min-h-[50vh] flex items-center">
        <img
          src={RIYANALUXE_ASSETS.lifestyle.atmosphere}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-obsidian/70" />
        <motion.div {...reveal} className="container-content relative text-center max-w-2xl mx-auto space-y-8 px-4">
          <Home className="h-10 w-10 text-gold/60 mx-auto" strokeWidth={1.25} />
          <h2 className="text-h1 heading-display text-pearl">{copy.atmosphereTitle}</h2>
          <p className="prose-luxury text-lg">{copy.atmosphereLead}</p>
          <div className="max-w-md mx-auto pt-2">
            <OrderNowButton onClick={orderMabkharaNow} size="lg" />
          </div>
        </motion.div>
      </section>

      {/* ——— Testimonials ——— */}
      <section className="section-y-tight border-y border-gold/[0.08] relative overflow-hidden">
        <img
          src={RIYANALUXE_ASSETS.sections.testimonialBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-obsidian/80" />
        <div className="container-content relative space-y-12">
          <SectionHeader title={copy.testimonialsTitle} align="center" />
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: 'سلمى',
                city: 'الدار البيضاء',
                text:
                  locale === 'ar'
                    ? 'هدية العيد اللي فرحات أمي. التغليف حسّني بوتيك بالمعمورة — والمبخرة أحسن من التصور.'
                    : 'Cadeau de fête qui a ému ma mère. Emballage digne d’une boutique.',
              },
              {
                name: 'Yasmine',
                city: 'Rabat',
                text:
                  locale === 'ar'
                    ? 'أخيراً بخور بلا فحم يحترم صالوني. الريحة كتبدل الجوّ كامل.'
                    : 'Enfin un bakhoor qui respecte mon salon.',
              },
              {
                name: 'نادية',
                city: 'مراكش',
                text:
                  locale === 'ar'
                    ? 'التوصيل كان أنيق، والتأكيد عبر واتساب احترافي بزاف.'
                    : 'Livraison soignée, confirmation WhatsApp professionnelle.',
              },
            ].map((r) => (
              <motion.blockquote key={r.name} {...reveal} className="luxury-card p-8 space-y-4">
                <p className="text-champagne leading-[1.8] text-pretty">&ldquo;{r.text}&rdquo;</p>
                <footer className="text-xs uppercase tracking-[0.2em] text-gold/80">
                  {r.name} · {r.city}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Bundles — direct order ——— */}
      {bundles.length > 0 ? (
        <section
          id="home-bundles"
          className="section-y-tight border-t border-gold/[0.08] bg-charcoal/30"
        >
          <div className="container-content space-y-10 md:space-y-12">
            <SectionHeader
              eyebrow={t('bundles.eyebrow')}
              title={t('nav.bundles')}
              lead={
                locale === 'ar'
                  ? 'تشكيلات جاهزة للطلب — مبخرة وطقوس المنزل في تقديم واحد.'
                  : 'Sélections prêtes à commander — une présentation complète.'
              }
              align="center"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 max-w-5xl mx-auto">
              {bundles.map((b) => (
                <motion.div
                  key={b.id}
                  {...reveal}
                  className="luxury-card flex flex-col gap-4 p-6 md:p-7 text-center"
                >
                  <h3 className="text-lg heading-display text-pearl text-balance min-h-[3rem] flex items-center justify-center">
                    {locale === 'ar' ? b.name_ar : b.name_en}
                  </h3>
                  <p className="text-2xl font-display text-gold tabular">
                    {formatMAD(Number(b.price_sar) || 0, locale)}
                  </p>
                  <OrderNowButton
                    onClick={() => orderBundleNow(b)}
                    size="lg"
                    className="mt-auto"
                  />
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center pt-2">
              <Button to="/bundles" variant="ghost" size="lg">
                {locale === 'ar' ? 'عرض كل التشكيلات' : 'Voir toutes les sélections'}
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {/* ——— Trust — calm, not spammy ——— */}
      <section className="py-20 md:py-24">
        <div className="container-content space-y-12">
          <SectionHeader title={copy.trustTitle} align="center" className="mb-2" />
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Users, label: t('trust.happy_customers') },
              { icon: Truck, label: t('trust.nationwide_delivery') },
              { icon: Banknote, label: t('trust.cod_at_delivery') },
            ].map((item) => (
              <div key={item.label} className="text-center space-y-4">
                <div className="mx-auto h-14 w-14 rounded-full border border-gold/20 flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-gold/80" strokeWidth={1.25} />
                </div>
                <p className="text-sm text-champagne font-medium">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="max-w-md mx-auto px-4">
            <OrderNowButton onClick={orderMabkharaNow} />
          </div>
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section className="section-y-tight border-t border-gold/[0.08]">
        <div className="container-content max-w-xl mx-auto space-y-10">
          <SectionHeader title={copy.faqTitle} align="center" />
          <div className="max-w-md mx-auto px-2 pb-2">
            <OrderNowButton onClick={orderMabkharaNow} size="lg" />
          </div>
          <Accordion
            items={
              locale === 'ar'
                ? [
                    {
                      question: 'كيف يتم تأكيد الطلب؟',
                      answer:
                        'بعد الطلب، نتواصل معكم هاتفياً أو عبر واتساب لتأكيد التفاصيل — ثم نرسل القطعة بتغليفها الفاخر.',
                    },
                    {
                      question: 'هل المبخرة بدون فحم؟',
                      answer:
                        'نعم. تسخين كهربائي نظيف — بخور بلا رماد ولا فوضى في الصالون.',
                    },
                    {
                      question: 'ما هي مدة التوصيل؟',
                      answer:
                        'من 2 إلى 5 أيام حسب المدينة. الدار البيضاء والرباط عادةً أسرع (2-3 أيام).',
                    },
                  ]
                : [
                    {
                      question: 'Comment confirmer la commande ?',
                      answer: 'Nous vous contactons par WhatsApp ou téléphone avant l’envoi.',
                    },
                    {
                      question: 'Sans charbon ?',
                      answer: 'Oui — chauffage électrique, bakhoor propre.',
                    },
                    {
                      question: 'Délais ?',
                      answer: '2 à 5 jours selon la ville.',
                    },
                  ]
            }
          />
        </div>
      </section>

      {/* ——— Closing CTA ——— */}
      <section className="py-24 md:py-32">
        <motion.div
          {...reveal}
          className="container-content text-center max-w-lg mx-auto space-y-8"
        >
          <p className="text-champagne">{copy.closingCta}</p>
          <div className="flex flex-col gap-4 justify-center max-w-md mx-auto w-full px-4">
            <OrderNowButton onClick={orderMabkharaNow} />
            <Button href={waHref} variant="whatsapp" size="lg" target="_blank" fullWidth>
              <MessageCircle className="h-5 w-5" />
              {t('cta.order_via_whatsapp')}
            </Button>
          </div>
        </motion.div>
      </section>

      <StickyMobileCTA
        label={t('bundles.order_now', { defaultValue: 'اطلب الآن' })}
        onClick={orderMabkharaNow}
        price={locale === 'ar' ? '249 درهم' : '249 MAD'}
        showAfter={280}
      />
    </>
  );
}
