/**
 * Temporary guest checkout until `order-confirm` Edge Function is deployed.
 * Submits checkout through Postgres RPC (`hirra_guest_checkout`), which
 * validates prices, writes customers / orders / order_items atomically as
 * the table owner (see migration 006_guest_checkout_rpc.sql).
 *
 * **Do not automatically retry** failed RPC calls: each invocation may create
 * a new order. Handle retries only with explicit idempotency keys at the DB layer.
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
    console.error('hirra_guest_checkout:', error.message, error.details);
    return { error: error.message };
  }

  const row = data as GuestCheckoutSuccess | GuestCheckoutFailure | null;
  if (!row || typeof row !== 'object') {
    return { error: 'Invalid response from checkout.' };
  }
  if ('error' in row && row.error) {
    return { error: String(row.error) };
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
    return { error: 'Checkout did not complete. Please try again.' };
  }

  return { ...ok, total_sar: totalSar };
}
