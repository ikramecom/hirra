import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_CTA, WHATSAPP } from '@/lib/sections-data';
import { ROUTES } from '@/lib/routes';
import { SectionShell } from './SectionShell';

export function FinalCtaSection() {
  return (
    <SectionShell variant="cta" labelledBy="final-cta-title" className="section-home-cta">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 id="final-cta-title" className="type-section-title">
          {CONTACT_CTA.title}
        </h2>
        <p className="home-cta-text type-subtitle mx-auto max-w-lg">{CONTACT_CTA.text}</p>
        <div className="final-cta-actions flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:gap-3">
          <a
            href={WHATSAPP.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-primary-lg inline-flex w-full sm:w-auto"
          >
            {CONTACT_CTA.button}
            <ArrowLeft className="h-4 w-4 opacity-85" aria-hidden />
          </a>
          <Link to={ROUTES.contact} className="btn-secondary btn-secondary-glass inline-flex w-full sm:w-auto">
            صفحة التواصل
          </Link>
        </div>
      </motion.div>
    </SectionShell>
  );
}
