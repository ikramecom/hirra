import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applyPageSeo } from '@/lib/seo';

/**
 * Per-route SEO (title, description, OG, Twitter, Arabic + mobile meta).
 * No DOM output — keeps the app lightweight on mobile.
 */
export function PageSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    applyPageSeo(pathname);
  }, [pathname]);

  return null;
}
