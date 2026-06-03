import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useBundles } from '@/hooks/useBundles';
import { useCartStore } from '@/store/cart';
import type { StoreLocale } from '@/i18n';
import { SectionHeader } from '@/components/brand/SectionHeader';
import { BundleCard } from '@/components/brand/BundleCard';
import type { Bundle } from '@hirra/shared';

export default function BundlesPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const navigate = useNavigate();
  const { data: bundles = [] } = useBundles();
  const clear = useCartStore((s) => s.clear);
  const addLine = useCartStore((s) => s.addLine);
  const featuredBundle = bundles.find((b) => b.slug === 'coffret-eid') ?? bundles[0];

  const handleOrderNow = (bundle: Bundle) => {
    clear();
    addLine({
      bundle_id: bundle.id,
      product_variant_id: null,
      slug: bundle.slug,
      name_ar: bundle.name_ar,
      name_en: bundle.name_en,
      variant_name_ar: null,
      variant_name_en: null,
      unit_price_sar: bundle.price_sar,
      quantity: 1,
      image_url: bundle.image_url,
    });
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>
          {t('nav.bundles')} — {t('brand.name')}
        </title>
      </Helmet>
      <div className="section-y cinematic-gradient">
        <div className="container-content space-y-12">
          <SectionHeader
            eyebrow={t('bundles.eyebrow')}
            title={t('nav.bundles')}
            lead={
              locale === 'ar'
                ? 'اختر تشكيلة فاخرة كاملة — مبخرة وطقوس المنزل في تقديم واحد أنيق.'
                : 'Choisissez une sélection prestige — Mabkhara et rituel maison, une seule présentation.'
            }
            align="center"
          />
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {bundles.map((b) => (
              <BundleCard
                key={b.id}
                bundle={b}
                locale={locale}
                featured={b.id === featuredBundle?.id}
                onSelect={() => handleOrderNow(b)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
