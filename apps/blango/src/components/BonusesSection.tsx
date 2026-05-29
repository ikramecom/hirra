import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { BONUSES } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function BonusesSection() {
  return (
    <SectionShell id="bonuses" variant="elevated" labelledBy="bonuses-title">
      <SectionHeader id="bonuses-title" eyebrow={BONUSES.eyebrow} title={BONUSES.title} />

      <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
        {BONUSES.items.map(({ label, icon: Icon }, index) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={
              index === BONUSES.items.length - 1
                ? 'sm:col-span-2 sm:mx-auto sm:max-w-md sm:w-full'
                : ''
            }
          >
            <div className="bonus-card group/bonus flex h-full items-center gap-4 p-5 sm:p-6">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/[0.07] transition-all duration-500 group-hover/bonus:border-gold/35 group-hover/bonus:bg-gold/[0.12]"
                aria-hidden
              >
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
              </span>
              <div className="flex items-center gap-2.5">
                <Gift className="h-4 w-4 shrink-0 text-gold/70" strokeWidth={1.75} aria-hidden />
                <p className="font-arabic text-[14px] font-medium leading-relaxed text-pearl/90 sm:text-[15px]">
                  {label}
                </p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </SectionShell>
  );
}
