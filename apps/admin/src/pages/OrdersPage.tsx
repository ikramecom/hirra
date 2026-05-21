import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ORDER_STATUSES, type AdminOrder, type ApiOrderStatus } from '@hirra/shared';
import { StatusBadge } from '@/components/StatusBadge';
import { fetchOrders, updateOrderStatus } from '@/lib/api';
import { cn } from '@/lib/cn';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function OrdersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ApiOrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await fetchOrders()).orders,
    refetchInterval: 30_000,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiOrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q) ||
        o.shipping_city.toLowerCase().includes(q)
      );
    });
  }, [data, filter, search]);

  return (
    <div className="p-8 md:p-10 max-w-[1400px]">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">Operations</p>
          <h1 className="font-display text-3xl font-semibold text-walnut mt-1">Orders</h1>
        </div>
        <input
          type="search"
          placeholder="Search order, name, phone, city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 rounded-xl border border-walnut/15 bg-whisper px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald/25"
        />
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          All
        </FilterChip>
        {API_ORDER_STATUSES.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {s}
          </FilterChip>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-walnut/50">Loading orders…</p>
      ) : error ? (
        <p className="text-sm text-signal">{(error as Error).message}</p>
      ) : (
        <div className="rounded-card border border-walnut/10 bg-whisper shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-walnut/10 bg-cream/50 text-left">
                  <th className="px-4 py-3 font-semibold text-walnut/60">Order</th>
                  <th className="px-4 py-3 font-semibold text-walnut/60">Customer</th>
                  <th className="px-4 py-3 font-semibold text-walnut/60">City</th>
                  <th className="px-4 py-3 font-semibold text-walnut/60">Total</th>
                  <th className="px-4 py-3 font-semibold text-walnut/60">Status</th>
                  <th className="px-4 py-3 font-semibold text-walnut/60">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-walnut/50">
                      No orders match your filters
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onStatusChange={(status) => mutation.mutate({ id: order.id, status })}
                      updating={mutation.isPending && mutation.variables?.id === order.id}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-semibold capitalize border transition',
        active
          ? 'bg-emerald text-cream border-emerald'
          : 'bg-whisper text-walnut/70 border-walnut/15 hover:border-emerald/40',
      )}
    >
      {children}
    </button>
  );
}

function OrderRow({
  order,
  onStatusChange,
  updating,
}: {
  order: AdminOrder;
  onStatusChange: (status: ApiOrderStatus) => void;
  updating: boolean;
}) {
  const itemsSummary = order.items.map((i) => `${i.quantity}× ${i.product_name_en}`).join(', ');

  return (
    <tr className="border-b border-walnut/5 hover:bg-cream/30 align-top">
      <td className="px-4 py-4">
        <p className="font-semibold text-walnut">{order.order_number}</p>
        <p className="text-xs text-walnut/45 mt-1 max-w-[200px] truncate" title={itemsSummary}>
          {itemsSummary}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="font-medium">{order.customer_name}</p>
        <p className="text-xs text-walnut/50 mt-0.5" dir="ltr">
          {order.customer_phone}
        </p>
      </td>
      <td className="px-4 py-4 text-walnut/80">{order.shipping_city}</td>
      <td className="px-4 py-4 font-semibold tabular-nums">{order.total_sar} SAR</td>
      <td className="px-4 py-4">
        <div className="flex flex-col gap-2">
          <StatusBadge status={order.status} />
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => onStatusChange(e.target.value as ApiOrderStatus)}
            className="rounded-lg border border-walnut/15 bg-cream px-2 py-1 text-xs font-medium capitalize disabled:opacity-50"
          >
            {API_ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td className="px-4 py-4 text-walnut/55 text-xs whitespace-nowrap">
        {formatDate(order.created_at)}
      </td>
    </tr>
  );
}
