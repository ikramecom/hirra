import { motion } from 'framer-motion';
import { WHY_BLANGO } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function WhyBlangoSection() {
  return (
    <SectionShell id="why-blango" labelledBy="why-blango-title">
      <SectionHeader
        id="why-blango-title"
        eyebrow={WHY_BLANGO.eyebrow}
        title={WHY_BLANGO.title}
      />

      <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {WHY_BLANGO.items.map(({ label, icon: Icon }, index) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="luxury-card group/card flex h-full flex-col gap-4 p-6 sm:p-7">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/25 bg-gold/[0.08] transition-all duration-500 group-hover/card:border-gold/40 group-hover/card:bg-gold/[0.14]"
                aria-hidden
              >
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
              </span>
              <p className="font-arabic text-[15px] font-medium leading-relaxed text-pearl/90 sm:text-base">
                {label}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </SectionShell>
  );
}
