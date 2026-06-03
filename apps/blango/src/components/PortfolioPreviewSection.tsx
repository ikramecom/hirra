import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStoreDomain } from '@/lib/portfolio-assets';
import { PORTFOLIO, PORTFOLIO_PREVIEW } from '@/lib/sections-data';
import { ROUTES } from '@/lib/routes';
import { PortfolioPreview } from './PortfolioPreview';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

const FEATURED_PROJECT =
  PORTFOLIO.projects.find((project) => project.id === PORTFOLIO_PREVIEW.featuredProjectId) ??
  PORTFOLIO.projects[0];

export function PortfolioPreviewSection() {
  const project = FEATURED_PROJECT;

  return (
    <SectionShell
      id="portfolio"
      variant="elevated"
      labelledBy="portfolio-preview-title"
      className="section-home-portfolio"
    >
      <SectionHeader
        id="portfolio-preview-title"
        eyebrow={PORTFOLIO_PREVIEW.eyebrow}
        title={PORTFOLIO_PREVIEW.title}
        subtitle={PORTFOLIO_PREVIEW.subtitle}
        density="compact"
      />

      <div className="portfolio-preview-featured mx-auto w-full max-w-md sm:max-w-lg">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="portfolio-preview-card group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-charcoal/40"
        >
          <div className="relative overflow-hidden border-b border-white/[0.06] bg-[#0a0a0a]">
            <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#111] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]/60" />
              <span className="mx-auto font-sans text-[6px] text-smoke/55">
                {getStoreDomain(project.theme)}
              </span>
            </div>
            <div className="portfolio-preview-media">
              <PortfolioPreview theme={project.theme} variant="desktop" />
            </div>
          </div>
          <div className="portfolio-preview-card-body flex flex-col p-4 sm:p-6">
            <span className="type-label text-gold/70">{project.industry}</span>
            <h3 className="mt-1.5 font-heading text-base font-bold text-pearl sm:mt-2 sm:text-lg">
              {project.nameAr}
            </h3>
            <p className="mt-2 flex items-center gap-2 font-heading text-xs font-semibold text-gold-light sm:mt-3 sm:text-sm">
              <TrendingUp className="h-3.5 w-3.5 shrink-0 text-gold/80 sm:h-4 sm:w-4" strokeWidth={1.75} />
              {project.result}
            </p>
          </div>
        </motion.article>
      </div>

      <div className="portfolio-preview-footer text-center">
        <Link to={ROUTES.portfolio} className="btn-secondary btn-secondary-glass inline-flex gap-2">
          {PORTFOLIO_PREVIEW.viewAll}
          <ArrowLeft className="h-4 w-4 opacity-85" aria-hidden />
        </Link>
      </div>
    </SectionShell>
  );
}
