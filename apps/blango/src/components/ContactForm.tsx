import { useState } from 'react';
import { Send } from 'lucide-react';
import { CONTACT_FORM, WHATSAPP } from '@/lib/sections-data';

export function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      'مرحباً Blango Studio،',
      '',
      `الاسم: ${name.trim()}`,
      `الهاتف: ${phone.trim()}`,
      email.trim() ? `البريد: ${email.trim()}` : '',
      '',
      'تفاصيل المشروع:',
      message.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    const url = `${WHATSAPP.url}?text=${encodeURIComponent(body)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="contact-form-panel mx-auto max-w-xl">
      <h2 className="font-heading text-xl font-bold text-pearl sm:text-2xl">{CONTACT_FORM.title}</h2>
      <p className="type-body mt-2 text-smoke">{CONTACT_FORM.subtitle}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="contact-name" className="contact-form-label">
            {CONTACT_FORM.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={CONTACT_FORM.namePlaceholder}
            className="contact-form-input"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="contact-form-label">
            {CONTACT_FORM.phone}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            required
            dir="ltr"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={CONTACT_FORM.phonePlaceholder}
            className="contact-form-input"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="contact-form-label">
            {CONTACT_FORM.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={CONTACT_FORM.emailPlaceholder}
            className="contact-form-input"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="contact-form-label">
            {CONTACT_FORM.message}
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={CONTACT_FORM.messagePlaceholder}
            className="contact-form-input contact-form-textarea"
          />
        </div>
        <button type="submit" className="btn-primary w-full sm:w-auto">
          {CONTACT_FORM.submit}
          <Send className="h-4 w-4 opacity-85" aria-hidden />
        </button>
      </form>
    </div>
  );
}
