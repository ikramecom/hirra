import type { CheckoutPayload } from '../types/order';

/**
 * Lightweight fake-order scoring. Returns 0–100; 50+ flags the order for manual review.
 * Mirrors the logic in the order-confirm Edge Function (kept in sync intentionally).
 */
export function scoreFakeOrder(
  payload: Pick<CheckoutPayload, 'customer'>,
  normalizedPhone: string,
): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 0;

  if (!/^\+212[67]\d{8}$/.test(normalizedPhone)) {
    flags.push('invalid_moroccan_mobile');
    score += 40;
  }

  if (payload.customer.street_address.trim().split(/\s+/).length < 3) {
    flags.push('short_address');
    score += 20;
  }

  const lowerName = payload.customer.name.toLowerCase().trim();
  if (lowerName.length < 3 || /^(test|x{1,3}|asdf|aaa)/.test(lowerName)) {
    flags.push('suspicious_name');
    score += 30;
  }

  const hour = (new Date().getUTCHours() + 1) % 24; // Morocco (UTC+1) approximate
  if (hour >= 1 && hour <= 5) {
    flags.push('late_night_order');
    score += 10;
  }

  return { score: Math.min(score, 100), flags };
}
