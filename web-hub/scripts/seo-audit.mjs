// Crawls the live site and records SEO facts per page. node scripts/seo-audit.mjs [baseUrl]
import { writeFileSync } from "node:fs";
const base = (process.argv[2] || "https://aibeautystyling.com").replace(/\/$/, "");
async function get(u, tries = 4) { for (let i = 0; i < tries; i++) { try { return await fetch(u, { redirect: "manual", signal: AbortSignal.timeout(60000) }); } catch (e) { if (i === tries - 1) return null; await new Promise(r => setTimeout(r, 1500)); } } }
const seen = new Map(); const queue = ["/"];
while (queue.length) {
  const p = queue.shift(); if (seen.has(p)) continue;
  const r = await get(base + p); if (!r) { seen.set(p, { status: 0 }); continue; }
  const status = r.status; const html = status === 200 ? await r.text() : "";
  const a = (re) => [...html.matchAll(re)].map(m => m[1]);
  const strip = s => s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || "";
  const meta = (n) => (html.match(new RegExp(`<meta[^>]+(?:name|property)="${n}"[^>]+content="([^"]*)"`)) || html.match(new RegExp(`<meta[^>]+content="([^"]*)"[^>]+(?:name|property)="${n}"`)) || [])[1] || "";
  const body = strip(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>|<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, ""));
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  const links = a(/<a\b[^>]*href="([^"]+)"/g).map(h => h.replace(/&amp;/g, "&"));
  const internal = [...new Set(links.filter(h => h.startsWith("/") && !h.startsWith("//")).map(h => h.split("#")[0].split("?")[0]).filter(Boolean))];
  const external = [...new Set(links.filter(h => /^https?:\/\//.test(h) && !h.startsWith(base)))];
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => { try { return JSON.parse(m[1]); } catch { return { _invalid: true }; } });
  const types = ld.flatMap(o => (Array.isArray(o) ? o : [o])).flatMap(o => o["@graph"] ? o["@graph"] : [o]).map(o => o["@type"]).flat().filter(Boolean);
  seen.set(p, { status, location: r.headers.get("location") || "", title, titleLen: strip(title).length, description: meta("description"), canonical: (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || "", robots: meta("robots"),
    og: { title: meta("og:title"), description: meta("og:description"), image: meta("og:image"), url: meta("og:url"), type: meta("og:type") }, twitter: { card: meta("twitter:card"), image: meta("twitter:image") },
    h1: a(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g).map(strip), h2: a(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g).map(strip).slice(0, 30), h3count: (html.match(/<h3\b/g) || []).length,
    words: body.split(" ").length, imgCount: imgs.length, imgNoAlt: imgs.filter(i => !/\balt="/.test(i)).length, imgEmptyAlt: imgs.filter(i => /\balt=""/.test(i)).length,
    imgAlts: imgs.map(i => (i.match(/\balt="([^"]*)"/) || [])[1]).filter(x => x), lang: (html.match(/<html[^>]*lang="([^"]+)"/) || [])[1] || "", jsonld: types, jsonldInvalid: ld.some(o => o._invalid),
    internal, external, body: body.slice(0, 6000), html: undefined });
  if (status === 200) for (const l of internal) if (!seen.has(l) && !queue.includes(l) && !/^\/(app|admin|api|_next|img|_opt|cdn-cgi)/.test(l) && !/\.[a-z0-9]{2,5}$/i.test(l)) queue.push(l);
}
const out = { base, crawled: [...seen.keys()].length, pages: Object.fromEntries(seen) };
for (const f of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt", "/favicon.ico", "/manifest.webmanifest", "/opengraph-image", "/humans.txt", "/.well-known/security.txt"]) { const r = await get(base + f); out[f] = r ? { status: r.status, type: r.headers.get("content-type"), body: r.status === 200 ? (await r.text()).slice(0, 1500) : "" } : { status: 0 }; }
writeFileSync("docs/seo/audit/crawl.json", JSON.stringify(out, null, 1));
console.log("pages crawled:", out.crawled);
