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
import { site } from "@/data/site";

// Local-business structured data — helps NexGen surface in local Google results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.name,
  description:
    "Property advisors and builders on PR-7 Airport Road, Zirakpur, serving the Tricity, Mohali, Panchkula and Himachal.",
  telephone: site.contact.phone,
  email: site.contact.email,
  areaServed: [
    "Zirakpur",
    "Mohali",
    "Panchkula",
    "Chandigarh",
    "Derabassi",
    "Shimla",
    "Solan",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.pin,
    addressCountry: "IN",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
