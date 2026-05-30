import { motion } from 'framer-motion';
import { WHY_BLANGO } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

interface WhyBlangoSectionProps {
  embedded?: boolean;
}

export function WhyBlangoSection({ embedded = false }: WhyBlangoSectionProps) {
  return (
    <SectionShell
      id="why-blango"
      labelledBy="why-blango-title"
      className={embedded ? 'section-embedded' : ''}
    >
      <SectionHeader
        id="why-blango-title"
        eyebrow={WHY_BLANGO.eyebrow}
        title={WHY_BLANGO.title}
      />

      <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {WHY_BLANGO.items.map(({ label, description, icon: Icon }, index) => (
          <motion.li
            key={label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: index * 0.07,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="luxury-card group/card flex h-full flex-col gap-5 p-7 sm:p-8">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.12] to-transparent transition-all duration-500 group-hover/card:border-gold/45 group-hover/card:shadow-glow"
                aria-hidden
              >
                <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-heading text-lg font-bold text-pearl sm:text-xl">{label}</h3>
                <p className="type-body mt-3 text-smoke">{description}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </SectionShell>
  );
}
