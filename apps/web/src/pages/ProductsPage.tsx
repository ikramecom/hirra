import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { ProductCard } from '@/components/product/ProductCard';
import { Eyebrow } from '@/components/common/Eyebrow';
import { GuaranteePromise } from '@/components/common/GuaranteePromise';
import { ProductCardSkeleton } from '@/components/common/Skeleton';
import { useProducts } from '@/hooks/useProducts';

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const { data: products = [], isLoading } = useProducts();

  return (
    <>
      <Helmet>
        <title>
          {locale === 'ar' ? 'المجموعة' : 'The Collection'} — {t('brand.name')}
        </title>
        <meta
          name="description"
          content={
            locale === 'ar'
              ? 'تسوقي مجموعة هِرّة الفاخرة — رولر شعر القطط، حصيرة حبس الرمل، ونافورة الماء.'
              : 'Shop the full Hirra collection — premium cat hair roller, litter trap mat, and water fountain.'
          }
        />
      </Helmet>

      {/* Editorial header — cream surface, centered, eyebrow + serif H1.
          Replaces the old emerald hero band so the page feels like a
          curated boutique rather than a category page. */}
      <section className="bg-cream">
        <div className="container-content pt-12 md:pt-20 pb-10 md:pb-14 text-center space-y-4">
          <Eyebrow as="div" className="justify-center">
            {locale === 'ar' ? 'المجموعة' : 'The Collection'}
          </Eyebrow>
          <h1 className="text-hero heading-display text-walnut text-balance max-w-3xl mx-auto">
            {locale === 'ar'
              ? 'ثلاث قطع. اختيرت بحب. صنعت لتدوم.'
              : 'Three pieces. Chosen with care. Made to last.'}
          </h1>
          <p className="max-w-xl mx-auto text-walnut/70 leading-relaxed text-pretty">
            {locale === 'ar'
              ? 'لا تشكيلة ضخمة، ولا فوضى. فقط الأساسيات اللي يستاهلها بيتك السعودي.'
              : 'No bloated catalogue. Just the essentials your Saudi home deserves.'}
          </p>
        </div>
      </section>

      <section className="container-content pb-16 md:pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[0, 1, 2].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-walnut/70">
            <p>{locale === 'ar' ? 'لا توجد منتجات حالياً.' : 'No products available right now.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-14 md:mt-20">
          <GuaranteePromise />
        </div>
      </section>
    </>
  );
}
