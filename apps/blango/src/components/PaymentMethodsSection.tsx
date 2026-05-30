import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { PAYMENT_METHODS } from '@/lib/sections-data';

export function PaymentMethodsSection() {
  return (
    <section
      id="payment-methods"
      className="payment-trust-band"
      aria-labelledby="payment-methods-title"
    >
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="payment-trust-panel"
        >
          <h2 id="payment-methods-title" className="payment-trust-title">
            {PAYMENT_METHODS.title}
          </h2>

          <ul className="payment-trust-grid" role="list">
            {PAYMENT_METHODS.methods.map(({ key, title, titleEn, icon: Icon }) => (
              <li key={key} className="payment-trust-item">
                <span className="payment-trust-icon" aria-hidden>
                  <Icon className="h-4 w-4 text-gold" strokeWidth={1.75} />
                </span>
                <span className="payment-trust-label">{title}</span>
                <span dir="ltr" className="payment-trust-label-en">
                  {titleEn}
                </span>
              </li>
            ))}
          </ul>

          <p className="payment-trust-message">
            <ShieldCheck className="payment-trust-message-icon" strokeWidth={1.75} aria-hidden />
            <span>{PAYMENT_METHODS.trustMessage}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
