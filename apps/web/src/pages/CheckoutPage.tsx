import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  Banknote,
  Lock,
  ShieldCheck,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  Truck,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Eyebrow } from '@/components/common/Eyebrow';
import { useCartStore } from '@/store/cart';
import { supabase } from '@/lib/supabase';
import { resolveCheckoutItems } from '@/lib/checkout-resolve-items';
import { submitGuestCheckoutViaRpc } from '@/lib/checkout-submit-direct';
import { isSupabaseConfigured } from '@/lib/fallback-data';
import {
  formatSAR,
  normalizeSaudiPhone,
  SAUDI_CITIES,
  calculateOrderTotals,
} from '@hirra/shared';
import { captureUtm, track } from '@/lib/tracking';

/**
 * Premium-feel COD checkout. Three fields only — name, phone, city.
 *
 * - Editorial header with eyebrow + serif H1.
 * - Order summary first (mobile-first: customer sees what they're paying
 *   for before scrolling).
 * - ETA pill appears once a city is chosen — premium reassurance signal.
 * - Single dominant submit CTA. Trust strip + COD reassurance below.
 */

const schema = z.object({
  name: z.string().trim().min(2, 'name_short'),
  phone: z.string().refine((v) => normalizeSaudiPhone(v) !== null, {
    message: 'phone_invalid',
  }),
  city: z.string().min(1, 'city_required'),
});

type FormValues = z.infer<typeof schema>;

function etaForCity(zone: 1 | 2 | 3 | 4 | undefined, locale: 'ar' | 'en'): string {
  switch (zone) {
    case 1:
      return locale === 'ar' ? 'وصول خلال ١-٢ يوم' : 'Arrives in 1–2 days';
    case 2:
      return locale === 'ar' ? 'وصول خلال ٢-٣ أيام' : 'Arrives in 2–3 days';
    case 3:
      return locale === 'ar' ? 'وصول خلال ٣-٤ أيام' : 'Arrives in 3–4 days';
    case 4:
    default:
      return locale === 'ar' ? 'وصول خلال ٣-٥ أيام' : 'Arrives in 3–5 days';
  }
}

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const submitGuardRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const cityValue = watch('city');

  const totals = useMemo(
    () => calculateOrderTotals(subtotal, cityValue || null, 'cod'),
    [subtotal, cityValue],
  );

  useEffect(() => {
    if (lines.length > 0) {
      track.initiateCheckout({
        value: subtotal,
        currency: 'SAR',
        num_items: lines.reduce((s, l) => s + l.quantity, 0),
      });
    }
  }, [lines.length, subtotal]);

  if (lines.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const cityOptions = SAUDI_CITIES.map((c) => ({
    value: c.value,
    label: locale === 'ar' ? c.label_ar : c.label_en,
  }));

  const selectedCity = SAUDI_CITIES.find((c) => c.value === cityValue);

  const onSubmit = async (values: FormValues) => {
    if (submitGuardRef.current) return;
    submitGuardRef.current = true;
    setSubmitting(true);
    setServerError(null);

    const releaseSubmit = () => {
      submitGuardRef.current = false;
      setSubmitting(false);
    };

    try {
      const utm = captureUtm();

      const cityLabel =
        SAUDI_CITIES.find((c) => c.value === values.city)?.[
          locale === 'ar' ? 'label_ar' : 'label_en'
        ] ?? values.city;

      // The simplified COD form only collects name/phone/city. We still need
      // `street_address` (≥5 chars, 3+ words for risk scoring in the DB RPC),
      // so we synthesise a placeholder line saying the address will be
      // confirmed on WhatsApp.
      const synthesizedAddress = `${cityLabel} — يُحدد عبر واتساب`;

      const baseCustomer = {
        phone: values.phone,
        name: values.name.trim(),
        city: values.city,
        street_address: synthesizedAddress,
      };

      // Storefront preview mode — when Supabase isn't connected, mock a
      // successful order so the full add-to-cart → checkout → confirmation
      // flow still works end-to-end.
      if (!isSupabaseConfigured()) {
        const mockOrderNumber = `HRR-${Date.now().toString().slice(-6)}`;

        track.purchase({
          value: totals.total,
          currency: 'SAR',
          content_ids: lines.flatMap((l) => (l.product_id ? [l.product_id] : [])),
          num_items: lines.reduce((s, l) => s + l.quantity, 0),
        });

        window.location.href = `/order-confirmation/${mockOrderNumber}`;
        return;
      }

      let resolvedItems;
      try {
        resolvedItems = await resolveCheckoutItems(lines);
      } catch (resolveErr) {
        console.error('Checkout item resolution failed:', resolveErr);
        setServerError(t('errors.generic'));
        releaseSubmit();
        return;
      }

      const rpcPayload = {
        customer: baseCustomer,
        items: resolvedItems,
        payment_method: 'cod' as const,
        ...(Object.keys(utm).length > 0 ? { utm } : {}),
        referrer:
          typeof document !== 'undefined' ? document.referrer || undefined : undefined,
        user_agent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      };

      const checkout = await submitGuestCheckoutViaRpc(rpcPayload);

      if ('error' in checkout) {
        setServerError(checkout.error);
        releaseSubmit();
        return;
      }

      const ok = checkout;

      track.purchase({
        value: ok.total_sar,
        currency: 'SAR',
        content_ids: resolvedItems.flatMap((i) =>
          i.product_id ? [i.product_id] : ([] as string[]),
        ),
        num_items: lines.reduce((s, l) => s + l.quantity, 0),
      });

      void supabase.from('analytics_events').insert({
        event_name: 'purchase',
        order_id: ok.order_id,
        metadata: { total_sar: ok.total_sar, payment_method: 'cod' },
      });

      window.location.href = `/order-confirmation/${ok.order_number}`;
      return;
    } catch (err) {
      console.error('Checkout failed:', err);
      setServerError(t('errors.generic'));
      releaseSubmit();
    }
  };

  const translateError = (key?: string) => (key ? t(`validation.${key}`) : undefined);

  return (
    <>
      <Helmet>
        <title>
          {t('checkout.title')} — {t('brand.name')}
        </title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="container-content py-6 md:py-12">
        <div className="max-w-md mx-auto space-y-6">
          {/* Editorial header */}
          <div className="space-y-2.5">
            <Link
              to="/cart"
              className="inline-flex items-center gap-1 text-emerald hover:text-emerald-dark text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              <span>{t('cta.continue_shopping')}</span>
            </Link>

            <Eyebrow>{locale === 'ar' ? 'الدفع' : 'Checkout'}</Eyebrow>
            <h1 className="text-h1 heading-display text-walnut">
              {locale === 'ar' ? 'خطوة وحدة، وراحة بال.' : 'One step, peace of mind.'}
            </h1>
          </div>

          {/* Order summary with inline qty + remove */}
          <section className="bg-whisper rounded-card border border-walnut/10 p-5 space-y-4">
            <div className="flex items-baseline justify-between">
              <Eyebrow>{t('checkout.your_order')}</Eyebrow>
              <Link
                to="/cart"
                className="text-xs text-emerald font-semibold hover:underline"
              >
                {t('cart.browse')}
              </Link>
            </div>

            <ul className="space-y-3">
              {lines.map((line) => {
                const name = locale === 'ar' ? line.name_ar : line.name_en;
                const variantName =
                  locale === 'ar' ? line.variant_name_ar : line.variant_name_en;
                return (
                  <li key={line.key} className="flex gap-3">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-sand-soft shrink-0">
                      {line.image_url ? (
                        <img
                          src={line.image_url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xl text-walnut/30">
                          ◇
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-walnut leading-tight clamp-2">
                        {name}
                      </p>
                      {variantName ? (
                        <p className="text-xs text-walnut/60">{variantName}</p>
                      ) : null}
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="inline-flex items-center bg-cream rounded-lg border border-walnut/10">
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.key, line.quantity - 1)}
                            className="p-1.5 text-walnut hover:text-emerald transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-7 text-center tabular">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(line.key, line.quantity + 1)}
                            className="p-1.5 text-walnut hover:text-emerald transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-emerald tabular">
                            {formatSAR(line.unit_price_sar * line.quantity, locale)}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeLine(line.key)}
                            className="text-walnut/40 hover:text-signal p-1 transition"
                            aria-label={t('cart.remove')}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-walnut/10 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-walnut/70">{t('cart.subtotal')}</span>
                <span className="font-semibold text-walnut tabular">
                  {formatSAR(totals.subtotal, locale)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-walnut/70">{t('cart.shipping')}</span>
                <span className="font-semibold text-walnut tabular">
                  {totals.shipping === 0
                    ? locale === 'ar'
                      ? 'مجاني'
                      : 'Free'
                    : formatSAR(totals.shipping, locale)}
                </span>
              </div>
              {totals.codFee > 0 ? (
                <div className="flex justify-between">
                  <span className="text-walnut/70">{t('cart.cod_fee')}</span>
                  <span className="font-semibold text-walnut tabular">
                    {formatSAR(totals.codFee, locale)}
                  </span>
                </div>
              ) : null}
              <div className="border-t border-walnut/10 pt-2 mt-1 flex justify-between items-baseline">
                <span className="text-base font-semibold text-walnut">
                  {t('cart.total')}
                </span>
                <span className="text-2xl font-bold text-emerald tabular">
                  {formatSAR(totals.total, locale)}
                </span>
              </div>
            </div>
          </section>

          {/* Form: name + phone + city only */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <section className="bg-whisper rounded-card border border-walnut/10 p-5 space-y-3">
              <Input
                {...register('name')}
                label={t('checkout.name')}
                placeholder={t('checkout.name_placeholder')}
                autoComplete="name"
                error={translateError(errors.name?.message)}
              />
              <Input
                {...register('phone')}
                label={t('checkout.phone')}
                placeholder={t('checkout.phone_placeholder')}
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                error={translateError(errors.phone?.message)}
              />
              <Select
                {...register('city')}
                label={t('checkout.city')}
                placeholder={t('checkout.city_placeholder')}
                options={cityOptions}
                error={translateError(errors.city?.message)}
              />

              {selectedCity ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald/10 text-emerald-dark px-3 py-1.5 text-xs font-semibold animate-fade-up">
                  <Truck className="h-3.5 w-3.5" />
                  {etaForCity(selectedCity.zone, locale)}
                </div>
              ) : null}
            </section>

            {/* Prominent COD reassurance */}
            <div className="bg-emerald text-cream rounded-card p-5 flex items-start gap-3 shadow-card">
              <div className="h-9 w-9 rounded-full bg-cream/15 grid place-items-center shrink-0">
                <Banknote className="h-4 w-4 text-gold" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm md:text-base font-semibold leading-snug">
                  {t('checkout.cod_reassurance')}
                </p>
                <p className="text-xs text-cream/75 leading-relaxed">
                  {locale === 'ar'
                    ? 'لا تسجيل، لا بطاقة. تدفعين عند الاستلام.'
                    : 'No sign-up, no card. You pay when it arrives.'}
                </p>
              </div>
            </div>

            {serverError ? (
              <div
                className="bg-signal/10 text-signal text-sm font-semibold rounded-xl p-3"
                role="alert"
              >
                {serverError}
              </div>
            ) : null}

            <Button type="submit" size="xl" fullWidth isLoading={submitting}>
              {t('checkout.submit')}
            </Button>

            <div className="flex items-center justify-center gap-5 pt-1 text-xs text-walnut/60">
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                <span>{t('trust.secure_payment')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{t('trust.guarantee')}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
