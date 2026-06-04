import { ROUTES, type AppRoute } from '@/lib/routes';

/** Mobile SERP display limits (Arabic uses fewer visible characters than Latin). */
const MOBILE_TITLE_MAX = 52;
const MOBILE_DESCRIPTION_MAX = 118;

export const SITE = {
  name: 'Blango Studio',
  language: 'ar',
  locale: 'ar_MA',
  defaultTitle: 'Blango Studio | مواقع وصفحات بيع',
  defaultDescription:
    'وكالة رقمية: تصميم مواقع وصفحات بيع، ربط واتساب، وإعداد إعلانات. استشارة مجانية.',
  ogImagePath: '/logo.png',
  ogImageAlt: 'شعار Blango Studio',
  ogImageWidth: '512',
  ogImageHeight: '512',
  twitterHandle: '@blangostudio',
  themeColor: '#000000',
  appleWebAppTitle: 'Blango Studio',
} as const;

export interface PageSeoConfig {
  title: string;
  description: string;
}

/** Titles and descriptions tuned for mobile search snippets (concise, keyword-first). */
export const PAGE_SEO: Record<AppRoute, PageSeoConfig> = {
  [ROUTES.home]: {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
  },
  [ROUTES.services]: {
    title: 'الخدمات | Blango Studio',
    description: 'صفحات هبوط، مواقع مخصصة، واتساب، وإعلانات Meta — من الفكرة إلى الإطلاق.',
  },
  [ROUTES.whyUs]: {
    title: 'لماذا نحن | Blango Studio',
    description: 'تصميم مخصص، دعم بعد التسليم، مواقع سريعة وجاهزة للإعلانات — بدون قوالب جاهزة.',
  },
  [ROUTES.pricing]: {
    title: 'الباقات | Blango Studio',
    description: 'باقات STARTER و PRO و BUSINESS و PREMIUM — أسعار واضحة وتسليم سريع.',
  },
  [ROUTES.portfolio]: {
    title: 'الأعمال | Blango Studio',
    description: 'مشاريع مواقع وصفحات بيع لعلامات فاخرة — نتائج حقيقية في العطور والأزياء.',
  },
  [ROUTES.faq]: {
    title: 'الأسئلة | Blango Studio',
    description: 'إجابات عن الدومين، الاستضافة، التسليم، الدفع والتعديلات قبل بدء مشروعك.',
  },
  [ROUTES.contact]: {
    title: 'تواصل | Blango Studio',
    description: 'تواصل عبر واتساب أو البريد — استشارة مجانية لتحويل فكرتك إلى موقع احترافي.',
  },
};

export function resolveSiteOrigin(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  const envUrl = import.meta.env.VITE_SITE_URL;
  if (typeof envUrl === 'string' && envUrl.length > 0) {
    return envUrl.replace(/\/$/, '');
  }

  return 'https://www.blangostudio.com';
}

function trimForMobileSnippet(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

export function getPageSeo(pathname: string): PageSeoConfig & {
  path: AppRoute;
  canonicalUrl: string;
  ogImageUrl: string;
  mobileTitle: string;
  mobileDescription: string;
} {
  const path = (Object.values(ROUTES).includes(pathname as AppRoute) ? pathname : ROUTES.home) as AppRoute;
  const seo = PAGE_SEO[path];
  const origin = resolveSiteOrigin();
  const mobileTitle = trimForMobileSnippet(seo.title, MOBILE_TITLE_MAX);
  const mobileDescription = trimForMobileSnippet(seo.description, MOBILE_DESCRIPTION_MAX);

  return {
    ...seo,
    title: mobileTitle,
    description: mobileDescription,
    mobileTitle,
    mobileDescription,
    path,
    canonicalUrl: `${origin}${path === ROUTES.home ? '' : path}`,
    ogImageUrl: `${origin}${SITE.ogImagePath}`,
  };
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra
    ? `link[rel="${rel}"]${Object.entries(extra)
        .map(([key, value]) => `[${key}="${value}"]`)
        .join('')}`
    : `link[rel="${rel}"]`;
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (extra) {
      for (const [key, value] of Object.entries(extra)) {
        element.setAttribute(key, value);
      }
    }
    document.head.appendChild(element);
  }

  element.href = href;
}

function upsertHttpEquiv(name: string, content: string) {
  let element = document.head.querySelector(`meta[http-equiv="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.httpEquiv = name;
    document.head.appendChild(element);
  }

  element.content = content;
}

export function applyPageSeo(pathname: string) {
  const seo = getPageSeo(pathname);

  document.documentElement.lang = SITE.language;
  document.documentElement.dir = 'rtl';
  document.title = seo.mobileTitle;

  upsertMeta('name', 'description', seo.mobileDescription);
  upsertMeta('name', 'language', SITE.language);
  upsertMeta('name', 'robots', 'index, follow, max-image-preview:large');
  upsertHttpEquiv('content-language', SITE.language);

  upsertMeta('name', 'theme-color', SITE.themeColor);
  upsertMeta('name', 'mobile-web-app-capable', 'yes');
  upsertMeta('name', 'apple-mobile-web-app-capable', 'yes');
  upsertMeta('name', 'apple-mobile-web-app-status-bar-style', 'black-translucent');
  upsertMeta('name', 'apple-mobile-web-app-title', SITE.appleWebAppTitle);
  upsertMeta('name', 'format-detection', 'telephone=yes');

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.mobileTitle);
  upsertMeta('name', 'twitter:description', seo.mobileDescription);
  upsertMeta('name', 'twitter:image', seo.ogImageUrl);
  upsertMeta('name', 'twitter:image:alt', SITE.ogImageAlt);
  upsertMeta('name', 'twitter:site', SITE.twitterHandle);

  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:locale', SITE.locale);
  upsertMeta('property', 'og:site_name', SITE.name);
  upsertMeta('property', 'og:title', seo.mobileTitle);
  upsertMeta('property', 'og:description', seo.mobileDescription);
  upsertMeta('property', 'og:url', seo.canonicalUrl);
  upsertMeta('property', 'og:image', seo.ogImageUrl);
  upsertMeta('property', 'og:image:alt', SITE.ogImageAlt);
  upsertMeta('property', 'og:image:width', SITE.ogImageWidth);
  upsertMeta('property', 'og:image:height', SITE.ogImageHeight);

  upsertLink('canonical', seo.canonicalUrl);
  upsertLink('alternate', seo.canonicalUrl, { hreflang: SITE.language });
}
