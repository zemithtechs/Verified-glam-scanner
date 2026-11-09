import type { NextConfig } from "next";

const HANDOFF = process.env.NEXT_PUBLIC_APP_MODE === "handoff";
const LEGACY_APP_URL = "https://scanner.verifiedglam.com";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev badge (bottom-left) in the local preview.
  devIndicators: false,
  // Keep local Windows builds stable while prerendering the full 48-tool catalog.
  experimental: {
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
  },
  async redirects() {
    return [
      { source: "/guides", destination: "/blog", permanent: true },
      // The preview dashboard is mock data. On the deployed site, people use the working app until accounts move here.
      ...(HANDOFF ? [{ source: "/app/:path*", destination: `${LEGACY_APP_URL}/app`, permanent: false }] : []),
    ];
  },
};

export default nextConfig;
