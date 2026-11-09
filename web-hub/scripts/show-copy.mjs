import { pathToFileURL } from "node:url"; import path from "node:path"; import { readdirSync } from "node:fs";
const dir = path.resolve("lib/copy"); const copy = {};
for (const f of readdirSync(dir).filter(f => !["types.ts","index.ts"].includes(f))) Object.assign(copy, ...Object.values(await import(pathToFileURL(path.join(dir,f)).href)));
for (const s of process.argv.slice(2)) { const c = copy[s]; console.log(`## ${s} [${c.primaryKeyword}]\nH1: ${c.h1}\nlead: ${c.heroLead}\nhow: ${c.howToHeading}\nfeat: ${c.featuresHeading}\nfaqQs: ${c.faqs.map(f=>f[0]).join(" | ")}\n`); }
