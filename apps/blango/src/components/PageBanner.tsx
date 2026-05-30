import { motion } from 'framer-motion';

interface PageBannerProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function PageBanner({ eyebrow, title, subtitle }: PageBannerProps) {
  return (
    <section className="page-banner relative overflow-hidden border-b border-white/[0.05] pt-28 sm:pt-32 lg:pt-36">
      <div className="page-banner-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-content relative pb-14 sm:pb-16 lg:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="type-eyebrow mb-6">{eyebrow}</p>
          <div className="section-divider mb-8">
            <span className="section-divider-line" aria-hidden />
            <span className="section-divider-dot" aria-hidden />
            <span className="section-divider-line rotate-180" aria-hidden />
          </div>
          <h1 className="type-section-title">{title}</h1>
          {subtitle ? <p className="type-subtitle mx-auto mt-6 max-w-xl">{subtitle}</p> : null}
        </motion.div>
      </div>
    </section>
  );
}
