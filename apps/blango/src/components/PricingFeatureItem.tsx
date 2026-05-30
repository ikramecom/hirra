import { Check } from 'lucide-react';

interface PricingFeatureItemProps {
  children: string;
}

export function PricingFeatureItem({ children }: PricingFeatureItemProps) {
  return (
    <li className="flex items-start gap-3.5">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08]"
        aria-hidden
      >
        <Check className="h-2.5 w-2.5 stroke-[3] text-gold" />
      </span>
      <span className="font-sans text-[13px] font-medium leading-relaxed text-pearl/88 sm:text-sm">{children}</span>
    </li>
  );
}
