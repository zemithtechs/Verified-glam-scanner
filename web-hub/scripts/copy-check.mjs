// Copy lint for landing page text. Rules come from docs/copy/STYLE_GUIDE.md.
// Usage: npm run copy:check   (exits 1 when any file has a failure)
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const copyDir = join(root, "lib", "copy");

// Files that get the full set of rules (titles, bodies, words, phrases).
const copyFiles = readdirSync(copyDir)
  .filter((name) => name.endsWith(".ts") && !["types.ts", "index.ts"].includes(name))
  .map((name) => join(copyDir, name));
const fullFiles = [...copyFiles, join(root, "lib", "tool-page-content.ts"), join(root, "lib", "tool-use-cases.ts")];
// Files that only get the dash, banned word and phrase checks.
const wordFiles = [join(root, "app", "page.tsx")];

const BANNED_WORDS = [
  "delve", "elevate", "unlock", "seamless", "seamlessly", "journey", "testament", "tapestry", "landscape", "crucial", "pivotal",
  "vibrant", "game-changing", "empower", "leverage", "harness", "revolutionize", "cutting-edge", "state-of-the-art", "stunning",
  "effortless", "effortlessly", "unleash", "radiance", "wonderfully", "truly", "simply",
];
const BANNED_PHRASES = [
  "in today's world", "whether you are", "not just", "more than just", "it's not about", "level up", "take it to the next level",
  "dive in", "imagine", "picture this", "and so much more",
];
const FORBIDDEN_PHRASES = ["small number", "local preview", "locally configured", "not connected here", "local app does not"];

const STRING = /"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`/g;
const literals = (segment) => [...segment.matchAll(STRING)].map((m) => (m[1] ?? m[2]).replace(/\$\{[^}]*\}/g, "x"));
const hasTemplate = (segment) => segment.includes("${");
const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const isComment = (line) => /^\s*(\/\/|\*|\/\*)/.test(line);

function checkFile(file, { structure }) {
  const text = readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  const failures = [];
  // Where the legacy per-tool use cases end. Only the category fallbacks are held to the title and body rules.
  const structureStart = file.endsWith("tool-use-cases.ts") ? lines.findIndex((l) => l.includes("const CATEGORY_CASES")) : 0;

  lines.forEach((line, i) => {
    const at = `line ${i + 1}`;
    if (/[—–]/.test(line)) failures.push(`${at}: em or en dash`);
    if (isComment(line)) return;
    const lower = line.toLowerCase();
    for (const word of BANNED_WORDS) {
      if (new RegExp(`\\b${word.replace(/-/g, "[- ]")}\\b`, "i").test(line)) failures.push(`${at}: banned word "${word}"`);
    }
    for (const phrase of BANNED_PHRASES) if (lower.includes(phrase)) failures.push(`${at}: banned phrase "${phrase}"`);
    for (const phrase of FORBIDDEN_PHRASES) if (lower.includes(phrase)) failures.push(`${at}: forbidden phrase "${phrase}"`);
    if (!structure || i < structureStart) return;

    const titleAt = line.indexOf("title:");
    if (titleAt === -1 && !/\bbody:/.test(line)) return;
    const bodyAt = line.indexOf("body:");
    if (titleAt !== -1) {
      const segment = line.slice(titleAt + 6, bodyAt > titleAt ? bodyAt : undefined);
      for (const title of literals(segment)) {
        if (!title.trim().endsWith(".")) failures.push(`${at}: title does not end in a full stop: "${title}"`);
      }
    }
    if (bodyAt !== -1) {
      const segment = line.slice(bodyAt + 5).split(/\b(?:points|cta):/)[0];
      if (hasTemplate(segment)) return;
      // Step bodies are one or two short sentences, everything else is 25 to 70 words.
      const upTo = lines.slice(0, i + 1).join("\n");
      const nearest = ["steps:", "stories:", "useCases:", "downloadBanner:", "CATEGORY_CASES"].map((k) => [k, upTo.lastIndexOf(k)]).sort((a, b) => b[1] - a[1])[0][0];
      const min = nearest === "steps:" ? 10 : 25;
      for (const body of literals(segment)) {
        if (/^\s*[,}\]]*\s*$/.test(body)) continue;
        const words = wordCount(body);
        if (words < min || words > 70) failures.push(`${at}: body has ${words} words (allowed ${min} to 70): "${body.slice(0, 50)}..."`);
      }
    }
  });
  return failures;
}

let failed = 0;
for (const [files, options] of [[fullFiles, { structure: true }], [wordFiles, { structure: false }]]) {
  for (const file of files) {
    const failures = checkFile(file, options);
    const name = relative(root, file).replace(/\\/g, "/");
    if (failures.length === 0) {
      console.log(`ok    ${name}`);
      continue;
    }
    failed += failures.length;
    console.log(`FAIL  ${name} (${failures.length})`);
    for (const failure of failures) console.log(`        ${failure}`);
  }
}

// Repetition check: no 6-word phrase may appear in more than 6 distinct strings across lib/copy/*.ts.
const MAX_REPEATS = 6;
const seen = new Map();
const distinct = new Set();
for (const file of copyFiles) {
  const body = readFileSync(file, "utf8").split(/\r?\n/).filter((line) => !isComment(line)).join("\n");
  for (const text of literals(body)) {
    const words = text.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").split(/\s+/).filter(Boolean);
    if (words.length < 6 || distinct.has(text)) continue;
    distinct.add(text);
    const grams = new Set();
    for (let i = 0; i + 6 <= words.length; i++) grams.add(words.slice(i, i + 6).join(" "));
    for (const gram of grams) seen.set(gram, (seen.get(gram) ?? 0) + 1);
  }
}
const offenders = [...seen].filter(([, count]) => count > MAX_REPEATS).sort((a, b) => b[1] - a[1]);
if (offenders.length > 0) {
  failed += offenders.length;
  console.log(`FAIL  repeated phrases in lib/copy (${offenders.length} six-word phrases appear in more than ${MAX_REPEATS} strings)`);
  for (const [gram, count] of offenders.slice(0, 15)) console.log(`        ${count} x "${gram}"`);
} else {
  console.log("ok    no six-word phrase repeats more than 6 times in lib/copy");
}

if (failed > 0) {
  console.log(`\n${failed} copy problem(s) found.`);
  process.exit(1);
}
console.log("\nCopy check passed.");
