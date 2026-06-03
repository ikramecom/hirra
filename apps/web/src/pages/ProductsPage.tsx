import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatMAD } from '@hirra/shared';
import { useProducts } from '@/hooks/useProducts';
import type { StoreLocale } from '@/i18n';
import { SectionHeader } from '@/components/brand/SectionHeader';
import { ProductCardLuxury } from '@/components/brand/ProductCardLuxury';
import { PremiumBadge } from '@/components/brand/PremiumBadge';
import { Button } from '@/components/ui/Button';
import { RIYANALUXE_ASSETS } from '@/lib/assets';

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const { data: products = [] } = useProducts();
  const hero = products.find((p) => p.is_hero);
  const others = products.filter((p) => !p.is_hero);

  return (
    <>
      <Helmet>
        <title>
          {t('nav.shop')} — {t('brand.name')}
        </title>
      </Helmet>
      <div className="section-y cinematic-gradient">
        <div className="container-content space-y-20">
          <SectionHeader
            eyebrow={locale === 'ar' ? 'المجموعة' : 'Collection'}
            title={t('nav.shop')}
            lead={
              locale === 'ar'
                ? 'ثلاث قطع — طقوس واحدة. المبخرة في القلب، والباقي يكمل أناقة المنزل.'
                : 'Trois pièces — un seul rituel. La Mabkhara au centre.'
            }
            align="center"
          />

          {hero ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={`/products/${hero.slug}`}
                className="luxury-card-hover grid lg:grid-cols-2 gap-0 overflow-hidden group"
              >
                <div className="relative frame-gold aspect-[4/5] lg:aspect-auto lg:min-h-[420px] overflow-hidden">
                  <img
                    src={hero.images[0]?.url ?? RIYANALUXE_ASSETS.products.mabkhara.main}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-gold/[0.05]" />
                  <div className="absolute top-6 start-6">
                    <PremiumBadge tone="gold">
                      {locale === 'ar' ? 'الأيقونة' : 'Iconique'}
                    </PremiumBadge>
                  </div>
                </div>
                <div className="p-10 lg:p-14 flex flex-col justify-center space-y-6">
                  <p className="text-eyebrow text-gold tracking-[0.3em]">
                    {locale === 'ar' ? 'مبخرة لوكس' : 'MABKHARA LUXE'}
                  </p>
                  <h2 className="text-h1 heading-display text-pearl text-balance">
                    {locale === 'ar' ? hero.name_ar : hero.name_en}
                  </h2>
                  {hero.subtitle_ar || hero.subtitle_en ? (
                    <p className="prose-luxury text-lg max-w-md">
                      {locale === 'ar' ? hero.subtitle_ar : hero.subtitle_en}
                    </p>
                  ) : null}
                  <p className="text-2xl font-display text-gold tabular">
                    {formatMAD(hero.price_sar, locale)}
                  </p>
                  <Button to={`/products/${hero.slug}`} variant="gold" size="lg" className="w-fit">
                    {locale === 'ar' ? 'اكتشف المبخرة' : 'Découvrir'}
                  </Button>
                </div>
              </Link>
            </motion.div>
          ) : null}

          {others.length > 0 ? (
            <div className="space-y-10">
              <SectionHeader
                eyebrow={locale === 'ar' ? 'مكملات' : 'Compléments'}
                title={
                  locale === 'ar' ? 'لإكمال طقوس المنزل' : 'Pour compléter le rituel'
                }
              />
              <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                {others.map((p) => (
                  <ProductCardLuxury key={p.id} product={p} locale={locale} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
