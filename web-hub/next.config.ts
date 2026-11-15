import type { NextConfig } from "next";

const HANDOFF = process.env.NEXT_PUBLIC_APP_MODE === "handoff";
const LEGACY_APP_URL = "https://scanner.verifiedglam.com";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev badge (bottom-left) in the local preview.
  devIndicators: false,
  // All modes: serve the pre-built WebP files from R2 (see lib/image-loader.ts) instead of resizing in the server.
  // A custom loader needs no remotePatterns.
  images: { loader: "custom", loaderFile: "./lib/image-loader.ts", deviceSizes: [384, 768, 1280, 1920], imageSizes: [96, 256] },
  // Keep local Windows builds stable while prerendering the full 48-tool catalog.
  experimental: {
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
  },
  async redirects() {
    return [
      { source: "/guides", destination: "/blog", permanent: true },
      // One canonical host: www sends everyone to the main domain.
      { source: "/:path*", has: [{ type: "host", value: "www.aibeautystyling.com" }], destination: "https://aibeautystyling.com/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
