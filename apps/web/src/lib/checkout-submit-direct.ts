/**
 * Guest checkout via Supabase RPC `hirra_guest_checkout`.
 * Atomically inserts customers, orders, and order_items (security definer).
 */

import type { CheckoutItem } from '@hirra/shared';

import { supabase } from '@/lib/supabase';

export interface GuestCheckoutPayload {
  customer: {
    phone: string;
    name: string;
    email?: string | null;
    city: string;
    district?: string | null;
    street_address: string;
    building?: string | null;
    landmarks?: string | null;
  };
  items: CheckoutItem[];
  payment_method: 'cod' | 'whatsapp';
  utm?: Record<string, string>;
  referrer?: string | null;
  user_agent?: string | null;
}

export interface GuestCheckoutSuccess {
  success: true;
  order_id: string;
  order_number: string;
  total_sar: number;
}

export interface GuestCheckoutFailure {
  error: string;
}

export type GuestCheckoutResult = GuestCheckoutSuccess | GuestCheckoutFailure;

/** Normalizes CheckoutItem shapes for JSON (PostgREST / jsonb-friendly). */
function itemsForRpc(items: CheckoutItem[]) {
  return items.map((i) => ({
    product_id: i.product_id ?? null,
    product_variant_id: i.product_variant_id ?? null,
    bundle_id: i.bundle_id ?? null,
    quantity: i.quantity,
  }));
}

/** Maps RPC / PostgREST errors to storefront-friendly Arabic messages. */
export function mapCheckoutErrorMessage(raw: string): string {
  const msg = raw.trim();
  if (!msg) return 'تعذر تسجيل الطلبية. عاود المحاولة.';

  if (/Invalid Moroccan phone|Invalid Saudi phone/i.test(msg)) {
    return 'رقم الهاتف غير صحيح. استعمل 06 أو 07XXXXXXXX';
  }
  if (/street_address|address/i.test(msg)) {
    return 'العنوان ناقص. عاود المحاولة.';
  }
  if (/not available|not found/i.test(msg)) {
    return 'أحد المنتجات لم يعد متوفراً. حدّث السلة وحاول مجدداً.';
  }
  if (/blacklist|cannot be processed/i.test(msg)) {
    return 'تعذر معالجة الطلبية. راسِلنا على واتساب.';
  }
  if (/items must be/i.test(msg)) {
    return 'السلة فارغة أو غير صالحة.';
  }

  return msg;
}

export async function submitGuestCheckoutViaRpc(
  body: GuestCheckoutPayload,
): Promise<GuestCheckoutResult> {
  const payload = {
    customer: body.customer,
    items: itemsForRpc(body.items),
    payment_method: body.payment_method,
    ...(body.utm && Object.keys(body.utm).length > 0 ? { utm: body.utm } : {}),
    ...(body.referrer ? { referrer: body.referrer } : {}),
    ...(body.user_agent ? { user_agent: body.user_agent } : {}),
  };

  const { data, error } = await supabase.rpc('hirra_guest_checkout', {
    payload,
  });

  if (error) {
    console.error('[checkout] hirra_guest_checkout RPC failed:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      payload: { ...payload, customer: { ...payload.customer, phone: '[redacted]' } },
    });
    return { error: mapCheckoutErrorMessage(error.message) };
  }

  const row = data as GuestCheckoutSuccess | GuestCheckoutFailure | null;
  if (!row || typeof row !== 'object') {
    console.error('[checkout] Invalid RPC response:', data);
    return { error: 'تعذر تسجيل الطلبية. عاود المحاولة.' };
  }

  if ('error' in row && row.error) {
    const rpcErr = String(row.error);
    console.error('[checkout] hirra_guest_checkout returned error:', rpcErr);
    return { error: mapCheckoutErrorMessage(rpcErr) };
  }

  const ok = row as GuestCheckoutSuccess;
  const totalSar =
    typeof ok.total_sar === 'number'
      ? ok.total_sar
      : typeof ok.total_sar === 'string'
        ? Number.parseFloat(ok.total_sar)
        : Number.NaN;

  if (
    !ok.success ||
    typeof ok.order_id !== 'string' ||
    typeof ok.order_number !== 'string' ||
    !Number.isFinite(totalSar)
  ) {
    console.error('[checkout] Incomplete success payload:', row);
    return { error: 'تعذر إتمام الطلبية. عاود المحاولة.' };
  }

  console.info('[checkout] Order created:', {
    order_id: ok.order_id,
    order_number: ok.order_number,
    total_sar: totalSar,
  });

  return { ...ok, total_sar: totalSar };
}
