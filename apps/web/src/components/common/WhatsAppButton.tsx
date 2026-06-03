import { MessageCircle } from 'lucide-react';
import { buildWhatsAppLink, BRAND } from '@hirra/shared';

export function WhatsAppButton() {
  const phone = import.meta.env.VITE_WHATSAPP_PHONE || BRAND.whatsappDigits;
  const message =
    'السلام عليكم، أود الاستفسار عن مبخرة ريانا لوكس — شكراً.';
  const href = buildWhatsAppLink(phone, message);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 end-4 sm:bottom-6 sm:end-6 z-40 h-14 w-14 rounded-full bg-[#1FAA52] text-white shadow-card-hover grid place-items-center hover:scale-105 transition-all ring-2 ring-gold/30"
      aria-label="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
