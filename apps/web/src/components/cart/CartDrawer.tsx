import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Banknote } from 'lucide-react';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/common/Eyebrow';
import { formatSAR, FREE_SHIPPING_THRESHOLD_SAR } from '@hirra/shared';
import { track } from '@/lib/tracking';

/**
 * Premium slide-over cart.
 *
 * Single primary CTA at the foot, persistent COD reassurance, free-shipping
 * progress bar with brass→emerald gradient, and inline qty + remove on each
 * line. Empty state mirrors the editorial typography of the rest of the site
 * so it never looks broken.
 */
export function CartDrawer() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const navigate = useNavigate();

  const isOpen = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD_SAR - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_SAR) * 100);

  const handleCheckout = () => {
    track.initiateCheckout({
      value: subtotal,
      currency: 'SAR',
      num_items: itemCount,
    });
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-walnut/45 backdrop-blur-[1px] z-40"
            onClick={closeDrawer}
            aria-hidden
          />
          <motion.aside
            initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 end-0 w-full sm:w-[440px] bg-cream z-50 shadow-card-hover flex flex-col"
            role="dialog"
            aria-label={t('cta.checkout')}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-walnut/10 shrink-0">
              <div>
                <Eyebrow>{locale === 'ar' ? 'سلتك' : 'Your bag'}</Eyebrow>
                <h2 className="text-lg font-semibold heading-display text-walnut mt-1">
                  {itemCount > 0
                    ? t('cart.items_count', { count: itemCount })
                    : t('cart.empty')}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 -me-2 text-walnut hover:text-emerald transition"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {lines.length > 0 ? (
              <div className="px-5 py-3.5 bg-whisper border-b border-walnut/10 shrink-0">
                <p className="text-xs text-walnut/80 mb-2 font-medium">
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
            ) : null}

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <div className="text-center py-16 px-5 space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-whisper grid place-items-center">
                    <ShoppingBag className="h-7 w-7 text-walnut/40" />
                  </div>
                  <div className="space-y-1.5 max-w-xs mx-auto">
                    <p className="text-lg font-semibold heading-display text-walnut">
                      {t('cart.empty')}
                    </p>
                    <p className="text-sm text-walnut/65 leading-relaxed">
                      {t('cart.empty_subtitle')}
                    </p>
                  </div>
                  <Button
                    to="/products"
                    onClick={closeDrawer}
                    variant="primary"
                    className="mt-2"
                  >
                    {t('cart.browse')}
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-walnut/10">
                  {lines.map((line) => {
                    const name = locale === 'ar' ? line.name_ar : line.name_en;
                    const variantName =
                      locale === 'ar' ? line.variant_name_ar : line.variant_name_en;
                    return (
                      <li key={line.key} className="flex gap-4 p-5">
                        <div className="h-20 w-20 rounded-xl overflow-hidden bg-sand-soft shrink-0">
                          {line.image_url ? (
                            <img
                              src={line.image_url}
                              alt={name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full grid place-items-center text-2xl text-walnut/30">
                              ◇
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <h3 className="font-semibold text-walnut text-sm leading-tight clamp-2">
                            {name}
                          </h3>
                          {variantName ? (
                            <p className="text-xs text-walnut/55">{variantName}</p>
                          ) : null}
                          <p className="text-sm font-bold text-emerald tabular">
                            {formatSAR(line.unit_price_sar * line.quantity, locale)}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <div className="inline-flex items-center bg-whisper rounded-lg border border-walnut/10">
                              <button
                                onClick={() =>
                                  updateQuantity(line.key, line.quantity - 1)
                                }
                                className="p-1.5 text-walnut hover:text-emerald transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-sm font-semibold w-7 text-center tabular">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(line.key, line.quantity + 1)
                                }
                                className="p-1.5 text-walnut hover:text-emerald transition"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeLine(line.key)}
                              className="text-walnut/45 hover:text-signal transition p-1.5"
                              aria-label={t('cart.remove')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 ? (
              <div className="border-t border-walnut/10 p-5 space-y-4 shrink-0 pb-safe bg-cream">
                <div className="flex items-center justify-between text-walnut">
                  <span className="font-semibold">{t('cart.subtotal')}</span>
                  <span className="text-xl font-bold text-emerald tabular">
                    {formatSAR(subtotal, locale)}
                  </span>
                </div>

                <Button onClick={handleCheckout} size="lg" fullWidth>
                  {t('cta.checkout')} · {formatSAR(subtotal, locale)}
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-walnut/65">
                  <span className="inline-flex items-center gap-1.5">
                    <Banknote className="h-3.5 w-3.5 text-emerald" />
                    {locale === 'ar' ? 'دفع عند الاستلام' : 'Cash on delivery'}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald" />
                    {locale === 'ar' ? 'ضمان ٣٠ يوم' : '30-day guarantee'}
                  </span>
                </div>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
