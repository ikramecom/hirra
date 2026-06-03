import { FinalCtaSection } from '@/components/FinalCtaSection';
import { HeroSection } from '@/components/HeroSection';
import { PortfolioPreviewSection } from '@/components/PortfolioPreviewSection';
import { ServicesSection } from '@/components/ServicesSection';

/**
 * Homepage: Hero → Services → Portfolio → CTA only.
 * "لماذا نحن" lives on /why-us (WhyUsPage), not here.
 */
export function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection variant="preview" />
      <PortfolioPreviewSection />
      <FinalCtaSection />
    </>
  );
}
