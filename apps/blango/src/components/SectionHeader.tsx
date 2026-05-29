import { motion } from 'framer-motion';

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ id, eyebrow, title, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20 ${className}`}
    >
      {eyebrow ? (
        <p className="mb-5 font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-gold/80">
          {eyebrow}
        </p>
      ) : null}
      <div className="mx-auto mb-7 flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-gradient-to-l from-gold/50 to-transparent" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-gold/60" aria-hidden />
        <span className="h-px w-10 bg-gradient-to-r from-gold/50 to-transparent" aria-hidden />
      </div>
      <h2
        id={id}
        className="font-arabic text-[1.75rem] font-bold leading-[1.25] tracking-tight text-pearl sm:text-4xl lg:text-[2.5rem]"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-5 max-w-lg text-base leading-[1.75] text-smoke sm:text-lg">{subtitle}</p>
      ) : null}
    </motion.header>
  );
}
