import { getCityByFuzzyInput, getCityByValue } from './cities';

/** Stored in `price_sar` / order totals — amounts are Moroccan dirhams (MAD). */
/** Delivery is included in product prices — always free at checkout. */
export const FREE_SHIPPING_THRESHOLD_MAD = 0;
export const COD_FEE_MAD = 0;

/** @deprecated alias */
export const FREE_SHIPPING_THRESHOLD_SAR = FREE_SHIPPING_THRESHOLD_MAD;
export const COD_FEE_SAR = COD_FEE_MAD;

export interface ShippingZone {
  zone: 1 | 2 | 3 | 4;
  cost_mad: number;
  eta_label_ar: string;
  eta_label_fr: string;
  eta_label_en: string;
}

export const SHIPPING_ZONES: Record<number, ShippingZone> = {
  1: { zone: 1, cost_mad: 25, eta_label_ar: '2-3 أيام', eta_label_fr: '2–3 jours', eta_label_en: '2–3 days' },
  2: { zone: 2, cost_mad: 30, eta_label_ar: '3-4 أيام', eta_label_fr: '3–4 jours', eta_label_en: '3–4 days' },
  3: { zone: 3, cost_mad: 35, eta_label_ar: '4-5 أيام', eta_label_fr: '4–5 jours', eta_label_en: '4–5 days' },
  4: { zone: 4, cost_mad: 45, eta_label_ar: '5-7 أيام', eta_label_fr: '5–7 jours', eta_label_en: '5–7 days' },
};

export function getShippingForCity(cityValue: string, subtotal: number): {
  cost: number;
  zone: ShippingZone;
  isFree: boolean;
} {
  const city = getCityByValue(cityValue) ?? getCityByFuzzyInput(cityValue);
  const zone = SHIPPING_ZONES[city?.zone ?? 3];
  void subtotal;
  return {
    cost: 0,
    zone,
    isFree: true,
  };
}

export function calculateOrderTotals(
  subtotal: number,
  cityValue: string | null,
  paymentMethod: 'cod' | 'whatsapp' | 'mada' | 'apple_pay' | 'stc_pay' | 'tabby' | 'tamara' | 'visa_mc',
) {
  void cityValue;
  void paymentMethod;
  const shipping = 0;
  const codFee = 0;
  const total = subtotal;
  return { subtotal, shipping, codFee, total };
}
