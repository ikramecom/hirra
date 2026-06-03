import {
  HERO_SLUG,
  isRiyanaluxeBundleSlug,
  isRiyanaluxeProductSlug,
  resolveCanonicalBundleSlug,
  resolveCanonicalProductSlug,
} from '@hirra/shared';
import type { Product, ProductImage, ProductVariant, ProductWithDetails } from '@hirra/shared';

import {
  getFallbackBundleBySlug,
  getFallbackProductBySlug,
  withLocalProductImageFallback,
} from '@/lib/fallback-data';
import { RIYANALUXE_ASSETS } from '@/lib/assets';

export { HERO_SLUG, resolveCanonicalProductSlug, resolveCanonicalBundleSlug };

const PRODUCT_IMAGE_FALLBACK: Record<string, string> = {
  'riyanaluxe-mabkhara-luxe': RIYANALUXE_ASSETS.products.mabkhara.main,
  'riyanaluxe-pierre-seche': RIYANALUXE_ASSETS.products.pierreSeche.main,
  'riyanaluxe-armoire-seche': RIYANALUXE_ASSETS.products.armoireSeche.main,
};

const VARIANT_IMAGE_BY_SKU: Record<string, string> = {
  'RYN-MBK-NOIR': RIYANALUXE_ASSETS.products.mabkhara.main,
  'RYN-MBK-OR': RIYANALUXE_ASSETS.products.mabkhara.gift,
};

function mergeVariantImages(
  variants: ProductVariant[],
  localVariants: ProductVariant[],
  productSlug: string,
): ProductVariant[] {
  const fallbackProduct = getFallbackProductBySlug(productSlug);
  const localById = new Map(localVariants.map((v) => [v.id, v]));
  const localBySku = new Map(localVariants.filter((v) => v.sku).map((v) => [v.sku!, v]));

  return variants.map((v) => {
    const local = localById.get(v.id) ?? (v.sku ? localBySku.get(v.sku) : undefined);
    const image_url =
      local?.image_url ??
      v.image_url ??
      (v.sku ? VARIANT_IMAGE_BY_SKU[v.sku] : undefined) ??
      fallbackProduct?.variants.find((fv) => fv.id === v.id || fv.sku === v.sku)?.image_url ??
      null;
    return image_url ? { ...v, image_url } : v;
  });
}

export function getProductImageFallbackUrl(slug: string): string {
  const canonical = resolveCanonicalProductSlug(slug) ?? slug;
  return PRODUCT_IMAGE_FALLBACK[canonical] ?? RIYANALUXE_ASSETS.products.mabkhara.main;
}

export function toProductWithDetails(
  row: Product & {
    product_images?: ProductImage[] | null;
    product_variants?: ProductVariant[] | null;
    images?: ProductImage[];
    variants?: ProductVariant[];
  },
): ProductWithDetails {
  const withImages = withLocalProductImageFallback({
    ...row,
    product_images: row.product_images ?? row.images ?? [],
  });

  return normalizeProductDisplay({
    ...withImages,
    images: withImages.product_images ?? row.images ?? [],
    variants: withImages.product_variants ?? row.variants ?? [],
  } as ProductWithDetails);
}

/** Guarantees images + variants arrays for safe rendering. */
export function normalizeProductDisplay(product: ProductWithDetails): ProductWithDetails {
  const slug = product.slug;
  let images = Array.isArray(product.images) ? [...product.images] : [];

  if (images.length === 0 && isRiyanaluxeProductSlug(slug)) {
    images = [
      {
        id: `fallback-${product.id}`,
        product_id: product.id,
        url: getProductImageFallbackUrl(slug),
        alt_ar: product.name_ar,
        alt_en: product.name_en,
        display_order: 1,
        is_primary: true,
      },
    ];
  }

  let variants = Array.isArray(product.variants)
    ? product.variants.filter((v) => v.is_active)
    : [];

  const local = getFallbackProductBySlug(slug);
  if (variants.length > 0 && local) {
    variants = mergeVariantImages(variants, local.variants, slug);
  } else if (variants.length === 0 && local?.variants.length) {
    variants = local.variants;
  }

  const { product_images: _pi, product_variants: _pv, ...rest } = product as ProductWithDetails & {
    product_images?: ProductImage[];
    product_variants?: ProductVariant[];
  };

  return { ...rest, images, variants };
}

export function mergeWithLocalProduct(
  remote: ProductWithDetails | null,
  local: ProductWithDetails | null,
): ProductWithDetails | null {
  if (!remote && !local) return null;
  if (!remote) return local ? normalizeProductDisplay(local) : null;
  if (!local) return normalizeProductDisplay(remote);

  const remoteImages = Array.isArray(remote.images) ? remote.images : [];
  const localImages = Array.isArray(local.images) ? local.images : [];
  const remoteVariants = Array.isArray(remote.variants) ? remote.variants : [];
  const localVariants = Array.isArray(local.variants) ? local.variants : [];

  const slug = remote.slug ?? local.slug;
  const mergedVariants =
    remoteVariants.length > 0
      ? mergeVariantImages(remoteVariants, localVariants, slug)
      : localVariants;

  return normalizeProductDisplay({
    ...local,
    ...remote,
    images: remoteImages.length > 0 ? remoteImages : localImages,
    variants: mergedVariants,
  });
}

/** Always returns a display-ready product for allowed slugs, or null. */
export function loadProductForSlug(slug: string | undefined): ProductWithDetails | null {
  const canonical = resolveCanonicalProductSlug(slug);
  if (!canonical || !isRiyanaluxeProductSlug(canonical)) return null;
  const product = getFallbackProductBySlug(canonical);
  return product ? normalizeProductDisplay(product) : null;
}

export function loadBundleForSlug(slug: string | undefined) {
  const canonical = resolveCanonicalBundleSlug(slug);
  if (!canonical || !isRiyanaluxeBundleSlug(canonical)) return null;
  return getFallbackBundleBySlug(canonical);
}

export function isBundleSlug(slug: string | undefined): boolean {
  if (!slug) return false;
  const canonical = resolveCanonicalBundleSlug(slug);
  return Boolean(canonical && isRiyanaluxeBundleSlug(canonical));
}

export function scrollToSection(sectionId: string): void {
  const el = document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
