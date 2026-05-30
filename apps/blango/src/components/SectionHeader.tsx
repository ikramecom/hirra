import { motion } from 'framer-motion';

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  density?: 'default' | 'compact';
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
  className = '',
  density = 'default',
}: SectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className={`section-header mx-auto max-w-3xl text-center ${density === 'compact' ? 'section-header-compact' : 'mb-16 sm:mb-20 lg:mb-24'} ${className}`}
    >
      {eyebrow ? <p className="type-eyebrow mb-6">{eyebrow}</p> : null}

      <div className="section-divider">
        <span className="section-divider-line" aria-hidden />
        <span className="section-divider-dot" aria-hidden />
        <span className="section-divider-line rotate-180" aria-hidden />
      </div>

      <h2 id={id} className="type-section-title">
        {title}
      </h2>

      {subtitle ? (
        <p className={`type-subtitle section-header-subtitle mx-auto max-w-xl ${density === 'compact' ? 'mt-4' : 'mt-7'}`}>
          {subtitle}
        </p>
      ) : null}
    </motion.header>
  );
}
