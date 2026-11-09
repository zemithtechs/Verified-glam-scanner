// Builds / deploys the public site in "handoff" mode (see lib/live-mode.ts).
//   node scripts/live.mjs build    -> OpenNext build for Cloudflare Workers
//   node scripts/live.mjs deploy   -> build, then deploy with wrangler
// Cloudflare credentials come from web-hub/.env (git-ignored). Index flags come from the environment.
import { spawnSync } from "node:child_process";

const mode = process.argv[2];
const env = {
  ...process.env,
  NEXT_PUBLIC_APP_MODE: "handoff",
  // The new domain stays hidden from Google until the SEO cutover. Set SITE_INDEXABLE=true only on cutover day.
  SITE_INDEXABLE: process.env.SITE_INDEXABLE ?? "false",
};
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", env, shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
if (mode === "build") run("npx", ["opennextjs-cloudflare", "build"]);
else if (mode === "deploy") { run("npx", ["opennextjs-cloudflare", "build"]); run("npx", ["opennextjs-cloudflare", "deploy"]); }
else { console.log("Usage: node scripts/live.mjs build|deploy"); process.exit(2); }
