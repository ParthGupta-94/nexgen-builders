import { Hero } from "@/components/home/hero";
import {
  StatsStrip,
  AboutTeaser,
  WhyNexgen,
  FeaturedProjects,
  Locations,
  Testimonial,
  Partners,
  FinalCta,
} from "@/components/home/sections";
import { businessJsonLd } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <Hero />
      <StatsStrip />
      <AboutTeaser />
      <WhyNexgen />
      <FeaturedProjects />
      <Locations />
      <Testimonial />
      <Partners />
      <FinalCta />
    </>
  );
}
