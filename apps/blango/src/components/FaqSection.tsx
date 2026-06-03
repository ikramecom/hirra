import { FAQ_ITEMS, FAQ_SECTION } from '@/lib/sections-data';
import { Accordion } from './Accordion';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

interface FaqSectionProps {
  embedded?: boolean;
}

export function FaqSection({ embedded = false }: FaqSectionProps) {
  return (
    <SectionShell id="faq" variant="elevated" labelledBy="faq-title" className={embedded ? 'section-embedded' : ''}>
      {!embedded ? (
        <SectionHeader
          id="faq-title"
          eyebrow={FAQ_SECTION.eyebrow}
          title={FAQ_SECTION.title}
          subtitle={FAQ_SECTION.subtitle}
        />
      ) : null}

      <div className="faq-panel mx-auto max-w-3xl">
        <Accordion items={FAQ_ITEMS} />
      </div>
    </SectionShell>
  );
}
