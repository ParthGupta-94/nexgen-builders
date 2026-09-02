/*
 * Projects NexGen is actively marketing — from the owner's questionnaire.
 * Positioning + genuinely-true location advantages only. Prices, floor plans,
 * availability and unit counts are deliberately NOT stated (they change and
 * weren't provided) — those route to WhatsApp so nothing is invented.
 * [PLACEHOLDER] = detail the owner still needs to confirm.
 */

import type { Faq } from "./locations";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  developer: string;
  type: string;
  status: string;
  locationName: string;
  locationSlug: string; // links to the matching /locations page
  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  // content
  intro: string[];
  highlights: { title: string; body: string }[];
  configs: string[];
  faqs: Faq[];
  // optional rich sections (real data from the developer's site; omit if unknown)
  amenities?: string[];
  connectivity?: { place: string; time: string }[];
};

export const projects: Project[] = [
  {
    slug: "golden-era-homes",
    name: "Golden Era Homes",
    tagline: "Nagla Road, Zirakpur",
    developer: "Goyal Infra",
    type: "Residential apartments",
    status: "Available",
    locationName: "Zirakpur",
    locationSlug: "zirakpur",
    metaTitle: "Golden Era Homes, Zirakpur — Flats on Nagla Road | NexGen",
    metaDescription:
      "Golden Era Homes by Goyal Infra on Nagla Road, Zirakpur — premium residences with quick access to PR-7 and the airport. Get current pricing and availability from NexGen on WhatsApp.",
    keywords: [
      "Golden Era Homes Zirakpur",
      "Golden Era Homes Goyal Infra",
      "flats on Nagla Road Zirakpur",
      "Golden Era Homes price",
    ],
    intro: [
      "Golden Era Homes by Goyal Infra sits on Nagla Road, one of Zirakpur's better-connected residential pockets, with a quick run onto PR-7 and the airport corridor. It's built for families who want a settled address without stepping away from the city's momentum.",
      "We've worked with Goyal Infra's projects before, so we can talk you through the towers, floors and configurations honestly — and get you the best possible number, not just the list price.",
    ],
    highlights: [
      {
        title: "Connected on Nagla Road",
        body: "Easy access to PR-7, the airport and the wider Zirakpur core — the connectivity buyers actually ask for.",
      },
      {
        title: "A developer we know",
        body: "We've dealt with Goyal Infra's projects, so you get first-hand insight rather than a brochure.",
      },
      {
        title: "Negotiated, not listed",
        body: "We push for the best price, floor and payment terms on your behalf.",
      },
    ],
    configs: ["3 BHK apartments & independent floors", "S+14 towers (1750 & 2100 sq.ft) · S+4 floors (225 sq.yd)"],
    faqs: [
      {
        q: "What is the price of a flat in Golden Era Homes?",
        a: "Pricing depends on the tower, floor, facing and possession stage, and it moves regularly. Message us your budget on WhatsApp and we'll send you current, real numbers — usually within minutes.",
      },
      {
        q: "Where exactly is Golden Era Homes located?",
        a: "On Nagla Road in Zirakpur, with quick access to PR-7 Airport Road. See our full guide to buying property in Zirakpur for the wider area picture.",
      },
    ],
  },
  {
    slug: "green-lotus-utsav",
    name: "Green Lotus Utsav",
    tagline: "Airport Road, Zirakpur",
    developer: "Green Lotus Group",
    type: "Residential apartments",
    status: "Available",
    locationName: "Zirakpur",
    locationSlug: "airport-road-pr7",
    metaTitle: "Green Lotus Utsav, Zirakpur — 3–6 BHK Eco Flats | NexGen",
    metaDescription:
      "Green Lotus Utsav, Zirakpur — IGBC-certified 3–6 BHK eco apartments on PR-7 Airport Road. NexGen Builders & Promoters: pricing, availability & honest advice.",
    keywords: [
      "Green Lotus Utsav Zirakpur",
      "Green Lotus Utsav price",
      "Green Lotus Utsav 3 BHK",
      "eco apartments Zirakpur",
      "Green Lotus Utsav Airport Road",
    ],
    intro: [
      "Green Lotus Utsav is one of Zirakpur's landmark green addresses — an IGBC-certified eco-development on the PR-7 Airport Road corridor, where high-rise towers wrap around landscaped courtyards and homes run from spacious 3 BHKs to sprawling penthouses.",
      "It's a project buyers ask about by name, and one we know inside out. We'll walk you honestly through the towers, floors and configurations, check the paperwork, and negotiate hard — so you get the right home at the right number, not just the list price.",
    ],
    highlights: [
      {
        title: "IGBC-certified green living",
        body: "Solar-ready homes, rainwater harvesting and low-VOC interiors — comfort that's easier on the running costs and the planet.",
      },
      {
        title: "On the PR-7 Airport Road corridor",
        body: "The Tricity's most sought-after belt — minutes from the international airport, the highway, malls and schools.",
      },
      {
        title: "Resort-grade amenities",
        body: "An all-weather pool, clubhouse, sports courts, fine dining and more — a full lifestyle inside the gates.",
      },
    ],
    configs: ["3 BHK, 3 BHK + Study & 4 BHK apartments", "5 & 6 BHK penthouses"],
    amenities: [
      "All-weather swimming pool & kids' pool",
      "Clubhouse & fine-dining lounge",
      "Gym, sauna, steam & jacuzzi",
      "Tennis, squash & basketball courts",
      "Billiards, table tennis & mini theatre",
      "Library & kids' corner",
      "EV charging & golf-cart service",
      "Rainwater harvesting & waste management",
    ],
    connectivity: [
      { place: "Metro", time: "4 min" },
      { place: "Paras Downtown Mall", time: "5 min" },
      { place: "Schools", time: "5 min" },
      { place: "Bus Stand", time: "5 min" },
      { place: "Airport", time: "7 min" },
      { place: "Hospitals", time: "10 min" },
      { place: "Railway Station", time: "12 min" },
    ],
    faqs: [
      {
        q: "Who is the developer of Green Lotus Utsav?",
        a: "Green Lotus Utsav is developed under the Green Lotus brand (Maya Estate) on PR-7 Airport Road, Zirakpur — an IGBC-certified green development (RERA PBRERA-SAS79-PR0425). We've worked this corridor for years and can give you the honest picture.",
      },
      {
        q: "What configurations does Green Lotus Utsav offer?",
        a: "Mainly 3 BHK, 3 BHK + study and 4 BHK apartments, plus 5 and 6 BHK penthouses. Tell us your family size and budget on WhatsApp and we'll match you to what's genuinely available now.",
      },
      {
        q: "What is the price of a flat in Green Lotus Utsav?",
        a: "Pricing moves by tower, floor, facing and stage, and it changes regularly. Message us your budget on WhatsApp and we'll send current, real numbers — usually within minutes.",
      },
    ],
  },
  {
    slug: "vintage-greens",
    name: "Vintage Greens",
    tagline: "Airport Road, Zirakpur",
    developer: "Vintage Buildtech",
    type: "Residential apartments",
    status: "Available",
    locationName: "PR-7 Airport Road",
    locationSlug: "airport-road-pr7",
    metaTitle: "Vintage Greens, Airport Road Zirakpur — Flats | NexGen Builders",
    metaDescription:
      "Vintage Greens on Airport Road, Zirakpur — green, low-density living on the PR-7 corridor. Talk to NexGen Builders & Promoters for current pricing, availability and honest advice on WhatsApp.",
    keywords: [
      "Vintage Greens Zirakpur",
      "Vintage Greens Airport Road",
      "flats Airport Road Zirakpur",
      "Vintage Greens price",
    ],
    intro: [
      "Vintage Greens brings green, lower-density living to the fast-growing Airport Road belt. For buyers who want the PR-7 address without the density of the busiest towers, it's an easy one to like.",
      "We'll give you the straight picture on configurations, stage and value here — and make sure the builder's credentials check out before you commit.",
    ],
    highlights: [
      {
        title: "On the PR-7 corridor",
        body: "The Tricity's most sought-after belt, minutes from the airport and highway.",
      },
      {
        title: "Green & liveable",
        body: "A lower-density, greener setting for families who want calm as well as connectivity.",
      },
      {
        title: "Builder checked",
        body: "We verify credibility and track record before you put money down.",
      },
    ],
    configs: ["2 & 3 BHK apartments", "Airport Road / PR-7 location"],
    amenities: ["Swimming pool", "37,000 sq.ft clubhouse", "6.5-acre landscaped greens", "Power backup", "Piped-gas connection", "Managed facilities (IFMS)"],
    connectivity: [
      { place: "Chandigarh Airport", time: "18 min" },
      { place: "Mehar Hospital", time: "10 min" },
      { place: "St. Xavier's School", time: "5 min" },
      { place: "D-Mart", time: "5 min" },
      { place: "Decathlon", time: "5 min" },
      { place: "Metro Wholesale", time: "10 min" },
      { place: "Mohali", time: "20 min" },
      { place: "Panchkula", time: "20 min" },
    ],
    faqs: [
      {
        q: "Is Vintage Greens ready to move in?",
        a: "Availability and possession stage change over time. Tell us your timeline on WhatsApp and we'll confirm exactly what's on offer right now.",
      },
      {
        q: "What makes the Airport Road location good?",
        a: "Fast airport and highway access, premium new launches and strong resale demand. See our Airport Road / PR-7 area guide for the full picture.",
      },
    ],
  },
  {
    slug: "belgravia",
    name: "Belgravia",
    tagline: "Airport Road, Zirakpur",
    developer: "Affinity Group",
    type: "Luxury apartments",
    status: "Available",
    locationName: "PR-7 Airport Road",
    locationSlug: "airport-road-pr7",
    metaTitle: "Belgravia, Airport Road Zirakpur — Luxury Apartments | NexGen",
    metaDescription:
      "Belgravia on Airport Road, Zirakpur — an exclusive PR-7 address for buyers who want a premium lifestyle. NexGen Builders & Promoters has current details and honest pricing. WhatsApp us.",
    keywords: [
      "Belgravia Zirakpur",
      "Belgravia Airport Road",
      "luxury apartments Zirakpur",
      "premium flats Airport Road",
    ],
    intro: [
      "Belgravia is an exclusive address on Airport Road for buyers who want a genuinely premium lifestyle — the kind of home you upgrade into and stay in. It sits right on the Tricity's most aspirational corridor.",
      "For a purchase at this level, diligence and negotiation matter even more. That's exactly where a decade of Zirakpur deals earns its keep for you.",
    ],
    highlights: [
      {
        title: "A premium PR-7 address",
        body: "Exclusivity and prestige on the corridor buyers most want to live on.",
      },
      {
        title: "Lifestyle-led",
        body: "Positioned for buyers who value finish, facilities and address over price alone.",
      },
      {
        title: "Serious negotiation",
        body: "At this level, our negotiation and diligence protect a significant investment.",
      },
    ],
    configs: ["Premium 3 & 4 BHK apartments", "Airport Road / PR-7 location"],
    amenities: ["Swimming pool", "Clubhouse", "Gymnasium", "Indoor games", "Yoga deck", "Squash court", "Banquet hall"],
    connectivity: [
      { place: "Bestech Mall", time: "8 min" },
      { place: "Manav Rachna School", time: "6 min" },
      { place: "IISER Mohali", time: "10 min" },
      { place: "NIPER Mohali", time: "11 min" },
      { place: "Airport", time: "15 min" },
      { place: "Fortis Hospital", time: "16 min" },
      { place: "PCA Stadium", time: "12 min" },
      { place: "Railway Station", time: "25 min" },
    ],
    faqs: [
      {
        q: "How much does a luxury flat in Belgravia cost?",
        a: "Premium pricing varies by unit, floor and view, and changes with the market. Share your budget on WhatsApp and we'll send current options and honest guidance.",
      },
    ],
  },
  {
    slug: "vaneet-infra-derabassi",
    name: "Vaneet Infra",
    tagline: "Derabassi",
    developer: "Vaneet Infra",
    type: "Residential",
    status: "Available",
    locationName: "Derabassi",
    locationSlug: "derabassi",
    metaTitle: "Vaneet Infra, Derabassi — Value Homes | NexGen Builders",
    metaDescription:
      "Vaneet Infra in Derabassi — well-priced homes on the Chandigarh–Ambala belt with strong long-term upside. NexGen Builders & Promoters has current pricing and availability. WhatsApp us.",
    keywords: [
      "Vaneet Infra Derabassi",
      "flats in Derabassi",
      "Vaneet Infra price",
      "affordable homes Derabassi",
    ],
    intro: [
      "Vaneet Infra brings well-priced homes to Derabassi, on the improving Chandigarh–Ambala belt. For first-time buyers and value-seekers, it's a way to own more home for the money without losing connectivity.",
      "We help you weigh entry price against long-term growth here honestly, and verify the builder before anything is signed.",
    ],
    highlights: [
      {
        title: "Value on the Ambala belt",
        body: "Entry pricing the Tricity core no longer offers, with room to appreciate.",
      },
      {
        title: "A developer we know",
        body: "Vaneet Infra is on our list of worked-with developers — you get first-hand insight.",
      },
      {
        title: "Honest trade-offs",
        body: "We'll tell you plainly how Derabassi compares to Zirakpur for your goals.",
      },
    ],
    configs: ["1, 2 & 3 BHK homes", "Chandigarh–Ambala belt location"],
    amenities: ["24×7 gated security", "Clubhouse", "Mini theatre", "Amphitheatre", "Gymnasium", "Cricket, basketball & volleyball", "Landscaped parks", "Rainwater harvesting"],
    faqs: [
      {
        q: "Are Vaneet Infra homes in Derabassi a good investment?",
        a: "Derabassi offers strong value and improving infrastructure, which supports long-term upside. We'll give you a straight read for your budget — message us on WhatsApp.",
      },
      {
        q: "How far is Derabassi from Chandigarh?",
        a: "Derabassi sits on the Chandigarh–Ambala highway, keeping it well connected. See our Derabassi area guide for more.",
      },
    ],
  },
  {
    slug: "velora",
    name: "Velora",
    tagline: "Patiala Highway",
    developer: "Velora Buildtech",
    type: "Residential",
    status: "Available",
    locationName: "Zirakpur",
    locationSlug: "zirakpur",
    metaTitle: "Velora, Patiala Highway — Homes with Upside | NexGen Builders",
    metaDescription:
      "Velora on the Patiala Highway — a well-connected address with strong long-term upside near Zirakpur. NexGen Builders & Promoters has current details and honest pricing. WhatsApp us.",
    keywords: [
      "Velora Patiala Highway",
      "Velora Zirakpur",
      "homes Patiala Road",
      "Velora price",
    ],
    intro: [
      "Velora sits on the Patiala Highway, a connected address with genuine long-term upside as the corridor develops around Zirakpur. It suits buyers looking a little further out for better value and growth.",
      "As always, we'll verify the builder, read the market for you and negotiate hard — so the upside stays real, not just a sales pitch.",
    ],
    highlights: [
      {
        title: "On the Patiala Highway",
        body: "A well-connected corridor with room to grow as development spreads out from Zirakpur.",
      },
      {
        title: "Growth-focused",
        body: "Positioned for buyers who want long-term appreciation as much as a home.",
      },
      {
        title: "Diligence first",
        body: "Builder credibility and paperwork are checked before you commit.",
      },
    ],
    configs: ["Residential configurations", "Patiala Highway location"],
    amenities: ["Club Green clubhouse", "Kids' play area", "Sports zones", "7-acre central park", "EV charging", "24×7 water supply", "Power backup", "3-tier security"],
    connectivity: [
      { place: "Chandigarh Airport", time: "15 min" },
      { place: "Amity University", time: "15 min" },
      { place: "Panchkula", time: "15 min" },
      { place: "Tribune Chowk", time: "20 min" },
      { place: "Ambala Highway", time: "10 min" },
    ],
    faqs: [
      {
        q: "Where is Velora located?",
        a: "On the Patiala Highway, within the growth corridor around Zirakpur. See our Zirakpur area guide for the wider picture, or message us for exact directions.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
