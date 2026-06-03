/**
 * Moroccan mobile numbers → E.164 (+2126XXXXXXXX / +2127XXXXXXXX).
 * Accepts: 06XXXXXXXX, 07XXXXXXXX, +2126…, +2127…, 2126… (12 digits).
 */
export function normalizeMoroccanPhone(raw: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');

  if (digits.startsWith('00212')) {
    const local = digits.slice(5);
    if (/^[67]\d{8}$/.test(local)) return `+212${local}`;
  }

  if (digits.startsWith('212') && digits.length === 12) {
    const local = digits.slice(3);
    if (/^[67]\d{8}$/.test(local)) return `+212${local}`;
  }

  if ((digits.startsWith('06') || digits.startsWith('07')) && digits.length === 10) {
    return `+212${digits.slice(1)}`;
  }

  if ((digits.startsWith('6') || digits.startsWith('7')) && digits.length === 9) {
    return `+212${digits}`;
  }

  return null;
}

/** @deprecated Use normalizeMoroccanPhone — kept for existing imports */
export function normalizeMaghrebPhone(raw: string): string | null {
  return normalizeMoroccanPhone(raw);
}

/**
 * @deprecated Saudi validation removed from RIYANALUXE storefront
 */
export function normalizeSaudiPhone(_raw: string): string | null {
  return null;
}

export function formatPhoneDisplay(normalized: string): string {
  if (normalized.startsWith('+212')) {
    const local = normalized.slice(4);
    return `+212 ${local.slice(0, 1)} ${local.slice(1, 3)} ${local.slice(3, 5)} ${local.slice(5)}`;
  }
  return normalized;
}

export function buildWhatsAppLink(phoneDigits: string, message?: string): string {
  const cleaned = phoneDigits.replace(/\D/g, '');
  if (!message) return `https://wa.me/${cleaned}`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
