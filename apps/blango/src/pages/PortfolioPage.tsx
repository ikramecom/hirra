import { PageBanner } from '@/components/PageBanner';
import { PortfolioPageCta } from '@/components/PortfolioPageCta';
import { PortfolioSection } from '@/components/PortfolioSection';
import { PAGE_HEADERS } from '@/lib/sections-data';

export function PortfolioPage() {
  return (
    <>
      <PageBanner {...PAGE_HEADERS.portfolio} />
      <PortfolioSection embedded />
      <PortfolioPageCta />
    </>
  );
}
