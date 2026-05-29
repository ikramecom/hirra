import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { GUARANTEE } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function GuaranteeSection() {
  return (
    <SectionShell id="guarantee" labelledBy="guarantee-title">
      <SectionHeader id="guarantee-title" eyebrow={GUARANTEE.eyebrow} title={GUARANTEE.title} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="guarantee-panel mx-auto max-w-2xl text-center"
      >
        <div className="guarantee-badge-large group/guarantee mx-auto inline-flex flex-col items-center gap-5 rounded-[28px] px-8 py-10 sm:px-12 sm:py-12">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.1] transition-all duration-500 group-hover/guarantee:border-gold/45 group-hover/guarantee:bg-gold/[0.16]"
            aria-hidden
          >
            <ShieldCheck className="h-7 w-7 text-gold" strokeWidth={1.5} />
          </span>
          <p className="font-arabic text-xl font-bold text-pearl sm:text-2xl">{GUARANTEE.label}</p>
          <p className="max-w-md font-arabic text-sm leading-[1.85] text-smoke sm:text-base">
            {GUARANTEE.description}
          </p>
        </div>
      </motion.div>
    </SectionShell>
  );
}
