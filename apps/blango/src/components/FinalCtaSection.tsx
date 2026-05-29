import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FINAL_CTA } from '@/lib/sections-data';
import { SectionShell } from './SectionShell';

export function FinalCtaSection() {
  return (
    <SectionShell id="consultation" variant="cta" labelledBy="cta-title">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="cta-panel mx-auto max-w-3xl text-center"
      >
        <div className="mx-auto mb-7 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gradient-to-l from-gold/50 to-transparent" aria-hidden />
          <span className="h-1.5 w-1.5 rounded-full bg-gold/60" aria-hidden />
          <span className="h-px w-10 bg-gradient-to-r from-gold/50 to-transparent" aria-hidden />
        </div>
        <h2
          id="cta-title"
          className="font-arabic text-[1.75rem] font-bold leading-tight text-pearl sm:text-4xl"
        >
          {FINAL_CTA.title}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-[1.75] text-smoke sm:text-lg">
          {FINAL_CTA.text}
        </p>
        <motion.a
          href="#contact"
          whileTap={{ scale: 0.985 }}
          className="cta-button group/cta mt-10 inline-flex items-center justify-center gap-2.5 rounded-xl px-8 py-4 text-sm font-semibold sm:text-base"
        >
          {FINAL_CTA.button}
          <ArrowLeft
            className="h-4 w-4 opacity-80 transition-transform duration-500 group-hover/cta:-translate-x-0.5"
            aria-hidden
          />
        </motion.a>
      </motion.div>
    </SectionShell>
  );
}
