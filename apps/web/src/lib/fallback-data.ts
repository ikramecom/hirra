/**
 * Local fallback catalogue.
 *
 * Used by the storefront when Supabase isn't connected yet (e.g. local preview
 * with the placeholder VITE_SUPABASE_URL=https://test.supabase.co), or when a
 * Supabase query fails for any reason.
 *
 * Mirrors `supabase/migrations/004_seed_data.sql` — keep them in sync if you
 * change product copy or pricing.
 */

import type {
  Bundle,
  BundleWithProducts,
  Product,
  ProductImage,
  ProductVariant,
  ProductWithDetails,
  Review,
} from '@hirra/shared';

const NOW = new Date().toISOString();

/* -------------------------------------------------------------------------- */
/* Detect whether Supabase is "really" configured                              */
/* -------------------------------------------------------------------------- */

/**
 * Returns true only when the env vars look like a real Supabase project
 * (anything other than the placeholder `test` / `test.supabase.co` values).
 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !key) return false;
  if (url.includes('test.supabase.co')) return false;
  if (key === 'test' || key.length < 20) return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Editorial product photography lives in `/public/brand/`. Each entry is the
 * cover shot for a product and is wired below into `FALLBACK_PRODUCTS`. The
 * shape stays compatible with the Supabase `product_images` rows, so when
 * real Supabase data ships these locally-bundled URLs are simply replaced.
 */
const PRODUCT_IMAGES: Record<string, { url: string; alt_ar: string; alt_en: string }> = {
  'hirra-pro-roller': {
    url: '/brand/hirra-pro-roller.png',
    alt_ar: 'هِرّة برو رولر — سيليكون فاخر بلون زيتي على عباية سوداء حريرية',
    alt_en: 'Hirra Pro Roller — premium olive silicone resting on a folded black silk abaya',
  },
  'hirra-honeycomb-mat': {
    url: '/brand/hirra-honeycomb-mat.png',
    alt_ar: 'حصيرة هِرّة العسلية لحبس الرمل — على رخام سعودي',
    alt_en: 'Hirra Honeycomb Litter Trap Mat — on Saudi marble flooring',
  },
  'hirra-aurora-fountain': {
    url: '/brand/hirra-aurora-fountain.png',
    alt_ar: 'نافورة هِرّة أورورا — تصميم سيراميك فاخر مع تفاصيل نحاسية',
    alt_en: 'Hirra Aurora Fountain — premium ceramic with brass detailing',
  },
};

/** True when URL is empty or a generated placeholder — use local /brand/ assets instead. */
export function isMissingOrPlaceholderProductImageUrl(
  url: string | null | undefined,
): boolean {
  const u = (url ?? '').trim();
  if (!u) return true;
  if (/placehold\.co/i.test(u)) return true;
  return false;
}

/**
 * When Supabase `product_images` rows omit URLs or still point at placeholders,
 * merge in the original local `/brand/` photography by product slug.
 */
export function withLocalProductImageFallback<T extends Product & { product_images: ProductImage[] }>(
  product: T,
): T {
  const local = PRODUCT_IMAGES[product.slug];
  if (!local) return product;

  const existing = product.product_images ?? [];
  if (existing.length === 0) {
    return {
      ...product,
      product_images: [
        {
          id: `local-fallback-${product.id}`,
          product_id: product.id,
          url: local.url,
          alt_ar: local.alt_ar,
          alt_en: local.alt_en,
          display_order: 1,
          is_primary: true,
        },
      ],
    } as T;
  }

  const mapped = existing.map((img) =>
    isMissingOrPlaceholderProductImageUrl(img.url)
      ? { ...img, url: local.url, alt_ar: local.alt_ar, alt_en: local.alt_en }
      : img,
  );

  return { ...product, product_images: mapped } as T;
}

function makeImage(productId: string, slug: string, fallbackLabel: string): ProductImage {
  const entry = PRODUCT_IMAGES[slug];
  return {
    id: `img-${productId}`,
    product_id: productId,
    url:
      entry?.url ??
      `https://placehold.co/1080x1080/F4ECE0/0E5C42?text=${encodeURIComponent(fallbackLabel)}`,
    alt_ar: entry?.alt_ar ?? fallbackLabel,
    alt_en: entry?.alt_en ?? fallbackLabel,
    display_order: 1,
    is_primary: true,
  };
}

const ROLLER_VARIANTS: ProductVariant[] = [
  {
    id: 'var-roller-olive',
    product_id: 'prod-hirra-pro-roller',
    name_ar: 'زيتي',
    name_en: 'Olive',
    sku: 'HRR-PRO-001-OLV',
    inventory_count: 20,
    is_active: true,
    display_order: 1,
  },
  {
    id: 'var-roller-cream',
    product_id: 'prod-hirra-pro-roller',
    name_ar: 'كريمي',
    name_en: 'Cream',
    sku: 'HRR-PRO-001-CRM',
    inventory_count: 20,
    is_active: true,
    display_order: 2,
  },
  {
    id: 'var-roller-walnut',
    product_id: 'prod-hirra-pro-roller',
    name_ar: 'بني داكن',
    name_en: 'Walnut',
    sku: 'HRR-PRO-001-WAL',
    inventory_count: 10,
    is_active: true,
    display_order: 3,
  },
];

export const FALLBACK_PRODUCTS: Array<Product & { product_images: ProductImage[] }> = [
  {
    id: 'prod-hirra-pro-roller',
    slug: 'hirra-pro-roller',
    name_ar: 'هِرّة برو — رولر شعر القطط',
    name_en: 'Hirra Pro Lint-Free Cat Hair Roller',
    subtitle_ar: 'رولر سيليكون فاخر، قابل لإعادة الاستخدام',
    subtitle_en: 'Premium reusable silicone — for the Saudi home',
    description_ar:
      'هِرّة برو رولر مصمم خصيصاً للبيت السعودي. سيليكون فاخر يلتقط شعر القطط بسحبة واحدة. قابل لإعادة الاستخدام إلى الأبد — لا أوراق لاصقة، لا هدر. آمن للعباية السوداء، السوفا المخمل، وكل أقمشة بيتك.',
    description_en:
      'The Hirra Pro Roller is designed for the Saudi home. Premium food-grade silicone picks up cat hair in a single swipe. Reusable forever — no sticky paper, no waste. Safe on black abayas, velvet majlis sofas, and every fabric in your home.',
    price_sar: 99,
    compare_at_price_sar: 129,
    cost_sar: 18,
    sku: 'HRR-PRO-001',
    inventory_count: 50,
    is_active: true,
    is_hero: true,
    display_order: 1,
    created_at: NOW,
    updated_at: NOW,
    product_images: [makeImage('prod-hirra-pro-roller', 'hirra-pro-roller', 'Hirra+Pro')],
  },
  {
    id: 'prod-hirra-honeycomb-mat',
    slug: 'hirra-honeycomb-mat',
    name_ar: 'حصيرة هِرّة العسلية لحبس الرمل',
    name_en: 'Hirra Honeycomb Litter Trap Mat XL',
    subtitle_ar: 'حصيرة مزدوجة الطبقات تحبس كل حبة رمل',
    subtitle_en: 'Double-layer mat that traps every grain',
    description_ar:
      'حصيرة هِرّة العسلية بحجم XL (٧٥×٦٠ سم) تحبس كل حبة رمل قبل ما توصل لرخام بيتك. طبقتين: علوية بفتحات عسلية، وسفلية مقاومة للماء وعازلة للانزلاق. سهلة التنظيف بالنفض.',
    description_en:
      'The Hirra Honeycomb Mat XL (75×60 cm) traps every grain of litter before it reaches your marble floors. Two layers: a honeycomb top and a waterproof non-slip bottom. Clean it with a simple shake.',
    price_sar: 119,
    compare_at_price_sar: 149,
    cost_sar: 28,
    sku: 'HRR-MAT-001',
    inventory_count: 30,
    is_active: true,
    is_hero: false,
    display_order: 2,
    created_at: NOW,
    updated_at: NOW,
    product_images: [makeImage('prod-hirra-honeycomb-mat', 'hirra-honeycomb-mat', 'Hirra+Mat')],
  },
  {
    id: 'prod-hirra-aurora-fountain',
    slug: 'hirra-aurora-fountain',
    name_ar: 'نافورة هِرّة أورورا للقطط',
    name_en: 'Hirra Aurora Cat Water Fountain',
    subtitle_ar: 'نافورة هادئة بإضاءة LED — تشتغل ٣٠ يوم بشحنة واحدة',
    subtitle_en: 'Silent LED fountain — 30 days per charge',
    description_ar:
      'نافورة هِرّة أورورا — ماء بارد متجدد لقطتك في حر الرياض. مضخة هادئة (٢٥ ديسيبل)، فلتر كربون نشط قابل للاستبدال، إضاءة LED ناعمة تشتغل بالحركة، وسعة ٢.٥ لتر. تعمل بشحن USB — آمنة وعملية لكل بيت سعودي.',
    description_en:
      'Hirra Aurora Fountain — cool, filtered, flowing water for your cat in the Riyadh heat. Silent pump (25 dB), replaceable activated carbon filter, motion-activated soft LED, 2.5L capacity. USB-powered — safe and practical for every Saudi home.',
    price_sar: 229,
    compare_at_price_sar: 279,
    cost_sar: 65,
    sku: 'HRR-FNT-001',
    inventory_count: 20,
    is_active: true,
    is_hero: false,
    display_order: 3,
    created_at: NOW,
    updated_at: NOW,
    product_images: [
      makeImage('prod-hirra-aurora-fountain', 'hirra-aurora-fountain', 'Hirra+Aurora'),
    ],
  },
];

const PRODUCT_VARIANTS_BY_SLUG: Record<string, ProductVariant[]> = {
  'hirra-pro-roller': ROLLER_VARIANTS,
  'hirra-honeycomb-mat': [],
  'hirra-aurora-fountain': [],
};

/**
 * Get a single product (with `images` + `variants`) by slug from the local
 * fallback. Returns null if no product matches.
 */
export function getFallbackProductBySlug(slug: string): ProductWithDetails | null {
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  const { product_images, ...rest } = product;
  return {
    ...rest,
    images: product_images,
    variants: PRODUCT_VARIANTS_BY_SLUG[slug] ?? [],
  };
}

/* -------------------------------------------------------------------------- */
/* Bundles                                                                     */
/* -------------------------------------------------------------------------- */

const BUNDLE_IMAGE_BASE = 'https://placehold.co/1200x900/F4ECE0/0E5C42';

/**
 * Until we shoot dedicated bundle stills (Phase-2 supplier shoot), each
 * bundle reuses the most evocative single-product shot in its set.
 */
const BUNDLE_IMAGES: Record<string, string> = {
  'hirra-trio': '/brand/hero-living-room.png',
  'clean-home-bundle': '/brand/hirra-honeycomb-mat.png',
  'pampered-cat-set': '/brand/hirra-aurora-fountain.png',
};

/**
 * When `bundles.image_url` from Supabase is empty or a placeholder, use the
 * same local assets as `FALLBACK_BUNDLES` (hero + product photography).
 */
export function withLocalBundleImageFallback<T extends Bundle>(bundle: T): T {
  if (!isMissingOrPlaceholderProductImageUrl(bundle.image_url)) return bundle;
  const local = BUNDLE_IMAGES[bundle.slug];
  if (!local) return bundle;
  return { ...bundle, image_url: local } as T;
}

function bundleImage(slug: string, fallbackLabel: string) {
  return BUNDLE_IMAGES[slug] ?? `${BUNDLE_IMAGE_BASE}?text=${encodeURIComponent(fallbackLabel)}`;
}

const BUNDLE_BASE: Bundle[] = [
  {
    id: 'bundle-hirra-trio',
    slug: 'hirra-trio',
    name_ar: 'مجموعة هِرّة الثلاثية',
    name_en: 'The Hirra Trio',
    description_ar: 'البطل الكامل — الرولر + الحصيرة + النافورة في مجموعة واحدة فاخرة، بسعر خاص.',
    description_en:
      'The complete cat-mom kit — roller + mat + fountain in one premium bundle, at a special price.',
    price_sar: 397,
    savings_sar: 50,
    image_url: bundleImage('hirra-trio', 'Hirra+Trio'),
    is_active: true,
    display_order: 1,
  },
  {
    id: 'bundle-clean-home',
    slug: 'clean-home-bundle',
    name_ar: 'مجموعة البيت النظيف',
    name_en: 'The Clean-Home Bundle',
    description_ar: 'بيت نظيف، قطة سعيدة. الرولر + الحصيرة بسعر مجموعة.',
    description_en: 'Clean home, happy cat. The Roller + Mat at a bundle price.',
    price_sar: 189,
    savings_sar: 29,
    image_url: bundleImage('clean-home-bundle', 'Clean+Home'),
    is_active: true,
    display_order: 2,
  },
  {
    id: 'bundle-pampered',
    slug: 'pampered-cat-set',
    name_ar: 'مجموعة الدلال',
    name_en: 'The Pampered Cat Set',
    description_ar: 'دلال على دلال. الرولر + النافورة لقطتك المدللة.',
    description_en: 'Spoiled, with love. The Roller + Fountain for your pampered cat.',
    price_sar: 289,
    savings_sar: 39,
    image_url: bundleImage('pampered-cat-set', 'Pampered+Set'),
    is_active: true,
    display_order: 3,
  },
];

const BUNDLE_PRODUCT_SLUGS: Record<string, string[]> = {
  'hirra-trio': ['hirra-pro-roller', 'hirra-honeycomb-mat', 'hirra-aurora-fountain'],
  'clean-home-bundle': ['hirra-pro-roller', 'hirra-honeycomb-mat'],
  'pampered-cat-set': ['hirra-pro-roller', 'hirra-aurora-fountain'],
};

export const FALLBACK_BUNDLES: BundleWithProducts[] = BUNDLE_BASE.map((b) => ({
  ...b,
  products: (BUNDLE_PRODUCT_SLUGS[b.slug] ?? [])
    .map((slug) => FALLBACK_PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof FALLBACK_PRODUCTS)[number] => Boolean(p))
    .map((p) => ({
      ...p,
      quantity: 1,
    })),
}));

/* -------------------------------------------------------------------------- */
/* Reviews                                                                     */
/* -------------------------------------------------------------------------- */

function review(
  id: string,
  productId: string,
  customer_name: string,
  customer_city: string | null,
  rating: number,
  title_ar: string | null,
  body_ar: string,
  display_order: number,
): Review {
  return {
    id,
    product_id: productId,
    order_id: null,
    customer_name,
    customer_city,
    rating,
    title_ar,
    body_ar,
    image_urls: [],
    is_verified: true,
    is_published: true,
    display_order,
    created_at: NOW,
  };
}

export const FALLBACK_REVIEWS: Review[] = [
  review(
    'rev-roller-1',
    'prod-hirra-pro-roller',
    'نورة',
    'الرياض',
    5,
    'أنقذني قبل الحفلات',
    'اشتريتها قبل أسبوع. الرولر ده أنقذني قبل الحفلات — كنت أمشي وعليّ شعر القطة وأنا ما أحس. هِرّة برو غيّر كل شي. والتغليف فخم. أوصي بها بقوة 💚',
    1,
  ),
  review(
    'rev-roller-2',
    'prod-hirra-pro-roller',
    'سارة',
    'جدة',
    5,
    'أول رولر يضبط معاي',
    'عندي ٣ قطط شيرازي وشعرهم في كل مكان. جربت كل أنواع الرولرات من أمازون، ما واحد ضبط معاي. هذا أول رولر يجمع الشعر فعلاً وما يحتاج لصقات.',
    2,
  ),
  review(
    'rev-roller-3',
    'prod-hirra-pro-roller',
    'ريما',
    'الدمام',
    4,
    'خدمة سعودية حقيقية',
    'جودة ممتازة، التغليف فخم، والخدمة على واتساب سريعة جداً. خصمت نجمة فقط لأن اللون اللي طلبته كان مختلف شوي عن الصورة — بس لما تواصلت معاهم، استبدلوا فوراً.',
    3,
  ),
  review(
    'rev-roller-4',
    'prod-hirra-pro-roller',
    'مايا',
    'الرياض',
    5,
    'هدية مثالية',
    'أهديته لأختي اللي عندها قطتها قمر، ومن يومها وهي تشكرني. التغليف يحس لك إنه من براند فاخر، مش دروبشيبنغ عادي.',
    4,
  ),
  review(
    'rev-roller-5',
    'prod-hirra-pro-roller',
    'علا',
    'الخبر',
    5,
    'يستاهل كل ريال',
    'أعمل في شركة وما أقدر أمشي وعليّ شعر القطة. الرولر ده وفّر علي كل صباح. بصراحة، يستاهل كل ريال.',
    5,
  ),
  review(
    'rev-mat-1',
    'prod-hirra-honeycomb-mat',
    'هند',
    'الرياض',
    5,
    'وقفت رمل القطة عن المرمر',
    'الحصيرة كبيرة وتمسك الرمل تماماً. الرخام عندي نضيف لأول مرة من زمان. مع ضمان رضا فعلاً يطمنك.',
    1,
  ),
  review(
    'rev-fountain-1',
    'prod-hirra-aurora-fountain',
    'دانة',
    'جدة',
    5,
    'قطتي صارت تشرب أكثر',
    'النافورة هادية فعلاً وقطتي تشرب منها أكثر بكثير من الصحن العادي. الإضاءة جميلة وما تحتاج كهرباء — USB فقط.',
    1,
  ),
];

export function getFallbackReviewsForProduct(productId: string): Review[] {
  return FALLBACK_REVIEWS.filter((r) => r.product_id === productId);
}
