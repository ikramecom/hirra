import type { CheckoutPayload } from '@hirra/shared/types';
import { supabase } from '../lib/supabase.js';

function normalizeSaudiPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00966')) return '+' + digits.slice(2);
  if (digits.startsWith('966')) return '+' + digits;
  if (digits.startsWith('05') && digits.length === 10) return '+966' + digits.slice(1);
  if (digits.startsWith('5') && digits.length === 9) return '+966' + digits;
  return null;
}

function scoreFakeOrder(payload: CheckoutPayload, normalizedPhone: string) {
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

  return { score: Math.min(score, 100), flags };
}

export async function createOrderFromCheckout(payload: CheckoutPayload) {
  const normalizedPhone = normalizeSaudiPhone(payload.customer.phone);
  if (!normalizedPhone) {
    return { ok: false as const, status: 400, error: 'Invalid Saudi phone number' };
  }

  const fake = scoreFakeOrder(payload, normalizedPhone);

  const { data: existing } = await supabase
    .from('customers')
    .select('id, is_blacklisted')
    .eq('phone', normalizedPhone)
    .maybeSingle();

  if (existing?.is_blacklisted) {
    return { ok: false as const, status: 403, error: 'Customer is blacklisted' };
  }

  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .upsert(
      {
        phone: normalizedPhone,
        name: payload.customer.name.trim(),
        email: payload.customer.email?.trim() || null,
        city: payload.customer.city,
        district: payload.customer.district || null,
        street_address: payload.customer.street_address.trim(),
        building: payload.customer.building?.trim() || null,
        landmarks: payload.customer.landmarks?.trim() || null,
      },
      { onConflict: 'phone' },
    )
    .select('id')
    .single();

  if (custErr || !customer) {
    return { ok: false as const, status: 500, error: 'Could not save customer' };
  }

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

  for (const item of payload.items) {
    if (item.bundle_id) {
      const { data: bundle, error: bErr } = await supabase
        .from('bundles')
        .select('id, name_ar, name_en, price_sar, is_active')
        .eq('id', item.bundle_id)
        .maybeSingle();

      if (bErr || !bundle || !bundle.is_active) {
        return { ok: false as const, status: 400, error: `Bundle not available: ${item.bundle_id}` };
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
        .select('id, name_ar, name_en, price_sar, is_active')
        .eq('id', item.product_id)
        .maybeSingle();

      if (pErr || !product || !product.is_active) {
        return { ok: false as const, status: 400, error: `Product not available: ${item.product_id}` };
      }

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
    return { ok: false as const, status: 400, error: 'No valid items' };
  }

  const shipping = subtotal >= 199 ? 0 : 18;
  const codFee = payload.payment_method === 'cod' ? 10 : 0;
  const total = subtotal + shipping + codFee;

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      customer_phone: normalizedPhone,
      customer_name: payload.customer.name.trim(),
      customer_email: payload.customer.email?.trim() || null,
      shipping_city: payload.customer.city,
      shipping_district: payload.customer.district || null,
      shipping_address: payload.customer.street_address.trim(),
      shipping_building: payload.customer.building?.trim() || null,
      shipping_landmarks: payload.customer.landmarks?.trim() || null,
      subtotal_sar: subtotal,
      shipping_sar: shipping,
      cod_fee_sar: codFee,
      discount_sar: 0,
      total_sar: total,
      payment_method: payload.payment_method,
      status: fake.score >= 50 ? 'fake_flagged' : 'pending_confirmation',
      fake_score: fake.score,
      fake_flags: fake.flags,
      utm_source: payload.utm?.source || null,
      utm_medium: payload.utm?.medium || null,
      utm_campaign: payload.utm?.campaign || null,
      utm_term: payload.utm?.term || null,
      utm_content: payload.utm?.content || null,
      referrer: payload.referrer || null,
    })
    .select('id, order_number, total_sar')
    .single();

  if (orderErr || !order) {
    return { ok: false as const, status: 500, error: 'Could not create order' };
  }

  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(lineItems.map((li) => ({ ...li, order_id: order.id })));

  if (itemsErr) {
    await supabase.from('orders').delete().eq('id', order.id);
    return { ok: false as const, status: 500, error: 'Could not save order items' };
  }

  return {
    ok: true as const,
    order_id: order.id,
    order_number: order.order_number,
    total_sar: Number(order.total_sar),
  };
}
