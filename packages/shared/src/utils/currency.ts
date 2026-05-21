/**
 * Format a SAR amount for display.
 * Always uses ASCII digits in the number itself (Saudi convention for prices)
 * but renders the currency label in the requested locale.
 */
export function formatSAR(amount: number, locale: 'ar' | 'en' = 'ar'): string {
  const rounded = Number.isInteger(amount) ? amount : Math.round(amount * 100) / 100;
  const formatted = rounded.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return locale === 'ar' ? `${formatted} ر.س` : `SAR ${formatted}`;
}

/**
 * Convert a Western-digit string to Arabic-Indic digits (for storytelling copy)
 */
export function toArabicDigits(input: string | number): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(input).replace(/[0-9]/g, (d) => arabicDigits[parseInt(d, 10)]);
}
