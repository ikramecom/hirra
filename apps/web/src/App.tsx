import { Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/HomePage';

const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const BundlesPage = lazy(() => import('@/pages/BundlesPage'));
const BundlePage = lazy(() => import('@/pages/BundlePage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'));
const TrackOrderPage = lazy(() => import('@/pages/TrackOrderPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ShippingPolicyPage = lazy(() => import('@/pages/policies/ShippingPolicyPage'));
const RefundPolicyPage = lazy(() => import('@/pages/policies/RefundPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/policies/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('@/pages/policies/TermsPage'));

function PageFallback() {
  return (
    <div className="min-h-[40vh] grid place-items-center">
      <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
    </div>
  );
}

/** Lazy pages only — homepage is never behind Suspense (no empty shell). */
function LazyRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Outlet />
    </Suspense>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<LazyRoutes />}>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/bundles" element={<BundlesPage />} />
          <Route path="/bundles/:slug" element={<BundlePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/policies/shipping" element={<ShippingPolicyPage />} />
          <Route path="/policies/refunds" element={<RefundPolicyPage />} />
          <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/policies/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Layout>
  );
}
