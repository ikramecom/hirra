import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/sections-data';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function TestimonialsSection() {
  return (
    <SectionShell id="testimonials" variant="elevated" labelledBy="testimonials-title">
      <SectionHeader
        id="testimonials-title"
        eyebrow={TESTIMONIALS.eyebrow}
        title={TESTIMONIALS.title}
        subtitle={TESTIMONIALS.subtitle}
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {TESTIMONIALS.items.map((item, index) => (
          <motion.blockquote
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="testimonial-card group/quote luxury-card flex h-full flex-col p-6 sm:p-7"
          >
            <Quote
              className="mb-5 h-5 w-5 text-gold/50 transition-colors duration-500 group-hover/quote:text-gold/70"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="flex-1 font-arabic text-[14px] leading-[1.85] text-pearl/85 sm:text-[15px]">
              «{item.quote}»
            </p>
            <footer className="mt-6 border-t border-white/[0.06] pt-5">
              <cite className="not-italic">
                <p className="font-arabic text-sm font-semibold text-pearl">{item.name}</p>
                <p className="mt-1 font-arabic text-xs text-smoke">{item.role}</p>
              </cite>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </SectionShell>
  );
}
