import { useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, MessageCircle, Package, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { PremiumBadge } from '@/components/brand/PremiumBadge';
import { ProductCardLuxury } from '@/components/brand/ProductCardLuxury';
import { GuaranteePromise } from '@/components/common/GuaranteePromise';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/fallback-data';
import {
  buildRiyanaluxeOrderConfirmationWhatsAppText,
  buildWhatsAppLink,
  BRAND,
} from '@hirra/shared';
import type { StoreLocale } from '@/i18n';

const waConfirmInflight = new Set<string>();

interface LocationState {
  customerName?: string;
  paymentMethod?: 'cod' | 'whatsapp';
}

export default function OrderConfirmationPage() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { state } = useLocation() as { state: LocationState | null };

  const customerName =
    state?.customerName ?? (locale === 'ar' ? 'صديقنا' : 'vous');
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || BRAND.whatsappDigits;
  const safeOrderNo = orderNumber?.trim() ?? '';
  const whatsappMessage = buildRiyanaluxeOrderConfirmationWhatsAppText(safeOrderNo, locale);
  const whatsappLink = buildWhatsAppLink(whatsappPhone, whatsappMessage);

  const { data: products = [] } = useProducts();
  const companions = products.filter((p) => !p.is_hero);

  const loggedRef = useRef(false);

  useEffect(() => {
    if (!safeOrderNo || !isSupabaseConfigured()) return;

    const storageKey = `riyanaluxe_wa_confirm_${safeOrderNo}`;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(storageKey)) {
      loggedRef.current = true;
      return;
    }

    if (waConfirmInflight.has(safeOrderNo) || loggedRef.current) return;
    waConfirmInflight.add(safeOrderNo);

    let cancelled = false;
    void (async () => {
      try {
        const { data, error } = await supabase.rpc('hirra_record_whatsapp_confirmation_opened', {
          p_order_number: safeOrderNo,
        });
        if (cancelled || error) return;
        const payload = data as { success?: boolean } | null;
        if (payload?.success && typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(storageKey, '1');
          loggedRef.current = true;
        }
      } catch {
        /* page must render even if logging fails */
      } finally {
        waConfirmInflight.delete(safeOrderNo);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [safeOrderNo]);

  const timeline =
    locale === 'ar'
      ? [
          {
            n: '01',
            title: 'تأكيد واتساب',
            body: 'نتواصل خلال دقائق لتأكيد الطلب والمدينة.',
          },
          {
            n: '02',
            title: 'تغليف فاخر',
            body: 'نغلّف طلبيتك بأسلوب ريانا لوكس — توصيل سريع.',
          },
          {
            n: '03',
            title: 'التسليم والدفع',
            body: '2-5 أيام حسب المدينة. الدفع عند التسليم.',
          },
        ]
      : [
          {
            n: '01',
            title: 'Confirmation WhatsApp',
            body: 'Nous vous contactons en quelques minutes.',
          },
          {
            n: '02',
            title: 'Emballage soigné',
            body: 'Présentation RIYANALUXE — expédition rapide.',
          },
          {
            n: '03',
            title: 'Réception & paiement',
            body: '2–5 jours selon la ville. Paiement à la livraison.',
          },
        ];

  return (
    <>
      <Helmet>
        <title>
          {t('order_confirmation.title', { name: customerName })} — {t('brand.name')}
        </title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="container-content pt-12 md:pt-20 pb-10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-full border border-gold/30 grid place-items-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-gold" strokeWidth={1.25} />
          </div>
          <PremiumBadge tone="pearl">{locale === 'ar' ? 'تم التسجيل' : 'Enregistré'}</PremiumBadge>
          <h1 className="text-h1 heading-display text-pearl text-balance">
            {t('order_confirmation.title', { name: customerName })}
          </h1>
          <p className="text-lg text-champagne/90">{t('order_confirmation.subtitle')}</p>
          {safeOrderNo ? (
            <div className="inline-flex items-center gap-3 rounded-full border border-gold/25 bg-charcoal/60 px-5 py-2.5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold">
                {t('order_confirmation.order_number')}
              </span>
              <span className="text-base font-display text-pearl tabular" dir="ltr">
                {safeOrderNo}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="container-content pb-10">
        <div className="max-w-3xl mx-auto luxury-card p-6 md:p-8">
          <ol className="grid md:grid-cols-3 gap-6">
            {timeline.map((step) => (
              <li key={step.n} className="space-y-2">
                <span className="font-display text-2xl text-gold tabular">{step.n}</span>
                <h3 className="font-semibold text-pearl heading-display">{step.title}</h3>
                <p className="text-sm text-smoke leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-content pb-12">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <p className="text-champagne/90">{t('order_confirmation.next_step')}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              href={whatsappLink}
              target="_blank"
              variant="whatsapp"
              size="xl"
              leftIcon={<MessageCircle className="h-5 w-5" />}
            >
              {t('order_confirmation.open_whatsapp')}
            </Button>
            <Button to="/track" variant="secondary" size="xl" leftIcon={<Package className="h-5 w-5" />}>
              {t('order_confirmation.track_order')}
            </Button>
          </div>
        </div>
      </section>

      {companions.length > 0 ? (
        <section className="border-t border-gold/10 bg-charcoal/30 section-y-tight">
          <div className="container-content space-y-8">
            <h2 className="text-h2 heading-display text-pearl text-center">
              {locale === 'ar' ? 'أكمل طقوسك' : 'Complétez votre rituel'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {companions.map((p) => (
                <ProductCardLuxury key={p.id} product={p} locale={locale} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-gold hover:text-champagne font-medium transition"
              >
                {t('cta.view_collection')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-content py-12">
        <GuaranteePromise />
      </section>
    </>
  );
}
