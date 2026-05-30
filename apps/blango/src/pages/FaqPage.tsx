import { FaqSection } from '@/components/FaqSection';
import { PageBanner } from '@/components/PageBanner';
import { PAGE_HEADERS } from '@/lib/sections-data';

export function FaqPage() {
  return (
    <>
      <PageBanner {...PAGE_HEADERS.faq} />
      <FaqSection embedded />
    </>
  );
}
