import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, ShoppingBag, Globe } from 'lucide-react';

import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { HirraLogo } from '@/components/brand/HirraLogo';
import { cn } from '@/lib/cn';

/**
 * Premium navigation chrome.
 *
 * - Logo gets a hand-set wordmark in display script + tiny brass tagline cap.
 * - Nav uses link-underline animation (brass-toned underline on hover/active).
 * - Cart icon shows a brass-on-emerald counter dot only when count > 0.
 */
export function Header() {
  const { t, i18n } = useTranslation();
  const itemCount = useCartStore((s) => s.itemCount());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const openMobileNav = useUIStore((s) => s.openMobileNav);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur-md border-b border-walnut/10">
      <div className="container-content flex items-center justify-between gap-4 h-16">
        <button
          type="button"
          onClick={openMobileNav}
          className="md:hidden p-2 -ms-2 text-walnut hover:text-emerald transition"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link
          to="/"
          className="text-walnut hover:opacity-90 transition-opacity -my-1"
          aria-label={t('brand.name')}
        >
          <HirraLogo variant="icon" className="sm:hidden" />
          <HirraLogo variant="full" showTagline className="hidden sm:inline-flex" />
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-walnut/80">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn('link-underline transition', isActive && 'text-emerald')
            }
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              cn('link-underline transition', isActive && 'text-emerald')
            }
          >
            {t('nav.shop')}
          </NavLink>
          <NavLink
            to="/products/hirra-pro-roller"
            className={({ isActive }) =>
              cn('link-underline transition', isActive && 'text-emerald')
            }
          >
            {t('nav.bestsellers')}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              cn('link-underline transition', isActive && 'text-emerald')
            }
          >
            {t('nav.about')}
          </NavLink>
          <NavLink
            to="/track"
            className={({ isActive }) =>
              cn('link-underline transition', isActive && 'text-emerald')
            }
          >
            {t('nav.track')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLanguage}
            className="p-2 text-walnut/70 hover:text-emerald transition flex items-center gap-1.5 text-sm font-semibold"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.language')}</span>
          </button>

          <button
            type="button"
            onClick={openDrawer}
            className="relative p-2 text-walnut hover:text-emerald transition"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-6 w-6" />
            {itemCount > 0 ? (
              <span
                className="absolute -top-0.5 -end-0.5 bg-emerald text-cream text-[10px] font-bold rounded-full h-5 min-w-5 px-1 grid place-items-center ring-2 ring-cream tabular"
                aria-label={`${itemCount} items in cart`}
              >
                {itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
