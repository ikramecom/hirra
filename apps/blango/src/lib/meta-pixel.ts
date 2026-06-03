import { CONTACT_CTA, CONTACT_SECTION, HERO, PORTFOLIO_CTA } from '@/lib/sections-data';

/** data-meta-lead value for primary consultation CTAs */
export const META_LEAD_CONSULTATION_ATTR = 'consultation';

/** All consultation CTA labels that should fire Lead */
export const META_LEAD_CTA_LABELS = [
  HERO.ctaPrimary,
  CONTACT_CTA.button,
  CONTACT_SECTION.cta,
  PORTFOLIO_CTA.button,
] as const;

const LOG_PREFIX = '[Blango Meta Pixel]';

declare global {
  interface Window {
    fbq?: {
      (command: 'track', event: string, params?: Record<string, string>): void;
      (command: 'init', pixelId: string): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: Window['fbq'];
  }
}

let scriptInjected = false;
let pixelInitialized = false;

function readDefinedPixelId(): string {
  if (typeof __BLANGO_META_PIXEL_ID__ === 'string' && __BLANGO_META_PIXEL_ID__.length > 0) {
    return __BLANGO_META_PIXEL_ID__;
  }
  return import.meta.env.VITE_META_PIXEL_ID?.replace(/\D/g, '') ?? '';
}

export function getMetaPixelId(): string | undefined {
  const id = readDefinedPixelId().trim();
  return id.length > 0 ? id : undefined;
}

/** True when vite.config injected the standard Meta snippet into index.html. */
export function isMetaPixelInHtml(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }
  return document.documentElement.dataset.blangoMetaPixel === '1';
}

function injectMetaPixelScript(): void {
  if (scriptInjected || typeof document === 'undefined') {
    return;
  }

  if (document.querySelector('script[src*="fbevents.js"]')) {
    scriptInjected = true;
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  if (!window.fbq) {
    const queue: unknown[] = [];
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) {
        fbq.callMethod.apply(fbq, args);
      } else {
        queue.push(args);
      }
    } as NonNullable<Window['fbq']>;
    fbq.queue = queue;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.push = queue.push.bind(queue);
    window.fbq = fbq;
    window._fbq = fbq;
  }

  scriptInjected = true;
}

/** Ensures fbq is initialized (HTML snippet or client-side fallback). */
export function initMetaPixel(): boolean {
  const pixelId = getMetaPixelId();
  if (!pixelId) {
    return false;
  }
  if (pixelInitialized) {
    return true;
  }

  if (isMetaPixelInHtml() && window.fbq) {
    pixelInitialized = true;
    scriptInjected = true;
    return true;
  }

  injectMetaPixelScript();
  window.fbq?.('init', pixelId);
  pixelInitialized = true;
  return true;
}

export function trackMetaPageView(): void {
  if (!getMetaPixelId() || !window.fbq) {
    return;
  }
  window.fbq('track', 'PageView');
}

export function matchesConsultationCtaLabel(text: string): boolean {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return META_LEAD_CTA_LABELS.some((label) => normalized.includes(label));
}

export function isConsultationCtaElement(el: Element): boolean {
  return (
    el.closest(`[data-meta-lead="${META_LEAD_CONSULTATION_ATTR}"]`) !== null ||
    matchesConsultationCtaLabel(elementText(el))
  );
}

/** Fires Meta standard Lead event — fbq('track', 'Lead') */
export function trackMetaLead(
  source: string,
  options?: { logCta?: boolean; logForm?: boolean },
): void {
  if (!getMetaPixelId() || !window.fbq) {
    console.warn(`${LOG_PREFIX} Lead skipped — pixel not ready (${source})`);
    return;
  }

  if (options?.logCta) {
    console.log(`${LOG_PREFIX} CTA clicked`);
  }
  if (options?.logForm) {
    console.log(`${LOG_PREFIX} Contact form submitted`);
  }

  window.fbq('track', 'Lead');
  console.log(`${LOG_PREFIX} Lead event fired`, `(${source})`);
}

function isWhatsAppHref(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    return url.hostname === 'wa.me' || url.hostname.endsWith('.whatsapp.com');
  } catch {
    return href.includes('wa.me');
  }
}

function elementText(el: Element): string {
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/** Document-level handler for consultation CTAs, WhatsApp links, and related clicks. */
export function handleMetaLeadClick(event: MouseEvent): void {
  if (!getMetaPixelId()) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (isConsultationCtaElement(target)) {
    trackMetaLead('consultation_cta', { logCta: true });
    return;
  }

  const anchor = target.closest('a[href]');
  if (anchor instanceof HTMLAnchorElement && anchor.href && isWhatsAppHref(anchor.href)) {
    trackMetaLead('whatsapp_click');
    return;
  }
}
