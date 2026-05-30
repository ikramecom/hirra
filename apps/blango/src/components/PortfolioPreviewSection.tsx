import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStoreDomain } from '@/lib/portfolio-assets';
import { PORTFOLIO, PORTFOLIO_PREVIEW } from '@/lib/sections-data';
import { ROUTES } from '@/lib/routes';
import { PortfolioPreview } from './PortfolioPreview';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

const FEATURED = PORTFOLIO.projects.slice(0, PORTFOLIO_PREVIEW.featuredCount);

export function PortfolioPreviewSection() {
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

      <ul className="portfolio-preview-grid mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
        {FEATURED.map((project, index) => (
          <motion.li
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <article className="portfolio-preview-card group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-charcoal/40">
              <div className="relative overflow-hidden border-b border-white/[0.06] bg-[#0a0a0a]">
                <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#111] px-3 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]/60" />
                  <span className="mx-auto font-sans text-[6px] text-smoke/55">
                    {getStoreDomain(project.theme)}
                  </span>
                </div>
                <div className="aspect-[4/3]">
                  <PortfolioPreview theme={project.theme} variant="desktop" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <span className="type-label text-gold/70">{project.industry}</span>
                <h3 className="mt-2 font-heading text-lg font-bold text-pearl">{project.nameAr}</h3>
                <p className="mt-3 flex items-center gap-2 font-heading text-sm font-semibold text-gold-light">
                  <TrendingUp className="h-4 w-4 shrink-0 text-gold/80" strokeWidth={1.75} />
                  {project.result}
                </p>
              </div>
            </article>
          </motion.li>
        ))}
      </ul>

      <div className="portfolio-preview-footer mt-12 text-center sm:mt-14">
        <Link to={ROUTES.portfolio} className="btn-secondary btn-secondary-glass inline-flex gap-2">
          {PORTFOLIO_PREVIEW.viewAll}
          <ArrowLeft className="h-4 w-4 opacity-85" aria-hidden />
        </Link>
      </div>
    </SectionShell>
  );
}
