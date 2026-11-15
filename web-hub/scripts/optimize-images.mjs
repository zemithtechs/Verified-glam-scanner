// Pre-builds small WebP versions of every picture in media/img, once, at build time.
// The WebP files are uploaded to R2 (npm run images:upload) and served from https://images.aibeautystyling.com,
// so nothing is resized inside the Worker. Originals stay in media/img (git-ignored) for "Download" links.
//
//   node scripts/optimize-images.mjs
//
// Output: media/_opt/<same path>-<width>.webp for each width in WIDTHS (never upscaled).
// Keep WIDTHS in sync with lib/image-loader.ts.
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "media", "img");
const OUT = path.join(root, "media", "_opt");
const WIDTHS = [384, 768, 1280, 1920];
const QUALITY = 78;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(png|jpe?g)$/i.test(entry.name)) yield full;
  }
}

const files = [];
for await (const f of walk(SRC)) files.push(f);

let made = 0, skipped = 0, bytes = 0;
const queue = [...files];
async function worker() {
  while (queue.length) {
    const file = queue.pop();
    const rel = path.relative(SRC, file).replace(/\\/g, "/").replace(/\.(png|jpe?g)$/i, "");
    const srcTime = (await stat(file)).mtimeMs;
    const meta = await sharp(file).metadata();
    for (const w of WIDTHS) {
      const target = Math.min(w, meta.width || w);
      const out = path.join(OUT, `${rel}-${w}.webp`);
      try { const s = await stat(out); if (s.mtimeMs >= srcTime) { skipped++; bytes += s.size; continue; } } catch {}
      await mkdir(path.dirname(out), { recursive: true });
      const info = await sharp(file).rotate().resize({ width: target, withoutEnlargement: true }).webp({ quality: QUALITY, effort: 4 }).toFile(out);
      made++; bytes += info.size;
    }
  }
}
await Promise.all([worker(), worker(), worker()]);
console.log(`Images: ${files.length} originals -> ${made} written, ${skipped} up to date, ${(bytes / 1048576).toFixed(1)} MB total in media/_opt`);
