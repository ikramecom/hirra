import { motion } from 'framer-motion';
import { ArrowUpRight, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';
import { getStoreDomain } from '@/lib/portfolio-assets';
import { PORTFOLIO } from '@/lib/sections-data';
import { PortfolioPreview } from './PortfolioPreview';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

interface PortfolioSectionProps {
  embedded?: boolean;
}

export function PortfolioSection({ embedded = false }: PortfolioSectionProps) {
  return (
    <SectionShell
      id="portfolio"
      variant="elevated"
      labelledBy="portfolio-title"
      className={cn(embedded && 'section-embedded section-portfolio-page')}
    >
      {!embedded ? (
        <SectionHeader
          id="portfolio-title"
          eyebrow={PORTFOLIO.eyebrow}
          title={PORTFOLIO.title}
          subtitle={PORTFOLIO.subtitle}
        />
      ) : null}

      <div className="portfolio-projects-list mx-auto flex max-w-6xl flex-col gap-16 lg:gap-20">
        {PORTFOLIO.projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="case-study group"
          >
            <div
              className={`case-study-layout grid items-center gap-10 lg:grid-cols-2 lg:gap-14 ${index % 2 === 1 ? '' : ''}`}
            >
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="case-study-devices relative px-1 pt-1">
                  <div className="case-study-desktop overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a0a0a] shadow-2xl">
                    <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#111] px-3 py-2.5">
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57]/60" />
                      <span className="h-2 w-2 rounded-full bg-[#febc2e]/60" />
                      <span className="h-2 w-2 rounded-full bg-[#28c840]/60" />
                      <span className="mx-auto rounded-md border border-white/[0.06] bg-black/30 px-6 py-0.5 font-sans text-[7px] text-smoke/60">
                        {getStoreDomain(project.theme)}
                      </span>
                    </div>
                    <div className="aspect-[16/10]">
                      <PortfolioPreview theme={project.theme} variant="desktop" />
                    </div>
                  </div>
                  <div className="case-study-mobile absolute -bottom-4 -left-5 w-[27%] min-w-[96px] max-w-[128px] overflow-hidden rounded-[20px] border-2 border-white/[0.12] bg-[#0a0a0a] shadow-xl sm:-bottom-5 sm:-left-7">
                    <div className="mx-auto mt-1.5 h-0.5 w-9 rounded-full bg-white/15" />
                    <div className="aspect-[9/16]">
                      <PortfolioPreview theme={project.theme} variant="mobile" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`case-study-copy ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <span className="case-study-industry type-label text-gold/75">{project.industry}</span>
                <h3 className="case-study-title mt-3 font-heading text-2xl font-bold text-pearl sm:text-3xl">
                  {project.nameAr}
                </h3>

                <div className="case-study-meta mt-6 space-y-4">
                  <div className="case-study-goal flex items-start gap-3">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.75} />
                    <div>
                      <p className="type-label mb-1 text-gold/60">الهدف</p>
                      <p className="case-study-goal-text type-body text-smoke">{project.goal}</p>
                    </div>
                  </div>
                  <div className="case-study-result-row flex items-start gap-3">
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.75} />
                    <div>
                      <p className="type-label mb-1 text-gold/60">النتيجة</p>
                      <p className="case-study-result font-heading text-lg font-semibold text-gold-light sm:text-xl">
                        {project.result}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="case-study-explore mt-8 flex items-center gap-2 font-arabic text-sm text-smoke opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <span>استكشف المشروع</span>
                  <ArrowUpRight className="h-4 w-4 text-gold" />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

    </SectionShell>
  );
}
