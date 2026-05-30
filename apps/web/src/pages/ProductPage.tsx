import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Star, ArrowRight, Truck, Users, Banknote, Gift } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { ImageGallery } from '@/components/product/ImageGallery';
import { StickyMobileCTA } from '@/components/common/StickyMobileCTA';
import { GuaranteePromise } from '@/components/common/GuaranteePromise';
import { Eyebrow } from '@/components/common/Eyebrow';
import { PageLoader } from '@/components/common/Skeleton';

import { useReviews } from '@/hooks/useReviews';
import { useResolvedProduct } from '@/hooks/useResolvedCatalog';
import { useCartStore } from '@/store/cart';
import { track } from '@/lib/tracking';
import { formatMAD } from '@hirra/shared';
import {
  getProductImageFallbackUrl,
  HERO_SLUG,
  isBundleSlug,
  resolveCanonicalBundleSlug,
} from '@/lib/product-utils';
import type { StoreLocale } from '@/i18n';
import { productCopy } from '@/lib/brand-copy';
import { RIYANALUXE_ASSETS } from '@/lib/assets';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { PremiumBadge } from '@/components/brand/PremiumBadge';
import { SectionHeader } from '@/components/brand/SectionHeader';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const navigate = useNavigate();

  const { product, canonicalSlug, isKnownSlug, isLoading, isError } = useResolvedProduct(slug);
  const { data: reviews = [] } = useReviews(product?.id);

  const clear = useCartStore((s) => s.clear);
  const addLine = useCartStore((s) => s.addLine);

  useEffect(() => {
    if (slug && isBundleSlug(slug)) {
      const bundleTarget = resolveCanonicalBundleSlug(slug);
      if (bundleTarget) navigate(`/bundles/${bundleTarget}`, { replace: true });
      return;
    }
    if (!slug || !canonicalSlug || slug === canonicalSlug) return;
    navigate(`/products/${canonicalSlug}`, { replace: true });
  }, [slug, canonicalSlug, navigate]);

  useEffect(() => {
    if (product) {
      track.viewContent({
        content_ids: [product.id],
        content_name: product.name_en,
        content_type: 'product',
        value: Number(product.price_sar) || 0,
        currency: 'MAD',
      });
    }
  }, [product]);

  if (slug && isBundleSlug(slug)) {
    return <PageLoader />;
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (!product || !isKnownSlug) {
    return (
      <div className="container-content py-20 text-center text-pearl/70 space-y-6">
        <p className="text-lg font-medium text-pearl">
          {isError ? t('errors.generic') : t('errors.not_found')}
        </p>
        <p className="text-sm text-smoke max-w-md mx-auto">
          {locale === 'ar'
            ? 'لم نعثر على هذه القطعة. جرّب المجموعة أو تواصل معنا على واتساب.'
            : 'Cette pièce est introuvable. Parcourez la collection ou écrivez-nous.'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button to="/products" variant="secondary">
            {locale === 'ar' ? 'تصفح المجموعة' : 'Voir la collection'}
          </Button>
          <Button to={`/products/${HERO_SLUG}`} variant="gold">
            {locale === 'ar' ? 'المبخرة لوكس' : 'Mabkhara Luxe'}
          </Button>
        </div>
      </div>
    );
  }

  const galleryImages = product.images;
  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const subtitle = locale === 'ar' ? product.subtitle_ar : product.subtitle_en;
  const description =
    (locale === 'ar' ? product.description_ar : product.description_en) ||
    (locale === 'ar'
      ? 'قطعة من مجموعة ريانا لوكس — صُممت للدار المغربية بأناقة معاصرة.'
      : 'Une pièce RIYANALUXE — conçue pour la maison marocaine.');
  const primaryImage =
    galleryImages.find((i) => i.is_primary) ?? galleryImages[0];
  const displayImageUrl =
    primaryImage?.url ?? getProductImageFallbackUrl(product.slug);
  const isMabkhara = product.slug === HERO_SLUG || product.is_hero;
  const copy = productCopy(locale, isMabkhara);

  const handleOrderNow = () => {
    clear();
    addLine({
      product_id: product.id,
      product_variant_id: null,
      name_ar: product.name_ar,
      name_en: product.name_en,
      variant_name_ar: null,
      variant_name_en: null,
      image_url: displayImageUrl,
      slug: product.slug,
      unit_price_sar: Number(product.price_sar) || 0,
      quantity: 1,
    });

    track.addToCart({
      content_ids: [product.id],
      content_name: product.name_en,
      content_type: 'product',
      value: Number(product.price_sar) || 0,
      currency: 'MAD',
      num_items: 1,
    });

    navigate('/checkout');
  };

  const sharedFaq = [
    {
      question:
        locale === 'ar' ? 'متى يوصلني الطلب؟' : 'When does my order arrive?',
      answer:
        locale === 'ar'
          ? '2-3 أيام للدار البيضاء والرباط، 3-5 أيام لباقي المدن المغاربية.'
          : '2–3 jours Casa/Rabat, 4–5 jours ailleurs au Maghreb.',
    },
    {
      question: locale === 'ar' ? 'ضمان الإرجاع؟' : 'Return guarantee?',
      answer:
        locale === 'ar'
          ? 'ضمان رضا 14 يوم — استبدال أو استرجاع بعد التواصل معنا.'
          : 'Satisfait 14 jours — échange ou remboursement après contact.',
    },
    {
      question: locale === 'ar' ? 'كيف أتواصل معكم؟' : 'How do I reach you?',
      answer:
        locale === 'ar'
          ? 'عبر واتساب — نرد بالعربي بسرعة، طوال أيام الأسبوع.'
          : 'On WhatsApp — we reply in Arabic fast, every day of the week.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{name} — {t('brand.name')}</title>
        <meta name="description" content={subtitle ?? name} />
      </Helmet>

      <section className="container-content pt-6 md:pt-10 pb-10 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14">
          <div>
            <ImageGallery src={displayImageUrl} alt={name} />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Eyebrow>
                {product.is_hero
                  ? locale === 'ar' ? 'البطلة' : 'The hero'
                  : locale === 'ar' ? 'ريانا لوكس' : 'RIYANALUXE'}
              </Eyebrow>

              <h1 className="text-h1 heading-display text-pearl text-balance">
                {name}
              </h1>

              {subtitle ? (
                <p className="text-lg text-champagne/90 leading-relaxed text-pretty">
                  {subtitle}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <div className="flex items-baseline gap-3 tabular">
                <span className="text-3xl font-display text-gold tracking-wide">
                  {formatMAD(Number(product.price_sar) || 0, locale)}
                </span>
                {isMabkhara ? (
                  <PremiumBadge tone="pearl">
                    {locale === 'ar' ? 'تغليف هدية' : 'Cadeau'}
                  </PremiumBadge>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 text-sm">
                <div className="flex items-center gap-0.5 text-gold">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-pearl">4.8</span>
                <span className="text-pearl/55">
                  ({reviews.length}+ {locale === 'ar' ? 'تقييم' : 'reviews'})
                </span>
              </div>
            </div>

            {copy.giftNote ? (
              <p className="flex items-center gap-2 text-sm text-champagne/90">
                <Gift className="h-4 w-4 text-gold/80" strokeWidth={1.25} />
                {copy.giftNote}
              </p>
            ) : null}

            <div className="pt-1">
              <Button
                onClick={handleOrderNow}
                variant="gold"
                size="xl"
                fullWidth
                rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
              >
                {copy.buyLabel}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gold/10 text-center text-xs">
              <div className="space-y-1.5">
                <Users className="h-5 w-5 mx-auto text-gold" strokeWidth={1.25} />
                <p className="font-semibold text-pearl leading-tight">
                  {t('trust.happy_customers')}
                </p>
              </div>
              <div className="space-y-1.5">
                <Truck className="h-5 w-5 mx-auto text-gold" strokeWidth={1.25} />
                <p className="font-semibold text-pearl leading-tight">
                  {t('trust.nationwide_delivery')}
                </p>
              </div>
              <div className="space-y-1.5">
                <Banknote className="h-5 w-5 mx-auto text-gold" strokeWidth={1.25} />
                <p className="font-semibold text-pearl leading-tight">
                  {t('trust.cod_at_delivery')}
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-gold/10">
              <p className="text-champagne/90 leading-relaxed whitespace-pre-line text-pretty">
                {description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {isMabkhara ? (
        <section className="border-t border-gold/10 bg-ink/30">
          <div className="container-content section-y-tight grid md:grid-cols-2 gap-10 items-center">
            <div className="frame-gold rounded-hero overflow-hidden aspect-[4/3]">
              <ResponsiveImage
                src={RIYANALUXE_ASSETS.packaging}
                alt={locale === 'ar' ? 'تغليف ريانا لوكس' : 'Emballage RIYANALUXE'}
                aspectClassName="h-full w-full"
              />
            </div>
            <SectionHeader
              eyebrow={locale === 'ar' ? 'التقديم' : 'Présentation'}
              title={
                locale === 'ar' ? 'علبة تُقدَّم كهدية' : 'Un emballage offert'
              }
              lead={
                locale === 'ar'
                  ? 'صندوق أسود مطفي، شريط ذهبي، وبطاقة ترحيب — مثالي للعيد والزيارات والمناسبات.'
                  : 'Boîte noire mate, ruban doré, carte de bienvenue — idéal pour l’Aïd et les réceptions.'
              }
            />
          </div>
        </section>
      ) : null}

      <section className="bg-charcoal/40 border-t border-gold/10">
        <div className="container-content section-y-tight">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Eyebrow as="div" className="justify-center">
                {locale === 'ar' ? 'تفاصيل' : 'Details'}
              </Eyebrow>
              <h2 className="text-h2 heading-display text-pearl">
                {locale === 'ar' ? 'أسئلة مهمة قبل الطلب' : 'Questions avant de commander'}
              </h2>
            </div>
            <Accordion items={sharedFaq} />
          </div>
        </div>
      </section>

      {reviews.length > 0 ? (
        <section className="container-content section-y-tight">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <Eyebrow as="div" className="justify-center">
                {locale === 'ar' ? 'الآراء' : 'Real reviews'}
              </Eyebrow>
              <h2 className="text-h2 heading-display text-pearl">{copy.reviewsTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="luxury-card p-6 space-y-3"
                >
                  <div className="flex items-center gap-0.5 text-gold">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  {r.title_ar ? (
                    <h4 className="font-semibold text-pearl heading-display">
                      {r.title_ar}
                    </h4>
                  ) : null}
                  <p className="text-champagne/90 leading-relaxed text-pretty">
                    {r.body_ar}
                  </p>
                  <p className="text-sm text-smoke font-medium pt-1 border-t border-gold/10">
                    — {r.customer_name}
                    {r.customer_city ? `, ${r.customer_city}` : ''}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-content pb-20 md:pb-24">
        <GuaranteePromise />
      </section>

      <StickyMobileCTA
        label={copy.buyLabel}
        onClick={handleOrderNow}
        price={formatMAD(Number(product.price_sar) || 0, locale)}
      />
    </>
  );
}
