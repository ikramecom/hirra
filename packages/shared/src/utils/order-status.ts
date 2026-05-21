import type { ApiOrderStatus } from '../types/admin';
import type { OrderStatus } from '../types/order';

/** DB → admin API (no schema change). */
const DB_TO_API: Record<OrderStatus, ApiOrderStatus> = {
  pending_confirmation: 'new',
  fake_flagged: 'new',
  confirmed: 'confirmed',
  packed: 'confirmed',
  shipped: 'shipped',
  delivered: 'delivered',
  returned: 'returned',
  refunded: 'returned',
  cancelled: 'cancelled',
};

/** Admin API → primary DB status for writes. */
const API_TO_DB: Record<ApiOrderStatus, OrderStatus> = {
  new: 'pending_confirmation',
  confirmed: 'confirmed',
  shipped: 'shipped',
  delivered: 'delivered',
  returned: 'returned',
  cancelled: 'cancelled',
};

export function dbStatusToApi(status: OrderStatus): ApiOrderStatus {
  return DB_TO_API[status] ?? 'new';
}

export function apiStatusToDb(status: ApiOrderStatus): OrderStatus {
  return API_TO_DB[status];
}

export const API_ORDER_STATUSES: ApiOrderStatus[] = [
  'new',
  'confirmed',
  'shipped',
  'delivered',
  'returned',
  'cancelled',
];

export function isApiOrderStatus(value: string): value is ApiOrderStatus {
  return API_ORDER_STATUSES.includes(value as ApiOrderStatus);
}
