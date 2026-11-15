// Builds / deploys the public site in "handoff" mode (see lib/live-mode.ts).
//   node scripts/live.mjs build    -> OpenNext build for Cloudflare Workers
//   node scripts/live.mjs deploy   -> build, then deploy with wrangler
// Cloudflare credentials come from web-hub/.env.cloudflare (git-ignored). They are NOT kept in .env, because the build bundles
// every .env file into the deployed Worker. Only the deploy step receives them. Index flags come from the environment.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";

const mode = process.argv[2];
const env = {
  ...process.env,
  NEXT_PUBLIC_APP_MODE: "handoff",
  // The origin the backend must trust for sign-in requests made by this site.
  NEXT_PUBLIC_SELF_ORIGIN: "https://aibeautystyling.com",
  // The new domain stays hidden from Google until the SEO cutover. Set SITE_INDEXABLE=true only on cutover day.
  SITE_INDEXABLE: process.env.SITE_INDEXABLE ?? "false",
};
const credentials = {};
if (existsSync(".env.cloudflare")) {
  for (const line of readFileSync(".env.cloudflare", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*(CLOUDFLARE_[A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) credentials[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
// A clean build folder every time: a half-finished earlier build leaves duplicate files behind and breaks the next one.
const clean = () => { for (const dir of [".open-next", ".next"]) rmSync(dir, { recursive: true, force: true }); };
const run = (cmd, args, extra = {}) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", env: { ...env, ...extra }, shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
// Pictures are served from R2, not the Worker. Only rebuild the WebP files when the source folder exists on this machine.
const images = () => { if (existsSync("media")) run("node", ["scripts/optimize-images.mjs"]); };
if (mode === "build") { clean(); images(); run("npx", ["opennextjs-cloudflare", "build"]); }
else if (mode === "deploy") { clean(); images(); run("npx", ["opennextjs-cloudflare", "build"]); run("npx", ["opennextjs-cloudflare", "deploy"], credentials); }
else { console.log("Usage: node scripts/live.mjs build|deploy"); process.exit(2); }
