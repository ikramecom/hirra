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
import { Eyebrow } from '@/components/common/Eyebrow';
import { useCartStore } from '@/store/cart';
import { formatSAR, FREE_SHIPPING_THRESHOLD_SAR } from '@hirra/shared';
import { track } from '@/lib/tracking';

/**
 * Full-page cart.
 *
 * Two-column on desktop (lines | summary). Summary is sticky on desktop and
 * carries the persistent COD reassurance. Free-shipping bar uses the same
 * brass→emerald gradient as the drawer for visual consistency.
 */
export default function CartPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const navigate = useNavigate();

  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_SAR - subtotal);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD_SAR ? 0 : 18;
  const total = subtotal + shipping;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_SAR) * 100);

  const handleCheckout = () => {
    track.initiateCheckout({
      value: subtotal,
      currency: 'SAR',
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
        <div className="space-y-2">
          <Eyebrow>{locale === 'ar' ? 'سلتك' : 'Your bag'}</Eyebrow>
          <h1 className="text-h1 heading-display text-walnut">
            {itemCount > 0
              ? t('cart.items_count', { count: itemCount })
              : t('cart.empty')}
          </h1>
        </div>
      </section>

      <div className="container-content pb-16 md:pb-24">
        {lines.length === 0 ? (
          <div className="bg-whisper rounded-card p-12 text-center space-y-5 max-w-xl mx-auto border border-walnut/10">
            <div className="h-16 w-16 mx-auto rounded-full bg-cream grid place-items-center">
              <ShoppingBag className="h-7 w-7 text-walnut/40" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <p className="text-xl font-semibold heading-display text-walnut">
                {t('cart.empty')}
              </p>
              <p className="text-walnut/65 leading-relaxed">{t('cart.empty_subtitle')}</p>
            </div>
            <Button
              to="/products"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
            >
              {t('cart.browse')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
            {/* Lines */}
            <div className="space-y-3">
              {lines.map((line) => {
                const name = locale === 'ar' ? line.name_ar : line.name_en;
                const variantName =
                  locale === 'ar' ? line.variant_name_ar : line.variant_name_en;
                return (
                  <article
                    key={line.key}
                    className="bg-whisper rounded-card border border-walnut/10 p-4 md:p-5 flex gap-4"
                  >
                    <Link
                      to={`/products/${line.slug}`}
                      className="h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden bg-sand-soft shrink-0"
                    >
                      {line.image_url ? (
                        <img
                          src={line.image_url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-3xl text-walnut/30">
                          ◇
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/products/${line.slug}`} className="min-w-0">
                          <h3 className="font-semibold text-walnut leading-tight hover:text-emerald transition clamp-2">
                            {name}
                          </h3>
                          {variantName ? (
                            <p className="text-sm text-walnut/55 mt-0.5">{variantName}</p>
                          ) : null}
                        </Link>
                        <button
                          onClick={() => removeLine(line.key)}
                          className="text-walnut/45 hover:text-signal transition p-1.5 -m-1.5"
                          aria-label={t('cart.remove')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <div className="inline-flex items-center bg-cream rounded-lg border border-walnut/10">
                          <button
                            onClick={() => updateQuantity(line.key, line.quantity - 1)}
                            className="p-2 text-walnut hover:text-emerald transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-8 text-center tabular">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.key, line.quantity + 1)}
                            className="p-2 text-walnut hover:text-emerald transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-bold text-emerald text-lg tabular">
                          {formatSAR(line.unit_price_sar * line.quantity, locale)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}

              <Link
                to="/products"
                className="inline-flex items-center gap-1 text-emerald hover:text-emerald-dark text-sm font-semibold pt-2"
              >
                <ArrowRight className="h-4 w-4 rtl:rotate-180 -scale-x-100 rtl:scale-x-100" />
                {locale === 'ar' ? 'إكمال التسوق' : 'Continue shopping'}
              </Link>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
              <div className="bg-whisper rounded-card border border-walnut/10 p-6 space-y-5">
                <Eyebrow>{locale === 'ar' ? 'الملخص' : 'Summary'}</Eyebrow>

                {/* Free shipping progress */}
                <div className="space-y-2">
                  <p className="text-xs text-walnut/80 font-medium">
                    {remaining > 0
                      ? t('cart.free_shipping_progress', {
                          amount: formatSAR(remaining, locale),
                        })
                      : t('cart.free_shipping_unlocked')}
                  </p>
                  <div className="h-1.5 bg-sand rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brass via-emerald to-emerald-dark transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-walnut/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-walnut/70">{t('cart.subtotal')}</span>
                    <span className="font-semibold text-walnut tabular">
                      {formatSAR(subtotal, locale)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-walnut/70">{t('cart.shipping')}</span>
                    <span className="font-semibold text-walnut tabular">
                      {shipping === 0
                        ? locale === 'ar'
                          ? 'مجاني'
                          : 'Free'
                        : formatSAR(shipping, locale)}
                    </span>
                  </div>
                  <div className="border-t border-walnut/10 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-semibold text-walnut">
                      {t('cart.total')}
                    </span>
                    <span className="text-2xl font-bold text-emerald tabular">
                      {formatSAR(total, locale)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
                >
                  {t('cta.checkout')}
                </Button>

                <div className="grid grid-cols-1 gap-2 text-xs text-walnut/70 pt-1">
                  <span className="inline-flex items-center gap-2">
                    <Banknote className="h-3.5 w-3.5 text-emerald" />
                    {t('checkout.cod_reassurance')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-emerald" />
                    {t('trust.fast_shipping')}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald" />
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
