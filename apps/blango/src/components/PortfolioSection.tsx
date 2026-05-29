import { motion } from 'framer-motion';
import { PORTFOLIO } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

interface PortfolioMockupProps {
  accent: string;
  variant: 'landing' | 'websites' | 'custom';
}

function DesktopFrame({ accent, variant }: PortfolioMockupProps) {
  return (
    <div className="mockup-desktop relative w-full overflow-hidden rounded-xl border border-white/[0.1] bg-charcoal shadow-2xl transition-transform duration-700 group-hover/portfolio:-translate-y-1">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-ink/90 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/15" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-white/15" aria-hidden />
        <span className="h-2 w-2 rounded-full bg-white/15" aria-hidden />
        <span className="mx-auto h-4 w-24 rounded-md bg-white/[0.04]" aria-hidden />
      </div>
      <div className={`mockup-screen relative aspect-[16/10] bg-gradient-to-br ${accent} p-4 sm:p-5`}>
        <div className="mb-3 h-2 w-1/3 rounded-full bg-gold/30" aria-hidden />
        <div className="mb-2 h-1.5 w-2/3 rounded-full bg-white/10" aria-hidden />
        <div className="mb-4 h-1.5 w-1/2 rounded-full bg-white/[0.06]" aria-hidden />
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 h-16 rounded-lg border border-white/[0.06] bg-white/[0.03] sm:h-20" aria-hidden />
          <div className="h-16 rounded-lg border border-gold/15 bg-gold/[0.06] sm:h-20" aria-hidden />
        </div>
        {variant === 'custom' ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-8 rounded-md bg-white/[0.04]" aria-hidden />
            <div className="h-8 rounded-md bg-white/[0.04]" aria-hidden />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MobileFrame({ accent }: { accent: string }) {
  return (
    <div className="mockup-mobile absolute -bottom-4 -left-3 w-[28%] min-w-[72px] max-w-[100px] overflow-hidden rounded-[14px] border border-white/[0.12] bg-ink shadow-xl sm:-bottom-5 sm:-left-4 sm:max-w-[110px]">
      <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-white/10" aria-hidden />
      <div className={`aspect-[9/16] bg-gradient-to-b ${accent} p-2`}>
        <div className="mb-2 h-1 w-3/4 rounded-full bg-gold/25" aria-hidden />
        <div className="mb-1.5 h-0.5 w-full rounded-full bg-white/[0.08]" aria-hidden />
        <div className="mt-3 h-10 rounded-md border border-white/[0.06] bg-white/[0.03]" aria-hidden />
        <div className="mt-2 h-4 rounded-md bg-gold/15" aria-hidden />
      </div>
    </div>
  );
}

export function PortfolioSection() {
  return (
    <SectionShell id="portfolio" labelledBy="portfolio-title">
      <SectionHeader
        id="portfolio-title"
        eyebrow={PORTFOLIO.eyebrow}
        title={PORTFOLIO.title}
        subtitle={PORTFOLIO.subtitle}
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-6">
        {PORTFOLIO.projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: index * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="portfolio-card group/portfolio luxury-card flex flex-col p-5 sm:p-6"
          >
            <div className="relative mb-6 px-1 pt-1 sm:mb-7">
              <DesktopFrame
                accent={project.accent}
                variant={project.id as 'landing' | 'websites' | 'custom'}
              />
              <MobileFrame accent={project.accent} />
            </div>
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/70">
                {project.category}
              </p>
              <p className="mt-2 font-arabic text-sm text-smoke">{project.tag}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
