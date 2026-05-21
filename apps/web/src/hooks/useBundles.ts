import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import {
  FALLBACK_BUNDLES,
  isSupabaseConfigured,
  withLocalBundleImageFallback,
  withLocalProductImageFallback,
} from '@/lib/fallback-data';
import type { Bundle, BundleWithProducts, Product, ProductImage } from '@hirra/shared';

export function useBundles() {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return FALLBACK_BUNDLES;
      }

      try {
        const { data, error } = await supabase
          .from('bundles')
          .select('*, bundle_products(quantity, products(*, product_images(*)))')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) return FALLBACK_BUNDLES;

        return data.map((raw) => {
          const b = raw as Bundle & {
            bundle_products: Array<{
              quantity: number;
              products: Product & { product_images?: ProductImage[] };
            }>;
          };
          const withBundleImage = withLocalBundleImageFallback(b);
          return {
            ...withBundleImage,
            products: b.bundle_products
              .map((bp) => {
                const merged = withLocalProductImageFallback({
                  ...bp.products,
                  product_images: bp.products.product_images ?? [],
                });
                const { product_images: _pi, ...rest } = merged;
                return { ...rest, quantity: bp.quantity };
              })
              .filter((p) => p.is_active),
          };
        }) as BundleWithProducts[];
      } catch (err) {
        console.warn('[hirra] useBundles falling back to local data:', err);
        return FALLBACK_BUNDLES;
      }
    },
  });
}

export function useBundle(slug: string | undefined) {
  return useQuery({
    queryKey: ['bundle', slug],
    queryFn: async () => {
      if (!slug) throw new Error('slug required');

      if (!isSupabaseConfigured()) {
        return FALLBACK_BUNDLES.find((b) => b.slug === slug) ?? null;
      }

      try {
        const { data, error } = await supabase
          .from('bundles')
          .select('*, bundle_products(quantity, products(*, product_images(*)))')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        if (!data) return FALLBACK_BUNDLES.find((b) => b.slug === slug) ?? null;

        const bundle = data as Bundle & {
          bundle_products: Array<{
            quantity: number;
            products: Product & { product_images?: ProductImage[] };
          }>;
        };
        const withBundleImage = withLocalBundleImageFallback(bundle);
        return {
          ...withBundleImage,
          products: bundle.bundle_products.map((bp) => {
            const merged = withLocalProductImageFallback({
              ...bp.products,
              product_images: bp.products.product_images ?? [],
            });
            const { product_images: _pi, ...rest } = merged;
            return { ...rest, quantity: bp.quantity };
          }),
        } as BundleWithProducts;
      } catch (err) {
        console.warn(`[hirra] useBundle(${slug}) falling back to local data:`, err);
        return FALLBACK_BUNDLES.find((b) => b.slug === slug) ?? null;
      }
    },
    enabled: Boolean(slug),
  });
}
