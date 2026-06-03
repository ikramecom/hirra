import {
  PRICING_PLANS,
  PRICING_SECTION,
} from '@/lib/pricing-data';
import { cn } from '@/lib/cn';
import { PricingCard } from './PricingCard';
import { SectionHeader } from './SectionHeader';

interface PricingSectionProps {
  embedded?: boolean;
}

export function PricingSection({ embedded = false }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className={cn(
        'pricing-section relative overflow-hidden',
        embedded ? 'section-pricing-page-embedded' : 'py-28 sm:py-36 lg:py-44',
      )}
      aria-labelledby="pricing-title"
    >
      <div className="pricing-ambient pointer-events-none absolute inset-0" aria-hidden />
      <div className="pricing-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
      <div className="pricing-orb pricing-orb-a pointer-events-none absolute" aria-hidden />
      <div className="pricing-orb pricing-orb-b pointer-events-none absolute" aria-hidden />

      <div className="container-content relative">
        {!embedded ? (
          <SectionHeader
            id="pricing-title"
            eyebrow={PRICING_SECTION.eyebrow}
            title={PRICING_SECTION.title}
            subtitle={PRICING_SECTION.subtitle}
          />
        ) : null}

        <div className="pricing-cards-grid grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-6 lg:gap-7 xl:grid-cols-4 xl:items-stretch">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
