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
export const founderImage = U(INT.d, 600);

export const projectImages: Record<string, string> = {
  "golden-era-homes": U(EXT.a),
  "vintage-greens": U(EXT.c),
  belgravia: U(EXT.f),
  "vaneet-infra-derabassi": U(EXT.b),
  velora: U(EXT.e),
};

// gallery shots for a project detail page
export const galleryImages = [U(INT.a), U(INT.b), U(INT.c)];

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
