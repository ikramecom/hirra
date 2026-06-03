import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import {
  FALLBACK_BUNDLES,
  getFallbackBundleBySlug,
  isSupabaseConfigured,
  withLocalBundleImageFallback,
} from '@/lib/fallback-data';
import { loadBundleForSlug, toProductWithDetails } from '@/lib/product-utils';
import {
  isRiyanaluxeBundleSlug,
  isRiyanaluxeProductSlug,
  resolveCanonicalBundleSlug,
} from '@hirra/shared';
import type { Bundle, BundleWithProducts, Product, ProductImage } from '@hirra/shared';

function mapBundleRow(raw: unknown): BundleWithProducts {
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
        const detail = toProductWithDetails({
          ...bp.products,
          product_images: bp.products.product_images ?? [],
        });
        const { images: _i, variants: _v, ...productRow } = detail;
        return { ...productRow, quantity: bp.quantity };
      })
      .filter((p) => p.is_active && isRiyanaluxeProductSlug(p.slug)),
  };
}

export function useBundles() {
  return useQuery({
    queryKey: ['bundles'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) return FALLBACK_BUNDLES;

      try {
        const { data, error } = await supabase
          .from('bundles')
          .select('*, bundle_products(quantity, products(*, product_images(*)))')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) return FALLBACK_BUNDLES;

        const mapped = data
          .filter((raw) => isRiyanaluxeBundleSlug((raw as Bundle).slug))
          .map(mapBundleRow);

        return mapped.length > 0 ? mapped : FALLBACK_BUNDLES;
      } catch (err) {
        console.warn('[riyanaluxe] useBundles falling back to local data:', err);
        return FALLBACK_BUNDLES;
      }
    },
  });
}

export function useBundle(slug: string | undefined) {
  const canonicalSlug = resolveCanonicalBundleSlug(slug);
  const localBundle = loadBundleForSlug(canonicalSlug);

  return useQuery({
    queryKey: ['bundle', canonicalSlug],
    enabled: Boolean(canonicalSlug),
    initialData: localBundle ?? undefined,
    placeholderData: () => localBundle ?? undefined,
    queryFn: async (): Promise<BundleWithProducts | null> => {
      if (!canonicalSlug) return null;

      const local = getFallbackBundleBySlug(canonicalSlug);
      if (!isSupabaseConfigured()) return local;

      try {
        const { data, error } = await supabase
          .from('bundles')
          .select('*, bundle_products(quantity, products(*, product_images(*)))')
          .eq('slug', canonicalSlug)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;
        if (!data || !isRiyanaluxeBundleSlug((data as Bundle).slug)) return local;

        const mapped = mapBundleRow(data);
        if (mapped.products.length === 0) return local;
        return mapped;
      } catch (err) {
        console.warn(`[riyanaluxe] useBundle(${canonicalSlug}) falling back:`, err);
        return local;
      }
    },
    select: (data) => {
      if (!canonicalSlug || !isRiyanaluxeBundleSlug(canonicalSlug)) return data;
      return data ?? getFallbackBundleBySlug(canonicalSlug);
    },
  });
}
