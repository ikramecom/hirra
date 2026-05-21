import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Star, ArrowRight, Truck, ShieldCheck, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { ImageGallery } from '@/components/product/ImageGallery';
import { StickyMobileCTA } from '@/components/common/StickyMobileCTA';
import { GuaranteePromise } from '@/components/common/GuaranteePromise';
import { Eyebrow } from '@/components/common/Eyebrow';
import { PageLoader } from '@/components/common/Skeleton';

import { useProduct } from '@/hooks/useProducts';
import { useReviews } from '@/hooks/useReviews';
import { useCartStore } from '@/store/cart';
import { track } from '@/lib/tracking';
import { formatSAR } from '@hirra/shared';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const navigate = useNavigate();

  const { data: product, isLoading } = useProduct(slug);
  const { data: reviews = [] } = useReviews(product?.id);

  const addLine = useCartStore((s) => s.addLine);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const [variantId, setVariantId] = useState<string | null>(null);

  useEffect(() => {
    if (product?.variants?.length && !variantId) {
      setVariantId(product.variants[0].id);
    }
  }, [product, variantId]);

  useEffect(() => {
    if (product) {
      track.viewContent({
        content_ids: [product.id],
        content_name: product.name_en,
        content_type: 'product',
        value: product.price_sar,
        currency: 'SAR',
      });
    }
  }, [product]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!product) {
    return (
      <div className="container-content py-20 text-center text-walnut/70 space-y-4">
        <p className="text-lg">{t('errors.not_found')}</p>
        <Button to="/products" variant="secondary">
          {locale === 'ar' ? 'تصفّحي المجموعة' : 'Browse the collection'}
        </Button>
      </div>
    );
  }

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const subtitle = locale === 'ar' ? product.subtitle_ar : product.subtitle_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const primaryImage = product.images.find((i) => i.is_primary) ?? product.images[0];
  const selectedVariant = product.variants.find((v) => v.id === variantId);
  const hasDiscount =
    product.compare_at_price_sar && product.compare_at_price_sar > product.price_sar;

  const handleAdd = (buyNow: boolean) => {
    addLine({
      product_id: product.id,
      product_variant_id: variantId,
      name_ar: product.name_ar,
      name_en: product.name_en,
      variant_name_ar: selectedVariant?.name_ar ?? null,
      variant_name_en: selectedVariant?.name_en ?? null,
      image_url: primaryImage?.url ?? null,
      slug: product.slug,
      unit_price_sar: product.price_sar,
      quantity: 1,
    });

    track.addToCart({
      content_ids: [product.id],
      content_name: product.name_en,
      content_type: 'product',
      value: product.price_sar,
      currency: 'SAR',
      num_items: 1,
    });

    if (buyNow) navigate('/checkout');
    else openDrawer();
  };

  const sharedFaq = [
    {
      question:
        locale === 'ar' ? 'متى يوصلني الطلب؟' : 'When does my order arrive?',
      answer:
        locale === 'ar'
          ? '١-٢ يوم في الرياض، ٢-٣ أيام في جدة والدمام، ٣-٥ أيام في باقي المدن.'
          : '1–2 days in Riyadh, 2–3 days in Jeddah/Dammam, 3–5 days for other cities.',
    },
    {
      question: locale === 'ar' ? 'ضمان الإرجاع؟' : 'Return guarantee?',
      answer:
        locale === 'ar'
          ? 'ضمان رضا ٣٠ يوم — لو ما عجبكِ، نستلم المنتج ونرجع لكِ فلوسكِ كاملة.'
          : '30-day satisfaction guarantee — if it’s not right we collect it and refund you in full.',
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

      {/* HERO ============================================================ */}
      <section className="container-content pt-6 md:pt-10 pb-10 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14">
          <div>
            <ImageGallery images={product.images} altFallback={name} locale={locale} />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Eyebrow>
                {product.is_hero
                  ? locale === 'ar' ? 'البطلة' : 'The hero'
                  : locale === 'ar' ? 'هِرّة' : 'Hirra'}
              </Eyebrow>

              <h1 className="text-h1 heading-display text-walnut text-balance">
                {name}
              </h1>

              {subtitle ? (
                <p className="text-lg text-walnut/70 leading-relaxed text-pretty">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {/* Price + reviews grouped — anchored under the title for one
                clear glance answering "how much, how loved". */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <div className="flex items-baseline gap-2 tabular">
                <span className="text-3xl font-bold text-emerald">
                  {formatSAR(product.price_sar, locale)}
                </span>
                {hasDiscount ? (
                  <span className="text-base text-walnut/40 line-through">
                    {formatSAR(product.compare_at_price_sar!, locale)}
                  </span>
                ) : null}
                {hasDiscount ? (
                  <span className="text-xs font-bold text-signal bg-signal/10 px-2 py-0.5 rounded-full">
                    −
                    {formatSAR(
                      product.compare_at_price_sar! - product.price_sar,
                      locale,
                    )}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 text-sm">
                <div className="flex items-center gap-0.5 text-gold">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-walnut">4.8</span>
                <span className="text-walnut/55">
                  ({reviews.length}+ {locale === 'ar' ? 'تقييم' : 'reviews'})
                </span>
              </div>
            </div>

            {/* Variants */}
            {product.variants.length > 0 ? (
              <div className="space-y-2.5">
                <p className="text-sm font-semibold text-walnut">
                  {locale === 'ar' ? 'الخيار' : 'Choose option'}
                  {selectedVariant
                    ? ` · ${
                        locale === 'ar'
                          ? selectedVariant.name_ar
                          : selectedVariant.name_en
                      }`
                    : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariantId(v.id)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition ${
                        variantId === v.id
                          ? 'border-emerald bg-emerald text-cream'
                          : 'border-sand bg-whisper text-walnut hover:border-emerald'
                      }`}
                    >
                      {locale === 'ar' ? v.name_ar : v.name_en}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button
                onClick={() => handleAdd(true)}
                size="xl"
                fullWidth
                rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
              >
                {t('cta.buy_now')}
              </Button>
              <Button
                onClick={() => handleAdd(false)}
                variant="secondary"
                size="xl"
                fullWidth
              >
                {t('cta.add_to_cart')}
              </Button>
            </div>

            {/* Quick trust strip */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-walnut/10 text-center text-xs">
              <div className="space-y-1.5">
                <Truck className="h-5 w-5 mx-auto text-emerald" />
                <p className="font-semibold text-walnut leading-tight">
                  {t('trust.fast_shipping')}
                </p>
              </div>
              <div className="space-y-1.5">
                <ShieldCheck className="h-5 w-5 mx-auto text-emerald" />
                <p className="font-semibold text-walnut leading-tight">
                  {t('trust.guarantee')}
                </p>
              </div>
              <div className="space-y-1.5">
                <MessageSquare className="h-5 w-5 mx-auto text-emerald" />
                <p className="font-semibold text-walnut leading-tight">
                  {t('trust.arabic_support')}
                </p>
              </div>
            </div>

            {/* Description (collapsible feel via prose styling) */}
            {description ? (
              <div className="pt-5 border-t border-walnut/10">
                <p className="text-walnut/80 leading-relaxed whitespace-pre-line text-pretty">
                  {description}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* DETAILS / FAQ ACCORDION ========================================== */}
      <section className="bg-whisper">
        <div className="container-content section-y-tight">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Eyebrow as="div" className="justify-center">
                {locale === 'ar' ? 'تفاصيل' : 'Details'}
              </Eyebrow>
              <h2 className="text-h2 heading-display text-walnut">
                {locale === 'ar' ? 'كل اللي تبغين تعرفينه' : 'Everything you’d want to know'}
              </h2>
            </div>
            <Accordion items={sharedFaq} />
          </div>
        </div>
      </section>

      {/* REVIEWS ========================================================= */}
      {reviews.length > 0 ? (
        <section className="container-content section-y-tight">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <Eyebrow as="div" className="justify-center">
                {locale === 'ar' ? 'الآراء' : 'Real reviews'}
              </Eyebrow>
              <h2 className="text-h2 heading-display text-walnut">
                {locale === 'ar' ? 'كلام صادق من بيوت سعودية' : 'Honest words from Saudi homes'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="bg-whisper rounded-card border border-walnut/10 p-6 space-y-3 shadow-card"
                >
                  <div className="flex items-center gap-0.5 text-gold">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  {r.title_ar ? (
                    <h4 className="font-semibold text-walnut heading-display">
                      {r.title_ar}
                    </h4>
                  ) : null}
                  <p className="text-walnut/80 leading-relaxed text-pretty">
                    {r.body_ar}
                  </p>
                  <p className="text-sm text-walnut/55 font-semibold pt-1 border-t border-walnut/10">
                    — {r.customer_name}
                    {r.customer_city ? `, ${r.customer_city}` : ''}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* PROMISE STRIP =================================================== */}
      <section className="container-content pb-20 md:pb-24">
        <GuaranteePromise />
      </section>

      <StickyMobileCTA
        label={t('cta.buy_now')}
        onClick={() => handleAdd(true)}
        price={formatSAR(product.price_sar, locale)}
      />
    </>
  );
}
