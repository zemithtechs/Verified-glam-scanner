import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { buildGenerationPrompt, GENERATION_SPECS } from "./generation-specs";

/**
 * Production image generation (deployed site only; local development uses generation-server.ts).
 *
 * Same request and result as the local tool, but it runs on Cloudflare and is protected:
 *  - a free allowance per visitor per day and a global daily cap, both counted in D1 before any paid call
 *  - the allowance is handed back if the AI call fails, so errors never burn a visitor's free results
 *  - uploads are re-encoded (metadata removed) and nothing is stored
 * Limits come from FREE_RESULTS_PER_DAY and GLOBAL_RESULTS_PER_DAY (Worker variables).
 */

const MAX_BODY = 21 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const DEFAULT_MODEL = "gpt-image-2.5-sunburst";

export class LiveError extends Error { constructor(message: string, public status = 400) { super(message); } }

type D1 = { prepare(sql: string): { bind(...values: unknown[]): { first<T = unknown>(): Promise<T | null>; run(): Promise<unknown> } } };
type LiveEnv = {
  OPENAI_API_KEY?: string; OPENAI_IMAGE_MODEL?: string; IP_SALT?: string;
  FREE_RESULTS_PER_DAY?: string; GLOBAL_RESULTS_PER_DAY?: string;
  DB?: D1;
  ASSETS: { fetch(request: Request): Promise<Response> };
  IMAGES?: { input(stream: ReadableStream): { transform(options: object): { output(options: object): Promise<{ response(): Response }> } } };
};

const env = () => getCloudflareContext().env as unknown as LiveEnv;
const intOr = (value: string | undefined, fallback: number) => { const n = Number(value); return Number.isInteger(n) && n >= 0 ? n : fallback; };
const today = () => new Date().toISOString().slice(0, 10);

async function visitorHash(request: Request, e: LiveEnv) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const data = new TextEncoder().encode(`${ip}|${e.IP_SALT || "aibeautystyling"}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Counts one result against the visitor and the global cap. Returns why it was refused, or null when allowed. */
async function reserve(db: D1, hash: string, day: string, perVisitor: number, globalCap: number): Promise<"visitor" | "global" | null> {
  const total = await db.prepare("insert into daily_generation_totals (day, count) values (?, 1) on conflict(day) do update set count = count + 1 where count < ? returning count").bind(day, globalCap).first();
  if (!total) return "global";
  const mine = await db.prepare("insert into visitor_generations (ip_hash, day, count) values (?, ?, 1) on conflict(ip_hash, day) do update set count = count + 1 where count < ? returning count").bind(hash, day, perVisitor).first();
  if (!mine) { await refund(db, null, day); return "visitor"; }
  if (Math.random() < 0.05) await db.prepare("delete from visitor_generations where day < date(?, '-7 days')").bind(day).run().catch(() => {});
  return null;
}

async function refund(db: D1, hash: string | null, day: string) {
  await db.prepare("update daily_generation_totals set count = max(0, count - 1) where day = ?").bind(day).run().catch(() => {});
  if (hash) await db.prepare("update visitor_generations set count = max(0, count - 1) where ip_hash = ? and day = ?").bind(hash, day).run().catch(() => {});
}

function looksLikeImage(bytes: Uint8Array, type: string) {
  if (type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8;
  if (type === "image/webp") return bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  return false;
}

async function normalized(file: File, e: LiveEnv): Promise<Uint8Array> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new LiveError("Choose a JPG, PNG or WebP image.", 415);
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new LiveError("Each image must be under 10 MB.", 413);
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!looksLikeImage(bytes, file.type)) throw new LiveError("That image could not be read. Choose a still JPG, PNG or WebP.", 415);
  if (!e.IMAGES) return bytes;
  try {
    // Re-encode as PNG at a sensible size; this also removes location and camera metadata.
    const stream = new Response(bytes).body!;
    const out = await e.IMAGES.input(stream).transform({ width: 2048, height: 2048, fit: "scale-down" }).output({ format: "image/png" });
    return new Uint8Array(await out.response().arrayBuffer());
  } catch { throw new LiveError("That image could not be decoded. Choose a still JPG, PNG or WebP at least 128 × 128 pixels.", 415); }
}

export function liveStatus() {
  return { available: Boolean(env().OPENAI_API_KEY), token: "live", message: "Ready." };
}

export async function generateLive(request: Request, options: { skipVisitorLimit?: boolean } = {}) {
  const e = env();
  if (!e.OPENAI_API_KEY) throw new LiveError("The image service is not available right now.", 503);
  if (!e.DB) throw new LiveError("The image service is not available right now.", 503);
  if (Number(request.headers.get("content-length")) > MAX_BODY) throw new LiveError("The combined upload is too large.", 413);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) throw new LiveError("Use an image form upload.", 415);

  let form: FormData;
  try { form = await request.formData(); } catch { throw new LiveError("The upload form could not be read."); }

  const slug = String(form.get("tool") || "");
  const spec = Object.hasOwn(GENERATION_SPECS, slug) ? GENERATION_SPECS[slug] : undefined;
  if (!spec) throw new LiveError("Unknown tool.", 404);
  if (spec.unavailable) throw new LiveError(spec.unavailable, 422);
  if (form.get("consent") !== "yes") throw new LiveError("Confirm permission to process the photos and that the people shown are adults.");
  const option = String(form.get("option") || "");
  if (option && !spec.options?.includes(option)) throw new LiveError("Choose one of the available styles.");
  const inputs = form.getAll("image");
  if (inputs.length !== spec.inputs || inputs.some((file) => !(file instanceof File))) throw new LiveError(`Upload ${spec.inputs === 1 ? "one image" : "both required images"}.`);

  // Prepare everything that can fail for free (decoding, the layout reference) before spending an allowance.
  const images = await Promise.all((inputs as File[]).map((file) => normalized(file, e)));
  const refResponse = await e.ASSETS.fetch(new Request(new URL(`/img/results/${slug}.png`, request.url)));
  if (!refResponse.ok) throw new LiveError("This tool's visual template is missing. Please try another tool.", 503);
  const reference = new Uint8Array(await refResponse.arrayBuffer());

  const day = today();
  const hash = await visitorHash(request, e);
  let reserved = false;
  if (!options.skipVisitorLimit) {
    const refused = await reserve(e.DB, hash, day, intOr(e.FREE_RESULTS_PER_DAY, 2), intOr(e.GLOBAL_RESULTS_PER_DAY, 100));
    if (refused === "visitor") throw new LiveError("You have used your free results for today. Create a free account for more credits, or come back tomorrow.", 429);
    if (refused === "global") throw new LiveError("We have reached today's free capacity. Log in or create an account to keep going, or try again tomorrow.", 429);
    reserved = true;
  }

  try {
    const model = e.OPENAI_IMAGE_MODEL?.trim() || DEFAULT_MODEL;
    const payload = new FormData();
    payload.set("model", model);
    payload.set("prompt", buildGenerationPrompt(slug, option || spec.options?.[0]));
    payload.set("size", model === "gpt-image-1.5" ? "1536x1024" : "1536x864");
    payload.set("quality", "high");
    payload.set("output_format", "png");
    payload.set("n", "1");
    if (model === "gpt-image-1.5") payload.set("input_fidelity", "high");
    images.forEach((bytes, i) => payload.append("image[]", new Blob([new Uint8Array(bytes)], { type: "image/png" }), `input-${i + 1}.png`));
    payload.append("image[]", new Blob([new Uint8Array(reference)], { type: "image/png" }), "layout-reference-only.png");

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST", headers: { Authorization: `Bearer ${e.OPENAI_API_KEY}` }, body: payload,
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(240_000)]),
    });
    if (!response.ok) {
      // Private log only (Worker logs): status and error code, never the body, and never shown to visitors.
      const info = await response.clone().json().catch(() => null) as { error?: { code?: unknown; type?: unknown } } | null;
      console.error("openai image edit failed", response.status, String(info?.error?.code ?? ""), String(info?.error?.type ?? ""), "model", model);
      // Never pass the provider's error text to visitors: it can contain prompts or account details.
      throw new LiveError(response.status === 429 || response.status === 401 || response.status === 403
        ? "The image service is busy right now. Please try again in a little while."
        : "The image could not be generated. Please retry with a clear photo.", response.status === 429 ? 503 : 502);
    }
    const json = await response.json() as { data?: Array<{ b64_json?: string }> };
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) throw new LiveError("The image could not be generated. Please retry with a clear photo.", 502);
    const bytes = Uint8Array.from(Buffer.from(b64, "base64"));
    return { bytes, slug };
  } catch (error) {
    if (reserved) await refund(e.DB, hash, day); // a failed run does not use up the visitor's free result
    if (error instanceof LiveError) throw error;
    if (error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name)) throw new LiveError("Generation was cancelled or timed out. Please try again.", 504);
    throw new LiveError("The image could not be generated. Please retry with a clear photo.", 500);
  }
}
