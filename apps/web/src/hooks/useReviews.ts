import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';
import { getFallbackReviewsForProduct, isSupabaseConfigured } from '@/lib/fallback-data';
import type { Review } from '@hirra/shared';

export function useReviews(productId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!productId) return [];

      if (!isSupabaseConfigured()) {
        return getFallbackReviewsForProduct(productId);
      }

      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .eq('is_published', true)
          .order('display_order', { ascending: true })
          .limit(20);

        if (error) throw error;
        const rows = (data ?? []) as Review[];
        if (rows.length === 0) return getFallbackReviewsForProduct(productId);
        return rows;
      } catch (err) {
        console.warn(`[riyanaluxe] useReviews(${productId}) falling back to local data:`, err);
        return getFallbackReviewsForProduct(productId);
      }
    },
    enabled: Boolean(productId),
  });
}
