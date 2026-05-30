import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '@/lib/sections-data';
import { ROUTES } from '@/lib/routes';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

interface ServicesSectionProps {
  variant?: 'preview' | 'full';
  embedded?: boolean;
}

function getServices(variant: 'preview' | 'full') {
  if (variant === 'full') {
    return [...SERVICES.items];
  }
  return SERVICES.items.filter((item) =>
    (SERVICES.featuredIds as readonly string[]).includes(item.id),
  );
}

export function ServicesSection({ variant = 'full', embedded = false }: ServicesSectionProps) {
  const isPreview = variant === 'preview';
  const items = getServices(variant);

  return (
    <SectionShell
      id="services"
      variant="elevated"
      labelledBy="services-title"
      className={
        isPreview ? 'section-home-services' : embedded ? 'section-embedded' : ''
      }
    >
      <SectionHeader
        id="services-title"
        eyebrow={SERVICES.eyebrow}
        title={isPreview ? SERVICES.previewTitle : SERVICES.title}
        subtitle={isPreview ? SERVICES.previewSubtitle : SERVICES.subtitle}
        density={isPreview ? 'compact' : 'default'}
      />

      <ul
        className={
          isPreview
            ? 'services-grid-compact mx-auto grid max-w-3xl grid-cols-1 gap-3.5 sm:max-w-4xl sm:grid-cols-2 sm:gap-4'
            : 'mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7'
        }
      >
        {items.map(({ id, title, description, icon: Icon }, index) => (
          <motion.li
            key={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: index * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {isPreview ? (
              <div className="service-card service-card-compact group/service flex h-full flex-col">
                <span className="service-card-icon" aria-hidden>
                  <Icon className="text-gold" strokeWidth={1.75} />
                </span>
                <div className="service-card-body">
                  <h3 className="service-card-title">{title}</h3>
                  <p className="service-card-desc">{description}</p>
                </div>
              </div>
            ) : (
              <div className="service-card group/service flex h-full flex-col gap-5 p-7 sm:p-8">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/[0.1] to-transparent transition-all duration-500 group-hover/service:border-gold/45 group-hover/service:shadow-glow"
                  aria-hidden
                >
                  <Icon className="h-5 w-5 text-gold" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-pearl sm:text-xl">{title}</h3>
                  <p className="type-body mt-3 text-smoke">{description}</p>
                </div>
                <div className="mt-auto h-px w-full bg-gradient-to-l from-gold/20 to-transparent opacity-0 transition-opacity duration-500 group-hover/service:opacity-100" />
              </div>
            )}
          </motion.li>
        ))}
      </ul>

      {isPreview ? (
        <div className="mt-8 text-center sm:mt-9">
          <Link to={ROUTES.services} className="btn-secondary btn-secondary-glass inline-flex gap-2">
            {SERVICES.viewAll}
            <ArrowLeft className="h-4 w-4 opacity-85" aria-hidden />
          </Link>
        </div>
      ) : null}
    </SectionShell>
  );
}
