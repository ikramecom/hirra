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
    <div className="faq-item group/faq">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="faq-trigger"
        aria-expanded={open}
      >
        <span className="font-arabic text-[15px] font-semibold leading-snug text-pearl transition-colors duration-500 group-hover/faq:text-pearl sm:text-base">
          {question}
        </span>
        <span
          className={cn(
            'faq-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/[0.06] transition-all duration-500',
            open && 'border-gold/40 bg-gold/[0.12]',
          )}
          aria-hidden
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 text-gold transition-transform duration-500 ease-luxury',
              open && 'rotate-180',
            )}
          />
        </span>
      </button>
      <div
        className={cn(
          'grid transition-all duration-500 ease-luxury',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="faq-answer font-arabic pb-5 pe-14 ps-1 pt-1 text-[13px] leading-[1.85] text-smoke sm:text-sm">
            {answer}
          </p>
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
    <div className="faq-list">
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
