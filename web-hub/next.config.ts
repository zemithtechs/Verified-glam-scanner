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
    // Cloudflare tells the Worker which scheme the visitor used.
    const plainHttp = [{ type: "header" as const, key: "x-forwarded-proto", value: "http" }];
    const visitorHttp = [{ type: "header" as const, key: "cf-visitor", value: '.*"scheme":"http".*' }];
    return [
      { source: "/guides", destination: "/blog", permanent: true },
      // One canonical address: https://aibeautystyling.com. Every other variant (www, plain http, or both) goes there in ONE step.
      // The home page needs its own rule: ":path*" does not expand when the path is empty, which produced a 404.
      { source: "/", has: www, destination: `${SITE}/`, permanent: true },
      { source: "/:path+", has: www, destination: `${SITE}/:path+`, permanent: true },
      { source: "/", has: plainHttp, destination: `${SITE}/`, permanent: true },
      { source: "/:path+", has: plainHttp, destination: `${SITE}/:path+`, permanent: true },
      // Same rule through the second header Cloudflare sets, in case the first one is not passed on.
      { source: "/", has: visitorHttp, destination: `${SITE}/`, permanent: true },
      { source: "/:path+", has: visitorHttp, destination: `${SITE}/:path+`, permanent: true },
    ];
  },
  async headers() {
    // Browsers that have seen the site over https will use https automatically from then on (one year).
    return [{ source: "/:path*", headers: [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] }];
  },
};

export default nextConfig;
