import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatMAD, type ProductWithDetails } from '@hirra/shared';
import { getProductImageFallbackUrl } from '@/lib/product-utils';
import type { StoreLocale } from '@/i18n';
import { PremiumBadge } from './PremiumBadge';
import { cn } from '@/lib/cn';

interface ProductCardLuxuryProps {
  product: ProductWithDetails;
  locale: StoreLocale;
  layout?: 'standard' | 'wide';
  /** Show full product in frame (homepage companion grid) */
  imageFit?: 'cover' | 'contain';
}

export function ProductCardLuxury({
  product,
  locale,
  layout = 'standard',
  imageFit = 'cover',
}: ProductCardLuxuryProps) {
  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const subtitle = locale === 'ar' ? product.subtitle_ar : product.subtitle_en;
  const imageUrl = product.images[0]?.url ?? getProductImageFallbackUrl(product.slug);

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <Link
        to={`/products/${product.slug}`}
        className={cn(
          'luxury-card-hover group block overflow-hidden',
          layout === 'wide' && 'sm:flex sm:gap-0',
        )}
      >
        <div
          className={cn(
            'relative overflow-hidden bg-ink frame-gold flex items-center justify-center',
            layout === 'wide'
              ? 'aspect-[4/5] sm:aspect-auto sm:w-2/5 sm:min-h-[260px]'
              : 'aspect-[4/5] min-h-[280px]',
          )}
        >
          <img
            src={imageUrl}
            alt={name}
            className={cn(
              imageFit === 'contain'
                ? 'h-full w-full max-h-full max-w-full object-contain object-center'
                : 'h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]',
            )}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/50 to-transparent opacity-60" />
          {product.is_hero ? (
            <div className="absolute top-4 start-4">
              <PremiumBadge>{locale === 'ar' ? 'الأيقونة' : 'Iconique'}</PremiumBadge>
            </div>
          ) : null}
        </div>
        <div className={cn('p-6 space-y-3', layout === 'wide' && 'sm:flex-1 sm:flex sm:flex-col sm:justify-center')}>
          <div>
            <h3 className="text-lg heading-display text-pearl group-hover:text-gold transition-colors">
              {name}
            </h3>
            {subtitle ? (
              <p className="text-sm text-smoke mt-1 leading-relaxed line-clamp-2">{subtitle}</p>
            ) : null}
          </div>
          <p className="text-lg text-gold tabular pt-2 border-t border-gold/10">
            {formatMAD(product.price_sar, locale)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
