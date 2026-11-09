import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The public pages are prerendered at build time. Serve those saved copies from Cloudflare's static assets
// instead of re-rendering every page on every visit (which was slow and overloaded the Worker).
export default defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache });
