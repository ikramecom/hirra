import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContactPage } from '@/pages/ContactPage';
import { FaqPage } from '@/pages/FaqPage';
import { HomePage } from '@/pages/HomePage';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { PricingPage } from '@/pages/PricingPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { ROUTES } from '@/lib/routes';

const WhyUsPage = lazy(() =>
  import('@/pages/WhyUsPage').then((m) => ({ default: m.WhyUsPage })),
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.services} element={<ServicesPage />} />
          <Route
            path={ROUTES.whyUs}
            element={
              <Suspense fallback={null}>
                <WhyUsPage />
              </Suspense>
            }
          />
          <Route path={ROUTES.pricing} element={<PricingPage />} />
          <Route path={ROUTES.portfolio} element={<PortfolioPage />} />
          <Route path={ROUTES.faq} element={<FaqPage />} />
          <Route path={ROUTES.contact} element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
