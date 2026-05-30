import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash, state } = useLocation();

  useEffect(() => {
    const scrollTarget =
      (state as { scrollTo?: string } | null)?.scrollTo ?? hash.replace('#', '');

    if (scrollTarget && pathname === '/') {
      const el = document.getElementById(scrollTarget);
      if (el) {
        const timer = window.setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
        return () => window.clearTimeout(timer);
      }
    }

    if (!scrollTarget) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname, hash, state]);

  return null;
}
