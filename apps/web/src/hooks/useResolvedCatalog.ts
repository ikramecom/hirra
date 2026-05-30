import { useMemo } from 'react';

import {
  isRiyanaluxeBundleSlug,
  isRiyanaluxeProductSlug,
  resolveCanonicalBundleSlug,
  resolveCanonicalProductSlug,
} from '@hirra/shared';
import type { BundleWithProducts, ProductWithDetails } from '@hirra/shared';

import { loadBundleForSlug, loadProductForSlug, mergeWithLocalProduct, normalizeProductDisplay } from '@/lib/product-utils';
import { useBundle } from '@/hooks/useBundles';
import { useProduct } from '@/hooks/useProducts';

/**
 * Always resolves a product for RIYANALUXE slugs from local catalog first,
 * then merges Supabase when available. Never returns null for known slugs.
 */
export function useResolvedProduct(slug: string | undefined) {
  const canonicalSlug = resolveCanonicalProductSlug(slug);
  const isKnownSlug = Boolean(canonicalSlug && isRiyanaluxeProductSlug(canonicalSlug));

  const localProduct = useMemo(
    () => (canonicalSlug ? loadProductForSlug(canonicalSlug) : null),
    [canonicalSlug],
  );

  const { data: remoteProduct, isFetching, isError, isPending } = useProduct(slug);

  const product = useMemo((): ProductWithDetails | null => {
    if (!canonicalSlug || !isKnownSlug) return null;

    const local = loadProductForSlug(canonicalSlug);
    if (!local && !remoteProduct) return null;

    const merged = mergeWithLocalProduct(remoteProduct ?? null, local) ?? local ?? remoteProduct;
    return merged ? normalizeProductDisplay(merged) : null;
  }, [canonicalSlug, isKnownSlug, remoteProduct]);

  const isLoading = isPending && !localProduct && !product;

  return {
    product,
    canonicalSlug,
    isKnownSlug,
    isLoading,
    isFetching,
    isError: isError && !product,
  };
}

export function useResolvedBundle(slug: string | undefined) {
  const canonicalSlug = resolveCanonicalBundleSlug(slug);
  const isKnownSlug = Boolean(canonicalSlug && isRiyanaluxeBundleSlug(canonicalSlug));

  const localBundle = useMemo(
    () => (canonicalSlug ? loadBundleForSlug(canonicalSlug) : null),
    [canonicalSlug],
  );

  const { data: remoteBundle, isFetching, isError, isPending } = useBundle(slug);

  const bundle = useMemo((): BundleWithProducts | null => {
    if (!canonicalSlug || !isKnownSlug) return null;
    return remoteBundle ?? localBundle ?? loadBundleForSlug(canonicalSlug);
  }, [canonicalSlug, isKnownSlug, remoteBundle, localBundle]);

  const isLoading = isPending && !localBundle && !bundle;

  return {
    bundle,
    canonicalSlug,
    isKnownSlug,
    isLoading,
    isFetching,
    isError: isError && !bundle,
  };
}
