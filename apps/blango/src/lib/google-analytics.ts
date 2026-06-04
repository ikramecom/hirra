/** Blango Studio GA4 measurement ID (overridable via VITE_GA4_ID at build). */
export const BLANGO_GA4_MEASUREMENT_ID = 'G-6PJH1GP650';

const LOG_PREFIX = '[Blango GA4]';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let gtagInitialized = false;

function readDefinedGa4Id(): string {
  if (typeof __BLANGO_GA4_ID__ === 'string' && __BLANGO_GA4_ID__.length > 0) {
    return __BLANGO_GA4_ID__;
  }
  const fromImport = import.meta.env.VITE_GA4_ID?.trim() ?? '';
  return fromImport || BLANGO_GA4_MEASUREMENT_ID;
}

function isValidGa4Id(id: string): boolean {
  return /^G-[A-Z0-9]+$/i.test(id);
}

export function getGa4MeasurementId(): string | undefined {
  const id = readDefinedGa4Id().trim();
  return isValidGa4Id(id) ? id.toUpperCase() : undefined;
}

/** True when vite.config injected gtag into index.html. */
export function isGa4InHtml(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  return document.documentElement.dataset.blangoGa4 === '1';
}

function logGtagState(context: string): void {
  console.log(`${LOG_PREFIX} ${context}`, {
    windowGtagType: typeof window.gtag,
    windowGtagExists: typeof window.gtag === 'function',
    dataLayerLength: window.dataLayer?.length ?? 0,
    ga4InHtml: isGa4InHtml(),
  });
}

function ensureGtagFunction(): void {
  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
}

function injectGtagScript(measurementId: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`)) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

/** Loads gtag.js and configures GA4 (skipped if already injected in index.html). */
export function initGoogleAnalytics(): boolean {
  const measurementId = getGa4MeasurementId();
  if (!measurementId) {
    console.warn(`${LOG_PREFIX} GA4 disabled — invalid measurement ID`);
    return false;
  }

  console.log(`${LOG_PREFIX} measurement ID detected`, measurementId);
  logGtagState('before init');

  if (gtagInitialized) {
    console.log(`${LOG_PREFIX} GA4 already initialized`);
    return true;
  }

  if (!window.gtag) {
    ensureGtagFunction();
  }

  if (!isGa4InHtml()) {
    injectGtagScript(measurementId);
    window.gtag?.('js', new Date());
    window.gtag?.('config', measurementId, { send_page_view: false });
  }

  gtagInitialized = true;
  logGtagState('after init');
  console.log(`${LOG_PREFIX} GA4 initialized`);
  return true;
}

/**
 * Sends a page_view using the official GA4 SPA pattern:
 * gtag('config', MEASUREMENT_ID, { page_path, page_location, page_title })
 *
 * Required when the base config uses send_page_view:false (see Google SPA docs).
 */
export function trackGa4PageView(pathname?: string): void {
  const measurementId = getGa4MeasurementId();
  logGtagState('before page_view');

  if (!measurementId) {
    console.warn(`${LOG_PREFIX} page_view skipped — no measurement ID`);
    return;
  }
  if (typeof window.gtag !== 'function') {
    console.warn(`${LOG_PREFIX} page_view skipped — window.gtag missing`);
    return;
  }

  const pagePath =
    pathname ??
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const payload = {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
  };

  console.log(`${LOG_PREFIX} executing page_view`, payload);
  window.gtag('config', measurementId, payload);
  console.log(`${LOG_PREFIX} page_view sent`, payload);
}
