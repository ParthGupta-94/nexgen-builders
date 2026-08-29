/*
 * NexGen Builders & Promoters — single source of truth.
 * Everything editable lives here. Values drawn from the owner's
 * completed discovery questionnaire (Sanjeev Bhagta, Aug 2026).
 * Items marked [PLACEHOLDER] are awaiting confirmed details.
 */

export const site = {
  name: "NexGen Builders & Promoters",
  shortName: "NexGen",
  tagline: "Building for the next generation",
  // The owner's brand promise, in his own words.
  ethos:
    "A home is built for the generations that come after us — the most crucial decision a family makes. It deserves to be made knowledgeably, and honestly.",
  foundedNote: "10 years in real estate · 300+ deals closed",

  contact: {
    owner: "Sanjeev Bhagta",
    role: "Owner & Managing Director",
    phone: "+91 98053 35550",
    phoneRaw: "919805335550",
    email: "Sanj.ngns@gmail.com",
    whatsapp: "919805335550",
    whatsappMessage:
      "Hi NexGen, I'm interested in a property. Could you help me?",
  },

  address: {
    line1: "Uptown Insignia, LGF-7",
    line2: "PR-7 Airport Road, Zirakpur",
    city: "Mohali",
    state: "Punjab",
    pin: "140603",
    hours: "[PLACEHOLDER — working hours]",
  },

  social: {
    instagram: "https://www.instagram.com/nexgen_estates_/",
    facebook: "[PLACEHOLDER — Facebook page URL]",
  },

  // Preferred domains (to be registered): nexgenbuilders.in
  domain: "nexgenbuilders.in",

  // RERA / certifications — owner confirmed these exist; awaiting numbers.
  rera: "[PLACEHOLDER — RERA registration number]",
} as const;

export const stats = [
  { value: "10", suffix: "+", label: "Years in real estate" },
  { value: "300", suffix: "+", label: "Deals closed" },
  { value: "₹1–10", suffix: " Cr", label: "Typical property range" },
  { value: "2", suffix: " min", label: "Average response time" },
] as const;

/* Why clients choose NexGen — straight from his stated strengths. */
export const pillars = [
  {
    title: "Deep market knowledge",
    body: "Ten years and 300+ deals across the Tricity and hill markets. We know what a property is really worth — and what it will be worth tomorrow.",
  },
  {
    title: "Negotiation that pays for itself",
    body: "The one thing even our competitors admit we're good at. We fight for the best possible outcome, and our clients feel it in the final number.",
  },
  {
    title: "We check the builder, so you don't get burned",
    body: "Most buyers never verify a builder's credibility or history. We do it for you — the single biggest mistake we save clients from.",
  },
  {
    title: "Promises kept, every time",
    body: "A stressful, complicated process made to feel seamless and easy. When we commit to something, it happens.",
  },
] as const;

/* Projects live in src/data/projects.ts; areas in src/data/locations.ts. */

/* Real testimonial from the questionnaire. */
export const testimonials = [
  {
    quote:
      "Your deep market knowledge and negotiation skills got us the best possible outcome. You made a stressful, complicated process feel completely seamless and easy.",
    author: "[PLACEHOLDER — client name]",
    detail: "Home buyer, Zirakpur",
  },
] as const;

/* Builders & developers he has worked with — credibility proof. */
export const partners = [
  "Escon Projects",
  "Altura (DD Builders)",
  "Golden Era Homes · Goyal Infra",
  "Wave Estate, Sector 85",
  "Vaneet Infra",
  "VRS Aadhyam",
  "Vintage Greens",
] as const;

/* The founder's journey — for the About page timeline (from questionnaire). */
export const journey = [
  {
    year: "Before 2008",
    title: "A corporate grounding",
    body: "Years inside ICICI Prudential, New York Life, TATA and IBM — learning how large, disciplined organisations actually work.",
  },
  {
    year: "2008",
    title: "NEXGEN Net Solutions",
    body: "Founded his own IT company, and ran government-sponsored STAR skill-development programs for students.",
  },
  {
    year: "2016",
    title: "Into real estate",
    body: "Brought that corporate discipline into property, starting out as a dealer across the Tricity.",
  },
  {
    year: "2021",
    title: "Became an underwriter",
    body: "Stepped up to underwriting under the NEXGEN Builders & Promoters brand — and sold a 40-acre land bank.",
  },
  {
    year: "Today",
    title: "Becoming a builder",
    body: "300+ deals in, NexGen is growing from trusted advisor into a builder shaping the region's next chapter.",
  },
] as const;

/* Milestones the owner is proud of (questionnaire). */
export const milestones = [
  { label: "40-acre land bank sold", detail: "2021" },
  { label: "150 bighas sold in Himachal", detail: "2024" },
  { label: "Pre-leased Sagar Ratna unit sold", detail: "in a mall" },
] as const;

export const nav = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Why NexGen", href: "/about#principles" },
  { label: "Areas We Cover", href: "/locations" },
  { label: "Contact", href: "/contact" },
] as const;

export function whatsappHref(message: string = site.contact.whatsappMessage) {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
