// Lists the image files the live site really uses, so only those are uploaded to R2.
// It reads the page crawl result written by the crawler (see the path argument) and the media folder.
//
//   node scripts/build-image-manifest.mjs <used.json>
//
// Writes scripts/image-manifest.json: the R2 object keys (img/... originals and _opt/... WebP files) to upload.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const crawl = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const unused = new Set(crawl.unused);
const keys = new Set(crawl.used.map((u) => u.replace(/^\//, "")));

(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.png$/i.test(entry.name)) {
      const rel = "/img/" + path.relative(path.join(root, "media", "img"), full).replace(/\\/g, "/");
      if (!unused.has(rel)) keys.add(rel.replace(/^\//, ""));
    }
  }
})(path.join(root, "media", "img"));
keys.add("img/favicon.png");

const out = [...keys].sort();
fs.writeFileSync(path.join(root, "scripts", "image-manifest.json"), JSON.stringify(out, null, 0));
console.log(`${out.length} keys: ${out.filter((k) => k.startsWith("_opt/")).length} WebP, ${out.filter((k) => k.startsWith("img/")).length} originals`);
