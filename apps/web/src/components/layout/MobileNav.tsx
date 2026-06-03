import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import { useUIStore } from '@/store/ui';
import { RiyanaluxeLogo } from '@/components/brand/RiyanaluxeLogo';

function NavRow({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="block py-2.5 text-pearl hover:text-gold font-medium transition"
      >
        {children}
      </Link>
    </li>
  );
}

export function MobileNav() {
  const { t } = useTranslation();
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
            className="fixed inset-0 bg-black/60 z-40"
            onClick={close}
            aria-hidden
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            className="fixed inset-y-0 start-0 w-80 max-w-[85vw] bg-charcoal z-50 border-e border-gold/10 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gold/10">
              <RiyanaluxeLogo size="md" />
              <button type="button" onClick={close} className="p-2 text-pearl" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-5 space-y-1">
              <NavRow to="/" onClick={close}>
                {t('nav.home')}
              </NavRow>
              <NavRow to="/products/riyanaluxe-mabkhara-luxe" onClick={close}>
                {t('nav.mabkhara')}
              </NavRow>
              <NavRow to="/bundles" onClick={close}>
                {t('nav.bundles')}
              </NavRow>
              <NavRow to="/about" onClick={close}>
                {t('nav.about')}
              </NavRow>
              <NavRow to="/contact" onClick={close}>
                {t('nav.contact')}
              </NavRow>
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
