import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';

import { formatSAR, type Product, type ProductImage } from '@hirra/shared';
import { cn } from '@/lib/cn';

interface ProductCardProps {
  product: Product & { product_images?: ProductImage[] };
  /** Visual emphasis used on featured rows. Defaults to 'standard'. */
  variant?: 'standard' | 'feature';
}

/**
 * Editorial product card.
 *
 * - Square photo well with soft sand backdrop (so even placeholders feel
 *   composed before Phase-2 photography lands).
 * - Hover: subtle 1.02 zoom on the image, brass eyebrow lifts in, secondary
 *   image fades over (when present), and a top-right "open" arrow appears.
 * - Bestseller badge in the top-start corner uses a brass-on-cream chip
 *   (no neon dropshipping pill).
 * - Price typography uses tabular numerals for crisp alignment.
 */
export function ProductCard({ product, variant = 'standard' }: ProductCardProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';

  const images = product.product_images ?? [];
  const primary = images.find((i) => i.is_primary) ?? images[0];
  const secondary = images.find((i) => i.id !== primary?.id);

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const subtitle = locale === 'ar' ? product.subtitle_ar : product.subtitle_en;

  const hasDiscount =
    product.compare_at_price_sar && product.compare_at_price_sar > product.price_sar;
  const savings = hasDiscount ? product.compare_at_price_sar! - product.price_sar : 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn(
        'group relative block overflow-hidden rounded-card bg-whisper transition-all duration-500 ease-out',
        'shadow-card hover:shadow-card-hover focus-visible:shadow-card-hover',
        variant === 'feature' && 'md:col-span-2',
      )}
    >
      {/* Image well — no hover scale; images stay stable on tap & hover.
          Zoom is reserved for the intentional PDP gallery. */}
      <div className="relative aspect-square overflow-hidden bg-sand-soft">
        {primary ? (
          <img
            src={primary.url}
            alt={(locale === 'ar' ? primary.alt_ar : primary.alt_en) ?? name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-walnut/25 text-5xl">
            ◇
          </div>
        )}

        {secondary ? (
          <img
            src={secondary.url}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        ) : null}

        {/* Top badges */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2">
          {product.is_hero ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-cream/95 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] font-bold text-walnut">
              <span className="h-1 w-1 rounded-full bg-brass" />
              {locale === 'ar' ? 'الأكثر مبيعاً' : 'Bestseller'}
            </span>
          ) : (
            <span aria-hidden />
          )}

          {hasDiscount ? (
            <span className="inline-flex items-center rounded-full bg-emerald text-cream px-2.5 py-1 text-[10px] font-bold tabular">
              −{formatSAR(savings, locale)}
            </span>
          ) : null}
        </div>

        {/* Hover affordance — corner arrow */}
        <div className="absolute bottom-3 end-3 h-10 w-10 rounded-full bg-cream text-walnut grid place-items-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-card">
          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-2.5">
        <div className="space-y-1">
          <h3 className="font-semibold text-walnut leading-tight clamp-1 group-hover:text-emerald transition-colors">
            {name}
          </h3>
          {subtitle ? (
            <p className="text-sm text-walnut/65 clamp-1 leading-snug">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-baseline justify-between gap-2 pt-1.5 border-t border-walnut/10">
          <div className="flex items-baseline gap-2 tabular">
            <span className="text-lg font-bold text-emerald">
              {formatSAR(product.price_sar, locale)}
            </span>
            {hasDiscount ? (
              <span className="text-xs text-walnut/40 line-through">
                {formatSAR(product.compare_at_price_sar!, locale)}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] uppercase tracking-[0.16em] text-brass font-semibold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {locale === 'ar' ? 'تفاصيل ←' : 'View →'}
          </span>
        </div>
      </div>
    </Link>
  );
}
