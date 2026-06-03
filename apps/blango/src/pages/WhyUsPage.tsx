import { PageBanner } from '@/components/PageBanner';
import { WhyBlangoSection } from '@/components/WhyBlangoSection';
import { PAGE_HEADERS } from '@/lib/sections-data';

export function WhyUsPage() {
  return (
    <>
      <PageBanner {...PAGE_HEADERS.whyUs} />
      <WhyBlangoSection embedded />
    </>
  );
}
