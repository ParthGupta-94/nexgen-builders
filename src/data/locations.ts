/*
 * SEO location pages — one rich, unique page per area NexGen wants to rank for.
 * Geo-targets and search phrasing taken directly from the owner's questionnaire:
 *   "Best property dealer in Zirakpur / Mohali / Chandigarh / Panchkula",
 *   "3 BHK in Zirakpur", "safe investment", "1/2/3 BHK near
 *    Highway / PR-7 / Airport / Hospital / School / IT Park".
 * Facts kept to genuinely true geography; prices deliberately soft
 * (exact figures come via WhatsApp) so nothing is invented.
 */

export type Faq = { q: string; a: string };

export type Location = {
  slug: string;
  name: string; // full display name
  shortName: string;
  region: string; // e.g. "Tricity, Punjab"
  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  // page content
  tagline: string;
  intro: string[]; // 2 paragraphs, unique per area
  highlights: { title: string; body: string }[];
  nearby: string[]; // "near X" chips — the buyer's own words
  configs: string[]; // property types available here
  projectSlugs: string[]; // links into projects data
  faqs: Faq[];
};

export const locations: Location[] = [
  {
    slug: "zirakpur",
    name: "Zirakpur",
    shortName: "Zirakpur",
    region: "Tricity, Punjab",
    metaTitle: "Property Dealer in Zirakpur — Flats, Plots & Villas | NexGen",
    metaDescription:
      "Trusted property dealer in Zirakpur on PR-7 Airport Road — 1/2/3 BHK flats, plots & villas, with builders we verify. NexGen: 10 yrs, 300+ deals. WhatsApp us.",
    keywords: [
      "property dealer in Zirakpur",
      "flats in Zirakpur",
      "3 BHK in Zirakpur",
      "2 BHK Zirakpur",
      "property in Zirakpur Airport Road",
      "best real estate agent Zirakpur",
    ],
    tagline: "Our home turf",
    intro: [
      "Zirakpur is where NexGen was built. For ten years and 300+ deals we have worked these streets, societies and launches — from the PR-7 Airport Road belt to Patiala Road and Nagla — so we know what a home here is genuinely worth today, and what it will be worth tomorrow.",
      "Sitting where Punjab, Haryana and the Chandigarh airport meet, Zirakpur has become the Tricity's fastest-moving residential market. That speed is exactly why buyers get it wrong — chasing a price without checking the builder. We do that check for you before you commit a rupee.",
    ],
    highlights: [
      {
        title: "The PR-7 Airport Road corridor",
        body: "The most sought-after address in Zirakpur, minutes from the international airport and the Chandigarh–Delhi highway.",
      },
      {
        title: "Everything within reach",
        body: "Schools, hospitals, malls and the IT hubs of Mohali are all a short drive away — the connectivity buyers actually ask for.",
      },
      {
        title: "A market we can read",
        body: "300+ deals here means we spot a fair price — and an overpriced one — the moment we see it.",
      },
    ],
    nearby: ["Airport", "PR-7 Highway", "Schools", "Hospitals", "IT Park", "Malls"],
    configs: [
      "1, 2 & 3 BHK apartments",
      "Independent floors & villas",
      "Residential plots",
      "Ready-to-move & under-construction",
    ],
    projectSlugs: ["golden-era-homes", "vintage-greens", "belgravia"],
    faqs: [
      {
        q: "Is Zirakpur a good place to buy property in 2026?",
        a: "Yes — Zirakpur remains one of the Tricity's strongest growth markets thanks to the airport, PR-7 connectivity and steady new launches. The key is buying from a credible builder at a fair price, which is exactly where we help.",
      },
      {
        q: "What is the price of a 3 BHK flat in Zirakpur?",
        a: "Pricing moves by project, floor, tower and possession date, so the honest answer is that it changes weekly. Message us your budget on WhatsApp and we'll send you current, real options — usually within minutes.",
      },
      {
        q: "How do I know a Zirakpur builder is trustworthy?",
        a: "Check RERA registration, past project delivery and financial track record. We verify a builder's credibility and history for every client — it's the single biggest mistake we save buyers from.",
      },
    ],
  },
  {
    slug: "airport-road-pr7",
    name: "PR-7 Airport Road",
    shortName: "Airport Road",
    region: "Zirakpur, Tricity",
    metaTitle: "PR-7 Airport Road Property, Zirakpur — Flats & Villas | NexGen",
    metaDescription:
      "Premium property on the PR-7 Airport Road corridor, Zirakpur — 2 & 3 BHK flats, apartments & villas near the airport. NexGen: trusted advisors, 300+ deals.",
    keywords: [
      "property PR-7 Airport Road",
      "flats near Chandigarh airport",
      "Airport Road Zirakpur property",
      "3 BHK near airport Zirakpur",
      "luxury apartments Airport Road",
    ],
    tagline: "The corridor everyone wants",
    intro: [
      "PR-7 — the Airport Road corridor — is the address Tricity buyers name first, and for good reason. Wide roads, new premium towers and a straight run to the international airport have made it the region's most aspirational belt. Our office sits right here, at Uptown Insignia.",
      "Because demand is high, this is also where the gap between a good deal and an overpriced one is widest. We live in this market every day, so we can tell you honestly which tower, which floor and which builder is worth your money.",
    ],
    highlights: [
      {
        title: "Minutes from the airport",
        body: "The single biggest draw of PR-7 — quick, clean access to Chandigarh's international airport and the national highway.",
      },
      {
        title: "The Tricity's premium belt",
        body: "New luxury launches, retail and dining make this the corridor buyers upgrade into, not out of.",
      },
      {
        title: "Strong rental & resale",
        body: "Proximity and prestige keep both rental demand and long-term resale healthy along Airport Road.",
      },
    ],
    nearby: ["Airport", "PR-7 Highway", "Malls", "Fine dining", "Schools", "Hospitals"],
    configs: [
      "2 & 3 BHK premium apartments",
      "Luxury 4 BHK & penthouses",
      "Independent villas",
      "Pre-leased commercial (on request)",
    ],
    projectSlugs: ["vintage-greens", "belgravia"],
    faqs: [
      {
        q: "Why is PR-7 Airport Road so popular with buyers?",
        a: "Connectivity and prestige. It offers the fastest access to the airport and highway, plus the Tricity's newest premium projects, retail and dining — all reasons demand and resale stay strong.",
      },
      {
        q: "Are there ready-to-move flats near the airport in Zirakpur?",
        a: "Yes — the corridor has both ready-to-move and under-construction options. Tell us your timeline and budget on WhatsApp and we'll match you to what's actually available now.",
      },
    ],
  },
  {
    slug: "mohali",
    name: "Greater Mohali",
    shortName: "Mohali",
    region: "Tricity, Punjab",
    metaTitle: "Property Dealer in Mohali — Flats, Plots & Investment | NexGen",
    metaDescription:
      "Buy property in Greater Mohali — flats, plots & safe long-term investment near IT City. NexGen Builders & Promoters: honest Tricity advisors, 300+ deals.",
    keywords: [
      "property dealer in Mohali",
      "flats in Mohali",
      "plots in Mohali",
      "safe investment Mohali",
      "property near IT City Mohali",
    ],
    tagline: "Where the Tricity is growing",
    intro: [
      "Greater Mohali has become the engine room of Tricity real estate — planned sectors, IT City, institutions and a steady pipeline of new societies. For buyers it offers something Zirakpur's core sometimes can't: space, planning and long-term upside.",
      "We help clients across Mohali's sectors and new-launch belts, from end-use family homes to plots bought purely for appreciation. Whatever the goal, the discipline is the same — verify the builder, negotiate hard, keep the promise.",
    ],
    highlights: [
      {
        title: "IT City & jobs",
        body: "Mohali's IT hubs and institutions drive genuine, lasting housing demand — the foundation of safe investment.",
      },
      {
        title: "Planned & spacious",
        body: "Sector planning and wider layouts appeal to families upgrading for the long term.",
      },
      {
        title: "Plots that appreciate",
        body: "For investors, Mohali's growth corridors remain one of the Tricity's better plays for capital growth.",
      },
    ],
    nearby: ["IT Park", "Highway", "Schools", "Hospitals", "Stadium", "Universities"],
    configs: [
      "2, 3 & 4 BHK apartments",
      "Residential & commercial plots",
      "Independent kothis",
      "Investment-grade land",
    ],
    projectSlugs: [],
    faqs: [
      {
        q: "Is Mohali good for property investment?",
        a: "Mohali is one of the Tricity's strongest investment markets, backed by IT City, education and planned infrastructure. We help you pick locations and builders with real long-term upside rather than hype.",
      },
      {
        q: "Should I buy a flat or a plot in Mohali?",
        a: "It depends on your goal — flats suit end-use and rental, plots often suit pure appreciation. Tell us what you're after and your budget, and we'll give you a straight recommendation.",
      },
    ],
  },
  {
    slug: "chandigarh",
    name: "Chandigarh",
    shortName: "Chandigarh",
    region: "Tricity, Chandigarh UT",
    metaTitle: "Real Estate Agent in Chandigarh — Homes & Flats | NexGen",
    metaDescription:
      "Trusted Chandigarh real estate consultants — sector kothis, builder floors & value flats across the Tricity. NexGen: 10 yrs, 300+ deals. WhatsApp us.",
    keywords: [
      "real estate agent in Chandigarh",
      "property dealer in Chandigarh",
      "property in Chandigarh",
      "flats in Chandigarh",
      "builder floor Chandigarh",
      "buy home in Chandigarh",
    ],
    tagline: "The city at the centre",
    intro: [
      "Chandigarh is the reason the whole Tricity exists — planned, green, and still the address every other town is measured against. It's also largely built-out, which makes buying here a different game: mostly resale kothis, builder floors and the occasional society flat, where a fair price and clean paperwork matter far more than a glossy brochure.",
      "That's exactly where a dealer earns their keep. For ten years and 300+ deals we've worked Chandigarh and its edges — so whether you want to own inside the city or get more home for your money in Mohali, Zirakpur or New Chandigarh just across the line, we'll tell you honestly where your budget goes furthest.",
    ],
    highlights: [
      {
        title: "India's first planned city",
        body: "The sector grid, wide green avenues and the Tricity's most established schools, hospitals and markets — the benchmark every other address is judged by.",
      },
      {
        title: "Mostly a resale market",
        body: "Little new supply inside the city means most buys are kothis, builder floors and resale flats — where verified title and a fair price are everything.",
      },
      {
        title: "Value just across the border",
        body: "When city prices stretch the budget, Mohali, Zirakpur and New Chandigarh offer new launches minutes away — we'll lay out the honest trade-off.",
      },
    ],
    nearby: ["Sectors", "PGIMER", "Panjab University", "IT Park", "Airport", "Elante Mall"],
    configs: [
      "Sector kothis & builder floors",
      "Resale society flats",
      "Residential plots (resale)",
      "New launches in the wider Tricity",
    ],
    projectSlugs: [],
    faqs: [
      {
        q: "Do you deal in property inside Chandigarh?",
        a: "Yes — we help buyers with kothis, builder floors and resale flats across Chandigarh's sectors, and we verify the title and paperwork before you commit. Tell us your preferred sector and budget on WhatsApp.",
      },
      {
        q: "Is it better to buy in Chandigarh or nearby Mohali / Zirakpur?",
        a: "Chandigarh offers the established address; Mohali, Zirakpur and New Chandigarh often offer newer homes and better value minutes away. We'll lay out the honest trade-off for your budget — no pressure either way.",
      },
      {
        q: "How much does a home in Chandigarh cost?",
        a: "It ranges widely by sector, plot size and whether it's a kothi, floor or flat — and it moves. Send us your budget on WhatsApp and we'll come back with real, current options, usually within minutes.",
      },
    ],
  },
  {
    slug: "panchkula",
    name: "Panchkula Extension",
    shortName: "Panchkula",
    region: "Tricity, Haryana",
    metaTitle: "Property Dealer in Panchkula — Flats & Plots | NexGen Builders",
    metaDescription:
      "Property in Panchkula & Panchkula Extension — flats & plots in the Tricity's greenest quarter. NexGen Builders & Promoters: trusted advisors, 300+ deals.",
    keywords: [
      "property dealer in Panchkula",
      "flats in Panchkula",
      "Panchkula Extension property",
      "plots in Panchkula",
      "best real estate agent Panchkula",
    ],
    tagline: "The Tricity's greenest quarter",
    intro: [
      "Panchkula has long been the Tricity's calmest, greenest and most orderly address — and the Panchkula Extension belt is now opening a fresh wave of homes at the foot of the Shivaliks. For buyers who want the Tricity without the rush, this is it.",
      "We work both the established sectors and the upcoming extension, matching families to homes that hold their value. As always, every builder is checked and every price is negotiated before you sign.",
    ],
    highlights: [
      {
        title: "Green & planned living",
        body: "Panchkula's tree-lined sectors and clean planning make it a favourite for families and end-users.",
      },
      {
        title: "New in the Extension",
        body: "Panchkula Extension is bringing fresh inventory and value at the edge of an already-loved city.",
      },
      {
        title: "Hills on the horizon",
        body: "Sitting at the foot of the Shivaliks, it pairs city convenience with a calmer, greener setting.",
      },
    ],
    nearby: ["Shivalik foothills", "Schools", "Hospitals", "Parks", "Highway", "Markets"],
    configs: [
      "2 & 3 BHK apartments",
      "Residential plots",
      "Independent floors & kothis",
      "Established & new-launch options",
    ],
    projectSlugs: [],
    faqs: [
      {
        q: "Is Panchkula Extension a good area to buy in?",
        a: "Yes — it brings fresh, better-value inventory to one of the Tricity's most liveable cities. We'll help you weigh the established sectors against the newer extension based on your budget and plans.",
      },
      {
        q: "Do you deal in Panchkula plots as well as flats?",
        a: "We do — both flats and plots across Panchkula and the extension. Share what you're looking for on WhatsApp and we'll send current options.",
      },
    ],
  },
  {
    slug: "derabassi",
    name: "Derabassi",
    shortName: "Derabassi",
    region: "Tricity, Punjab",
    metaTitle: "Property in Derabassi — Value Homes & Plots | NexGen Builders",
    metaDescription:
      "High-value property in Derabassi on the Chandigarh–Ambala belt — flats, plots & homes with strong upside. NexGen: honest local advisors, 300+ deals.",
    keywords: [
      "property in Derabassi",
      "flats in Derabassi",
      "plots in Derabassi",
      "affordable property near Chandigarh",
      "Derabassi real estate",
    ],
    tagline: "Value on the Ambala belt",
    intro: [
      "Derabassi is where Tricity buyers stretch their budget further. On the Chandigarh–Ambala highway with fast-improving infrastructure, it offers genuine value — more home for the money, with real room to grow.",
      "We help buyers who want smart entry pricing without giving up connectivity. The homework is the same as everywhere we work: the builder is verified, the price is negotiated, and nothing is oversold.",
    ],
    highlights: [
      {
        title: "More home per rupee",
        body: "Derabassi's pricing lets first-time buyers and investors get in at a level the Tricity core no longer offers.",
      },
      {
        title: "On the highway",
        body: "Sitting on the Chandigarh–Ambala belt keeps it well connected as the corridor develops.",
      },
      {
        title: "Room to appreciate",
        body: "Improving infrastructure and industry nearby give Derabassi a credible long-term growth story.",
      },
    ],
    nearby: ["Highway", "Industry", "Schools", "Hospitals", "Chandigarh", "Colleges"],
    configs: [
      "1, 2 & 3 BHK apartments",
      "Affordable & mid-segment plots",
      "Independent homes",
      "Investment plots",
    ],
    projectSlugs: ["vaneet-infra-derabassi"],
    faqs: [
      {
        q: "Is Derabassi worth buying in compared to Zirakpur?",
        a: "If value and space matter most, Derabassi often wins; if you want to be in the Tricity core, Zirakpur does. We'll lay out the honest trade-off for your budget so you choose with open eyes.",
      },
      {
        q: "Are there affordable flats in Derabassi?",
        a: "Yes — Derabassi is one of the more affordable belts we cover. Tell us your budget on WhatsApp and we'll match you to current options.",
      },
    ],
  },
  {
    slug: "shimla-solan",
    name: "Shimla & Solan",
    shortName: "Himachal",
    region: "Himachal Pradesh",
    metaTitle: "Property in Shimla & Solan — Land & Hill Homes | NexGen Builders",
    metaDescription:
      "Buy land & hill homes in Shimla and Solan, Himachal — cottages to land banks. NexGen Builders & Promoters: we've sold 150 bighas here. WhatsApp us.",
    keywords: [
      "property in Shimla",
      "land in Solan",
      "Himachal property dealer",
      "hill property Shimla Solan",
      "buy land Himachal",
    ],
    tagline: "Homes and land in the hills",
    intro: [
      "Beyond the Tricity, NexGen has deep roots in the Himachal market — many of our clients come from Himachal, and we've handled land at real scale here, including a 150-bigha sale in 2024. Shimla and Solan are where those buyers put down roots.",
      "Hill property has its own rules — title, access, slope and paperwork all matter more than in the plains. That's precisely where our diligence earns its keep, so a dream in the hills doesn't turn into a headache.",
    ],
    highlights: [
      {
        title: "Land done right",
        body: "From cottage plots to sizeable land banks, we handle Himachal land with the paperwork discipline it demands.",
      },
      {
        title: "Genuine local reach",
        body: "A large share of our clients are from Himachal — we know these buyers and these markets first-hand.",
      },
      {
        title: "Diligence that protects you",
        body: "Title, access and approvals are checked carefully, so a hill purchase stays a joy, not a liability.",
      },
    ],
    nearby: ["Shimla", "Solan", "Kasauli belt", "Hill views", "Highway", "Towns"],
    configs: [
      "Residential land & plots",
      "Cottages & hill homes",
      "Land banks (investment)",
      "Agricultural & view plots",
    ],
    projectSlugs: [],
    faqs: [
      {
        q: "Can non-Himachalis buy land in Himachal Pradesh?",
        a: "Himachal has specific rules (notably around Section 118) on who can buy agricultural land and how. We guide you through what's permissible for your situation before anything is committed — please treat this as general information, not legal advice.",
      },
      {
        q: "Do you deal in both Shimla and Solan?",
        a: "Yes — across the Shimla and Solan belts, from homes to land. Share what you have in mind on WhatsApp and we'll tell you honestly what's realistic.",
      },
    ],
  },
];

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}
