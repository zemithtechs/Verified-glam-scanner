import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Static-heavy public site: the default (no incremental cache override) is enough.
export default defineCloudflareConfig();
