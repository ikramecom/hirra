import type { ReactNode } from 'react';

interface SectionShellProps {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'cta';
  labelledBy?: string;
}

export function SectionShell({
  id,
  children,
  className = '',
  variant = 'default',
  labelledBy,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={`section-shell section-shell-${variant} relative overflow-hidden ${className}`}
      aria-labelledby={labelledBy}
    >
      {variant !== 'cta' ? (
        <div className="section-ambient pointer-events-none absolute inset-0 opacity-80" aria-hidden />
      ) : null}
      <div className="container-content relative">{children}</div>
    </section>
  );
}
