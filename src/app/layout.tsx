import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WhatsappFab } from "@/components/site/whatsapp-fab";
import { Motion } from "@/components/site/motion";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nexgenestates.in"),
  title: {
    default:
      "NexGen Builders & Promoters — Property in Zirakpur, Mohali & Tricity",
    template: "%s · NexGen Builders & Promoters",
  },
  description:
    "Trusted property dealer & builders on PR-7 Airport Road, Zirakpur — flats, plots & villas across the Tricity. 10 years, 300+ deals, builders we verify.",
  keywords: [
    "property dealer in Zirakpur",
    "real estate Airport Road PR-7",
    "flats in Zirakpur",
    "property in Mohali",
    "3 BHK Zirakpur",
    "NexGen Builders",
    "property dealer Panchkula",
    "safe property investment Chandigarh",
  ],
  openGraph: {
    type: "website",
    title: "NexGen Builders & Promoters",
    description:
      "Building for the next generation. Trusted property advisors on PR-7 Airport Road, Zirakpur — 10 years, 300+ deals.",
    siteName: site.name,
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
  verification: { google: "A08hZfZZ-0eWP-bqJjKtyIuvoy2PgZp3CorrRJu-fO4" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${hanken.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        {/* Pre-paint flag so animated elements hide before JS runs (no FOUC).
            Only set when motion is allowed, so no-JS/reduced-motion see content. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js')}}catch(e){}",
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-[var(--color-gold)] focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Motion />
        <SiteHeader />
        <main id="main" className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsappFab />
      </body>
    </html>
  );
}
