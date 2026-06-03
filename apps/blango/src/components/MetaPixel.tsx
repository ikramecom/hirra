import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getMetaPixelId,
  handleMetaLeadClick,
  initMetaPixel,
  isMetaPixelInHtml,
  trackMetaPageView,
} from '@/lib/meta-pixel';

const LOG_PREFIX = '[Blango Meta Pixel]';

/**
 * Meta Pixel: SPA PageView on route change, Lead on WhatsApp / form / consultation CTA.
 * Base code is injected into index.html at build time when VITE_META_PIXEL_ID is set.
 */
export function MetaPixel() {
  const { pathname } = useLocation();
  const skipFirstPageView = useRef(isMetaPixelInHtml());

  useEffect(() => {
    console.log(`${LOG_PREFIX} MetaPixel mounted`);
    console.log(`${LOG_PREFIX} Pixel ID:`, getMetaPixelId() ?? '(not set at build)');
    const initialized = initMetaPixel();
    console.log(`${LOG_PREFIX} MetaPixel initialized:`, initialized);
  }, []);

  useEffect(() => {
    if (skipFirstPageView.current) {
      skipFirstPageView.current = false;
      return;
    }
    trackMetaPageView();
  }, [pathname]);

  useEffect(() => {
    const pixelId = getMetaPixelId();
    if (!pixelId) {
      return;
    }

    document.addEventListener('click', handleMetaLeadClick, true);
    return () => document.removeEventListener('click', handleMetaLeadClick, true);
  }, []);

  return null;
}
