import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const base = process.argv.find(arg => arg.startsWith("--base="))?.slice(7) || "http://127.0.0.1:3100";
const live = process.argv.includes("--live");
const only = process.argv.find(arg => arg.startsWith("--only="))?.slice(7)?.split(",").filter(Boolean);
const max = Number(process.argv.find(arg => arg.startsWith("--max="))?.slice(6) || "0");
const reportName = process.argv.find(arg => arg.startsWith("--report="))?.slice(9) || "audit.json";
assert.match(reportName, /^[a-z0-9-]+\.json$/, "Report must be a simple JSON filename.");
const manifestNames = ["analysis-tools.json", "tryon-tools.json", "creative-tools.json"];
const manifests = (await Promise.all(manifestNames.map(async name => JSON.parse(await readFile(path.join("scripts", name), "utf8"))))).flat();
assert.equal(manifests.length, 38, "Every launch/later tool must be present in the audit manifest.");
assert.equal(new Set(manifests.map(item => item.slug)).size, manifests.length, "Duplicate tool in audit manifest.");
const selected = only ? manifests.filter(item => only.includes(item.slug)) : max > 0 ? manifests.slice(0, max) : manifests;
if (only) assert.equal(selected.length, only.length, "Unknown slug in --only filter.");

const statusResponse = await fetch(`${base}/api/generate`, { cache: "no-store" });
assert.equal(statusResponse.status, 200, "Local generation status endpoint unavailable.");
const service = await statusResponse.json();
assert.equal(typeof service.available, "boolean");
if (live) assert.ok(service.available && service.token, "Live audit needs a configured local OpenAI key.");

const outputDir = path.join(".local-test-results", "new-tools");
await mkdir(outputDir, { recursive: true });
const results = [];
const reportPath = path.join(outputDir, reportName);
async function saveReport() {
  await writeFile(reportPath, JSON.stringify({ generatedAt: new Date().toISOString(), live, serviceAvailable: service.available, results }, null, 2));
}

for (const item of selected) {
  const record = { slug: item.slug, category: item.category, preflight: "pending", api: "not_run", visualReview: "not_reviewed", expected: item.expected, blockers: item.blockers || [] };
  results.push(record);
  try {
    assert.match(item.slug, /^[a-z0-9-]+$/);
    assert.ok(item.inputs === 1 || item.inputs === 2);
    assert.equal(item.fixtures?.length, item.inputs, "Fixture count must match input count.");
    const page = await fetch(`${base}/${item.slug}`);
    assert.equal(page.status, 200, "Tool page failed.");
    const html = await page.text();
    assert.ok(html.includes("tool-workspace") && html.includes(item.slug), "Tool workspace missing.");
    const template = await fetch(`${process.env.IMAGE_BASE ?? "https://images.aibeautystyling.com"}/img/results/${item.slug}.png`);
    assert.equal(template.status, 200, "Main result template missing.");
    const templateBytes = Buffer.from(await template.arrayBuffer());
    assert.equal(templateBytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "Invalid result template PNG.");
    const fixtureBytes = [];
    for (const fixture of item.fixtures) {
      assert.match(fixture, /^\/img\/samples\/[a-z0-9-]+\.png$/);
      const response = await fetch(`${base}${fixture}`);
      assert.equal(response.status, 200, `Sample missing: ${fixture}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      await sharp(bytes).metadata();
      fixtureBytes.push(bytes);
    }
    record.preflight = "passed";
    if (live) {
      const body = new FormData();
      body.set("tool", item.slug);
      body.set("consent", "yes");
      if (item.option) body.set("option", item.option);
      fixtureBytes.forEach((bytes, index) => body.append("image", new Blob([bytes], { type: "image/png" }), `input-${index + 1}.png`));
      const started = Date.now();
      const response = await fetch(`${base}/api/generate`, { method: "POST", headers: { Origin: base, "x-local-generation": service.token }, body, signal: AbortSignal.timeout(300_000) });
      if (!response.ok) throw new Error(`Generation HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "Generated response is not PNG.");
      const metadata = await sharp(bytes).metadata();
      assert.ok(metadata.width >= 512 && metadata.height >= 512, "Generated image is too small.");
      await writeFile(path.join(outputDir, `${item.slug}.png`), bytes);
      record.api = "returned_png";
      record.output = { path: `${item.slug}.png`, bytes: bytes.length, width: metadata.width, height: metadata.height, seconds: Math.round((Date.now() - started) / 1000) };
    }
  } catch (error) {
    if (record.preflight !== "passed") record.preflight = "failed";
    else record.api = "failed";
    record.error = error instanceof Error ? error.message : String(error);
  }
  await saveReport();
  console.log(JSON.stringify({ slug: record.slug, preflight: record.preflight, api: record.api, error: record.error || "" }));
}

console.log(`Audit report: ${reportPath}`);
