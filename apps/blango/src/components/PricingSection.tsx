import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import {
  COMMON_BENEFITS,
  PRICING_PLANS,
  PRICING_SECTION,
} from '@/lib/pricing-data';
import { SectionHeader } from './SectionHeader';
import { PricingCard } from './PricingCard';

interface PricingSectionProps {
  embedded?: boolean;
}

export function PricingSection({ embedded = false }: PricingSectionProps) {
  return (
    <section
      id="pricing"
      className={`pricing-section relative overflow-hidden ${embedded ? 'py-16 sm:py-20 lg:py-24' : 'py-28 sm:py-36 lg:py-44'}`}
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

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-6 lg:gap-7 xl:grid-cols-4 xl:items-stretch">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 sm:mt-32 lg:mt-36"
        >
          <div className="benefits-panel mx-auto max-w-5xl">
            <div className="mb-10 text-center sm:mb-12">
              <div className="section-divider mb-6">
                <span className="section-divider-line" aria-hidden />
                <span className="section-divider-dot" aria-hidden />
                <span className="section-divider-line rotate-180" aria-hidden />
              </div>
              <h3 className="font-heading text-2xl font-bold text-pearl sm:text-3xl">
                {COMMON_BENEFITS.title}
              </h3>
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {COMMON_BENEFITS.items.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="benefit-item group/item flex h-full items-center gap-4 px-5 py-5 sm:px-6">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.08] transition-all duration-500 group-hover/item:border-gold/45 group-hover/item:bg-gold/[0.14]"
                      aria-hidden
                    >
                      <Check className="h-4 w-4 stroke-[2.5] text-gold" />
                    </span>
                    <span className="type-body text-pearl/90">{item}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
