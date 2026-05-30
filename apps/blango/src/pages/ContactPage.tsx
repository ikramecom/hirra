import { ContactForm } from '@/components/ContactForm';
import { ContactSection } from '@/components/ContactSection';
import { PageBanner } from '@/components/PageBanner';
import { PaymentMethodsSection } from '@/components/PaymentMethodsSection';
import { PAGE_HEADERS } from '@/lib/sections-data';

export function ContactPage() {
  return (
    <>
      <PageBanner {...PAGE_HEADERS.contact} />
      <ContactSection variant="page" />
      <section className="contact-form-section relative border-t border-white/[0.05] py-16 sm:py-20">
        <div className="container-content">
          <ContactForm />
        </div>
      </section>
      <PaymentMethodsSection />
    </>
  );
}
