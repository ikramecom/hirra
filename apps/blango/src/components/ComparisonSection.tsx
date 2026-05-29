import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { COMPARISON } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function ComparisonSection() {
  return (
    <SectionShell id="comparison" variant="elevated" labelledBy="comparison-title">
      <SectionHeader id="comparison-title" eyebrow={COMPARISON.eyebrow} title={COMPARISON.title} />

      <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {COMPARISON.items.map((item, index) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="comparison-card group/comp flex h-full items-center gap-4 p-5 sm:p-6">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.07] transition-all duration-500 group-hover/comp:border-gold/40 group-hover/comp:bg-gold/[0.12]"
                aria-hidden
              >
                <Check className="h-4 w-4 stroke-[2.5] text-gold" />
              </span>
              <p className="font-arabic text-[14px] font-medium leading-relaxed text-pearl/90 sm:text-[15px]">
                {item}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </SectionShell>
  );
}
