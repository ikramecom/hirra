import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import {
  FALLBACK_PRODUCTS,
  isSupabaseConfigured,
} from '@/lib/fallback-data';
import {
  loadProductForSlug,
  mergeWithLocalProduct,
  resolveCanonicalProductSlug,
  toProductWithDetails,
} from '@/lib/product-utils';
import { isRiyanaluxeProductSlug } from '@hirra/shared';
import type { Product, ProductImage, ProductVariant, ProductWithDetails } from '@hirra/shared';

function fallbackCatalog(): ProductWithDetails[] {
  return FALLBACK_PRODUCTS.map((row) =>
    toProductWithDetails({ ...row, product_images: row.product_images ?? [] }),
  );
}

/**
 * List all active RIYANALUXE products.
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const local = fallbackCatalog();
      if (!isSupabaseConfigured()) return local;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(*)')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        const rows = (data ?? []) as Array<Product & { product_images: ProductImage[] }>;
        if (rows.length === 0) return local;

        const mapped = rows
          .filter((row) => isRiyanaluxeProductSlug(row.slug))
          .map((row) => toProductWithDetails(row));

        return mapped.length > 0 ? mapped : local;
      } catch (err) {
        console.warn('[riyanaluxe] useProducts falling back to local catalogue:', err);
        return local;
      }
    },
  });
}

/**
 * Fetch a single product — local catalog first, Supabase enriches when available.
 */
export function useProduct(slug: string | undefined) {
  const canonicalSlug = resolveCanonicalProductSlug(slug);
  const localProduct = loadProductForSlug(canonicalSlug);

  return useQuery({
    queryKey: ['product', canonicalSlug],
    enabled: Boolean(canonicalSlug),
    initialData: localProduct ?? undefined,
    placeholderData: () => localProduct ?? undefined,
    queryFn: async (): Promise<ProductWithDetails | null> => {
      if (!canonicalSlug) return null;

      const local = loadProductForSlug(canonicalSlug);
      if (!isSupabaseConfigured()) return local;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(*), product_variants(*)')
          .eq('slug', canonicalSlug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        if (!data) return local;

        const remote = toProductWithDetails(
          data as Product & {
            product_images: ProductImage[];
            product_variants: ProductVariant[];
          },
        );

        const merged = mergeWithLocalProduct(remote, local);
        return merged ?? local;
      } catch (err) {
        console.warn(`[riyanaluxe] useProduct(${canonicalSlug}) falling back:`, err);
        return local;
      }
    },
    select: (data) => {
      if (!canonicalSlug || !isRiyanaluxeProductSlug(canonicalSlug)) return data;
      return data ?? loadProductForSlug(canonicalSlug);
    },
  });
}
