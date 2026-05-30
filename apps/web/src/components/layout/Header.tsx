import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, ShoppingBag, Globe } from 'lucide-react';

import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { RiyanaluxeLogo } from '@/components/brand/RiyanaluxeLogo';
import { cn } from '@/lib/cn';
import type { StoreLocale } from '@/i18n';

export function Header() {
  const { t, i18n } = useTranslation();
  const locale = (i18n.language === 'fr' ? 'fr' : 'ar') as StoreLocale;
  const itemCount = useCartStore((s) => s.itemCount());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const openMobileNav = useUIStore((s) => s.openMobileNav);

  const toggleLanguage = () => {
    i18n.changeLanguage(locale === 'ar' ? 'fr' : 'ar');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-sm font-medium transition-colors',
      isActive ? 'text-gold' : 'text-pearl/70 hover:text-pearl',
    );

  return (
    <header className="sticky top-0 z-30 bg-obsidian/90 backdrop-blur-xl border-b border-gold/10">
      <div className="container-content flex items-center justify-between h-16 md:h-[4.5rem]">
        <button
          type="button"
          onClick={openMobileNav}
          className="md:hidden p-2 text-pearl/80"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <RiyanaluxeLogo responsive className="md:mx-0 mx-auto md:mx-0 shrink-0" />

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/products/riyanaluxe-mabkhara-luxe" className={linkClass}>
            {t('nav.mabkhara')}
          </NavLink>
          <NavLink to="/bundles" className={linkClass}>
            {t('nav.bundles')}
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            {t('nav.about')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLanguage}
            className="p-2 text-pearl/60 hover:text-gold text-sm font-semibold flex items-center gap-1"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.language')}</span>
          </button>
          <button
            type="button"
            onClick={openDrawer}
            className="relative p-2 text-pearl hover:text-gold"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -top-0.5 -end-0.5 bg-gold text-obsidian text-[10px] font-bold rounded-full h-5 min-w-5 px-1 grid place-items-center">
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
