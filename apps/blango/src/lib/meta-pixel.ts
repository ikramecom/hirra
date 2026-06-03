import { PORTFOLIO_CTA } from '@/lib/sections-data';

/** Exact CTA copy that should fire a Lead event (portfolio final CTA). */
export const META_LEAD_CONSULTATION_CTA = PORTFOLIO_CTA.button;

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

export function trackMetaLead(source: string): void {
  if (!getMetaPixelId() || !window.fbq) {
    return;
  }
  window.fbq('track', 'Lead', { content_name: source });
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

/** Document-level handler for WhatsApp links and consultation CTA. */
export function handleMetaLeadClick(event: MouseEvent): void {
  if (!getMetaPixelId()) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const anchor = target.closest('a[href]');
  if (anchor instanceof HTMLAnchorElement && anchor.href && isWhatsAppHref(anchor.href)) {
    trackMetaLead('whatsapp_click');
    return;
  }

  const clickable = target.closest('a, button');
  if (!clickable) {
    return;
  }

  const text = elementText(clickable);
  if (text.includes(META_LEAD_CONSULTATION_CTA)) {
    trackMetaLead('consultation_cta');
  }
}
