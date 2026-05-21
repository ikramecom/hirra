import type { CartLine, CheckoutItem } from '@hirra/shared';

import { supabase } from '@/lib/supabase';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string | undefined | null): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}

async function fetchProductUuidBySlug(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

async function fetchBundleUuidBySlug(slug: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('bundles')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}

async function resolveVariantUuid(
  productId: string,
  variantId: string | null | undefined,
  variantNameEn: string | null | undefined,
  variantNameAr: string | null | undefined,
): Promise<string | null> {
  if (variantId && isUuid(variantId)) return variantId;

  if (variantNameEn) {
    const { data } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .eq('is_active', true)
      .eq('name_en', variantNameEn)
      .maybeSingle();
    if (data?.id) return data.id;
  }
  if (variantNameAr) {
    const { data } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', productId)
      .eq('is_active', true)
      .eq('name_ar', variantNameAr)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  const { data: first } = await supabase
    .from('product_variants')
    .select('id')
    .eq('product_id', productId)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .maybeSingle();

  return first?.id ?? null;
}

async function resolveLine(line: CartLine): Promise<CheckoutItem> {
  const slug = line.slug?.trim();
  if (!slug) {
    throw new Error('Missing product slug — cannot sync cart with storefront.');
  }

  if (line.bundle_id) {
    let bundleId = isUuid(line.bundle_id) ? line.bundle_id : null;
    if (!bundleId) {
      bundleId = await fetchBundleUuidBySlug(slug);
      if (!bundleId) {
        throw new Error(`Bundle not found for slug "${slug}".`);
      }
    }
    return { bundle_id: bundleId, quantity: line.quantity };
  }

  if (!line.product_id) {
    throw new Error('Cart line has no product or bundle.');
  }

  let productId = isUuid(line.product_id)
    ? line.product_id
    : await fetchProductUuidBySlug(slug);
  if (!productId) {
    throw new Error(`Product not found for slug "${slug}".`);
  }

  const variantResolved = await resolveVariantUuid(
    productId,
    line.product_variant_id,
    line.variant_name_en,
    line.variant_name_ar,
  );

  return {
    product_id: productId,
    product_variant_id: variantResolved ?? undefined,
    quantity: line.quantity,
  };
}

export async function resolveCheckoutItems(lines: CartLine[]): Promise<CheckoutItem[]> {
  return Promise.all(lines.map((line) => resolveLine(line)));
}
