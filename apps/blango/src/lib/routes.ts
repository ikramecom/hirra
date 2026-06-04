/** Public URL paths — also listed in site.config.mjs for sitemap.xml generation. */
export const ROUTES = {
  home: '/',
  services: '/services',
  whyUs: '/why-us',
  pricing: '/pricing',
  portfolio: '/portfolio',
  faq: '/faq',
  contact: '/contact',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const NAV_ITEMS = [
  { to: ROUTES.home, label: 'الرئيسية', end: true as const },
  { to: ROUTES.services, label: 'الخدمات' },
  { to: ROUTES.whyUs, label: 'لماذا نحن' },
  { to: ROUTES.portfolio, label: 'الأعمال' },
  { to: ROUTES.pricing, label: 'الباقات' },
  { to: ROUTES.faq, label: 'الأسئلة' },
  { to: ROUTES.contact, label: 'تواصل' },
] as const;

/** Compact mobile drawer — navigation links only (no contact blocks). */
export const MOBILE_NAV_ITEMS = [
  { to: ROUTES.home, label: 'الرئيسية', end: true as const },
  { to: ROUTES.services, label: 'الخدمات' },
  { to: ROUTES.portfolio, label: 'الأعمال' },
  { to: ROUTES.pricing, label: 'الباقات' },
  { to: ROUTES.faq, label: 'الأسئلة' },
  { to: ROUTES.contact, label: 'تواصل' },
] as const;

export const FOOTER_NAV = [
  { to: ROUTES.home, label: 'الرئيسية' },
  { to: ROUTES.services, label: 'الخدمات' },
  { to: ROUTES.whyUs, label: 'لماذا نحن' },
  { to: ROUTES.portfolio, label: 'الأعمال' },
  { to: ROUTES.pricing, label: 'الباقات' },
  { to: ROUTES.faq, label: 'الأسئلة' },
  { to: ROUTES.contact, label: 'تواصل' },
] as const;
