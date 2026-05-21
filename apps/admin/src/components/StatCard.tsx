import { cn } from '@/lib/cn';

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: 'emerald' | 'gold' | 'neutral';
};

export function StatCard({ label, value, hint, accent = 'neutral' }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-card border bg-whisper p-5 shadow-card transition hover:shadow-card-hover',
        accent === 'emerald' && 'border-emerald/20',
        accent === 'gold' && 'border-gold/30',
        accent === 'neutral' && 'border-walnut/10',
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-walnut/50">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-walnut tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-walnut/55">{hint}</p> : null}
    </div>
  );
}
