import { Router } from 'express';
import { z } from 'zod';
import type { CheckoutPayload } from '@hirra/shared/types';
import { apiStatusToDb, dbStatusToApi, isApiOrderStatus } from '@hirra/shared/utils';
import { createOrderFromCheckout } from '../services/create-order.js';
import { toAdminOrder } from '../services/stats.js';
import { supabase } from '../lib/supabase.js';

export const ordersRouter = Router();

const checkoutSchema = z.object({
  customer: z.object({
    phone: z.string().min(1),
    name: z.string().min(2),
    email: z.string().email().optional(),
    city: z.string().min(1),
    district: z.string().optional(),
    street_address: z.string().min(5),
    building: z.string().optional(),
    landmarks: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid().optional(),
        product_variant_id: z.string().uuid().nullable().optional(),
        bundle_id: z.string().uuid().optional(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
  payment_method: z.enum(['cod', 'whatsapp']),
  utm: z
    .object({
      source: z.string().optional(),
      medium: z.string().optional(),
      campaign: z.string().optional(),
      term: z.string().optional(),
      content: z.string().optional(),
    })
    .optional(),
  referrer: z.string().optional(),
});

ordersRouter.post('/', async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const result = await createOrderFromCheckout(parsed.data as CheckoutPayload);
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }

  res.status(201).json({
    success: true,
    order_id: result.order_id,
    order_number: result.order_number,
    total_sar: result.total_sar,
  });
});

ordersRouter.get('/', async (_req, res) => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const ids = (orders ?? []).map((o) => o.id);
  let items: Record<string, unknown>[] = [];

  if (ids.length > 0) {
    const { data: itemRows, error: itemsErr } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', ids);

    if (itemsErr) {
      res.status(500).json({ error: itemsErr.message });
      return;
    }
    items = (itemRows ?? []) as Record<string, unknown>[];
  }

  const itemsByOrder = new Map<string, Record<string, unknown>[]>();
  for (const item of items) {
    const orderId = String(item.order_id);
    const list = itemsByOrder.get(orderId) ?? [];
    list.push(item);
    itemsByOrder.set(orderId, list);
  }

  const payload = (orders ?? []).map((order) =>
    toAdminOrder(order as Record<string, unknown>, itemsByOrder.get(order.id) ?? []),
  );

  res.json({ orders: payload });
});

ordersRouter.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const statusRaw = req.body?.status;

  if (typeof statusRaw !== 'string' || !isApiOrderStatus(statusRaw)) {
    res.status(400).json({
      error: 'Invalid status. Use: new, confirmed, shipped, delivered, returned, cancelled',
    });
    return;
  }

  const dbStatus = apiStatusToDb(statusRaw);
  const patch: Record<string, unknown> = {
    status: dbStatus,
    updated_at: new Date().toISOString(),
  };

  if (statusRaw === 'shipped') patch.shipped_at = new Date().toISOString();
  if (statusRaw === 'delivered') patch.delivered_at = new Date().toISOString();
  if (statusRaw === 'cancelled') patch.cancelled_at = new Date().toISOString();
  if (statusRaw === 'confirmed') patch.whatsapp_confirmed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  if (!data) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id);

  res.json({
    order: toAdminOrder(data as Record<string, unknown>, (items ?? []) as Record<string, unknown>[]),
    status: dbStatusToApi(data.status),
  });
});
