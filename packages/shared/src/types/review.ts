export interface Review {
  id: string;
  product_id: string;
  order_id: string | null;
  customer_name: string;
  customer_city: string | null;
  rating: number;
  title_ar: string | null;
  body_ar: string;
  image_urls: string[];
  is_verified: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
}
