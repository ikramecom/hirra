import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { BEFORE_AFTER } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function BeforeAfterSection() {
  return (
    <SectionShell id="compare" variant="elevated" labelledBy="compare-title">
      <SectionHeader
        id="compare-title"
        eyebrow={BEFORE_AFTER.eyebrow}
        title={BEFORE_AFTER.title}
        subtitle={BEFORE_AFTER.subtitle}
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="compare-card compare-card-before"
        >
          <p className="compare-label">{BEFORE_AFTER.before.label}</p>
          <ul className="mt-6 space-y-4">
            {BEFORE_AFTER.before.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="compare-icon compare-icon-bad">
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <span className="font-arabic text-[15px] text-smoke">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="compare-card compare-card-after"
        >
          <p className="compare-label compare-label-gold">{BEFORE_AFTER.after.label}</p>
          <ul className="mt-6 space-y-4">
            {BEFORE_AFTER.after.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="compare-icon compare-icon-good">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                <span className="font-arabic text-[15px] text-pearl/90">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </SectionShell>
  );
}
