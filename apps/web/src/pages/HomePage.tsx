import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/product/ProductCard';
import { Eyebrow } from '@/components/common/Eyebrow';
import { SectionHeading } from '@/components/common/SectionHeading';
import { BrandStoryStrip } from '@/components/common/BrandStoryStrip';
import { FoundersNote } from '@/components/common/FoundersNote';
import { GuaranteePromise } from '@/components/common/GuaranteePromise';
import { useProducts } from '@/hooks/useProducts';
import { useBundles } from '@/hooks/useBundles';
import { formatSAR } from '@hirra/shared';
import { useCartStore } from '@/store/cart';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const navigate = useNavigate();
  const addLine = useCartStore((s) => s.addLine);
  const { data: products = [] } = useProducts();
  const { data: bundles = [] } = useBundles();

  return (
    <>
      <Helmet>
        <title>{t('brand.name')} — {t('brand.tagline')}</title>
        <meta name="description" content={t('brand.tagline')} />
      </Helmet>

      {/* HERO ============================================================ */}
      {/*
        Editorial hero: cream surface (not gradient), serif display H1, brass
        eyebrow, paired CTA — primary gold, secondary ghost. The right column
        renders a tall image card so the section already reads as "real"
        before Phase-2 photography lands.
      */}
      <section className="relative bg-cream overflow-hidden">
        <div className="container-content pt-12 md:pt-20 lg:pt-24 pb-16 md:pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
            <div className="space-y-7 max-w-xl">
              <Eyebrow>
                {locale === 'ar' ? 'هِرّة — منزل سعودي للقطط' : 'Hirra — a Saudi cat house'}
              </Eyebrow>

              <h1 className="text-hero heading-display text-walnut text-balance">
                {locale === 'ar' ? (
                  <>
                    لقطتك،
                    <br />
                    <span className="text-emerald">ولبيتك السعودي</span>
                    <br />
                    شي يستاهلكم.
                  </>
                ) : (
                  <>
                    For your cat,
                    <br />
                    <span className="text-emerald">and your Saudi home</span>
                    <br />
                    something worthy.
                  </>
                )}
              </h1>

              <p className="text-walnut/75 text-lg leading-relaxed text-pretty max-w-md">
                {locale === 'ar'
                  ? 'ثلاثة منتجات مختارة بحب — سيليكون فاخر، تصميم هادي، وضمان رضا ٣٠ يوم. صُنعت لك ولقطتك ولرخام بيتك.'
                  : 'Three pieces, carefully chosen — premium silicone, quiet design, and a 30-day promise. Made for you, your cat, and the marble of your home.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  to="/products/hirra-pro-roller"
                  variant="primary"
                  size="xl"
                  rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
                >
                  {locale === 'ar' ? 'تسوّقي البطلة' : 'Shop the hero'}
                </Button>
                <Button to="/about" variant="ghost" size="xl">
                  {t('cta.see_story')}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 text-xs text-walnut/65 font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  {locale === 'ar' ? 'دفع عند الاستلام' : 'Cash on delivery'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  {locale === 'ar' ? 'شحن ١-٣ أيام' : 'Delivery 1–3 days'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  {locale === 'ar' ? 'ضمان رضا ٣٠ يوم' : '30-day guarantee'}
                </span>
              </div>
            </div>

            {/* Hero image card — Saudi modern living-room editorial shot */}
            <div className="relative aspect-[4/5] rounded-hero overflow-hidden shadow-card-hover">
              <img
                src="/brand/hero-living-room.png"
                alt={
                  locale === 'ar'
                    ? 'بيت سعودي حديث مع قطة بريطانية رمادية وعباية سوداء وهِرّة برو رولر'
                    : 'A modern Saudi living room with a British Shorthair, a black abaya, and the Hirra Pro Roller'
                }
                className="absolute inset-0 h-full w-full object-cover img-fade"
                loading="eager"
                fetchPriority="high"
              />

              <div
                className="absolute inset-0 bg-gradient-to-t from-walnut/65 via-walnut/10 to-transparent"
                aria-hidden
              />

              <div className="relative h-full flex flex-col justify-end p-7 md:p-9 text-cream">
                <Eyebrow tone="cream">
                  {locale === 'ar' ? 'البطلة' : 'The hero'}
                </Eyebrow>
                <p className="font-display text-3xl md:text-4xl mt-2 leading-tight">
                  Hirra Pro Roller
                </p>
                <p className="text-cream/85 text-sm mt-2 max-w-[28ch]">
                  {locale === 'ar'
                    ? 'سيليكون فاخر، يلتقط الشعر بسحبة واحدة. آمن للعباية السوداء.'
                    : 'Premium silicone. One swipe. Safe on black abayas.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST RIBBON ===================================================== */}
      <section className="bg-walnut text-cream/80 border-y border-walnut">
        <div className="container-content py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-xs uppercase tracking-[0.16em] font-semibold">
            <span>{locale === 'ar' ? '⌖ شحن إلى كل المدن' : '⌖ Ships to every city'}</span>
            <span className="hidden md:inline">·</span>
            <span>{locale === 'ar' ? 'دفع عند الاستلام' : 'Cash on delivery'}</span>
            <span className="hidden md:inline">·</span>
            <span>{locale === 'ar' ? 'مصمم في الرياض' : 'Designed in Riyadh'}</span>
            <span className="hidden md:inline">·</span>
            <span>{locale === 'ar' ? 'دعم بالعربي على واتساب' : 'Arabic WhatsApp support'}</span>
          </div>
        </div>
      </section>

      {/* BRAND STORY STRIP ================================================ */}
      <section className="container-content section-y space-y-10">
        <SectionHeading
          eyebrow={locale === 'ar' ? 'القصة' : 'The story'}
          title={
            locale === 'ar'
              ? 'ثلاث لحظات في كل بيت سعودي فيه قطة.'
              : 'Three moments in every Saudi home with a cat.'
          }
          description={
            locale === 'ar'
              ? 'هِرّة بُنيت على هذي اللحظات الثلاث — الواقع، الحل، والنتيجة.'
              : 'Hirra is built around these three moments — the reality, the ritual, and the result.'
          }
        />
        <BrandStoryStrip />
      </section>

      {/* PRODUCTS ======================================================== */}
      <section className="bg-whisper">
        <div className="container-content section-y space-y-10">
          <SectionHeading
            eyebrow={locale === 'ar' ? 'المجموعة' : 'The collection'}
            title={
              locale === 'ar' ? 'ثلاث قطع. اختيرت بحب.' : 'Three pieces. Chosen with care.'
            }
            description={
              locale === 'ar'
                ? 'لا تشكيلة ضخمة، ولا فوضى. فقط الأساسيات اللي يستاهلها بيتك.'
                : 'No bloated catalogue. Just the essentials your home deserves.'
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="text-center pt-4">
            <Button
              to="/products"
              variant="secondary"
              size="lg"
              rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
            >
              {locale === 'ar' ? 'عرض كل المنتجات' : 'View the full collection'}
            </Button>
          </div>
        </div>
      </section>

      {/* RITUAL BUNDLES ================================================== */}
      {bundles.length > 0 ? (
        <section className="bg-emerald-deep text-cream">
          <div className="container-content section-y space-y-10">
            <SectionHeading
              tone="dark"
              eyebrow={locale === 'ar' ? 'مجموعات هِرّة' : 'Hirra rituals'}
              title={
                locale === 'ar' ? 'مجموعة واحدة. روتين كامل.' : 'One bundle. A whole ritual.'
              }
              description={
                locale === 'ar'
                  ? 'وفّري أكثر، حبّي أكثر — كل ما تحتاجينه لقطتك في مجموعة واحدة.'
                  : 'Save more, love more — everything your cat needs, in one set.'
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {bundles.map((b) => (
                <article
                  key={b.id}
                  className="group bg-cream text-walnut rounded-card overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="aspect-[4/3] bg-sand/40 overflow-hidden relative">
                    {b.image_url ? (
                      <img
                        src={b.image_url}
                        alt={locale === 'ar' ? b.name_ar : b.name_en}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-5xl text-walnut/30">
                        ◇
                      </div>
                    )}
                    {b.savings_sar ? (
                      <div className="absolute top-3 start-3 chip bg-emerald text-cream border-emerald">
                        {locale === 'ar' ? 'وفّري' : 'Save'} {formatSAR(b.savings_sar, locale)}
                      </div>
                    ) : null}
                  </div>
                  <div className="p-5 md:p-6 space-y-3">
                    <h3 className="text-lg font-semibold heading-display">
                      {locale === 'ar' ? b.name_ar : b.name_en}
                    </h3>
                    <p className="text-sm text-walnut/70 leading-relaxed clamp-2">
                      {locale === 'ar' ? b.description_ar : b.description_en}
                    </p>
                    <div className="flex items-baseline justify-between pt-2 border-t border-walnut/10">
                      <span className="text-xl font-bold text-emerald tabular">
                        {formatSAR(b.price_sar, locale)}
                      </span>
                      <span className="text-xs font-semibold text-walnut/55 uppercase tracking-wider">
                        {locale === 'ar' ? 'مجموعة' : 'Bundle'}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="primary"
                      size="md"
                      fullWidth
                      className="mt-1 font-semibold"
                      onClick={() => {
                        addLine({
                          bundle_id: b.id,
                          name_ar: b.name_ar,
                          name_en: b.name_en,
                          image_url: b.image_url ?? null,
                          slug: b.slug,
                          unit_price_sar: Number(b.price_sar),
                          quantity: 1,
                        });
                        navigate('/checkout');
                      }}
                    >
                      {locale === 'ar' ? 'اطلبي الآن' : 'Order now'}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* WHY HIRRA ======================================================= */}
      <section className="container-content section-y">
        <SectionHeading
          eyebrow={locale === 'ar' ? 'وعدنا' : 'Our promise'}
          title={locale === 'ar' ? 'لماذا هِرّة؟' : 'Why Hirra'}
          description={
            locale === 'ar'
              ? 'ثلاث وعود نسجّلها على ورقة كل طلب — لأن الثقة تُبنى بهدوء.'
              : 'Three promises printed on every order — because trust is built quietly.'
          }
          className="mb-12 md:mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {[
            {
              icon: Truck,
              titleAr: 'شحن سريع',
              titleEn: 'Fast shipping',
              descAr: 'توصيل ١-٣ أيام في الرياض وجدة والدمام — ٣-٥ أيام لباقي المدن.',
              descEn: '1–3 days in Riyadh, Jeddah, Dammam — 3–5 days for other cities.',
            },
            {
              icon: ShieldCheck,
              titleAr: 'ضمان رضا ٣٠ يوم',
              titleEn: '30-day guarantee',
              descAr: 'لو ما عجبك، نستلمه ونرجع لك فلوسك — كاملة، بدون تعقيد.',
              descEn: 'If it’s not right, we collect it and refund you in full — no questions.',
            },
            {
              icon: MessageSquare,
              titleAr: 'دعم سعودي',
              titleEn: 'Saudi support',
              descAr: 'نتكلم لغتك، نفهم بيتك، ونرد على واتساب بسرعة.',
              descEn: 'We speak your language, know your home, and reply on WhatsApp fast.',
            },
          ].map((feat) => (
            <div
              key={feat.titleEn}
              className="bg-whisper rounded-card border border-walnut/10 p-7 md:p-8 space-y-4 hover:shadow-card transition-shadow"
            >
              <div className="h-12 w-12 rounded-2xl bg-emerald/10 text-emerald grid place-items-center">
                <feat.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold heading-display text-walnut">
                {locale === 'ar' ? feat.titleAr : feat.titleEn}
              </h3>
              <p className="text-walnut/70 text-sm leading-relaxed">
                {locale === 'ar' ? feat.descAr : feat.descEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER'S NOTE ================================================== */}
      <section className="container-content section-y-tight">
        <FoundersNote />
      </section>

      {/* RE-ASSURANCE ROW + FINAL CTA ==================================== */}
      <section className="container-content pb-16 md:pb-24 space-y-10">
        <GuaranteePromise />

        <div className="text-center space-y-5 max-w-xl mx-auto pt-4">
          <Eyebrow>{locale === 'ar' ? 'ابدئي من هنا' : 'Start here'}</Eyebrow>
          <h2 className="text-h2 heading-display text-walnut text-balance">
            {locale === 'ar'
              ? 'قطتك، بيتك، عبايتك — كلهم يستاهلون الأفضل.'
              : 'Your cat. Your home. Your abaya. They all deserve better.'}
          </h2>
          <Button
            to="/products/hirra-pro-roller"
            variant="primary"
            size="xl"
            rightIcon={<ArrowRight className="h-5 w-5 rtl:rotate-180" />}
          >
            {locale === 'ar' ? 'تسوّقي البطلة' : 'Shop the hero'}
          </Button>
        </div>
      </section>
    </>
  );
}
