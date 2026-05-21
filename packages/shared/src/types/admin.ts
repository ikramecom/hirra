import type { CheckoutPayload } from './order';

/** Admin API status labels (maps to existing `order_status` enum in Postgres). */
export type ApiOrderStatus =
  | 'new'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'cancelled';

export interface AdminOrderItem {
  id: string;
  product_name_en: string;
  product_name_ar: string;
  quantity: number;
  unit_price_sar: number;
  line_total_sar: number;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  shipping_city: string;
  shipping_address: string;
  subtotal_sar: number;
  shipping_sar: number;
  cod_fee_sar: number;
  total_sar: number;
  payment_method: string;
  status: ApiOrderStatus;
  created_at: string;
  updated_at: string;
  items: AdminOrderItem[];
}

export interface DashboardStats {
  totalOrders: number;
  newOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  confirmationRate: number;
  deliveryRate: number;
  returnRate: number;
  averageOrderValue: number;
  bestSellingProduct: { name: string; quantity: number } | null;
  ordersByCity: { city: string; count: number }[];
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
}

export type CreateOrderRequest = CheckoutPayload;
