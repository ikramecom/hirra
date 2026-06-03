import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import type { PricingPlan } from '@/lib/pricing-data';
import { PRICING_LABELS } from '@/lib/pricing-data';
import { WHATSAPP } from '@/lib/sections-data';
import { cn } from '@/lib/cn';
import { PricingFeatureItem } from './PricingFeatureItem';

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
}

function parsePrice(price: string) {
  const match = price.match(/^(\d+)\s*(DH)$/);
  if (!match) return { amount: price, currency: '' };
  return { amount: match[1], currency: match[2] };
}

export function PricingCard({ plan, index }: PricingCardProps) {
  const isPopular = plan.popular === true;
  const { amount, currency } = parsePrice(plan.price);

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-48px' }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'pricing-card group relative flex h-full flex-col',
        isPopular && 'pricing-card-popular pricing-card-pro z-10',
      )}
    >
      {isPopular ? (
        <>
          <div className="popular-glow pointer-events-none absolute -inset-px rounded-[25px] opacity-70" aria-hidden />
          <div className="popular-badge">
            <span className="popular-badge-text">{plan.popularLabel ?? PRICING_LABELS.popular}</span>
          </div>
        </>
      ) : null}

      <div className="pricing-card-sheen pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-700 group-hover:opacity-100" aria-hidden />

      <div className={cn('relative flex flex-1 flex-col pricing-card-body p-7 sm:p-8 lg:p-9', isPopular && 'pt-12 sm:pt-12')}>
        <header>
          <p className="type-label tracking-widest text-smoke/70">{plan.name}</p>

          <div className="mt-5 flex items-end gap-2.5">
            <span className={cn('type-price', isPopular && 'type-price-pro')}>{amount}</span>
            {currency ? <span className="type-price-currency mb-2">{currency}</span> : null}
          </div>

          {plan.tagline ? (
            <p className="mt-5 font-arabic text-sm leading-relaxed text-smoke">{plan.tagline}</p>
          ) : (
            <div className="mt-5 h-5" aria-hidden />
          )}
        </header>

        <div className="pricing-divider" aria-hidden />

        <p className="type-label mb-6">{PRICING_LABELS.included}</p>

        <ul className="pricing-card-features mb-8 flex flex-1 flex-col gap-3.5">
          {plan.features.map((feature) => (
            <PricingFeatureItem key={feature}>{feature}</PricingFeatureItem>
          ))}
        </ul>

        {plan.bonus ? (
          <div className="bonus-panel mb-8">
            <p className="type-label mb-2.5 text-gold/75">{PRICING_LABELS.bonus}</p>
            <p className="type-body text-champagne">{plan.bonus}</p>
          </div>
        ) : null}

        <motion.a
          href={WHATSAPP.url}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.985 }}
          className={cn(
            'pricing-cta mt-auto',
            isPopular ? 'pricing-cta-popular' : 'pricing-cta-default',
          )}
        >
          {isPopular ? (
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/22 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              aria-hidden
            />
          ) : null}
          <span className="relative flex items-center justify-center gap-2.5">
            {plan.cta}
            <ArrowLeft className="h-4 w-4 opacity-75 transition-transform duration-500 group-hover:-translate-x-1" aria-hidden />
          </span>
        </motion.a>
      </div>
    </motion.article>
  );
}
