import { PageBanner } from '@/components/PageBanner';
import { PricingSection } from '@/components/PricingSection';
import { PAGE_HEADERS } from '@/lib/sections-data';

export function PricingPage() {
  return (
    <>
      <PageBanner {...PAGE_HEADERS.pricing} compact />
      <PricingSection embedded />
    </>
  );
}
