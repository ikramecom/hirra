import { Outlet } from 'react-router-dom';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { MetaPixel } from '@/components/MetaPixel';
import { PageSeo } from '@/components/PageSeo';
import { ScrollToTop } from './ScrollToTop';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-obsidian">
      <GoogleAnalytics />
      <MetaPixel />
      <PageSeo />
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
