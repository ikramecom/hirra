import { ContactForm } from '@/components/ContactForm';
import { ContactSection } from '@/components/ContactSection';
import { PageBanner } from '@/components/PageBanner';
import { PaymentMethodsSection } from '@/components/PaymentMethodsSection';
import { PAGE_HEADERS } from '@/lib/sections-data';

export function ContactPage() {
  return (
    <div className="contact-page">
      <PageBanner {...PAGE_HEADERS.contact} compact />
      <ContactSection variant="page" />
      <section className="contact-form-section contact-page-form relative border-t border-white/[0.05]">
        <div className="container-content">
          <ContactForm compact />
        </div>
      </section>
      <PaymentMethodsSection compact />
    </div>
  );
}
