// Validates lib/copy/*.ts against docs/seo/copy-brief.md. Run: node scripts/check-copy.mjs
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = readFileSync(path.join(root, "lib/catalog.ts"), "utf8");
const slugs = [...catalog.matchAll(/slug: "([^"]+)", name:/g)].map((m) => m[1]);

const copy = {};
for (const f of readdirSync(path.join(root, "lib/copy")).filter((f) => f.endsWith(".ts") && !["types.ts", "index.ts"].includes(f))) {
  const mod = await import(pathToFileURL(path.join(root, "lib/copy", f)).href);
  for (const v of Object.values(mod)) Object.assign(copy, v);
}

const BANNED = [/\bunlock/i, /\belevate/i, /game-?changer/i, /revolution/i, /cutting-?edge/i, /seamless/i, /in today'?s/i, /\bdelve/i, /openai/i, /local preview/i, /scientifically proven/i, /most accurate/i, /100% accurate/i, /\bugly\b/i, /\bflaws?\b/i, /\bfix your\b/i, /diagnos(e|is)\b(?!.*(cannot|can't|not|no))/i];
const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const has = (text, kw) => { const t = text.toLowerCase(); if (t.includes(kw)) return true; const w = kw.split(" ").filter((x) => x.length > 2); return w.filter((x) => t.includes(x.slice(0, 5))).length >= Math.ceil(w.length * 0.75); };
const featureCount = (slug) => slug === "face-beauty-analysis" ? 4 : [1, 2, 3, 4].filter((i) => existsSync(path.join(root, `media/img/results/${slug}-feature-${i}.png`)) || existsSync(path.join(root, `media/img/results/${slug}-detail-${i}.png`))).length || 3;

let errors = 0, warns = 0;
const err = (s, m) => { errors++; console.log(`ERROR ${s}: ${m}`); };
const warn = (s, m) => { warns++; console.log(`warn  ${s}: ${m}`); };

for (const slug of slugs) {
  const c = copy[slug];
  if (!c) { err(slug, "missing copy"); continue; }
  const kw = c.primaryKeyword?.toLowerCase();
  if (!kw) { err(slug, "no primaryKeyword"); continue; }
  if (c.metaTitle.length > 60) err(slug, `metaTitle ${c.metaTitle.length} chars`);
  if (c.metaDescription.length < 110 || c.metaDescription.length > 160) err(slug, `metaDescription ${c.metaDescription.length} chars`);
  if (!c.metaTitle.toLowerCase().includes(kw)) err(slug, "primary keyword not in metaTitle");
  if (!c.metaDescription.toLowerCase().includes(kw)) warn(slug, "primary keyword not in metaDescription");
  for (const k of ["h1", "heroLead", "howToHeading", "featuresHeading", "faqHeading"]) if (!has(c[k] ?? "", kw)) err(slug, `primary keyword missing in ${k}`);
  const hw = words(c.heroLead); if (hw < 30 || hw > 70) warn(slug, `heroLead ${hw} words`);
  if (c.steps?.length !== 3) err(slug, "steps != 3");
  const n = featureCount(slug);
  if (c.stories?.length !== n) err(slug, `stories ${c.stories?.length} but ${n} feature images`);
  c.stories?.forEach((s, i) => { const w = words(s.body); if (w < 25 || w > 85) warn(slug, `story ${i + 1} body ${w} words`); });
  if (!c.faqs || c.faqs.length < 8 || c.faqs.length > 10) err(slug, `faqs ${c.faqs?.length}`);
  if (!c.faqs?.some(([q]) => has(q, kw))) err(slug, "no FAQ question contains primary keyword");
  if (!c.faqs?.some(([q]) => /^what (is|are)/i.test(q))) warn(slug, "no 'What is' FAQ");
  c.faqs?.forEach(([q, a], i) => { const w = words(a); if (w < 25 || w > 95) warn(slug, `faq ${i + 1} answer ${w} words`); });
  if (!c.secondaryKeywords || c.secondaryKeywords.length < 4) warn(slug, "fewer than 4 secondaryKeywords");
  const all = JSON.stringify(c);
  for (const rx of BANNED) if (rx.test(all)) err(slug, `banned phrase ${rx}`);
  const dashes = (all.match(/—/g) || []).length; if (dashes > 2) warn(slug, `${dashes} em dashes`);
  const body = [c.heroLead, ...c.steps.map((s) => s.body), ...c.stories.map((s) => s.body), ...c.faqs.map((f) => f[1])].join(" ").toLowerCase();
  const hits = body.split(kw).length - 1, wc = words(body);
  if (wc / Math.max(hits, 1) < 90 && hits > 1) warn(slug, `keyword stuffing? ${hits}x in ${wc} words`);
  if (hits === 0) warn(slug, "primary keyword never in body copy");
}
const extra = Object.keys(copy).filter((s) => !slugs.includes(s));
if (extra.length) err("extra", extra.join(", "));
console.log(`\n${slugs.length} tools, ${Object.keys(copy).length} with copy, ${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);
