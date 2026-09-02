import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Temporary stock imagery (Unsplash) until the client sends real photos.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Locality pages moved from /locations/<city> to top-level /<city>.
  async redirects() {
    return [
      { source: "/locations/:slug", destination: "/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
