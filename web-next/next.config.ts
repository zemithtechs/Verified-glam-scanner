import type { NextConfig } from "next";

/**
 * Site move: the public pages now live on https://aibeautystyling.com.
 * Each old public URL gets a permanent (301) redirect to the same path there, only for requests that arrive on the old host.
 * Sign-in, registration and the signed-in app (/login, /register, /app, /dashboard, ...) are NOT redirected yet, because
 * Google sign-in is not live on the new site. Remove this block's keep-list when it is.
 */
const NEW_SITE = "https://aibeautystyling.com";
const OLD_HOST = "scanner.verifiedglam.com";
const MOVED_PATHS = [
  "/", "/tools", "/pricing", "/about", "/privacy", "/terms", "/delete-account",
  "/face-beauty-analysis", "/seasonal-color-palette", "/beauty-routine-challenge", "/beauty-tips",
  "/celebrity-look-alike", "/facial-symmetry", "/beauty-score-showdown", "/face-comparison",
  "/attractiveness-test", "/face-golden-ratio",
];

const nextConfig: NextConfig = {
  // Allow testing the local dev server from another device on this LAN.
  // Without this, Next blocks its client/HMR scripts and interactive forms
  // fall back to plain browser submissions (for example GET /login?).
  allowedDevOrigins: ["192.168.1.176"],
  async redirects() {
    return MOVED_PATHS.map((path) => ({
      source: path,
      has: [{ type: "host" as const, value: OLD_HOST }],
      destination: `${NEW_SITE}${path}`,
      permanent: true,
    }));
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
