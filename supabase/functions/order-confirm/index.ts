// =====================================================================
// HIRRA — order-confirm Edge Function
// POST /functions/v1/order-confirm
//
// Receives a customer checkout submission, validates it, runs the
// fake-order filter, upserts the customer, creates the order + items,
// and returns the order number.
//
// In Phase 2, this also triggers WhatsApp confirmation and pixel events.
// =====================================================================

// @ts-expect-error — Deno-specific import (resolved at runtime by Supabase)
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// @ts-expect-error — Deno-specific import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// =====================================================================
// CORS
// =====================================================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// =====================================================================
// Types
// =====================================================================
interface CheckoutItem {
  product_id?: string;
  product_variant_id?: string | null;
  bundle_id?: string;
  quantity: number;
}

interface CheckoutPayload {
  customer: {
    phone: string;
    name: string;
    email?: string;
    city: string;
    district?: string;
    street_address: string;
    building?: string;
    landmarks?: string;
  };
  items: CheckoutItem[];
  payment_method: 'cod' | 'whatsapp';
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  referrer?: string;
}

// =====================================================================
// Validation
// =====================================================================
function validatePayload(payload: unknown): { ok: true; data: CheckoutPayload } | { ok: false; error: string } {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'Invalid payload' };
  }

  const p = payload as Partial<CheckoutPayload>;

  if (!p.customer) return { ok: false, error: 'customer is required' };
  if (!p.customer.phone || typeof p.customer.phone !== 'string') {
    return { ok: false, error: 'customer.phone is required' };
  }
  if (!p.customer.name || typeof p.customer.name !== 'string' || p.customer.name.trim().length < 2) {
    return { ok: false, error: 'customer.name is required (min 2 chars)' };
  }
  if (!p.customer.city) return { ok: false, error: 'customer.city is required' };
  if (!p.customer.street_address || p.customer.street_address.trim().length < 5) {
    return { ok: false, error: 'customer.street_address is required (min 5 chars)' };
  }

  if (!Array.isArray(p.items) || p.items.length === 0) {
    return { ok: false, error: 'items must be a non-empty array' };
  }

  for (const item of p.items) {
    if (!item.product_id && !item.bundle_id) {
      return { ok: false, error: 'each item needs product_id or bundle_id' };
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      return { ok: false, error: 'item.quantity must be 1–20' };
    }
  }

  if (p.payment_method !== 'cod' && p.payment_method !== 'whatsapp') {
    return { ok: false, error: 'payment_method must be "cod" or "whatsapp"' };
  }

  return { ok: true, data: p as CheckoutPayload };
}

// =====================================================================
// Saudi phone normalisation → "+9665XXXXXXXX"
// =====================================================================
function normalizeSaudiPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');

  if (digits.startsWith('00966')) return '+' + digits.slice(2);
  if (digits.startsWith('966')) return '+' + digits;
  if (digits.startsWith('05') && digits.length === 10) return '+966' + digits.slice(1);
  if (digits.startsWith('5') && digits.length === 9) return '+966' + digits;

  return null;
}

// =====================================================================
// Fake-order scoring
// =====================================================================
function scoreFakeOrder(payload: CheckoutPayload, normalizedPhone: string): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 0;

  if (!normalizedPhone.startsWith('+9665')) {
    flags.push('invalid_saudi_mobile');
    score += 40;
  }

  if (payload.customer.street_address.split(/\s+/).length < 3) {
    flags.push('short_address');
    score += 20;
  }

  const lowerName = payload.customer.name.toLowerCase().trim();
  if (lowerName.length < 3 || /^(test|x{1,3}|asdf|aaa)/.test(lowerName)) {
    flags.push('suspicious_name');
    score += 30;
  }

  const hour = new Date().getUTCHours() + 3; // Riyadh = UTC+3
  const localHour = hour % 24;
  if (localHour >= 1 && localHour <= 5) {
    flags.push('late_night_order');
    score += 10;
  }

  return { score: Math.min(score, 100), flags };
}

// =====================================================================
// MAIN HANDLER
// =====================================================================
serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  // ── parse + validate ───────────────────────────────────────────────
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: corsHeaders });
  }

  const validation = validatePayload(payload);
  if (!validation.ok) {
    return new Response(JSON.stringify({ error: validation.error }), { status: 400, headers: corsHeaders });
  }
  const data = validation.data;

  const normalizedPhone = normalizeSaudiPhone(data.customer.phone);
  if (!normalizedPhone) {
    return new Response(JSON.stringify({ error: 'Invalid Saudi phone number' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // ── supabase service-role client (server-side only) ────────────────
  // @ts-expect-error — Deno env access
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  // @ts-expect-error — Deno env access
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ── fake-order scoring ─────────────────────────────────────────────
  const fake = scoreFakeOrder(data, normalizedPhone);

  // ── blacklist check ────────────────────────────────────────────────
  const { data: existing } = await supabase
    .from('customers')
    .select('id, is_blacklisted, blacklist_reason')
    .eq('phone', normalizedPhone)
    .maybeSingle();

  if (existing?.is_blacklisted) {
    return new Response(
      JSON.stringify({ error: 'Order cannot be processed at this time. Please contact support.' }),
      { status: 403, headers: corsHeaders },
    );
  }

  // ── upsert customer ────────────────────────────────────────────────
  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .upsert(
      {
        phone: normalizedPhone,
        name: data.customer.name.trim(),
        email: data.customer.email?.trim() || null,
        city: data.customer.city,
        district: data.customer.district || null,
        street_address: data.customer.street_address.trim(),
        building: data.customer.building?.trim() || null,
        landmarks: data.customer.landmarks?.trim() || null,
      },
      { onConflict: 'phone' },
    )
    .select('id')
    .single();

  if (custErr || !customer) {
    console.error('Customer upsert failed:', custErr);
    return new Response(JSON.stringify({ error: 'Could not save customer' }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  // ── price + build line items ───────────────────────────────────────
  type LineItem = {
    product_id: string | null;
    product_variant_id: string | null;
    bundle_id: string | null;
    product_name_ar: string;
    product_name_en: string;
    variant_name_ar: string | null;
    variant_name_en: string | null;
    unit_price_sar: number;
    quantity: number;
    line_total_sar: number;
  };

  const lineItems: LineItem[] = [];
  let subtotal = 0;

  for (const item of data.items) {
    if (item.bundle_id) {
      const { data: bundle, error: bErr } = await supabase
        .from('bundles')
        .select('id, name_ar, name_en, price_sar, is_active')
        .eq('id', item.bundle_id)
        .maybeSingle();

      if (bErr || !bundle || !bundle.is_active) {
        return new Response(JSON.stringify({ error: `Bundle not available: ${item.bundle_id}` }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      const lineTotal = Number(bundle.price_sar) * item.quantity;
      subtotal += lineTotal;
      lineItems.push({
        product_id: null,
        product_variant_id: null,
        bundle_id: bundle.id,
        product_name_ar: bundle.name_ar,
        product_name_en: bundle.name_en,
        variant_name_ar: null,
        variant_name_en: null,
        unit_price_sar: Number(bundle.price_sar),
        quantity: item.quantity,
        line_total_sar: lineTotal,
      });
    } else if (item.product_id) {
      const { data: product, error: pErr } = await supabase
        .from('products')
        .select('id, name_ar, name_en, price_sar, is_active, inventory_count')
        .eq('id', item.product_id)
        .maybeSingle();

      if (pErr || !product || !product.is_active) {
        return new Response(JSON.stringify({ error: `Product not available: ${item.product_id}` }), {
          status: 400,
          headers: corsHeaders,
        });
      }

      // (optional) variant name lookup
      let variantNameAr: string | null = null;
      let variantNameEn: string | null = null;
      if (item.product_variant_id) {
        const { data: variant } = await supabase
          .from('product_variants')
          .select('name_ar, name_en')
          .eq('id', item.product_variant_id)
          .maybeSingle();
        if (variant) {
          variantNameAr = variant.name_ar;
          variantNameEn = variant.name_en;
        }
      }

      const lineTotal = Number(product.price_sar) * item.quantity;
      subtotal += lineTotal;
      lineItems.push({
        product_id: product.id,
        product_variant_id: item.product_variant_id || null,
        bundle_id: null,
        product_name_ar: product.name_ar,
        product_name_en: product.name_en,
        variant_name_ar: variantNameAr,
        variant_name_en: variantNameEn,
        unit_price_sar: Number(product.price_sar),
        quantity: item.quantity,
        line_total_sar: lineTotal,
      });
    }
  }

  if (lineItems.length === 0) {
    return new Response(JSON.stringify({ error: 'No valid items in cart' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // ── shipping + COD fee + totals (delivery included in product price) ─
  const shipping = 0;
  const codFee = 0;
  const total = subtotal;

  // ── create order ───────────────────────────────────────────────────
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      customer_phone: normalizedPhone,
      customer_name: data.customer.name.trim(),
      customer_email: data.customer.email?.trim() || null,
      shipping_city: data.customer.city,
      shipping_district: data.customer.district || null,
      shipping_address: data.customer.street_address.trim(),
      shipping_building: data.customer.building?.trim() || null,
      shipping_landmarks: data.customer.landmarks?.trim() || null,
      subtotal_sar: subtotal,
      shipping_sar: shipping,
      cod_fee_sar: codFee,
      discount_sar: 0,
      total_sar: total,
      payment_method: data.payment_method,
      status: fake.score >= 50 ? 'fake_flagged' : 'pending_confirmation',
      fake_score: fake.score,
      fake_flags: fake.flags,
      utm_source: data.utm?.source || null,
      utm_medium: data.utm?.medium || null,
      utm_campaign: data.utm?.campaign || null,
      utm_term: data.utm?.term || null,
      utm_content: data.utm?.content || null,
      referrer: data.referrer || null,
      user_agent: req.headers.get('user-agent') || null,
    })
    .select('id, order_number')
    .single();

  if (orderErr || !order) {
    console.error('Order insert failed:', orderErr);
    return new Response(JSON.stringify({ error: 'Could not create order' }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  // ── insert line items ──────────────────────────────────────────────
  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(lineItems.map((li) => ({ ...li, order_id: order.id })));

  if (itemsErr) {
    console.error('Order items insert failed:', itemsErr);
    // best-effort rollback
    await supabase.from('orders').delete().eq('id', order.id);
    return new Response(JSON.stringify({ error: 'Could not save order items' }), {
      status: 500,
      headers: corsHeaders,
    });
  }

  // ── Phase 2 placeholders (uncomment when WhatsApp + pixels deployed) ─
  // await fetch(`${supabaseUrl}/functions/v1/whatsapp-send`, {...});
  // await fetch(`${supabaseUrl}/functions/v1/pixel-event`, {...});

  return new Response(
    JSON.stringify({
      success: true,
      order_number: order.order_number,
      order_id: order.id,
      total_sar: total,
      redirect_url: `/order-confirmation/${order.order_number}`,
    }),
    { status: 200, headers: corsHeaders },
  );
});
