import { MessageCircle } from 'lucide-react';
import { WHATSAPP } from '@/lib/sections-data';

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP.url}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa group"
      aria-label={`${WHATSAPP.label} — ${WHATSAPP.number}`}
    >
      <MessageCircle
        className="floating-wa-icon h-[15px] w-[15px] text-gold transition-colors duration-300 group-hover:text-gold-light"
        strokeWidth={1.75}
      />
    </a>
  );
}
