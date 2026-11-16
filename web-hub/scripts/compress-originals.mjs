// Re-encodes every PNG in media/img in place with a smaller (palette) PNG encoding.
// Same file names and sizes, so no page reference changes. A file is only replaced when the new one is smaller.
//
//   node scripts/compress-originals.mjs
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "media", "img");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.png$/i.test(entry.name)) yield full;
  }
}

// Pass --since=2026-11-16T16:00 to compress only files changed after that time. Without it every PNG is re-encoded,
// which squeezes already-compressed pictures a second time, so use --since for new additions.
const sinceArg = process.argv.find((a) => a.startsWith("--since="));
const since = sinceArg ? new Date(sinceArg.slice("--since=".length)).getTime() : 0;
const files = [];
for await (const f of walk(SRC)) if (!since || (await stat(f)).mtimeMs >= since) files.push(f);

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
