import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { META_LEAD_CONSULTATION_ATTR } from '@/lib/meta-pixel';
import { CONTACT_SECTION } from '@/lib/sections-data';
import { BusinessEmail } from '@/components/common/BusinessEmail';
import { PhoneNumber } from '@/components/common/PhoneNumber';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

const CHANNEL_ICONS = {
  whatsapp: MessageCircle,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  email: Mail,
} as const;

interface ContactSectionProps {
  variant?: 'standalone' | 'page';
}

export function ContactSection({ variant = 'standalone' }: ContactSectionProps) {
  const isPage = variant === 'page';

  return (
    <section
      id="contact"
      className={cn(
        'contact-section relative overflow-hidden',
        isPage ? 'contact-section-page py-8 sm:py-16' : 'pt-28 sm:pt-36 lg:pt-44 pb-12 sm:pb-14 lg:pb-16',
      )}
      aria-labelledby={isPage ? undefined : 'contact-title'}
    >
      <div className="contact-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-content relative">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'mx-auto text-center',
            isPage ? 'contact-page-channels max-w-5xl' : 'contact-panel max-w-5xl',
          )}
        >
          {!isPage ? (
            <>
              <p className="type-eyebrow mb-6">{CONTACT_SECTION.eyebrow}</p>
              <div className="section-divider mb-8">
                <span className="section-divider-line" aria-hidden />
                <span className="section-divider-dot" aria-hidden />
                <span className="section-divider-line rotate-180" aria-hidden />
              </div>
              <h2 id="contact-title" className="type-section-title">
                {CONTACT_SECTION.title}
              </h2>
              <p className="type-subtitle mx-auto mt-6 max-w-lg">{CONTACT_SECTION.subtitle}</p>
            </>
          ) : null}

          <div
            className={cn(
              'contact-channels-grid grid gap-3 sm:gap-5',
              isPage ? 'grid-cols-2 lg:grid-cols-4' : 'mt-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
            )}
          >
            {CONTACT_SECTION.channels.map((channel) => {
              const { key, label, href, hint } = channel;
              const primary = 'primary' in channel && channel.primary;
              const Icon = CHANNEL_ICONS[key];
              const isWhatsApp = key === 'whatsapp';
              const isEmail = key === 'email';
              const isExternal = !isEmail;

              return (
                <a
                  key={key}
                  href={href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={cn(
                    'contact-channel group',
                    primary && isWhatsApp && 'contact-channel-primary',
                    primary && key === 'instagram' && 'contact-channel-secondary',
                    isEmail && 'contact-channel-email',
                    key === 'facebook' && 'contact-channel-facebook',
                  )}
                >
                  <span
                    className={cn(
                      'contact-channel-icon',
                      isWhatsApp && 'contact-channel-icon-wa',
                      isEmail && 'contact-channel-icon-email',
                    )}
                  >
                    <Icon className="h-4 w-4 text-gold sm:h-5 sm:w-5" strokeWidth={1.75} />
                  </span>
                  <span className="contact-channel-label font-heading text-sm font-semibold text-pearl sm:text-base">
                    {label}
                  </span>
                  <span className={cn('contact-channel-hint', isWhatsApp && 'contact-channel-hint-wa')}>
                    {isWhatsApp ? (
                      <PhoneNumber className="phone-number--centered font-sans text-[10px] text-gold/75 sm:text-xs" />
                    ) : isEmail ? (
                      <BusinessEmail className="business-email--centered font-sans text-[10px] text-gold/75 sm:text-xs" />
                    ) : (
                      <span dir="ltr" className="font-sans text-[10px] text-gold/75 sm:text-xs">
                        {hint}
                      </span>
                    )}
                  </span>
                  {isWhatsApp ? (
                    <span className="contact-channel-badge">الأولوية</span>
                  ) : null}
                </a>
              );
            })}
          </div>

          {!isPage ? (
            <a
              href={CONTACT_SECTION.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              data-meta-lead={META_LEAD_CONSULTATION_ATTR}
              className="btn-primary btn-primary-lg group/contact mt-14 inline-flex"
            >
              {CONTACT_SECTION.cta}
              <ArrowLeft className="h-4 w-4 opacity-85 transition-transform duration-500 group-hover/contact:-translate-x-1" aria-hidden />
            </a>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
