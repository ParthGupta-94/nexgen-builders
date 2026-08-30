import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Temporary stock imagery (Unsplash) until the client sends real photos.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
