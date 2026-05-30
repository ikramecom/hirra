import { motion } from 'framer-motion';
import { HOW_WE_WORK } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function HowWeWorkSection() {
  return (
    <SectionShell id="process" variant="elevated" labelledBy="process-title">
      <SectionHeader
        id="process-title"
        eyebrow={HOW_WE_WORK.eyebrow}
        title={HOW_WE_WORK.title}
        subtitle={HOW_WE_WORK.subtitle}
      />

      <div className="mx-auto max-w-3xl">
        <ol className="process-timeline relative">
          <div className="process-line pointer-events-none absolute bottom-0 top-0 w-px bg-gradient-to-b from-gold/40 via-gold/15 to-transparent" aria-hidden />

          {HOW_WE_WORK.steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="process-step relative pb-12 last:pb-0"
            >
              <div className="flex gap-6 sm:gap-8">
                <div className="process-node relative z-10 flex shrink-0 flex-col items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-obsidian font-price text-base font-bold tabular-nums text-gold shadow-[0_0_24px_rgba(212,175,106,0.15)]">
                    {index + 1}
                  </span>
                </div>

                <div className="process-card luxury-card flex-1 p-6 sm:p-7">
                  <h3 className="font-heading text-lg font-bold text-pearl sm:text-xl">{step.title}</h3>
                  <p className="type-body mt-3 text-smoke">{step.description}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
