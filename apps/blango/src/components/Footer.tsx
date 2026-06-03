import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';
import { EMAIL, FACEBOOK, FOOTER, INSTAGRAM, WHATSAPP } from '@/lib/sections-data';
import { BusinessEmail } from '@/components/common/BusinessEmail';
import { PhoneNumber } from '@/components/common/PhoneNumber';

const FOOTER_CHANNELS = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: WHATSAPP.url,
    external: true,
    value: <PhoneNumber className="footer-channel-value phone-number--footer" />,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    href: INSTAGRAM.url,
    external: true,
    value: (
      <span dir="ltr" className="footer-channel-value">
        {INSTAGRAM.handle}
      </span>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: FACEBOOK.url,
    external: true,
    value: (
      <span dir="ltr" className="footer-channel-value">
        {FACEBOOK.handle}
      </span>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    href: EMAIL.href,
    external: false,
    value: <BusinessEmail className="footer-channel-value" />,
  },
] as const;

export function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden border-t border-white/[0.06]">
      <div className="footer-glow pointer-events-none absolute inset-0" aria-hidden />

      <div className="container-content site-footer-inner relative">
        <div className="site-footer-premium mx-auto max-w-lg text-center">
          <Link to={ROUTES.home} dir="ltr" lang="en" className="site-footer-brand">
            {FOOTER.brand}
          </Link>

          <p className="site-footer-description">{FOOTER.description}</p>

          <div className="site-footer-channels" dir="ltr" lang="en" aria-label="قنوات التواصل">
            {FOOTER_CHANNELS.map((channel, index) => (
              <Fragment key={channel.key}>
                {index > 0 ? (
                  <span className="site-footer-sep" aria-hidden>
                    •
                  </span>
                ) : null}
                <a
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="site-footer-channel"
                >
                  <span className="site-footer-channel-label">{channel.label}</span>
                  <span className="site-footer-channel-detail">{channel.value}</span>
                </a>
              </Fragment>
            ))}
          </div>

          <p className="site-footer-copyright">{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
