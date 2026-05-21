import type { AdminOrder, ApiOrderStatus, DashboardStats } from '@hirra/shared';

const STORAGE_KEY = 'hirra:admin-api-key';

export function getApiKey(): string | null {
  return sessionStorage.getItem(STORAGE_KEY) || import.meta.env.VITE_ADMIN_API_KEY || null;
}

export function setApiKey(key: string) {
  sessionStorage.setItem(STORAGE_KEY, key);
}

export function clearApiKey() {
  sessionStorage.removeItem(STORAGE_KEY);
}

const baseUrl = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const key = getApiKey();
  if (!key) throw new Error('Not authenticated');

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export function fetchStats() {
  return request<DashboardStats>('/api/dashboard/stats');
}

export function fetchOrders() {
  return request<{ orders: AdminOrder[] }>('/api/orders');
}

export function updateOrderStatus(id: string, status: ApiOrderStatus) {
  return request<{ order: AdminOrder }>(`/api/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
