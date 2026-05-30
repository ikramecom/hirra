import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface AccordionItemProps {
  question: string;
  answer: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ question, answer, defaultOpen = false }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('faq-item group/faq rounded-2xl transition-all duration-500', open && 'faq-item-open')}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="faq-trigger w-full"
        aria-expanded={open}
      >
        <span className="font-heading pe-4 text-base font-semibold leading-snug text-pearl sm:text-lg">
          {question}
        </span>
        <span
          className={cn(
            'faq-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/[0.06] transition-all duration-500',
            open && 'border-gold/40 bg-gold/[0.14] rotate-180',
          )}
          aria-hidden
        >
          <ChevronDown className="h-4 w-4 text-gold transition-transform duration-500" />
        </span>
      </button>
      <div
        className={cn(
          'grid transition-all duration-500 ease-luxury',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="type-body px-1 pb-6 pe-14 text-smoke">{answer}</p>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: ReadonlyArray<{ question: string; answer: ReactNode }>;
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="faq-list space-y-3">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          question={item.question}
          answer={item.answer}
          defaultOpen={i === 0}
        />
      ))}
    </div>
  );
}
