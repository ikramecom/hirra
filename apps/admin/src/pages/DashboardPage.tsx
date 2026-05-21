import { useQuery } from '@tanstack/react-query';
import { StatCard } from '@/components/StatCard';
import { fetchStats } from '@/lib/api';

function formatSar(n: number) {
  return `${n.toLocaleString('en-SA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} SAR`;
}

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchStats,
    refetchInterval: 60_000,
  });

  return (
    <div className="p-8 md:p-10 max-w-7xl">
      <header className="mb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">Overview</p>
        <h1 className="font-display text-3xl font-semibold text-walnut mt-1">Dashboard</h1>
        <p className="text-sm text-walnut/55 mt-2">
          Live metrics from your HIRRA orders database.
        </p>
      </header>

      {isLoading ? (
        <p className="text-sm text-walnut/50">Loading statistics…</p>
      ) : error ? (
        <p className="text-sm text-signal">{(error as Error).message}</p>
      ) : data ? (
        <div className="space-y-10">
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total orders" value={data.totalOrders} accent="emerald" />
            <StatCard
              label="Total revenue"
              value={formatSar(data.totalRevenue)}
              accent="gold"
            />
            <StatCard label="Avg order value" value={formatSar(data.averageOrderValue)} />
            <StatCard
              label="Confirmation rate"
              value={`${data.confirmationRate}%`}
              hint="Confirmed + shipped + delivered + returned"
            />
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-walnut/50 mb-4">
              Pipeline
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard label="New" value={data.newOrders} />
              <StatCard label="Confirmed" value={data.confirmedOrders} accent="emerald" />
              <StatCard label="Shipped" value={data.shippedOrders} />
              <StatCard label="Delivered" value={data.deliveredOrders} accent="emerald" />
              <StatCard label="Returned" value={data.returnedOrders} />
              <StatCard label="Cancelled" value={data.cancelledOrders} />
            </div>
          </section>

          <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Delivery rate" value={`${data.deliveryRate}%`} hint="Delivered ÷ shipped" />
            <StatCard label="Return rate" value={`${data.returnRate}%`} hint="Returned ÷ shipped" />
            <StatCard label="Orders today" value={data.ordersToday} />
            <StatCard label="This week" value={data.ordersThisWeek} hint={`Month: ${data.ordersThisMonth}`} />
          </section>

          <section className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-card border border-walnut/10 bg-whisper p-6 shadow-card">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-walnut/50 mb-4">
                Best seller
              </h2>
              {data.bestSellingProduct ? (
                <div>
                  <p className="font-semibold text-walnut">{data.bestSellingProduct.name}</p>
                  <p className="text-sm text-walnut/55 mt-1">
                    {data.bestSellingProduct.quantity} units sold
                  </p>
                </div>
              ) : (
                <p className="text-sm text-walnut/50">No order items yet</p>
              )}
            </div>

            <div className="rounded-card border border-walnut/10 bg-whisper p-6 shadow-card">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-walnut/50 mb-4">
                Orders by city
              </h2>
              <ul className="space-y-2">
                {data.ordersByCity.length === 0 ? (
                  <li className="text-sm text-walnut/50">No data</li>
                ) : (
                  data.ordersByCity.map(({ city, count }) => (
                    <li key={city} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-walnut">{city}</span>
                      <span className="tabular-nums text-walnut/55">{count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
