import { useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, MessageCircle, Package, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/common/Eyebrow';
import { ProductCard } from '@/components/product/ProductCard';
import { GuaranteePromise } from '@/components/common/GuaranteePromise';
import { useProducts } from '@/hooks/useProducts';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/fallback-data';
import { buildHirraOrderConfirmationWhatsAppText, buildWhatsAppLink } from '@hirra/shared';

/** Dedupe WhatsApp confirmation RPC (React Strict Mode double-mount in dev). */
const hirraWaConfirmInflight = new Set<string>();

interface LocationState {
  customerName?: string;
  paymentMethod?: 'cod' | 'whatsapp';
}

/**
 * Premium thank-you page.
 *
 * - Calmer success state — checkmark in a soft cream disc, eyebrow + serif
 *   greeting, order number rendered as a brass-bordered receipt chip.
 * - Three-step timeline tells the customer what happens next, in order:
 *   confirmation on WhatsApp → packaging → delivery.
 * - Primary action is "Open WhatsApp" (deep link with the order number
 *   prefilled), since the next real action is COD confirmation by chat.
 * - Cross-sell row at the bottom (the rest of the catalogue) increases
 *   AOV without breaking the moment of completion.
 */
export default function OrderConfirmationPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { state } = useLocation() as { state: LocationState | null };

  const customerName =
    state?.customerName ?? (locale === 'ar' ? 'صديقتنا' : 'friend');
  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE || '9665XXXXXXXX';
  const safeOrderNo = orderNumber?.trim() ?? '';
  const whatsappMessage = buildHirraOrderConfirmationWhatsAppText(safeOrderNo, locale);
  const whatsappLink = buildWhatsAppLink(whatsappPhone, whatsappMessage);

  const { data: products = [] } = useProducts();

  const loggedRef = useRef(false);

  useEffect(() => {
    if (!safeOrderNo) return;
    if (!isSupabaseConfigured()) return;

    const storageKey = `hirra_wa_confirm_${safeOrderNo}`;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(storageKey)) {
      loggedRef.current = true;
      return;
    }

    if (hirraWaConfirmInflight.has(safeOrderNo) || loggedRef.current) return;
    hirraWaConfirmInflight.add(safeOrderNo);

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
        /* thank-you page must still render if logging fails */
      } finally {
        hirraWaConfirmInflight.delete(safeOrderNo);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [safeOrderNo]);

  const timeline = [
    {
      n: '01',
      titleAr: 'التأكيد عبر واتساب',
      titleEn: 'WhatsApp confirmation',
      bodyAr: 'نتواصل معكِ خلال دقائق لتأكيد العنوان والطلب.',
      bodyEn: 'We reach out within minutes to confirm address and order.',
    },
    {
      n: '02',
      titleAr: 'التغليف بحب',
      titleEn: 'Packed with care',
      bodyAr: 'نغلّف طلبك بتغليف هِرّة الفاخر، ونرسله شحن سريع.',
      bodyEn: 'Your order is packed in our premium Hirra packaging, then dispatched.',
    },
    {
      n: '03',
      titleAr: 'الوصول، ثم الدفع',
      titleEn: 'Arrives, then you pay',
      bodyAr: '١-٣ أيام للمدن الكبرى. تدفعين نقداً عند الاستلام.',
      bodyEn: '1–3 days for major cities. You pay in cash when it arrives.',
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

      <section className="container-content pt-12 md:pt-20 pb-10 md:pb-14">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-emerald/10 grid place-items-center mx-auto ring-8 ring-emerald/5">
            <CheckCircle2 className="h-10 w-10 text-emerald" strokeWidth={1.8} />
          </div>

          <div className="space-y-2">
            <Eyebrow as="div" className="justify-center">
              {locale === 'ar' ? 'تم!' : 'Done!'}
            </Eyebrow>
            <h1 className="text-h1 heading-display text-walnut text-balance">
              {t('order_confirmation.title', { name: customerName })}
            </h1>
            <p className="text-lg text-walnut/70">{t('order_confirmation.subtitle')}</p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border border-brass/40 bg-whisper px-5 py-2.5">
            <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-brass">
              {t('order_confirmation.order_number')}
            </span>
            <span className="text-base font-bold text-walnut tabular" dir="ltr">
              {safeOrderNo || orderNumber}
            </span>
          </div>
        </div>
      </section>

      {/* Timeline ======================================================== */}
      <section className="container-content pb-10 md:pb-14">
        <div className="max-w-3xl mx-auto bg-whisper rounded-card border border-walnut/10 p-6 md:p-8">
          <Eyebrow as="div" className="justify-center md:justify-start">
            {locale === 'ar' ? 'شو الخطوات الجاية' : 'What happens next'}
          </Eyebrow>

          <ol className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {timeline.map((step) => (
              <li key={step.n} className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl text-emerald tabular leading-none">
                    {step.n}
                  </span>
                  <div className="h-px flex-1 bg-walnut/15" />
                </div>
                <h3 className="font-semibold text-walnut leading-tight heading-display text-lg">
                  {locale === 'ar' ? step.titleAr : step.titleEn}
                </h3>
                <p className="text-sm text-walnut/70 leading-relaxed text-pretty">
                  {locale === 'ar' ? step.bodyAr : step.bodyEn}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Primary action ================================================== */}
      <section className="container-content pb-12 md:pb-16">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <p className="text-walnut/75 leading-relaxed">
            {t('order_confirmation.next_step')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="xl"
              leftIcon={<MessageCircle className="h-5 w-5" />}
            >
              {t('order_confirmation.open_whatsapp')}
            </Button>
            <Button
              to="/track"
              variant="secondary"
              size="xl"
              leftIcon={<Package className="h-5 w-5" />}
            >
              {t('order_confirmation.track_order')}
            </Button>
          </div>
        </div>
      </section>

      {/* Cross-sell ===================================================== */}
      {products.length > 0 ? (
        <section className="bg-whisper">
          <div className="container-content section-y-tight space-y-8">
            <div className="text-center space-y-2">
              <Eyebrow as="div" className="justify-center">
                {locale === 'ar' ? 'ما يكتمل الطقس بدون' : 'Complete the ritual'}
              </Eyebrow>
              <h2 className="text-h2 heading-display text-walnut text-balance">
                {locale === 'ar' ? 'لمسة تكمّل بيتك' : 'A finishing touch for your home'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="text-center pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-emerald hover:text-emerald-dark font-semibold transition"
              >
                {locale === 'ar' ? 'عرض كل المنتجات' : 'View the full collection'}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Promise strip ================================================== */}
      <section className="container-content py-12 md:py-16">
        <GuaranteePromise />
      </section>
    </>
  );
}
