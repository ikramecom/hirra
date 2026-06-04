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

  if (gtagInitialized) {
    console.log(`${LOG_PREFIX} GA4 already initialized`);
    return true;
  }

  if (isGa4InHtml() && window.gtag) {
    gtagInitialized = true;
    console.log(`${LOG_PREFIX} GA4 initialized`);
    return true;
  }

  ensureGtagFunction();
  injectGtagScript(measurementId);
  window.gtag?.('js', new Date());
  window.gtag?.('config', measurementId, { send_page_view: false });
  gtagInitialized = true;
  console.log(`${LOG_PREFIX} GA4 initialized`);
  return true;
}

/** Sends a page_view for SPA navigations (explicit gtag event). */
export function trackGa4PageView(pathname?: string): void {
  const measurementId = getGa4MeasurementId();
  if (!measurementId) {
    console.warn(`${LOG_PREFIX} page_view skipped — no measurement ID`);
    return;
  }
  if (!window.gtag) {
    console.warn(`${LOG_PREFIX} page_view skipped — gtag not available`);
    return;
  }

  const pagePath =
    pathname ??
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const payload = {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: document.title,
    send_to: measurementId,
  };

  window.gtag('event', 'page_view', payload);
  console.log(`${LOG_PREFIX} page_view sent`, payload);
}
