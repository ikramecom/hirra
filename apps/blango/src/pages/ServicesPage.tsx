import { PageBanner } from '@/components/PageBanner';
import { ServicesSection } from '@/components/ServicesSection';
import { PAGE_HEADERS } from '@/lib/sections-data';

export function ServicesPage() {
  return (
    <>
      <PageBanner {...PAGE_HEADERS.services} />
      <ServicesSection variant="full" embedded />
    </>
  );
}
