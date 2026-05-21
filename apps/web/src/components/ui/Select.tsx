import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, hint, options, placeholder, className, id, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="block text-sm font-semibold text-walnut">
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'block w-full rounded-xl border-2 bg-whisper px-4 py-3 text-base text-walnut transition appearance-none',
          'focus:outline-none focus:ring-0',
          error ? 'border-signal focus:border-signal' : 'border-sand focus:border-emerald',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-signal">{error}</p>
      ) : hint ? (
        <p className="text-sm text-walnut/60">{hint}</p>
      ) : null}
    </div>
  );
});
