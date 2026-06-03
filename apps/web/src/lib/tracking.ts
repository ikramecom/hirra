/**
 * Thin pixel-tracking wrapper.
 * All events are no-ops until the corresponding pixel ID is provided via env.
 * Phase 2: also fire server-side via the `pixel-event` Edge Function.
 */

type EventName =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead';

interface TrackPayload {
  value?: number;
  currency?: 'SAR' | 'MAD';
  content_ids?: string[];
  content_name?: string;
  content_type?: 'product' | 'product_group';
  num_items?: number;
}

// =====================================================================
// TikTok
// =====================================================================
declare global {
  interface Window {
    ttq?: { track: (event: string, payload?: object) => void; page: () => void };
    snaptr?: (cmd: string, event: string, payload?: object) => void;
    fbq?: (cmd: string, event: string, payload?: object) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function trackTikTok(event: EventName, payload?: TrackPayload) {
  if (typeof window === 'undefined' || !window.ttq) return;
  window.ttq.track(event, payload as object);
}

function trackSnap(event: EventName, payload?: TrackPayload) {
  if (typeof window === 'undefined' || !window.snaptr) return;
  // Snap event name conventions
  const map: Record<EventName, string> = {
    PageView: 'PAGE_VIEW',
    ViewContent: 'VIEW_CONTENT',
    AddToCart: 'ADD_CART',
    InitiateCheckout: 'START_CHECKOUT',
    AddPaymentInfo: 'ADD_BILLING',
    Purchase: 'PURCHASE',
    Lead: 'SIGN_UP',
  };
  window.snaptr('track', map[event], payload as object);
}

function trackMeta(event: EventName, payload?: TrackPayload) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', event, payload as object);
}

function trackGA(event: EventName, payload?: TrackPayload) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', event, payload as object);
}

// =====================================================================
// Public API
// =====================================================================
export const track = {
  pageView() {
    trackTikTok('PageView');
    trackSnap('PageView');
    trackMeta('PageView');
    trackGA('PageView');
  },
  viewContent(payload: TrackPayload) {
    trackTikTok('ViewContent', payload);
    trackSnap('ViewContent', payload);
    trackMeta('ViewContent', payload);
    trackGA('ViewContent', payload);
  },
  addToCart(payload: TrackPayload) {
    trackTikTok('AddToCart', payload);
    trackSnap('AddToCart', payload);
    trackMeta('AddToCart', payload);
    trackGA('AddToCart', payload);
  },
  initiateCheckout(payload: TrackPayload) {
    trackTikTok('InitiateCheckout', payload);
    trackSnap('InitiateCheckout', payload);
    trackMeta('InitiateCheckout', payload);
    trackGA('InitiateCheckout', payload);
  },
  purchase(payload: TrackPayload) {
    trackTikTok('Purchase', payload);
    trackSnap('Purchase', payload);
    trackMeta('Purchase', payload);
    trackGA('Purchase', payload);
  },
};

/**
 * Reads UTM parameters from current URL and persists them in sessionStorage
 * so they survive cart → checkout flow.
 */
export function captureUtm(): {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
} {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined,
  };

  const hasAny = Object.values(utm).some(Boolean);
  if (hasAny) {
    try {
      sessionStorage.setItem('riyanaluxe:utm', JSON.stringify(utm));
    } catch {
      // ignore quota errors
    }
    return utm;
  }

  try {
    const stored = sessionStorage.getItem('riyanaluxe:utm');
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }

  return {};
}
