import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-semibold text-walnut">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'block w-full rounded-xl border-2 bg-whisper px-4 py-3 text-base text-walnut transition',
          'placeholder:text-walnut/40',
          'focus:outline-none focus:ring-0',
          error ? 'border-signal focus:border-signal' : 'border-sand focus:border-emerald',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-signal">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-sm text-walnut/60">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
