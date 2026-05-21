import { getCityByValue } from './cities';

export const FREE_SHIPPING_THRESHOLD_SAR = 199;
export const COD_FEE_SAR = 10;

export interface ShippingZone {
  zone: 1 | 2 | 3 | 4;
  cost_sar: number;
  eta_label_ar: string;
  eta_label_en: string;
}

export const SHIPPING_ZONES: Record<number, ShippingZone> = {
  1: { zone: 1, cost_sar: 18, eta_label_ar: '١-٢ يوم', eta_label_en: '1–2 days' },
  2: { zone: 2, cost_sar: 18, eta_label_ar: '٢-٣ أيام', eta_label_en: '2–3 days' },
  3: { zone: 3, cost_sar: 23, eta_label_ar: '٢-٤ أيام', eta_label_en: '2–4 days' },
  4: { zone: 4, cost_sar: 28, eta_label_ar: '٣-٥ أيام', eta_label_en: '3–5 days' },
};

export function getShippingForCity(cityValue: string, subtotal: number): {
  cost: number;
  zone: ShippingZone;
  isFree: boolean;
} {
  const city = getCityByValue(cityValue);
  const zone = SHIPPING_ZONES[city?.zone ?? 4];
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD_SAR;
  return {
    cost: isFree ? 0 : zone.cost_sar,
    zone,
    isFree,
  };
}

export function calculateOrderTotals(
  subtotal: number,
  cityValue: string | null,
  paymentMethod: 'cod' | 'whatsapp' | 'mada' | 'apple_pay' | 'stc_pay' | 'tabby' | 'tamara' | 'visa_mc',
) {
  const shipping = cityValue
    ? getShippingForCity(cityValue, subtotal).cost
    : SHIPPING_ZONES[2].cost_sar; // default before city selected
  const codFee = paymentMethod === 'cod' ? COD_FEE_SAR : 0;
  const total = subtotal + shipping + codFee;
  return { subtotal, shipping, codFee, total };
}
