import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  initGoogleAnalytics,
  isGa4InHtml,
  trackGa4PageView,
} from '@/lib/google-analytics';

/**
 * GA4: gtag.js loaded once; page_path updated on each React Router navigation.
 * Base gtag snippet is injected into index.html at build time.
 */
export function GoogleAnalytics() {
  const { pathname, search } = useLocation();
  const skipFirstPageView = useRef(isGa4InHtml());

  useEffect(() => {
    initGoogleAnalytics();
  }, []);

  useEffect(() => {
    const pagePath = `${pathname}${search}`;
    if (skipFirstPageView.current) {
      skipFirstPageView.current = false;
      return;
    }
    trackGa4PageView(pagePath);
  }, [pathname, search]);

  return null;
}
