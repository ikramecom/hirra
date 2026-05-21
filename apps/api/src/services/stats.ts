import type { AdminOrder, ApiOrderStatus, DashboardStats } from '@hirra/shared/types';
import type { OrderStatus } from '@hirra/shared/types';
import { dbStatusToApi } from '@hirra/shared/utils';
import { supabase } from '../lib/supabase.js';

type OrderRow = {
  id: string;
  status: OrderStatus;
  total_sar: number;
  shipping_city: string;
  created_at: string;
};

type ItemRow = {
  product_name_en: string;
  quantity: number;
};

function countByApiStatus(orders: OrderRow[], status: ApiOrderStatus): number {
  return orders.filter((o) => dbStatusToApi(o.status) === status).length;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = day === 0 ? 6 : day - 1;
  x.setDate(x.getDate() - diff);
  return x;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export async function computeDashboardStats(): Promise<DashboardStats> {
  const { data: orders, error: ordersErr } = await supabase
    .from('orders')
    .select('id, status, total_sar, shipping_city, created_at');

  if (ordersErr) throw new Error(ordersErr.message);

  const rows = (orders ?? []) as OrderRow[];
  const totalOrders = rows.length;

  const newOrders = countByApiStatus(rows, 'new');
  const confirmedOrders = countByApiStatus(rows, 'confirmed');
  const shippedOrders = countByApiStatus(rows, 'shipped');
  const deliveredOrders = countByApiStatus(rows, 'delivered');
  const returnedOrders = countByApiStatus(rows, 'returned');
  const cancelledOrders = countByApiStatus(rows, 'cancelled');

  const revenueOrders = rows.filter((o) => dbStatusToApi(o.status) !== 'cancelled');
  const totalRevenue = revenueOrders.reduce((sum, o) => sum + Number(o.total_sar), 0);

  const confirmedPipeline =
    confirmedOrders + shippedOrders + deliveredOrders + returnedOrders;
  const confirmationRate =
    totalOrders > 0 ? Math.round((confirmedPipeline / totalOrders) * 1000) / 10 : 0;

  const deliveryRate =
    shippedOrders > 0 ? Math.round((deliveredOrders / shippedOrders) * 1000) / 10 : 0;

  const returnRate =
    shippedOrders > 0 ? Math.round((returnedOrders / shippedOrders) * 1000) / 10 : 0;

  const averageOrderValue =
    revenueOrders.length > 0
      ? Math.round((totalRevenue / revenueOrders.length) * 100) / 100
      : 0;

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const ordersToday = rows.filter((o) => new Date(o.created_at) >= todayStart).length;
  const ordersThisWeek = rows.filter((o) => new Date(o.created_at) >= weekStart).length;
  const ordersThisMonth = rows.filter((o) => new Date(o.created_at) >= monthStart).length;

  const cityMap = new Map<string, number>();
  for (const o of rows) {
    const city = o.shipping_city?.trim() || 'Unknown';
    cityMap.set(city, (cityMap.get(city) ?? 0) + 1);
  }
  const ordersByCity = [...cityMap.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const { data: items, error: itemsErr } = await supabase
    .from('order_items')
    .select('product_name_en, quantity');

  if (itemsErr) throw new Error(itemsErr.message);

  const productQty = new Map<string, number>();
  for (const item of (items ?? []) as ItemRow[]) {
    const name = item.product_name_en;
    productQty.set(name, (productQty.get(name) ?? 0) + item.quantity);
  }

  let bestSellingProduct: DashboardStats['bestSellingProduct'] = null;
  for (const [name, quantity] of productQty) {
    if (!bestSellingProduct || quantity > bestSellingProduct.quantity) {
      bestSellingProduct = { name, quantity };
    }
  }

  return {
    totalOrders,
    newOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    returnedOrders,
    cancelledOrders,
    totalRevenue,
    confirmationRate,
    deliveryRate,
    returnRate,
    averageOrderValue,
    bestSellingProduct,
    ordersByCity,
    ordersToday,
    ordersThisWeek,
    ordersThisMonth,
  };
}

export function toAdminOrder(
  order: Record<string, unknown>,
  items: Record<string, unknown>[],
): AdminOrder {
  return {
    id: String(order.id),
    order_number: String(order.order_number),
    customer_name: String(order.customer_name),
    customer_phone: String(order.customer_phone),
    shipping_city: String(order.shipping_city),
    shipping_address: String(order.shipping_address),
    subtotal_sar: Number(order.subtotal_sar),
    shipping_sar: Number(order.shipping_sar),
    cod_fee_sar: Number(order.cod_fee_sar),
    total_sar: Number(order.total_sar),
    payment_method: String(order.payment_method),
    status: dbStatusToApi(order.status as OrderStatus),
    created_at: String(order.created_at),
    updated_at: String(order.updated_at),
    items: items.map((i) => ({
      id: String(i.id),
      product_name_en: String(i.product_name_en),
      product_name_ar: String(i.product_name_ar),
      quantity: Number(i.quantity),
      unit_price_sar: Number(i.unit_price_sar),
      line_total_sar: Number(i.line_total_sar),
    })),
  };
}
