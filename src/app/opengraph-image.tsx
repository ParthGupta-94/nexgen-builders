import { ImageResponse } from "next/og";

export const alt = "NexGen Builders & Promoters — property in Zirakpur & the Tricity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social-share card (used for link previews on WhatsApp, X, etc.)
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #17130d 0%, #241d13 100%)",
          color: "#f3ead6",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#b0873a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#17130d",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 26, letterSpacing: 6, color: "#c9a24a" }}>
            NEXGEN BUILDERS &amp; PROMOTERS
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
            Property, chosen the way you&apos;d choose it for family.
          </div>
          <div style={{ fontSize: 30, color: "#b9ac93" }}>
            10 years · 300+ deals · PR-7 Airport Road, Zirakpur
          </div>
        </div>

        <div style={{ fontSize: 24, color: "#c9a24a" }}>nexgenestates.in</div>
      </div>
    ),
    { ...size },
  );
}
