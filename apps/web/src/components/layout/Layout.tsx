import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { captureUtm, track } from '@/lib/tracking';

interface LayoutProps {
  children: ReactNode;
}

/**
 * App shell.
 *
 * - Announcement → Header → main → Footer
 * - Drawers (mobile nav, cart, WhatsApp button) live above the shell.
 * - Subtle page-transition fade keyed on the route path so SPA navigations
 *   feel intentional rather than abrupt.
 */
export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  useEffect(() => {
    captureUtm();
    track.pageView();
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <AnnouncementBar />
      <Header />
      <MobileNav />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </div>
  );
}
