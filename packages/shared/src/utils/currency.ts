import { normalizeWesternDigits } from './digits';

/**
 * Format MAD for display (stored in DB `price_sar` column during Maghreb rollout).
 * Moroccan retail convention: Western numerals + «درهم» (AR) or «MAD» (FR).
 */
export function formatMAD(amount: number, locale: 'ar' | 'fr' | 'en' = 'ar'): string {
  const rounded = Number.isInteger(amount) ? amount : Math.round(amount * 100) / 100;
  const formatted = rounded.toLocaleString('fr-FR', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  if (locale === 'ar') return normalizeWesternDigits(`${formatted} درهم`);
  if (locale === 'fr') return `${formatted} MAD`;
  return `${formatted} MAD`;
}

/** @deprecated Use formatMAD — legacy name */
export function formatSAR(amount: number, locale: 'ar' | 'en' = 'ar'): string {
  return formatMAD(amount, locale === 'en' ? 'en' : 'ar');
}

/** @deprecated Use normalizeWesternDigits — RIYANALUXE uses Western numerals in Arabic UI */
export function toArabicDigits(input: string | number): string {
  return normalizeWesternDigits(input);
}
