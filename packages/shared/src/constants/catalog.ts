/** RIYANALUXE storefront catalogue — only these SKUs may appear in the shop. */

export const HERO_SLUG = 'riyanaluxe-mabkhara-luxe' as const;

export const RIYANALUXE_PRODUCT_SLUGS = [
  'riyanaluxe-mabkhara-luxe',
  'riyanaluxe-pierre-seche',
  'riyanaluxe-armoire-seche',
] as const;

export type RiyanaluxeProductSlug = (typeof RIYANALUXE_PRODUCT_SLUGS)[number];

export const RIYANALUXE_BUNDLE_SLUGS = [
  'coffret-eid',
  'rituel-du-foyer',
  'maison-seche',
] as const;

export type RiyanaluxeBundleSlug = (typeof RIYANALUXE_BUNDLE_SLUGS)[number];

/** Retired slugs → canonical product URL (storefront redirects). */
export const LEGACY_PRODUCT_SLUG_REDIRECTS: Record<string, RiyanaluxeProductSlug> = {
  'riyana-mabkhara-luxe': 'riyanaluxe-mabkhara-luxe',
  'riyana-pierre-seche': 'riyanaluxe-pierre-seche',
  'riyana-armoire-seche': 'riyanaluxe-armoire-seche',
  'hirra-pro-roller': 'riyanaluxe-mabkhara-luxe',
  'hirra-honeycomb-mat': 'riyanaluxe-pierre-seche',
  'hirra-aurora-fountain': 'riyanaluxe-armoire-seche',
};

export const LEGACY_BUNDLE_SLUG_REDIRECTS: Record<string, RiyanaluxeBundleSlug> = {
  'hirra-trio': 'coffret-eid',
  'clean-home-bundle': 'rituel-du-foyer',
  'pampered-cat-set': 'maison-seche',
  'rituel-foyer': 'rituel-du-foyer',
  'garde-robe-maison': 'maison-seche',
};

export function isRiyanaluxeProductSlug(slug: string): slug is RiyanaluxeProductSlug {
  return (RIYANALUXE_PRODUCT_SLUGS as readonly string[]).includes(slug);
}

export function isRiyanaluxeBundleSlug(slug: string): slug is RiyanaluxeBundleSlug {
  return (RIYANALUXE_BUNDLE_SLUGS as readonly string[]).includes(slug);
}

export function resolveCanonicalProductSlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return LEGACY_PRODUCT_SLUG_REDIRECTS[slug] ?? slug;
}

export function resolveCanonicalBundleSlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  return LEGACY_BUNDLE_SLUG_REDIRECTS[slug] ?? slug;
}
