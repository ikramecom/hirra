import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink } from '@hirra/shared';

/**
 * Floating WhatsApp button — premium-leaning treatment.
 *
 * - Brand-green disc with a thin cream ring (instead of WhatsApp's neon tone).
 * - Drops shadow and hover-lifts subtly.
 * - Sits above the iOS sticky-CTA on PDPs (bottom-24 on small).
 */
export function WhatsAppButton() {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || '9665XXXXXXXX';
  const message = 'مرحبا 👋 عندي سؤال عن منتجات هِرّة';
  const href = buildWhatsAppLink(phone, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 end-4 sm:bottom-6 sm:end-6 z-40 h-14 w-14 rounded-full bg-[#1FAA52] text-cream shadow-card-hover grid place-items-center hover:scale-105 hover:bg-[#178A41] transition-all ring-2 ring-cream/80"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
