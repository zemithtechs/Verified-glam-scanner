// Builds and runs scripts/test-polar-credits.ts against a throwaway local database.
//   node scripts/test-polar-credits.mjs
import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const state = ".wrangler/test-state";
rmSync(state, { recursive: true, force: true });

const sh = (cmd, args, opts = {}) => spawnSync(cmd, args, { stdio: "inherit", shell: true, ...opts });
let r = sh("npx", ["wrangler", "d1", "migrations", "apply", "verified-glam-db", "--local", "--persist-to", state]);
if (r.status !== 0) process.exit(r.status ?? 1);

r = sh("npx", ["esbuild", "scripts/test-polar-credits.ts", "--bundle", "--platform=node", "--format=esm", "--packages=external", "--outfile=.wrangler/test-polar-credits.mjs", "--log-level=error"]);
if (r.status !== 0) process.exit(r.status ?? 1);

r = sh("node", [".wrangler/test-polar-credits.mjs"]);
process.exit(r.status ?? 1);
