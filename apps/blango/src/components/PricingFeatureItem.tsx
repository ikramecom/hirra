import { Check } from 'lucide-react';

interface PricingFeatureItemProps {
  children: string;
}

export function PricingFeatureItem({ children }: PricingFeatureItemProps) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="feature-check mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08]"
        aria-hidden
      >
        <Check className="h-2.5 w-2.5 stroke-[2.5] text-gold" />
      </span>
      <span className="text-[13px] leading-relaxed text-pearl/85 sm:text-sm">{children}</span>
    </li>
  );
}
