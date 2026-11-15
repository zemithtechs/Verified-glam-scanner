// Re-encodes every PNG in public/img in place with a smaller (palette) PNG encoding.
// Same file names and sizes, so no page reference changes. A file is only replaced when the new one is smaller.
//
//   node scripts/compress-originals.mjs
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "public", "img");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.png$/i.test(entry.name)) yield full;
  }
}

const files = [];
for await (const f of walk(SRC)) files.push(f);

let before = 0;
let after = 0;
let replaced = 0;
const queue = [...files];
async function worker() {
  while (queue.length) {
    const file = queue.pop();
    const input = await readFile(file);
    before += input.length;
    const output = await sharp(input)
      .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9, dither: 1.0 })
      .toBuffer();
    if (output.length < input.length * 0.95) {
      await writeFile(file, output);
      after += output.length;
      replaced++;
    } else {
      after += input.length;
    }
  }
}
await Promise.all([worker(), worker(), worker(), worker()]);
console.log(`PNGs: ${files.length}, re-encoded: ${replaced}, ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
