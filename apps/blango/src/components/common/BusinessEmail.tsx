import { cn } from '@/lib/cn';
import { EMAIL } from '@/lib/sections-data';

interface BusinessEmailProps {
  /** Defaults to EMAIL.address */
  value?: string;
  className?: string;
}

/** Business email isolated from RTL layout (reads left-to-right). */
export function BusinessEmail({ value = EMAIL.address, className }: BusinessEmailProps) {
  return (
    <span dir="ltr" lang="en" className={cn('business-email', className)}>
      {value}
    </span>
  );
}
