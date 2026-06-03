import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { META_LEAD_CONSULTATION_ATTR } from '@/lib/meta-pixel';
import { PORTFOLIO_CTA, WHATSAPP } from '@/lib/sections-data';
import { SectionShell } from './SectionShell';

export function PortfolioPageCta() {
  return (
    <SectionShell variant="cta" labelledBy="portfolio-cta-title" className="section-portfolio-cta">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 id="portfolio-cta-title" className="type-section-title">
          {PORTFOLIO_CTA.title}
        </h2>
        <p className="portfolio-cta-text type-subtitle mx-auto max-w-lg">{PORTFOLIO_CTA.subtitle}</p>
        <div className="portfolio-cta-actions">
          <a
            href={WHATSAPP.url}
            target="_blank"
            rel="noopener noreferrer"
            data-meta-lead={META_LEAD_CONSULTATION_ATTR}
            className="btn-primary btn-primary-lg inline-flex w-full sm:w-auto"
          >
            {PORTFOLIO_CTA.button}
            <ArrowLeft className="h-4 w-4 opacity-85" aria-hidden />
          </a>
        </div>
      </motion.div>
    </SectionShell>
  );
}
