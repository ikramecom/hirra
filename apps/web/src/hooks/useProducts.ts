import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import {
  FALLBACK_PRODUCTS,
  getFallbackProductBySlug,
  isSupabaseConfigured,
  withLocalProductImageFallback,
} from '@/lib/fallback-data';
import type { Product, ProductImage, ProductVariant, ProductWithDetails } from '@hirra/shared';

/**
 * List all active products with their primary image.
 *
 * Falls back to the local catalogue (`FALLBACK_PRODUCTS`) whenever Supabase
 * isn't configured or returns no rows — keeps the storefront working in
 * preview mode.
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return FALLBACK_PRODUCTS;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(*)')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        const rows = (data ?? []) as Array<Product & { product_images: ProductImage[] }>;
        if (rows.length === 0) return FALLBACK_PRODUCTS;
        return rows.map((row) => withLocalProductImageFallback(row));
      } catch (err) {
        console.warn('[hirra] useProducts falling back to local catalogue:', err);
        return FALLBACK_PRODUCTS;
      }
    },
  });
}

/**
 * Fetch a single product (with all images + variants) by slug.
 *
 * Falls back to the local catalogue when Supabase isn't configured or the
 * query fails.
 */
export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) throw new Error('slug required');

      if (!isSupabaseConfigured()) {
        return getFallbackProductBySlug(slug);
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(*), product_variants(*)')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        if (!data) return getFallbackProductBySlug(slug);

        const product = withLocalProductImageFallback(
          data as Product & {
            product_images: ProductImage[];
            product_variants: ProductVariant[];
          },
        );

        const images = [...product.product_images].sort(
          (a, b) => a.display_order - b.display_order,
        );
        const variants = [...product.product_variants]
          .filter((v) => v.is_active)
          .sort((a, b) => a.display_order - b.display_order);

        return { ...product, images, variants } as ProductWithDetails;
      } catch (err) {
        console.warn(`[hirra] useProduct(${slug}) falling back to local catalogue:`, err);
        return getFallbackProductBySlug(slug);
      }
    },
    enabled: Boolean(slug),
  });
}
