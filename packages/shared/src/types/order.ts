export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'
  | 'fake_flagged';

export type PaymentMethod =
  | 'cod'
  | 'whatsapp'
  | 'mada'
  | 'apple_pay'
  | 'stc_pay'
  | 'tabby'
  | 'tamara'
  | 'visa_mc';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_phone: string;
  customer_name: string;
  customer_email: string | null;
  shipping_city: string;
  shipping_district: string | null;
  shipping_address: string;
  shipping_building: string | null;
  shipping_landmarks: string | null;
  subtotal_sar: number;
  shipping_sar: number;
  cod_fee_sar: number;
  discount_sar: number;
  total_sar: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  whatsapp_confirmation_sent_at: string | null;
  whatsapp_confirmed_at: string | null;
  confirmation_attempts: number;
  courier: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  fake_score: number;
  fake_flags: string[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_variant_id: string | null;
  bundle_id: string | null;
  product_name_ar: string;
  product_name_en: string;
  variant_name_ar: string | null;
  variant_name_en: string | null;
  unit_price_sar: number;
  quantity: number;
  line_total_sar: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// Checkout payload sent to the Edge Function

export interface CheckoutItem {
  product_id?: string;
  product_variant_id?: string | null;
  bundle_id?: string;
  quantity: number;
}

export interface CheckoutPayload {
  customer: {
    phone: string;
    name: string;
    email?: string;
    city: string;
    district?: string;
    street_address: string;
    building?: string;
    landmarks?: string;
  };
  items: CheckoutItem[];
  payment_method: 'cod' | 'whatsapp';
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  referrer?: string;
}

export interface CheckoutResponse {
  success: true;
  order_number: string;
  order_id: string;
  total_sar: number;
  redirect_url: string;
}

export interface CheckoutErrorResponse {
  error: string;
}
