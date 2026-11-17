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
    const SITE = "https://aibeautystyling.com";
    const www = [{ type: "host" as const, value: "www.aibeautystyling.com" }];
    return [
      { source: "/guides", destination: "/blog", permanent: true },
      // One canonical host: www goes to https://aibeautystyling.com in one step.
      // The home page needs its own rule: ":path*" does not expand when the path is empty, which produced a 404.
      // Plain http is NOT detected here: the headers the Worker sees for the scheme are not reliable (a rule on them
      // caused a redirect loop on 2026-11-17). Use Cloudflare's "Always Use HTTPS" setting for that, plus the HSTS header below.
      { source: "/", has: www, destination: `${SITE}/`, permanent: true },
      { source: "/:path+", has: www, destination: `${SITE}/:path+`, permanent: true },
    ];
  },
  async headers() {
    // Browsers that have seen the site over https will use https automatically from then on (one year).
    return [{ source: "/:path*", headers: [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] }];
  },
};

export default nextConfig;
