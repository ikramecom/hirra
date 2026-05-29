import { FAQ_ITEMS, FAQ_SECTION } from '@/lib/sections-data';
import { Accordion } from './Accordion';
import { SectionHeader } from './SectionHeader';
import { SectionShell } from './SectionShell';

export function FaqSection() {
  return (
    <SectionShell id="faq" variant="elevated" labelledBy="faq-title">
      <SectionHeader
        id="faq-title"
        eyebrow={FAQ_SECTION.eyebrow}
        title={FAQ_SECTION.title}
        subtitle={FAQ_SECTION.subtitle}
      />

      <div className="faq-panel mx-auto max-w-3xl">
        <Accordion items={FAQ_ITEMS} />
      </div>
    </SectionShell>
  );
}
