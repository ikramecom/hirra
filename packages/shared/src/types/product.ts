export interface Product {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  description_ar: string | null;
  description_en: string | null;
  price_sar: number;
  compare_at_price_sar: number | null;
  cost_sar: number | null;
  sku: string | null;
  inventory_count: number;
  is_active: boolean;
  is_hero: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_ar: string | null;
  alt_en: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  sku: string | null;
  /** Variant-specific product photo (client / fallback; optional in API rows) */
  image_url?: string | null;
  inventory_count: number;
  is_active: boolean;
  display_order: number;
}

export interface ProductWithDetails extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
}
