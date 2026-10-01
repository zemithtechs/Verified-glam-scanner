import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow testing the local dev server from another device on this LAN.
  // Without this, Next blocks its client/HMR scripts and interactive forms
  // fall back to plain browser submissions (for example GET /login?).
  allowedDevOrigins: ["192.168.1.176"],
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
