import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { META_LEAD_CONSULTATION_ATTR } from '@/lib/meta-pixel';
import { HERO, WHATSAPP } from '@/lib/sections-data';
import { ROUTES } from '@/lib/routes';
import { HeroMockup } from './HeroMockup';

function HeroTrustCards({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={
        compact
          ? 'hero-trust-grid hero-trust-grid-compact grid grid-cols-2 gap-2'
          : 'hero-trust-grid grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'
      }
    >
      {HERO.trust.map((item) => (
        <li key={item} className="hero-trust-card">
          <Check className="hero-trust-icon h-3 w-3 shrink-0 text-gold/90 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="hero-section relative flex flex-col overflow-hidden lg:min-h-[85vh] lg:max-h-[900px]"
      aria-labelledby="hero-title"
    >
      <div className="hero-ambient pricing-ambient pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-grid pricing-grid-overlay pointer-events-none absolute inset-0" aria-hidden />
      <div className="pricing-orb pricing-orb-a pointer-events-none absolute opacity-20" aria-hidden />
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-content hero-main relative flex flex-col justify-center py-10 sm:py-16 lg:py-24">
        <div className="hero-grid-layout grid items-center lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="hero-copy text-center lg:text-start"
          >
            <p className="hero-eyebrow type-eyebrow">{HERO.eyebrow}</p>

            <h1
              id="hero-title"
              className="type-hero hero-headline mx-auto max-w-[17.5rem] sm:max-w-lg lg:mx-0 lg:max-w-[22rem] xl:max-w-[26rem]"
            >
              {HERO.title}
            </h1>

            <p className="type-hero-subtitle hero-subtitle mx-auto mt-5 max-w-[16.25rem] sm:mt-6 sm:max-w-md lg:mx-0 lg:max-w-[28rem]">
              {HERO.subtitle}
            </p>

            <div className="hero-actions mt-7 flex flex-col items-stretch gap-2.5 sm:mt-9 sm:flex-row sm:items-center sm:gap-4 lg:justify-start">
              <a
                href={WHATSAPP.url}
                target="_blank"
                rel="noopener noreferrer"
                data-meta-lead={META_LEAD_CONSULTATION_ATTR}
                className="btn-primary btn-hero w-full sm:w-auto"
              >
                {HERO.ctaPrimary}
              </a>
              <Link to={ROUTES.pricing} className="btn-secondary btn-secondary-glass btn-hero w-full sm:w-auto">
                {HERO.ctaSecondary}
              </Link>
            </div>

            {/* Mobile: trust pills directly under CTAs */}
            <div className="hero-trust-inline mt-5 lg:hidden">
              <HeroTrustCards compact />
            </div>
          </motion.div>

          <div className="hero-showcase relative hidden items-center justify-center lg:flex lg:justify-end">
            <HeroMockup />
          </div>
        </div>
      </div>

      {/* Desktop / tablet wide: trust band at hero base */}
      <div className="hero-trust-band relative hidden border-t border-white/[0.05] lg:block">
        <div className="container-content py-7 sm:py-8">
          <HeroTrustCards />
        </div>
      </div>

      <div className="hero-section-fade pointer-events-none absolute inset-x-0 bottom-0 h-16 lg:h-24" aria-hidden />
    </section>
  );
}
