import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const catalog = await readFile(path.join(root, 'lib/catalog.ts'), 'utf8');
const slugs = [...catalog.matchAll(/slug: "([^"]+)"/g)].map(match => match[1]);
const dir = path.join(root, 'media/img/results');
const files = (await readdir(dir)).filter(name => name.endsWith('.png'));
const errors = [];
for (const slug of slugs) if (!files.includes(`${slug}.png`)) errors.push(`Missing ${slug}`);
const hashes = new Map();
for (const file of files) {
  const bytes = await readFile(path.join(dir, file));
  if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') { errors.push(`Invalid PNG: ${file}`); continue; }
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  if (width < 1200 || Math.abs(width / height - 16 / 9) > 0.08) errors.push(`Unexpected dimensions ${width}x${height}: ${file}`);
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hashes.has(hash)) errors.push(`Duplicate: ${file} and ${hashes.get(hash)}`);
  hashes.set(hash, file);
}
const base = process.argv[2];
if (base) {
  for (let i = 0; i < files.length; i += 6) {
    await Promise.all(files.slice(i, i + 6).map(async file => {
      const response = await fetch(`${process.env.IMAGE_BASE ?? "https://images.aibeautystyling.com"}/img/results/${file}`, { method: 'HEAD' });
      if (!response.ok || !response.headers.get('content-type')?.includes('image/png')) errors.push(`Image HTTP failure ${response.status}: ${file}`);
    }));
  }
  for (const slug of ['face-beauty-analysis', 'skin-analysis', 'hairstyle-changer', 'lip-color-changer', 'virtual-try-on-clothes', 'cartoon-yourself', 'old-photo-restoration']) {
    const response = await fetch(`${base}/${slug}`);
    const html = await response.text();
    if (!response.ok || !html.includes(`/img/results/${slug}.png`)) errors.push(`Page asset mapping failed: ${slug}`);
    if (html.includes('/img/tools/')) errors.push(`Raw portrait still referenced: ${slug}`);
    if (!html.includes('download=""')) errors.push(`Download link missing: ${slug}`);
  }
  const redirect = await fetch(`${base}/app/skin-analysis`, { redirect: 'manual' });
  if (![307,308].includes(redirect.status) || !redirect.headers.get('location')?.endsWith('/skin-analysis')) errors.push('Dashboard canonical redirect failed');
}
console.log(JSON.stringify({ catalogTools: slugs.length, resultImages: files.length, uniqueImages: hashes.size, errors }, null, 2));
if (errors.length) process.exitCode = 1;
