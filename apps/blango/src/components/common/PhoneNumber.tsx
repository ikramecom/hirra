import { cn } from '@/lib/cn';
import { WHATSAPP } from '@/lib/sections-data';

interface PhoneNumberProps {
  /** Defaults to WHATSAPP.number (+212 649 498 336) */
  value?: string;
  className?: string;
}

/**
 * International phone display isolated from RTL page layout.
 * Keeps +212 on the visual left and digits in natural order.
 */
export function PhoneNumber({ value = WHATSAPP.number, className }: PhoneNumberProps) {
  return (
    <span dir="ltr" lang="en" className={cn('phone-number', className)}>
      {value}
    </span>
  );
}
