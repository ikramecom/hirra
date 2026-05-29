import { motion } from 'framer-motion';
import { HOW_WE_WORK } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function HowWeWorkSection() {
  return (
    <SectionShell id="process" labelledBy="process-title">
      <SectionHeader id="process-title" eyebrow={HOW_WE_WORK.eyebrow} title={HOW_WE_WORK.title} />

      <ol className="timeline mx-auto max-w-2xl">
        {HOW_WE_WORK.steps.map((step, index) => (
          <motion.li
            key={step}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="timeline-step group/step relative pb-10 last:pb-0"
          >
            <div className="timeline-marker flex items-start gap-5 sm:gap-6">
              <span
                className="timeline-number flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-obsidian font-sans text-xs font-semibold text-gold transition-all duration-500 group-hover/step:border-gold/50 group-hover/step:bg-gold/[0.1]"
                aria-hidden
              >
                {index + 1}
              </span>
              <div className="timeline-content luxury-card flex-1 px-5 py-4 sm:px-6 sm:py-5">
                <p className="font-arabic text-[15px] font-medium leading-relaxed text-pearl sm:text-base">
                  {step}
                </p>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </SectionShell>
  );
}
