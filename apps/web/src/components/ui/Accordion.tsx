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
    <div className="border-b border-sand/50 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-4 text-start text-walnut font-semibold hover:text-emerald transition"
        aria-expanded={open}
      >
        <span>{question}</span>
        <ChevronDown
          className={cn('h-5 w-5 shrink-0 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-300 ease-soft',
          open ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div className="text-walnut/80 leading-relaxed">{answer}</div>
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: Array<{ question: string; answer: ReactNode }>;
}

export function Accordion({ items }: AccordionProps) {
  return (
    <div className="divide-y divide-sand/50">
      {items.map((item, i) => (
        <AccordionItem key={i} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
