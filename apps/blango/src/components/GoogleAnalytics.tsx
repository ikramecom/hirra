import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGoogleAnalytics, trackGa4PageView } from '@/lib/google-analytics';

/**
 * GA4 SPA tracking — official gtag config page_path updates on each React Router navigation.
 * Base gtag snippet is injected at the top of index.html at build time.
 */
export function GoogleAnalytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    initGoogleAnalytics();
  }, []);

  useEffect(() => {
    trackGa4PageView(`${pathname}${search}`);
  }, [pathname, search]);

  return null;
}
