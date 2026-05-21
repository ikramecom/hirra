import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { useUIStore } from '@/store/ui';
import { Eyebrow } from '@/components/common/Eyebrow';
import { HirraLogo } from '@/components/brand/HirraLogo';

/**
 * Mobile navigation drawer.
 *
 * - Editorial header with logo mark
 * - Sectioned link list (Shop / Brand / Help) using Eyebrow as the
 *   category cap, instead of a flat link list.
 * - Slides from start edge (RTL/LTR aware).
 */
export function MobileNav() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'ar' | 'en';
  const isOpen = useUIStore((s) => s.isMobileNavOpen);
  const close = useUIStore((s) => s.closeMobileNav);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-walnut/45 backdrop-blur-[1px] z-40"
            onClick={close}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-y-0 start-0 w-80 max-w-[85vw] bg-cream z-50 shadow-card-hover flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-walnut/10">
              <Link to="/" onClick={close} className="text-walnut">
                <HirraLogo variant="full" showTagline />
              </Link>
              <button
                type="button"
                onClick={close}
                className="p-2 -me-2 text-walnut hover:text-emerald transition"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sectioned nav */}
            <nav className="flex-1 overflow-y-auto p-5 space-y-7">
              <div className="space-y-2">
                <Eyebrow>{locale === 'ar' ? 'تسوّقي' : 'Shop'}</Eyebrow>
                <ul className="space-y-1 pt-1">
                  <NavRow to="/" onClick={close}>
                    {t('nav.home')}
                  </NavRow>
                  <NavRow to="/products" onClick={close}>
                    {locale === 'ar' ? 'كل المنتجات' : 'All products'}
                  </NavRow>
                  <NavRow to="/products/hirra-pro-roller" onClick={close}>
                    Hirra Pro Roller
                  </NavRow>
                  <NavRow to="/products/hirra-honeycomb-mat" onClick={close}>
                    Hirra Honeycomb Mat
                  </NavRow>
                  <NavRow to="/products/hirra-aurora-fountain" onClick={close}>
                    Hirra Aurora Fountain
                  </NavRow>
                </ul>
              </div>

              <div className="space-y-2">
                <Eyebrow>{locale === 'ar' ? 'البراند' : 'Brand'}</Eyebrow>
                <ul className="space-y-1 pt-1">
                  <NavRow to="/about" onClick={close}>
                    {t('nav.about')}
                  </NavRow>
                  <NavRow to="/contact" onClick={close}>
                    {t('nav.contact')}
                  </NavRow>
                </ul>
              </div>

              <div className="space-y-2">
                <Eyebrow>{locale === 'ar' ? 'المساعدة' : 'Help'}</Eyebrow>
                <ul className="space-y-1 pt-1">
                  <NavRow to="/track" onClick={close}>
                    {t('nav.track')}
                  </NavRow>
                  <NavRow to="/faq" onClick={close}>
                    {t('footer.faq')}
                  </NavRow>
                </ul>
              </div>
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

function NavRow({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="block py-2.5 px-2 -mx-2 rounded-lg text-walnut font-semibold hover:bg-whisper hover:text-emerald transition"
      >
        {children}
      </Link>
    </li>
  );
}
