// Crawls a running server and validates JSON-LD, headings and head tags. node scripts/validate-schema.mjs http://localhost:3200
// Exit code 1 when any check fails.
const base = (process.argv[2] || "http://localhost:3200").replace(/\/$/, "");
const REQUIRED = {
  Organization: ["name", "url", "logo"],
  WebSite: ["name", "url"],
  WebApplication: ["name", "description", "url", "applicationCategory", "operatingSystem", "offers", "inLanguage", "isAccessibleForFree"],
  HowTo: ["name", "step"],
  BreadcrumbList: ["itemListElement"],
  ItemList: ["itemListElement"],
  BlogPosting: ["headline", "description", "image", "author", "publisher", "datePublished", "dateModified", "mainEntityOfPage"],
  Product: ["name", "description", "offers"],
  FAQPage: ["mainEntity"],
  Blog: ["name", "blogPost"],
};
const PRIVATE = /^\/(app|admin|api|login|register|forgot-password|icon-sheet|_next|img|_opt)(\/|$)/;
const seen = new Map();
const queue = ["/", "/delete-account", "/privacy", "/terms"];
const problems = [];
const typeCounts = {};
const fail = (page, msg) => problems.push(`${page}: ${msg}`);

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  const res = await fetch(base + path, { redirect: "manual" }).catch(() => null);
  if (!res || res.status !== 200) { seen.set(path, false); fail(path, `HTTP ${res?.status}`); continue; }
  seen.set(path, true);
  const html = await res.text();

  // JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  for (const raw of blocks) {
    let data;
    try { data = JSON.parse(raw); } catch (e) { fail(path, `JSON-LD does not parse (${e.message})`); continue; }
    for (const node of Array.isArray(data) ? data : [data]) {
      const type = node["@type"];
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      if (node["@context"] !== "https://schema.org") fail(path, `${type} missing @context`);
      for (const key of REQUIRED[type] || []) if (node[key] === undefined || node[key] === "") fail(path, `${type} missing "${key}"`);
      if (JSON.stringify(node).includes("aggregateRating")) fail(path, "aggregateRating must not be present");
    }
  }

  // Head tags
  const robots = (html.match(/<meta name="robots" content="([^"]*)"/) || [])[1];
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const isPrivate = PRIVATE.test(path);
  if (!robots) fail(path, "no robots meta");
  if (!isPrivate) {
    if (!canonical || !canonical.startsWith("https://")) fail(path, "canonical missing or not absolute");
    for (const tag of ["og:title", "og:description", "og:image", "og:url", "twitter:card", "twitter:image"]) if (!html.includes(`"${tag}"`)) fail(path, `missing ${tag}`);
    if ((html.match(/property="og:image"/g) || []).length !== 1) fail(path, "expected exactly one og:image");
  }

  // Headings: one h1, no skipped levels
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  if (levels.filter((l) => l === 1).length !== 1) fail(path, `expected one h1, found ${levels.filter((l) => l === 1).length}`);
  levels.forEach((level, i) => { if (i > 0 && level > levels[i - 1] + 1) fail(path, `heading level skipped (h${levels[i - 1]} then h${level})`); });

  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/g)) if (!PRIVATE.test(m[1]) && !/\.[a-z0-9]{2,5}$/i.test(m[1]) && !seen.has(m[1]) && !queue.includes(m[1])) queue.push(m[1]);
}

const pages = [...seen.keys()];
console.log(`pages checked: ${pages.length}`);
console.log("JSON-LD blocks by type:", JSON.stringify(typeCounts));
if (problems.length) { console.log(`\n${problems.length} problem(s):`); problems.slice(0, 60).forEach((p) => console.log(" -", p)); process.exit(1); }
console.log("all checks passed");
