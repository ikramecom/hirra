import type { ApiOrderStatus } from '@hirra/shared';
import { cn } from '@/lib/cn';

const styles: Record<ApiOrderStatus, string> = {
  new: 'bg-sand/60 text-walnut border-walnut/15',
  confirmed: 'bg-emerald/10 text-emerald border-emerald/25',
  shipped: 'bg-gold/15 text-walnut border-gold/35',
  delivered: 'bg-emerald text-cream border-emerald',
  returned: 'bg-signal/10 text-signal border-signal/25',
  cancelled: 'bg-walnut/10 text-walnut/60 border-walnut/15',
};

const labels: Record<ApiOrderStatus, string> = {
  new: 'New',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  returned: 'Returned',
  cancelled: 'Cancelled',
};

export function StatusBadge({ status }: { status: ApiOrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  );
}
