import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { FOOTER_NAV, ROUTES } from '@/lib/routes';
import { FOOTER, WHATSAPP } from '@/lib/sections-data';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { BusinessEmail } from '@/components/common/BusinessEmail';
import { PhoneNumber } from '@/components/common/PhoneNumber';
import { FacebookIcon } from '@/components/icons/FacebookIcon';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

const CONTACT_ICONS = {
  whatsapp: MessageCircle,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  email: Mail,
} as const;

export function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden border-t border-white/[0.06]">
      <div className="footer-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-content relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link to={ROUTES.home}>
              <BrandLogo variant="footer" />
            </Link>
            <p className="type-body mt-5 max-w-sm text-smoke">{FOOTER.tagline}</p>
            <a
              href={WHATSAPP.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-8 inline-flex"
            >
              {FOOTER.cta}
              <ArrowLeft className="h-4 w-4 opacity-85" aria-hidden />
            </a>
          </div>

          <div className="lg:col-span-3">
            <p className="type-label mb-6 text-gold/80">روابط سريعة</p>
            <ul className="space-y-3">
              {FOOTER_NAV.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="type-label mb-6 text-gold/80">تواصل معنا</p>
            <ul className="space-y-4">
              {FOOTER.contact.map((item) => {
                const Icon = CONTACT_ICONS[item.key];
                const isExternal = item.key !== 'email';
                const hint = 'hint' in item ? item.hint : undefined;

                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={cn(
                        'footer-contact flex items-center gap-3',
                        item.key === 'whatsapp' && 'footer-contact-primary',
                      )}
                    >
                      <span
                        className={cn(
                          'footer-contact-icon',
                          item.key === 'whatsapp' && 'footer-contact-icon-wa',
                        )}
                      >
                        <Icon className="h-4 w-4 text-gold" strokeWidth={1.75} />
                      </span>
                      <span className="flex flex-col gap-0.5">
                        <span className="font-arabic text-sm text-pearl/90">{item.label}</span>
                        {hint ? (
                          item.key === 'whatsapp' ? (
                            <PhoneNumber className="font-sans text-xs text-gold/70" />
                          ) : item.key === 'email' ? (
                            <BusinessEmail className="font-sans text-xs text-gold/70" />
                          ) : (
                            <span dir="ltr" className="font-sans text-xs text-gold/70">
                              {hint}
                            </span>
                          )
                        ) : null}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="font-sans text-xs text-muted">
            © {new Date().getFullYear()} Blango Studio. جميع الحقوق محفوظة.
          </p>
          <p className="font-sans text-[10px] uppercase tracking-wide text-muted">
            Premium Digital Agency
          </p>
        </div>
      </div>
    </footer>
  );
}
