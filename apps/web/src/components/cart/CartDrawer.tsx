import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Banknote } from 'lucide-react';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/Button';
import { PremiumBadge } from '@/components/brand/PremiumBadge';
import { formatMAD } from '@hirra/shared';
import { track } from '@/lib/tracking';
import type { StoreLocale } from '@/i18n';

export function CartDrawer() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const navigate = useNavigate();

  const isOpen = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());
  const itemCount = useCartStore((s) => s.itemCount());

  const handleCheckout = () => {
    track.initiateCheckout({
      value: subtotal,
      currency: 'MAD',
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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-obsidian/70 backdrop-blur-sm z-40"
            onClick={closeDrawer}
            aria-hidden
          />
          <motion.aside
            initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 end-0 w-full sm:w-[440px] bg-charcoal border-s border-gold/10 z-50 shadow-card-hover flex flex-col"
            role="dialog"
            aria-label={t('cta.checkout')}
          >
            <div className="flex items-center justify-between p-5 border-b border-gold/10 shrink-0">
              <div>
                <PremiumBadge tone="pearl">
                  {locale === 'ar' ? 'سلتك' : 'Votre sélection'}
                </PremiumBadge>
                <h2 className="text-lg heading-display text-pearl mt-3">
                  {itemCount > 0
                    ? t('cart.items_count', { count: itemCount })
                    : t('cart.empty')}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 -me-2 text-champagne hover:text-gold transition"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length > 0 ? (
              <div className="px-5 py-3 bg-ink/60 border-b border-gold/10 shrink-0">
                <p className="text-xs text-gold font-semibold">{t('cart.free_shipping_unlocked')}</p>
              </div>
            ) : null}

            <div className="flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <div className="text-center py-20 px-5 space-y-5">
                  <div className="h-16 w-16 mx-auto rounded-full border border-gold/20 grid place-items-center">
                    <ShoppingBag className="h-7 w-7 text-gold/50" />
                  </div>
                  <div className="space-y-2 max-w-xs mx-auto">
                    <p className="text-lg heading-display text-pearl">{t('cart.empty')}</p>
                    <p className="text-sm text-smoke leading-relaxed">{t('cart.empty_subtitle')}</p>
                  </div>
                  <Button to="/products" onClick={closeDrawer} variant="gold" className="mt-2">
                    {t('cart.browse')}
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-gold/10">
                  {lines.map((line) => {
                    const name = locale === 'ar' ? line.name_ar : line.name_en;
                    const variantName =
                      locale === 'ar' ? line.variant_name_ar : line.variant_name_en;
                    return (
                      <li key={line.key} className="flex gap-4 p-5">
                        <div className="h-20 w-20 rounded-xl overflow-hidden bg-ink border border-gold/15 shrink-0">
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
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <h3 className="font-semibold text-pearl text-sm leading-tight line-clamp-2">
                            {name}
                          </h3>
                          {variantName ? (
                            <p className="text-xs text-smoke">{variantName}</p>
                          ) : null}
                          <p className="text-sm font-semibold text-gold tabular">
                            {formatMAD(line.unit_price_sar * line.quantity, locale)}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <div className="inline-flex items-center bg-ink rounded-lg border border-gold/20">
                              <button
                                onClick={() => updateQuantity(line.key, line.quantity - 1)}
                                className="p-1.5 text-champagne hover:text-gold transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-sm font-semibold w-7 text-center tabular text-pearl">
                                {line.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(line.key, line.quantity + 1)}
                                className="p-1.5 text-champagne hover:text-gold transition"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeLine(line.key)}
                              className="text-smoke hover:text-champagne transition p-1.5"
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

            {lines.length > 0 ? (
              <div className="border-t border-gold/10 p-5 space-y-4 shrink-0 pb-safe bg-charcoal">
                <Button onClick={handleCheckout} variant="gold" size="lg" fullWidth>
                  {t('cta.checkout')} · {formatMAD(subtotal, locale)}
                </Button>

                <div className="flex items-center justify-center gap-5 text-xs text-smoke">
                  <span className="inline-flex items-center gap-1.5">
                    <Banknote className="h-3.5 w-3.5 text-gold/70" />
                    {t('trust.cod_label')}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold/70" />
                    {locale === 'ar' ? 'ضمان الرضا' : 'Satisfait ou échangé'}
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
