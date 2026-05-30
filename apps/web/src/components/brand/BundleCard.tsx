import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatMAD } from '@hirra/shared';
import type { Bundle } from '@hirra/shared';
import type { StoreLocale } from '@/i18n';
import { PremiumBadge } from './PremiumBadge';
import { Button } from '@/components/ui/Button';
import { RIYANALUXE_ASSETS } from '@/lib/assets';

const BUNDLE_IMAGE_FALLBACK: Record<string, string> = {
  'rituel-du-foyer': RIYANALUXE_ASSETS.bundles.rituelFoyer,
  'coffret-eid': RIYANALUXE_ASSETS.bundles.coffretEid,
  'maison-seche': RIYANALUXE_ASSETS.bundles.maisonSeche,
};

/** Fixed media + body heights so every coffret card is identical on the grid. */
const IMAGE_BOX_CLASS = 'relative h-52 w-full shrink-0 bg-ink md:h-56';
const TITLE_MIN_H = 'min-h-[3.25rem]';
const DESC_MIN_H = 'min-h-[4.125rem]';

interface BundleCardProps {
  bundle: Bundle;
  locale: StoreLocale;
  /** Badge only — does not change card size or layout */
  featured?: boolean;
  onSelect: () => void;
}

export function BundleCard({ bundle, locale, featured, onSelect }: BundleCardProps) {
  const { t } = useTranslation();
  const name = locale === 'ar' ? bundle.name_ar : bundle.name_en;
  const desc = locale === 'ar' ? bundle.description_ar : bundle.description_en;
  const imageUrl =
    bundle.image_url ?? BUNDLE_IMAGE_FALLBACK[bundle.slug] ?? RIYANALUXE_ASSETS.bundles.coffretEid;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="luxury-card-hover group relative flex h-full min-h-[28rem] flex-col overflow-hidden md:min-h-[30rem]"
    >
      <Link
        to={`/bundles/${bundle.slug}`}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className={IMAGE_BOX_CLASS}>
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain p-5 opacity-90 transition duration-700 group-hover:scale-[1.02] group-hover:opacity-100"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
          {featured ? (
            <div className="absolute top-4 start-4 z-10">
              <PremiumBadge tone="gold">
                {locale === 'ar' ? 'الأكثر اختياراً' : 'Le plus choisi'}
              </PremiumBadge>
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
          <h3
            className={`text-xl heading-display text-pearl line-clamp-2 transition-colors duration-300 group-hover:text-gold ${TITLE_MIN_H}`}
          >
            {name}
          </h3>
          <p
            className={`text-sm text-smoke leading-relaxed line-clamp-3 ${DESC_MIN_H}`}
          >
            {desc || '\u00a0'}
          </p>
          <p className="mt-auto shrink-0 text-2xl font-display text-gold tabular tracking-wide">
            {formatMAD(bundle.price_sar, locale)}
          </p>
        </div>
      </Link>

      <div className="shrink-0 border-t border-gold/10 px-6 pb-6 pt-4 md:px-7 md:pb-7">
        <Button
          variant="gold"
          size="md"
          fullWidth
          onClick={(e) => {
            e.preventDefault();
            onSelect();
          }}
        >
          {t('bundles.order_now')}
        </Button>
      </div>
    </motion.article>
  );
}
