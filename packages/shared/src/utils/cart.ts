import type { CartLine } from '../types/cart';

/**
 * Build a stable key for a cart line — used for de-duping and React keys.
 */
export function buildCartLineKey(input: {
  product_id?: string;
  product_variant_id?: string | null;
  bundle_id?: string;
}): string {
  if (input.bundle_id) return `bundle:${input.bundle_id}`;
  if (input.product_id && input.product_variant_id) {
    return `product:${input.product_id}:${input.product_variant_id}`;
  }
  if (input.product_id) return `product:${input.product_id}`;
  throw new Error('Cart line must include product_id or bundle_id');
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.unit_price_sar * line.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
