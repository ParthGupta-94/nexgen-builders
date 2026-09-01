/*
 * TEMPORARY placeholder imagery — curated royalty-free Unsplash real-estate
 * photography, used until the client provides NexGen's own photos.
 * All IDs verified to resolve. Swap these for real /public images later.
 */

const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

// exteriors
const EXT = {
  a: "1600585154340-be6161a56a0c",
  b: "1600047509807-ba8f99d2cdde",
  c: "1600596542815-ffad4c1539a9",
  d: "1512917774080-9991f1c4c750",
  e: "1600585152220-90363fe7e115",
  f: "1613490493576-7fde63acd811",
  g: "1568605114967-8130f3a36994",
  h: "1580587771525-78b9dba3b914",
};
// interiors
const INT = {
  a: "1600607687939-ce8a6c25118c",
  b: "1600566753086-00f18fb6b3ea",
  c: "1600210492486-724fe5c67fb0",
  d: "1567496898669-ee935f5f647a",
  e: "1502672260266-1c1ef2d93688",
  f: "1493809842364-78817add7ffb",
};

export const heroImage = U(EXT.f, 2000);
export const aboutImage = U(EXT.d, 1200);
export const founderImage = "/team/sanjeev.jpg"; // real photo — Sanjeev at the NexGen office

export const projectImages: Record<string, string> = {
  "golden-era-homes": "/projects/golden-era/day-site-view.jpg",
  "vintage-greens": "/projects/vintage-greens/exterior.jpg",
  belgravia: "/projects/belgravia/elevation.jpg",
  "vaneet-infra-derabassi": "/projects/vaneet-infra-derabassi/aerial.jpg",
  velora: "/projects/velora/aerial.jpg",
};

// fallback gallery shots (stock) for any project without its own gallery
export const galleryImages = [U(INT.a), U(INT.b), U(INT.c)];

/*
 * Per-project galleries — REAL developer renders sourced from each project's
 * official site (Vintage Buildtech, Affinity Group, Velora Buildtech, Vaneet
 * Infra). Optimised copies live in public/projects/<slug>/. First image is the
 * card/hero. Golden Era has its own `goldenEraGallery` below.
 */
export const projectGallery: Record<string, { src: string; alt: string }[]> = {
  "vintage-greens": [
    { src: "/projects/vintage-greens/exterior.jpg", alt: "Vintage Greens — the towers from the entrance driveway" },
    { src: "/projects/vintage-greens/aerial.jpg", alt: "Vintage Greens — aerial view of the cluster" },
    { src: "/projects/vintage-greens/elevation-dusk.jpg", alt: "Vintage Greens — tower elevation at dusk" },
    { src: "/projects/vintage-greens/pool.jpg", alt: "Vintage Greens — swimming pool" },
    { src: "/projects/vintage-greens/clubhouse.jpg", alt: "Vintage Greens — clubhouse" },
    { src: "/projects/vintage-greens/living.jpg", alt: "Vintage Greens — living room interior" },
    { src: "/projects/vintage-greens/kitchen.jpg", alt: "Vintage Greens — modular kitchen" },
    { src: "/projects/vintage-greens/bedroom.jpg", alt: "Vintage Greens — master bedroom" },
  ],
  belgravia: [
    { src: "/projects/belgravia/elevation.jpg", alt: "Affinity Belgravia — daytime elevation of the towers" },
    { src: "/projects/belgravia/aerial.jpg", alt: "Affinity Belgravia — aerial view" },
    { src: "/projects/belgravia/night.jpg", alt: "Affinity Belgravia — night view" },
    { src: "/projects/belgravia/pool.jpg", alt: "Affinity Belgravia — swimming pool" },
    { src: "/projects/belgravia/clubhouse.jpg", alt: "Affinity Belgravia — clubhouse" },
    { src: "/projects/belgravia/living.jpg", alt: "Affinity Belgravia — living room interior" },
    { src: "/projects/belgravia/dining.jpg", alt: "Affinity Belgravia — dining area interior" },
  ],
  velora: [
    { src: "/projects/velora/aerial.jpg", alt: "Velora Urbano — aerial view of the plotted township" },
    { src: "/projects/velora/clubhouse.jpg", alt: "Velora Urbano — Club Green clubhouse" },
    { src: "/projects/velora/greens.jpg", alt: "Velora Urbano — landscaped greens" },
  ],
  "vaneet-infra-derabassi": [
    { src: "/projects/vaneet-infra-derabassi/aerial.jpg", alt: "Vaneet Infra, Derabassi — aerial masterplan" },
    { src: "/projects/vaneet-infra-derabassi/retail-arcade.jpg", alt: "Vaneet Infra, Derabassi — retail arcade entrance" },
    { src: "/projects/vaneet-infra-derabassi/sunwise.jpg", alt: "Vaneet Infra, Derabassi — Sunwise plots" },
    { src: "/projects/vaneet-infra-derabassi/city-court.jpg", alt: "Vaneet Infra, Derabassi — City Court commercial block" },
  ],
};

/*
 * Golden Era Homes gallery — REAL developer renders (Goyal Infra), supplied by
 * the client. Optimised copies live in `public/projects/golden-era/`.
 * First image is the marquee tile in the gallery grid + the page hero.
 */
const GE = (file: string) => `/projects/golden-era/${file}`;

export const goldenEraGallery: { src: string; alt: string }[] = [
  { src: GE("front-elevation-night.jpg"), alt: "Golden Era Homes — front elevation at night" },
  { src: GE("site-elevation-day.jpg"), alt: "Golden Era Homes — full site elevation by day" },
  { src: GE("day-site-view.jpg"), alt: "Golden Era Homes — day view of the towers" },
  { src: GE("night-view-site.jpg"), alt: "Golden Era Homes — the site lit up at night" },
  { src: GE("highrise-elevation-low-angle.jpg"), alt: "Golden Era Homes — high-rise elevation, low angle" },
  { src: GE("block-2-3-elevations.jpg"), alt: "Golden Era Homes — Block 2 & 3 elevations" },
  { src: GE("block4-balcony-view.jpg"), alt: "Golden Era Homes — Block 4 balcony view" },
  { src: GE("entrance.jpg"), alt: "Golden Era Homes — grand entrance" },
  { src: GE("lobby.jpg"), alt: "Golden Era Homes — high-rise lobby" },
  { src: GE("bedroom.jpg"), alt: "Golden Era Homes — bedroom interior" },
  { src: GE("dining.jpg"), alt: "Golden Era Homes — dining area interior" },
  { src: GE("swimming-pool.jpg"), alt: "Golden Era Homes — swimming pool" },
  { src: GE("gym.jpg"), alt: "Golden Era Homes — gymnasium" },
  { src: GE("badminton-court.jpg"), alt: "Golden Era Homes — badminton court" },
  { src: GE("cricket-pitch.jpg"), alt: "Golden Era Homes — cricket pitch" },
  { src: GE("indoor-games.jpg"), alt: "Golden Era Homes — indoor games room" },
  { src: GE("mini-theatre.jpg"), alt: "Golden Era Homes — mini theatre" },
  { src: GE("kids-play-area.jpg"), alt: "Golden Era Homes — kids' play area" },
  { src: GE("park-view.jpg"), alt: "Golden Era Homes — landscaped park" },
  { src: GE("yoga.jpg"), alt: "Golden Era Homes — yoga & meditation deck" },
];

export const locationImages: Record<string, string> = {
  zirakpur: U(EXT.a),
  "airport-road-pr7": U(EXT.f),
  mohali: U(EXT.g),
  panchkula: U(EXT.h),
  derabassi: U(EXT.b),
  "shimla-solan": U(EXT.d),
};

export const testimonialImage = U(INT.e);
export const contactImage = U(EXT.h, 1000);
