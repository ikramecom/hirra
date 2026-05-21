/**
 * Normalise a Saudi phone number to +9665XXXXXXXX (E.164).
 * Returns null if the input cannot be parsed as a valid Saudi mobile.
 *
 * Accepts:
 *   - "0512345678"
 *   - "512345678"
 *   - "+966512345678"
 *   - "966512345678"
 *   - "00966512345678"
 *   - With spaces or dashes
 */
export function normalizeSaudiPhone(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');

  if (digits.startsWith('00966')) return '+' + digits.slice(2);
  if (digits.startsWith('966') && digits.length === 12) return '+' + digits;
  if (digits.startsWith('05') && digits.length === 10) return '+966' + digits.slice(1);
  if (digits.startsWith('5') && digits.length === 9) return '+966' + digits;

  return null;
}

/**
 * Pretty-print a normalized phone: "+966 5X XXX XXXX"
 */
export function formatPhoneDisplay(normalized: string): string {
  // Expects "+9665XXXXXXXX"
  if (!normalized.startsWith('+9665')) return normalized;
  const local = normalized.slice(4); // 5XXXXXXXX
  return `+966 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

/**
 * Build a "wa.me" link with an optional pre-filled message.
 * Phone must be digits only (no + sign).
 */
export function buildWhatsAppLink(phoneDigits: string, message?: string): string {
  const cleaned = phoneDigits.replace(/\D/g, '');
  if (!message) return `https://wa.me/${cleaned}`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
