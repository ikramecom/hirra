/**
 * RIYANALUXE local catalogue — mirrors supabase/migrations/008_riyana_magreb_catalog.sql
 * Prices in `price_sar` are Moroccan dirhams (MAD).
 */

import {
  HERO_SLUG,
  LEGACY_BUNDLE_SLUG_REDIRECTS,
  LEGACY_PRODUCT_SLUG_REDIRECTS,
  RIYANALUXE_BUNDLE_SLUGS,
  RIYANALUXE_PRODUCT_SLUGS,
  isRiyanaluxeBundleSlug,
  isRiyanaluxeProductSlug,
} from '@hirra/shared';
import type {
  Bundle,
  BundleWithProducts,
  Product,
  ProductImage,
  ProductVariant,
  ProductWithDetails,
  Review,
} from '@hirra/shared';

import { RIYANALUXE_ASSETS } from '@/lib/assets';

export { HERO_SLUG };

const NOW = new Date().toISOString();

export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return false;
  if (url.includes('test.supabase.co')) return false;
  if (key === 'test' || key.length < 20) return false;
  return true;
}

type ProductImageEntry = { url: string; alt_ar: string; alt_en: string };

const PRODUCT_IMAGES: Record<string, ProductImageEntry[]> = {
  'riyanaluxe-mabkhara-luxe': [
    {
      url: RIYANALUXE_ASSETS.products.mabkhara.main,
      alt_ar: 'ريانا لوكس — مبخرة لوكس',
      alt_en: 'RIYANALUXE Mabkhara Luxe',
    },
    {
      url: RIYANALUXE_ASSETS.products.mabkhara.closeup,
      alt_ar: 'تفاصيل المبخرة مع دخان البخور',
      alt_en: 'Mabkhara close-up with bakhoor smoke',
    },
    {
      url: RIYANALUXE_ASSETS.products.mabkhara.gift,
      alt_ar: 'تغليف هدية فاخر',
      alt_en: 'Luxury gift presentation',
    },
    {
      url: RIYANALUXE_ASSETS.products.mabkhara.salon,
      alt_ar: 'طقوس الضيافة في صالون مغربي',
      alt_en: 'Moroccan salon hospitality ritual',
    },
  ],
  'riyanaluxe-pierre-seche': [
    {
      url: RIYANALUXE_ASSETS.products.pierreSeche.main,
      alt_ar: 'ريانا لوكس — بيير سيك',
      alt_en: 'RIYANALUXE Pierre Sèche',
    },
    {
      url: RIYANALUXE_ASSETS.products.pierreSeche.demo,
      alt_ar: 'بساط حمام يجف في ثوانٍ',
      alt_en: 'Quick-dry stone bath mat',
    },
  ],
  'riyanaluxe-armoire-seche': [
    {
      url: RIYANALUXE_ASSETS.products.armoireSeche.main,
      alt_ar: 'ريانا لوكس — أرمور سيك',
      alt_en: 'RIYANALUXE Armoire Sèche',
    },
    {
      url: RIYANALUXE_ASSETS.products.armoireSeche.closet,
      alt_ar: 'دولاب محمي من الرطوبة',
      alt_en: 'Wardrobe protected from humidity',
    },
  ],
};

export function isMissingOrPlaceholderProductImageUrl(url: string | null | undefined): boolean {
  const u = (url ?? '').trim();
  if (!u) return true;
  if (/placehold\.co/i.test(u)) return true;
  if (/\.svg$/i.test(u) && !u.includes('/images/riyana/')) return true;
  return false;
}

export function withLocalProductImageFallback<T extends Product & { product_images: ProductImage[] }>(
  product: T,
): T {
  if (!isRiyanaluxeProductSlug(product.slug)) return product;
  const local = PRODUCT_IMAGES[product.slug];
  if (!local) return product;
  const existing = product.product_images ?? [];
  if (existing.length === 0 || existing.every((img) => isMissingOrPlaceholderProductImageUrl(img.url))) {
    return {
      ...product,
      product_images: local.map((entry, i) => ({
        id: `local-${product.id}-${i}`,
        product_id: product.id,
        url: entry.url,
        alt_ar: entry.alt_ar,
        alt_en: entry.alt_en,
        display_order: i + 1,
        is_primary: i === 0,
      })),
    } as T;
  }
  return {
    ...product,
    product_images: existing.map((img, i) =>
      isMissingOrPlaceholderProductImageUrl(img.url) && local[i]
        ? { ...img, url: local[i].url, alt_ar: local[i].alt_ar, alt_en: local[i].alt_en }
        : img,
    ),
  } as T;
}

function makeImages(productId: string, slug: string): ProductImage[] {
  const entries = PRODUCT_IMAGES[slug] ?? [];
  return entries.map((entry, i) => ({
    id: `img-${productId}-${i}`,
    product_id: productId,
    url: entry.url,
    alt_ar: entry.alt_ar,
    alt_en: entry.alt_en,
    display_order: i + 1,
    is_primary: i === 0,
  }));
}

const MABKHARA_VARIANTS: ProductVariant[] = [
  {
    id: 'var-mbk-noir',
    product_id: 'prod-riyanaluxe-mabkhara',
    name_ar: 'أسود مطفي',
    name_en: 'Matte Noir',
    sku: 'RYN-MBK-NOIR',
    image_url: RIYANALUXE_ASSETS.products.mabkhara.main,
    inventory_count: 40,
    is_active: true,
    display_order: 1,
  },
  {
    id: 'var-mbk-or',
    product_id: 'prod-riyanaluxe-mabkhara',
    name_ar: 'ذهبي رملي',
    name_en: 'Sable Gold',
    sku: 'RYN-MBK-OR',
    image_url: RIYANALUXE_ASSETS.products.mabkhara.gift,
    inventory_count: 25,
    is_active: true,
    display_order: 2,
  },
];

export const FALLBACK_PRODUCTS: Array<Product & { product_images: ProductImage[] }> = [
  {
    id: 'prod-riyanaluxe-mabkhara',
    slug: 'riyanaluxe-mabkhara-luxe',
    name_ar: 'ريانا لوكس — مبخرة لوكس',
    name_en: 'RIYANALUXE Mabkhara Luxe',
    subtitle_ar: 'بخور عصري بلا فحم — عبق الدار وكرم الضيافة',
    subtitle_en: 'Smokeless ritual — art of hospitality',
    description_ar:
      'مبخرة كهربائية فاخرة بتسخين سريع، قفل أمان، ومنفذ Type-C. تصميم أسود مطفي مع تفاصيل ذهبية — للصالون، العيد، والهدايا التي تُذكر.',
    description_en:
      'Premium electric mabkhara with rapid heat, safety lock, and Type-C charging. Matte black with gold details.',
    price_sar: 249,
    compare_at_price_sar: 349,
    cost_sar: 95,
    sku: 'RYN-MBK-001',
    inventory_count: 80,
    is_active: true,
    is_hero: true,
    display_order: 1,
    created_at: NOW,
    updated_at: NOW,
    product_images: makeImages('prod-riyanaluxe-mabkhara', 'riyanaluxe-mabkhara-luxe'),
  },
  {
    id: 'prod-riyanaluxe-pierre',
    slug: 'riyanaluxe-pierre-seche',
    name_ar: 'ريانا لوكس — بيير سيك',
    name_en: 'RIYANALUXE Pierre Sèche',
    subtitle_ar: 'حجر طبيعي يشرب الماء في ثوانٍ',
    subtitle_en: 'Natural stone — water vanishes in seconds',
    description_ar:
      'بساط حمام من حجر الدياتوميت: امتصاص فوري، مانع للانزلاق، ومظهر فندقي يليق بمنزلك المغربي.',
    description_en: 'Diatomite quick-dry stone bath mat: instant dry, anti-slip base.',
    price_sar: 249,
    compare_at_price_sar: 349,
    cost_sar: 55,
    sku: 'RYN-STM-001',
    inventory_count: 100,
    is_active: true,
    is_hero: false,
    display_order: 2,
    created_at: NOW,
    updated_at: NOW,
    product_images: makeImages('prod-riyanaluxe-pierre', 'riyanaluxe-pierre-seche'),
  },
  {
    id: 'prod-riyanaluxe-armoire',
    slug: 'riyanaluxe-armoire-seche',
    name_ar: 'ريانا لوكس — أرمور سيك',
    name_en: 'RIYANALUXE Armoire Sèche',
    subtitle_ar: 'مزيل رطوبة الدولاب — صامت وأنيق',
    subtitle_en: 'Wardrobe dehumidifier — quiet & refined',
    description_ar:
      'جهاز مدمج يحمي ملابسك من الرطوبة والرائحة الكريهة — مثالي للمدن الساحلية.',
    description_en: 'Compact closet mini dehumidifier for humid coastal homes.',
    price_sar: 449,
    compare_at_price_sar: 549,
    cost_sar: 110,
    sku: 'RYN-DSH-001',
    inventory_count: 60,
    is_active: true,
    is_hero: false,
    display_order: 3,
    created_at: NOW,
    updated_at: NOW,
    product_images: makeImages('prod-riyanaluxe-armoire', 'riyanaluxe-armoire-seche'),
  },
];

const PRODUCT_VARIANTS_BY_SLUG: Record<string, ProductVariant[]> = {
  'riyanaluxe-mabkhara-luxe': MABKHARA_VARIANTS,
  'riyanaluxe-pierre-seche': [],
  'riyanaluxe-armoire-seche': [],
};

export function getFallbackProductBySlug(slug: string): ProductWithDetails | null {
  const canonical = LEGACY_PRODUCT_SLUG_REDIRECTS[slug] ?? slug;
  const product = FALLBACK_PRODUCTS.find((p) => p.slug === canonical);
  if (!product) return null;
  const { product_images, ...rest } = product;
  return {
    ...rest,
    images: product_images,
    variants: PRODUCT_VARIANTS_BY_SLUG[canonical] ?? [],
  };
}

export function getFallbackBundleBySlug(slug: string): BundleWithProducts | null {
  const canonical = LEGACY_BUNDLE_SLUG_REDIRECTS[slug] ?? slug;
  return FALLBACK_BUNDLES.find((b) => b.slug === canonical) ?? null;
}

const BUNDLE_IMAGES: Record<string, string> = {
  'rituel-du-foyer': RIYANALUXE_ASSETS.bundles.rituelFoyer,
  'coffret-eid': RIYANALUXE_ASSETS.bundles.coffretEid,
  'maison-seche': RIYANALUXE_ASSETS.bundles.maisonSeche,
};

export function withLocalBundleImageFallback<T extends Bundle>(bundle: T): T {
  if (!isRiyanaluxeBundleSlug(bundle.slug)) return bundle;
  if (!isMissingOrPlaceholderProductImageUrl(bundle.image_url)) return bundle;
  const local = BUNDLE_IMAGES[bundle.slug];
  if (!local) return bundle;
  return { ...bundle, image_url: local } as T;
}

const BUNDLE_BASE: Bundle[] = [
  {
    id: 'bundle-rituel',
    slug: 'rituel-du-foyer',
    name_ar: 'طقس الضيافة',
    name_en: 'Rituel d\'Hospitalité',
    description_ar: 'مبخرة لوكس + بيير سيك',
    description_en: 'Mabkhara Luxe + Pierre Sèche',
    price_sar: 399,
    savings_sar: 99,
    image_url: BUNDLE_IMAGES['rituel-du-foyer'],
    is_active: true,
    display_order: 1,
  },
  {
    id: 'bundle-eid',
    slug: 'coffret-eid',
    name_ar: 'ليالي ريانا',
    name_en: 'Nuits Riyana',
    description_ar: 'مبخرة لوكس + بيير سيك + أرمور سيك',
    description_en: 'Mabkhara Luxe + Pierre Sèche + Armoire Sèche',
    price_sar: 599,
    savings_sar: 348,
    image_url: BUNDLE_IMAGES['coffret-eid'],
    is_active: true,
    display_order: 2,
  },
  {
    id: 'bundle-maison',
    slug: 'maison-seche',
    name_ar: 'لمسة فخامة',
    name_en: 'Touche de Prestige',
    description_ar: 'بيير سيك + أرمور سيك',
    description_en: 'Pierre Sèche + Armoire Sèche',
    price_sar: 499,
    savings_sar: 199,
    image_url: BUNDLE_IMAGES['maison-seche'],
    is_active: true,
    display_order: 3,
  },
];

const BUNDLE_SLUGS: Record<string, string[]> = {
  'rituel-du-foyer': ['riyanaluxe-mabkhara-luxe', 'riyanaluxe-pierre-seche'],
  'coffret-eid': ['riyanaluxe-mabkhara-luxe', 'riyanaluxe-pierre-seche', 'riyanaluxe-armoire-seche'],
  'maison-seche': ['riyanaluxe-pierre-seche', 'riyanaluxe-armoire-seche'],
};

export const FALLBACK_BUNDLES: BundleWithProducts[] = BUNDLE_BASE.filter((b) =>
  isRiyanaluxeBundleSlug(b.slug),
).map((b) => ({
  ...b,
  products: (BUNDLE_SLUGS[b.slug] ?? [])
    .map((productSlug) => {
      const p = getFallbackProductBySlug(productSlug);
      if (!p) return null;
      const { images: _i, variants: _v, ...row } = p;
      return { ...row, quantity: 1 };
    })
    .filter((p): p is NonNullable<typeof p> => Boolean(p)),
}));

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
    'rev-mbk-1',
    'prod-riyanaluxe-mabkhara',
    'سلمى',
    'الدار البيضاء',
    5,
    'هدية العيد المثالية',
    'شريتها لأمي فالعيد — البخور يتسخن بسرعة والتغليف يبان غالي. ضيوف الدار كيعجبهم بزاف.',
    1,
  ),
  review(
    'rev-mbk-2',
    'prod-riyanaluxe-mabkhara',
    'ياسمين',
    'الرباط',
    5,
    'بلا فحم، بلا فوضى',
    'أخيراً مبخرة ما كتوسخ الصالون. التصميم أسود وذهبي كيمشي مع الديكور ديالي.',
    2,
  ),
  review(
    'rev-mbk-3',
    'prod-riyanaluxe-mabkhara',
    'نادية',
    'مراكش',
    5,
    'ريحة الدار تبدل',
    'من بعد ما بديت نخدمها كل ليلة، الصالون كيبان فندق. التوصيل كان سريع والدفع عند التسليم.',
    3,
  ),
  review(
    'rev-pierre-1',
    'prod-riyanaluxe-pierre',
    'هبة',
    'طنجة',
    5,
    'الحمام ولى جاف',
    'الماء كيمشي فثواني — مابقاتش البساطة مبلولة. شي فخم بصح.',
    1,
  ),
  review(
    'rev-armoire-1',
    'prod-riyanaluxe-armoire',
    'ليلى',
    'الدار البيضاء',
    5,
    'الدولاب بلا ريحة',
    'فكرة ما كنتش نعرفها — الماء كيتجمع فالخزان والعبايات بقاو ناشفين.',
    1,
  ),
];

export function getFallbackReviewsForProduct(productId: string): Review[] {
  return FALLBACK_REVIEWS.filter((r) => r.product_id === productId);
}

/** Allowed storefront SKUs (for defensive filtering). */
export const ALLOWED_PRODUCT_SLUGS = RIYANALUXE_PRODUCT_SLUGS;
export const ALLOWED_BUNDLE_SLUGS = RIYANALUXE_BUNDLE_SLUGS;
