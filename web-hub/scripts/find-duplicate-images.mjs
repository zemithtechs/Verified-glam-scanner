// Finds picture files with identical content stored under different names, so the same bytes are never uploaded twice.
//   node scripts/find-duplicate-images.mjs
// Reads scripts/image-manifest.json (the files that will be uploaded) and groups them by content hash.
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const keys = JSON.parse(fs.readFileSync(path.join(root, "scripts", "image-manifest.json"), "utf8"));
const groups = new Map();
let total = 0;
for (const key of keys) {
  const file = path.join(root, key.startsWith("img/favicon") ? "public" : "media", key);
  if (!fs.existsSync(file)) continue;
  const buf = fs.readFileSync(file);
  total += buf.length;
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  if (!groups.has(hash)) groups.set(hash, []);
  groups.get(hash).push({ key, size: buf.length });
}
const dupes = [...groups.values()].filter((g) => g.length > 1);
const wasted = dupes.reduce((s, g) => s + g[0].size * (g.length - 1), 0);
console.log(`files: ${keys.length}, total ${(total / 1048576).toFixed(1)} MB`);
console.log(`groups of identical files: ${dupes.length}, wasted ${(wasted / 1048576).toFixed(2)} MB`);
for (const g of dupes.slice(0, 40)) console.log(` ${(g[0].size / 1024).toFixed(0)} KB x${g.length}: ${g.map((x) => x.key).join("  |  ")}`);
fs.writeFileSync(path.join(root, "scripts", "image-duplicates.json"), JSON.stringify(dupes, null, 1));
