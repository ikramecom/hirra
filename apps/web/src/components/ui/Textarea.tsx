import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, ...rest },
  ref,
) {
  const textareaId = id ?? rest.name;
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-walnut">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rest.rows ?? 3}
        className={cn(
          'block w-full rounded-xl border-2 bg-whisper px-4 py-3 text-base text-walnut transition resize-y',
          'placeholder:text-walnut/40',
          'focus:outline-none focus:ring-0',
          error ? 'border-signal focus:border-signal' : 'border-sand focus:border-emerald',
          className,
        )}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />
      {error ? <p className="text-sm text-signal">{error}</p> : hint ? <p className="text-sm text-walnut/60">{hint}</p> : null}
    </div>
  );
});
