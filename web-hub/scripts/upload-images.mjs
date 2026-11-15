// Uploads the site's own pictures to the public R2 bucket that serves https://images.aibeautystyling.com.
//   node scripts/upload-images.mjs              builds the WebP files, then uploads what the site uses
//   node scripts/upload-images.mjs --skip-build uploads without rebuilding the WebP files first
//
// Only files listed in scripts/image-manifest.json are sent (made by build-image-manifest.mjs), and files already
// in the bucket with the same size are skipped, so reruns only send what is missing.
// Bucket: ai-beauty-styling-images. Credentials (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID) come from web-hub/.env.
// Object keys mirror the site paths: img/<file> for originals, _opt/<file> for the WebP versions, posts/<slug>/<file> for blog pictures (always uploaded).
import { readdir, readFile, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUCKET = "ai-beauty-styling-images";
const PUBLIC_BASE = "https://images.aibeautystyling.com";
const TYPES = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".gif": "image/gif" };
const CONCURRENCY = 16;

// Read web-hub/.env without printing anything from it.
try {
  for (const line of readFileSync(path.join(root, ".env"), "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID ?? "d51f26f800e13df506b35fd6c2d523f6";
if (!TOKEN) { console.error("CLOUDFLARE_API_TOKEN is missing (web-hub/.env)."); process.exit(1); }

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (TYPES[path.extname(entry.name).toLowerCase()]) yield full;
  }
}

if (!process.argv.includes("--skip-build")) {
  const r = spawnSync("node", ["scripts/optimize-images.mjs"], { cwd: root, stdio: "inherit", shell: true });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const files = [];
for (const folder of ["img", "_opt"]) {
  const base = path.join(root, "media", folder);
  try { for await (const f of walk(base)) files.push({ file: f, key: `${folder}/${path.relative(base, f).replace(/\\/g, "/")}` }); } catch {}
}
// Blog pictures: media/blog/<slug>/<file> goes to posts/<slug>/<file>. Only the flat files next to the post are sent,
// never the research/, images/ (original downloads) or _template-checks folders.
try {
  const blogBase = path.join(root, "media", "blog");
  for (const post of await readdir(blogBase, { withFileTypes: true })) {
    if (!post.isDirectory() || post.name.startsWith("_")) continue;
    for (const entry of await readdir(path.join(blogBase, post.name), { withFileTypes: true })) {
      if (entry.isFile() && TYPES[path.extname(entry.name).toLowerCase()]) files.push({ file: path.join(blogBase, post.name, entry.name), key: `posts/${post.name}/${entry.name}` });
    }
  }
} catch {}
// The favicon is the one picture that also stays in public/ (the browser asks the site root for it).
files.push({ file: path.join(root, "public", "img", "favicon.png"), key: "img/favicon.png" });

try {
  const wanted = new Set(JSON.parse(readFileSync(path.join(root, "scripts", "image-manifest.json"), "utf8")));
  const before = files.length;
  for (let i = files.length - 1; i >= 0; i--) if (!files[i].key.startsWith("posts/") && !wanted.has(files[i].key)) files.splice(i, 1);
  console.log(`Manifest: ${files.length} of ${before} files are in use by pages.`);
} catch { console.log("No manifest found: uploading every file."); }

const endpoint = (key) => `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/r2/buckets/${BUCKET}/objects/${key.split("/").map(encodeURIComponent).join("/")}`;

async function put({ file, key }) {
  const body = await readFile(file);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(endpoint(key), {
        method: "PUT",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": TYPES[path.extname(file).toLowerCase()], "Cache-Control": "public, max-age=31536000, immutable" },
        body,
        signal: AbortSignal.timeout(120000),
      });
      if (res.ok) return { key, ok: true };
      if (attempt === 3) return { key, ok: false, err: `HTTP ${res.status} ${(await res.text()).slice(0, 160)}` };
    } catch (e) {
      if (attempt === 3) return { key, ok: false, err: String(e).slice(0, 160) };
    }
  }
}

let done = 0, sent = 0, skipped = 0;
const failed = [];
const queue = [...files];
async function worker() {
  while (queue.length) {
    const item = queue.pop();
    try {
      const head = await fetch(`${PUBLIC_BASE}/${item.key}`, { method: "HEAD" });
      if (head.ok && Number(head.headers.get("content-length")) === (await stat(item.file)).size) { skipped++; done++; continue; }
    } catch {}
    const res = await put(item);
    if (res.ok) sent++; else failed.push(res);
    done++;
    if (done % 50 === 0 || done === files.length) console.log(`${done}/${files.length} checked, ${sent} uploaded, ${skipped} already there, ${failed.length} failed`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
if (failed.length) {
  console.log("Failed objects:");
  for (const f of failed) console.log(" -", f.key, f.err);
  process.exit(1);
}
console.log(`Done: ${sent} uploaded, ${skipped} already in the bucket, ${files.length} in total.`);
