import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Banknote,
  ShieldCheck,
  Truck,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { PremiumBadge } from '@/components/brand/PremiumBadge';
import { useCartStore } from '@/store/cart';
import { formatMAD } from '@hirra/shared';
import { track } from '@/lib/tracking';
import type { StoreLocale } from '@/i18n';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const navigate = useNavigate();

  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());

  const total = subtotal;

  const handleCheckout = () => {
    track.initiateCheckout({
      value: subtotal,
      currency: 'MAD',
      num_items: itemCount,
    });
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>
          {t('cta.checkout')} — {t('brand.name')}
        </title>
      </Helmet>

      <section className="container-content pt-10 md:pt-14 pb-4">
        <div className="space-y-3">
          <PremiumBadge tone="pearl">{locale === 'ar' ? 'سلتك' : 'Votre sélection'}</PremiumBadge>
          <h1 className="text-h1 heading-display text-pearl">
            {itemCount > 0
              ? t('cart.items_count', { count: itemCount })
              : t('cart.empty')}
          </h1>
        </div>
      </section>

      <div className="container-content pb-16 md:pb-24">
        {lines.length === 0 ? (
          <div className="luxury-card p-12 text-center space-y-5 max-w-xl mx-auto">
            <div className="h-16 w-16 mx-auto rounded-full border border-gold/20 grid place-items-center">
              <ShoppingBag className="h-7 w-7 text-gold/50" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <p className="text-xl heading-display text-pearl">{t('cart.empty')}</p>
              <p className="text-smoke leading-relaxed">{t('cart.empty_subtitle')}</p>
            </div>
            <Button
              to="/products"
              variant="gold"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
            >
              {t('cart.browse')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
            <div className="space-y-4">
              {lines.map((line) => {
                const name = locale === 'ar' ? line.name_ar : line.name_en;
                const variantName =
                  locale === 'ar' ? line.variant_name_ar : line.variant_name_en;
                const itemHref = line.bundle_id
                  ? `/bundles/${line.slug}`
                  : `/products/${line.slug}`;
                return (
                  <article
                    key={line.key}
                    className="luxury-card p-4 md:p-5 flex gap-4"
                  >
                    <Link
                      to={itemHref}
                      className="h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden bg-ink border border-gold/15 shrink-0"
                    >
                      {line.image_url ? (
                        <img
                          src={line.image_url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-gold/30 font-display">
                          R
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={itemHref} className="min-w-0">
                          <h3 className="font-semibold text-pearl leading-tight hover:text-gold transition line-clamp-2">
                            {name}
                          </h3>
                          {variantName ? (
                            <p className="text-sm text-smoke mt-0.5">{variantName}</p>
                          ) : null}
                        </Link>
                        <button
                          onClick={() => removeLine(line.key)}
                          className="text-smoke hover:text-champagne transition p-1.5 -m-1.5"
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="inline-flex items-center bg-ink rounded-lg border border-gold/20">
                          <button
                            onClick={() => updateQuantity(line.key, line.quantity - 1)}
                            className="p-2 text-champagne hover:text-gold transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-8 text-center tabular text-pearl">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.key, line.quantity + 1)}
                            className="p-2 text-champagne hover:text-gold transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-display text-gold text-lg tabular">
                          {formatMAD(line.unit_price_sar * line.quantity, locale)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}

              <Link
                to="/products"
                className="inline-flex items-center gap-1 text-gold hover:text-champagne text-sm font-medium pt-2 transition"
              >
                <ArrowRight className="h-4 w-4 rtl:rotate-180 -scale-x-100 rtl:scale-x-100" />
                {locale === 'ar' ? 'إكمال التسوق' : 'Continuer'}
              </Link>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <div className="luxury-card p-6 space-y-5">
                <PremiumBadge tone="pearl">
                  {locale === 'ar' ? 'الملخص' : 'Récapitulatif'}
                </PremiumBadge>

                <p className="text-xs text-gold font-semibold">{t('cart.free_shipping_unlocked')}</p>

                <div className="border-t border-gold/10 pt-4 flex justify-between items-baseline">
                  <span className="text-base font-medium text-pearl">{t('cart.total')}</span>
                  <span className="text-2xl font-display text-gold tabular">
                    {formatMAD(total, locale)}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  variant="gold"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
                >
                  {t('cta.checkout')}
                </Button>

                <div className="grid grid-cols-1 gap-2 text-xs text-smoke pt-1">
                  <span className="inline-flex items-center gap-2">
                    <Banknote className="h-3.5 w-3.5 text-gold/70" />
                    {t('checkout.cod_reassurance')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-gold/70" />
                    {t('trust.fast_shipping')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold/70" />
                    {t('trust.guarantee')}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
