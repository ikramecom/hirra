export interface CartLine {
  // Stable per-line identity (combines product + variant + bundle)
  key: string;
  // Either a product OR a bundle
  product_id?: string;
  product_variant_id?: string | null;
  bundle_id?: string;
  // Display snapshot
  name_ar: string;
  name_en: string;
  variant_name_ar?: string | null;
  variant_name_en?: string | null;
  image_url: string | null;
  slug: string;
  unit_price_sar: number;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  cod_fee: number;
  total: number;
  free_shipping_threshold: number;
  free_shipping_remaining: number;
}
