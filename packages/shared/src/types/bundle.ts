import type { Product } from './product';

export interface Bundle {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price_sar: number;
  savings_sar: number | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

export interface BundleProduct {
  id: string;
  bundle_id: string;
  product_id: string;
  quantity: number;
}

export interface BundleWithProducts extends Bundle {
  products: Array<Product & { quantity: number }>;
}
