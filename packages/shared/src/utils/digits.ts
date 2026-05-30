/** Eastern Arabic (٠–٩) and Persian (۰–۹) → Western digits (0–9). */
export function normalizeWesternDigits(input: string | number): string {
  return String(input).replace(/[٠-٩۰-۹]/g, (ch) => {
    const eastern = '٠١٢٣٤٥٦٧٨٩'.indexOf(ch);
    if (eastern >= 0) return String(eastern);
    const persian = '۰۱۲۳۴۵۶۷۸۹'.indexOf(ch);
    if (persian >= 0) return String(persian);
    return ch;
  });
}
