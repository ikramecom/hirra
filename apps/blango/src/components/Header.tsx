import { useEffect, useState } from 'react';
import { Menu, MessageCircle, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { MOBILE_NAV_ITEMS, NAV_ITEMS, ROUTES } from '@/lib/routes';
import { INSTAGRAM, WHATSAPP } from '@/lib/sections-data';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

const NAV_SOCIAL_ICON_CLASS = 'h-[14px] w-[14px]';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const closeMobile = () => setMobileOpen(false);

  const isNavActive = (to: string, end?: boolean) => {
    if (end) {
      return location.pathname === to;
    }
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const handleNavClick = (to: string) => {
    closeMobile();
    navigate(to);
  };

  return (
    <header className={cn('site-header', scrolled && 'site-header-scrolled')}>
      <div className="container-content header-inner">
        <Link
          to={ROUTES.home}
          dir="ltr"
          lang="en"
          className="brand-block-link"
          onClick={closeMobile}
        >
          <BrandLogo variant="header" />
        </Link>

        <div className="header-desktop hidden items-center md:flex">
          <nav className="flex items-center gap-0.5" aria-label="التنقل الرئيسي">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavClick(item.to)}
                className={cn(
                  'nav-link',
                  isNavActive(item.to, 'end' in item ? item.end : false) && 'nav-link-active',
                )}
              >
                {item.label}
                {isNavActive(item.to, 'end' in item ? item.end : false) ? (
                  <span className="nav-indicator" aria-hidden />
                ) : null}
              </button>
            ))}
          </nav>

          <div className="header-social-group ms-4 flex items-center gap-1.5">
            <a
              href={WHATSAPP.url}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social nav-social-wa"
              aria-label={`${WHATSAPP.label} — ${WHATSAPP.number}`}
            >
              <MessageCircle className={NAV_SOCIAL_ICON_CLASS} strokeWidth={1.75} />
            </a>
            <a
              href={INSTAGRAM.url}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-social nav-social-ig"
              aria-label={`${INSTAGRAM.label} — ${INSTAGRAM.handle}`}
            >
              <InstagramIcon className={NAV_SOCIAL_ICON_CLASS} />
            </a>
          </div>

          <a
            href={WHATSAPP.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-cta-wa ms-3"
          >
            {WHATSAPP.label}
          </a>
        </div>

        <div className="header-mobile flex shrink-0 items-center gap-1.5 md:hidden">
          <a
            href={WHATSAPP.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-social nav-social-wa"
            aria-label={`${WHATSAPP.label} — ${WHATSAPP.number}`}
          >
            <MessageCircle className={NAV_SOCIAL_ICON_CLASS} strokeWidth={1.75} />
          </a>
          <a
            href={INSTAGRAM.url}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-social nav-social-ig"
            aria-label={`${INSTAGRAM.label} — ${INSTAGRAM.handle}`}
          >
            <InstagramIcon className={NAV_SOCIAL_ICON_CLASS} />
          </a>

          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="mobile-nav-panel md:hidden" role="dialog" aria-modal="true" aria-label="قائمة التنقل">
          <div className="mobile-nav-drawer container-content">
            <nav className="mobile-nav-links" aria-label="التنقل الرئيسي">
              {MOBILE_NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.to)}
                  className={cn(
                    'mobile-nav-link text-start',
                    isNavActive(item.to, 'end' in item ? item.end : false) && 'mobile-nav-link-active',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mobile-nav-social" aria-label="تواصل سريع">
              <a
                href={WHATSAPP.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-social-btn mobile-nav-social-btn-wa"
                aria-label={`${WHATSAPP.label} — ${WHATSAPP.number}`}
                onClick={closeMobile}
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
              </a>
              <a
                href={INSTAGRAM.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav-social-btn"
                aria-label={`${INSTAGRAM.label} — ${INSTAGRAM.handle}`}
                onClick={closeMobile}
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
