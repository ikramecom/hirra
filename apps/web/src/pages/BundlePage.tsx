import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Gift, Truck, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/common/Skeleton';
import { Eyebrow } from '@/components/common/Eyebrow';
import { GuaranteePromise } from '@/components/common/GuaranteePromise';
import { useResolvedBundle } from '@/hooks/useResolvedCatalog';
import { useCartStore } from '@/store/cart';
import { formatMAD } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';
import {
  getProductImageFallbackUrl,
  resolveCanonicalBundleSlug,
} from '@/lib/product-utils';
import { RIYANALUXE_ASSETS } from '@/lib/assets';

const BUNDLE_IMAGE_FALLBACK: Record<string, string> = {
  'rituel-du-foyer': RIYANALUXE_ASSETS.bundles.rituelFoyer,
  'coffret-eid': RIYANALUXE_ASSETS.bundles.coffretEid,
  'maison-seche': RIYANALUXE_ASSETS.bundles.maisonSeche,
};

export default function BundlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const navigate = useNavigate();

  const { bundle, canonicalSlug, isKnownSlug, isLoading, isError } = useResolvedBundle(slug);
  const clear = useCartStore((s) => s.clear);
  const addLine = useCartStore((s) => s.addLine);

  useEffect(() => {
    if (!slug || !canonicalSlug || slug === canonicalSlug) return;
    navigate(`/bundles/${canonicalSlug}`, { replace: true });
  }, [slug, canonicalSlug, navigate]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!bundle || !isKnownSlug) {
    return (
      <div className="container-content py-20 text-center text-pearl/70 space-y-6">
        <p className="text-lg font-medium text-pearl">
          {isError ? t('errors.generic') : t('errors.not_found')}
        </p>
        <p className="text-sm text-smoke max-w-md mx-auto">
          {t('bundles.not_found')} {t('bundles.not_found_hint')}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button to="/bundles" variant="gold">
            {t('nav.bundles')}
          </Button>
          <Button to="/products/riyanaluxe-mabkhara-luxe" variant="secondary">
            {locale === 'ar' ? 'المبخرة' : 'Mabkhara'}
          </Button>
        </div>
      </div>
    );
  }

  const name = locale === 'ar' ? bundle.name_ar : bundle.name_en;
  const desc = locale === 'ar' ? bundle.description_ar : bundle.description_en;
  const imageUrl =
    bundle.image_url ?? BUNDLE_IMAGE_FALLBACK[bundle.slug] ?? RIYANALUXE_ASSETS.bundles.coffretEid;

  const handleOrderNow = () => {
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
      image_url: imageUrl,
    });
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>{name} — {t('brand.name')}</title>
        <meta name="description" content={desc ?? name} />
      </Helmet>

      <section className="container-content pt-6 md:pt-10 pb-10 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div className="frame-gold rounded-hero overflow-hidden aspect-[4/3] bg-ink">
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-6">
            <Eyebrow>{t('bundles.detail_eyebrow')}</Eyebrow>
            <h1 className="text-h1 heading-display text-pearl text-balance">{name}</h1>
            {desc ? <p className="prose-luxury text-lg text-champagne/90">{desc}</p> : null}

            <p className="text-3xl font-display text-gold tabular">
              {formatMAD(Number(bundle.price_sar) || 0, locale)}
            </p>
            {bundle.savings_sar ? (
              <p className="text-sm text-smoke">
                {locale === 'ar'
                  ? `توفير ${formatMAD(Number(bundle.savings_sar), locale)}`
                  : `Économie ${formatMAD(Number(bundle.savings_sar), locale)}`}
              </p>
            ) : null}

            <div className="pt-1">
              <Button
                variant="gold"
                size="xl"
                fullWidth
                onClick={handleOrderNow}
                rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
              >
                {t('bundles.order_now')}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gold/10 text-center text-xs">
              <div className="space-y-1.5">
                <Truck className="h-5 w-5 mx-auto text-gold" />
                <p className="font-semibold text-pearl">{t('trust.fast_shipping')}</p>
              </div>
              <div className="space-y-1.5">
                <ShieldCheck className="h-5 w-5 mx-auto text-gold" />
                <p className="font-semibold text-pearl">{t('trust.guarantee')}</p>
              </div>
              <div className="space-y-1.5">
                <Gift className="h-5 w-5 mx-auto text-gold" />
                <p className="font-semibold text-pearl">
                  {locale === 'ar' ? 'تغليف هدية' : 'Cadeau'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y-tight border-t border-gold/10 bg-charcoal/30">
        <div className="container-content max-w-3xl space-y-8">
          <h2 className="text-h2 heading-display text-pearl text-center">
            {t('bundles.includes')}
          </h2>
          <ul className="space-y-4">
            {bundle.products.map((p) => {
              const pName = locale === 'ar' ? p.name_ar : p.name_en;
              return (
                <li key={p.id} className="luxury-card p-4 flex gap-4 items-center">
                  <Link
                    to={`/products/${p.slug}`}
                    className="h-20 w-20 rounded-xl overflow-hidden border border-gold/15 shrink-0 bg-ink"
                  >
                    <img
                      src={getProductImageFallbackUrl(p.slug)}
                      alt={pName}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${p.slug}`}
                      className="font-semibold text-pearl hover:text-gold transition"
                    >
                      {pName}
                    </Link>
                    <p className="text-sm text-gold tabular mt-1">
                      {formatMAD(Number(p.price_sar) || 0, locale)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="container-content pb-20">
        <GuaranteePromise />
      </section>
    </>
  );
}
