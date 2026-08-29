import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { WhatsappFab } from "@/components/site/whatsapp-fab";

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
  metadataBase: new URL("https://nexgenbuilders.in"),
  title: {
    default:
      "NexGen Builders & Promoters — Property in Zirakpur, Mohali & Tricity",
    template: "%s · NexGen Builders & Promoters",
  },
  description:
    "Trusted property advisors and builders on PR-7 Airport Road, Zirakpur. 10 years, 300+ deals. Flats, plots & villas across Zirakpur, Mohali, Panchkula & Himachal — with negotiation you can feel and builders we've verified.",
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} h-full`}>
      <head>
        {/* No-JS fallback: reveal-on-scroll elements stay fully visible. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsappFab />
      </body>
    </html>
  );
}
