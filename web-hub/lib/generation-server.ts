import "server-only";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { buildGenerationPrompt, GENERATION_SPECS } from "./generation-specs";

const MAX_BODY = 21 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
// Keep the normal local limit conservative. A deliberate local QA session can
// raise it for sequential, supervised tool checks without changing production.
const requestedHourlyLimit = Number(process.env.LOCAL_IMAGE_GENERATION_HOURLY_LIMIT);
const hourlyLimit = Number.isInteger(requestedHourlyLimit) && requestedHourlyLimit >= 1 && requestedHourlyLimit <= 48
  ? requestedHourlyLimit : 12;
type LocalState = { token: string; active: number; starts: number[] };
const scope = globalThis as typeof globalThis & { __beautyGeneration?: LocalState };
const state = scope.__beautyGeneration ??= { token: randomBytes(32).toString("hex"), active: 0, starts: [] };
export class GenerationError extends Error { constructor(message: string, public status = 400) { super(message); } }

export function assertLocalRequest(request: Request, tokenRequired = false) {
  if (process.env.NODE_ENV !== "development" || process.env.LOCAL_IMAGE_GENERATION === "0") throw new GenerationError("Image generation is only enabled in the local development environment.", 403);
  const host = request.headers.get("host");
  if (!["localhost:3100", "127.0.0.1:3100", "[::1]:3100"].includes(host || "")) throw new GenerationError("Local requests only.", 403);
  const localOrigin = `http://${host}`;
  // Next adds forwarded headers even for direct loopback requests. Accept only its
  // single loopback address and matching host, never a proxy chain or remote IP.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (request.headers.has("forwarded") || (forwardedFor && !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(forwardedFor)) || (forwardedHost && forwardedHost !== host)) throw new GenerationError("Proxied requests are not supported.", 403);
  const origin = request.headers.get("origin");
  if (origin && origin !== localOrigin) throw new GenerationError("Cross-origin generation is not allowed.", 403);
  const site = request.headers.get("sec-fetch-site");
  if (site && !["same-origin", "none"].includes(site)) throw new GenerationError("Cross-site requests are not allowed.", 403);
  if (tokenRequired) {
    if (origin !== localOrigin) throw new GenerationError("A matching local origin is required.", 403);
    const token = request.headers.get("x-local-generation") || "";
    if (token.length !== state.token.length || !timingSafeEqual(Buffer.from(token), Buffer.from(state.token))) throw new GenerationError("Reload the page to start a local generation session.", 403);
  }
}

export async function localKey() {
  if (process.env.OPENAI_API_KEY?.trim()) return process.env.OPENAI_API_KEY.trim();
  // Reuse just this existing repository secret in dev. Do not load unrelated variables, copy keys or expose them.
  if (process.env.NODE_ENV !== "development") return "";
  try {
    const content = await readFile(path.resolve(process.cwd(), "..", ".env"), "utf8");
    const match = content.match(/^\s*(?:export\s+)?OPENAI_API_KEY\s*=\s*(.+)\s*$/m);
    return match?.[1]?.trim().replace(/^(['"])(.*)\1$/, "$2").replace(/\s+#.*$/, "").trim() || "";
  } catch { return ""; }
}

export async function generationStatus() {
  const configured = Boolean(await localKey());
  return { available: configured, token: configured ? state.token : undefined, message: configured ? "Local OpenAI key configured. Generations also require available account credits and model access." : "Add OPENAI_API_KEY to web-hub/.env.local or the repository .env, then restart the local server." };
}

export async function readLimitedForm(request: Request) {
  const length = Number(request.headers.get("content-length"));
  if (length > MAX_BODY) throw new GenerationError("The combined upload is too large.", 413);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) throw new GenerationError("Use an image form upload.", 415);
  if (!request.body) throw new GenerationError("No image was uploaded.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.byteLength;
    if (total > MAX_BODY) { await reader.cancel(); throw new GenerationError("The combined upload is too large.", 413); }
    chunks.push(part.value);
  }
  try { return await new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type")! } }).formData(); }
  catch { throw new GenerationError("The upload form could not be read."); }
}

async function normalizedImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new GenerationError("Choose a JPG, PNG or WebP image.", 415);
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new GenerationError("Each image must be under 10 MB.", 413);
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const pipeline = sharp(bytes, { limitInputPixels: 40_000_000, animated: false });
    const metadata = await pipeline.metadata();
    if (!metadata.width || !metadata.height || metadata.width < 128 || metadata.height < 128 || !["jpeg", "png", "webp"].includes(metadata.format || "") || (metadata.pages || 1) > 1) throw new Error("unsupported");
    // Strip EXIF/GPS metadata; orient before resizing. No personal image is saved to disk.
    return await pipeline.rotate().resize(2048, 2048, { fit: "inside", withoutEnlargement: true }).png().toBuffer();
  } catch { throw new GenerationError("That image could not be decoded. Choose a still JPG, PNG or WebP at least 128 × 128 pixels.", 415); }
}

export async function generateResult(form: FormData, signal: AbortSignal) {
  const slug = String(form.get("tool") || "");
  const spec = Object.hasOwn(GENERATION_SPECS, slug) ? GENERATION_SPECS[slug] : undefined;
  if (!spec) throw new GenerationError("Unknown tool.", 404);
  if (spec.unavailable) throw new GenerationError(spec.unavailable, 422);
  if (form.get("consent") !== "yes") throw new GenerationError("Confirm permission to process the photos and that the people shown are adults.");
  const option = String(form.get("option") || "");
  if (option && !spec.options?.includes(option)) throw new GenerationError("Choose one of the available styles.");
  const inputs = form.getAll("image");
  if (inputs.length !== spec.inputs || inputs.some(file => !(file instanceof File))) throw new GenerationError(`Upload ${spec.inputs === 1 ? "one image" : "both required images"}.`);
  const key = await localKey();
  if (!key) throw new GenerationError("The local OpenAI API key is not configured.", 503);
  const now = Date.now();
  state.starts = state.starts.filter(time => now - time < 60 * 60 * 1000);
  if (state.active >= 1) throw new GenerationError("Another image is being generated. Please wait for it to finish.", 429);
  if (state.starts.length >= hourlyLimit) throw new GenerationError(`The local safety limit is ${hourlyLimit} generations per hour. Please try again later.`, 429);
  state.active++;
  try {
    const images = await Promise.all((inputs as File[]).map(normalizedImage));
    if (signal.aborted) throw new GenerationError("Generation cancelled.", 499);
    // The result artwork is reference-only. Actual uploads always appear first.
    let reference: Buffer;
    try { reference = await readFile(path.join(process.cwd(), "public", "img", "results", `${slug}.png`)); }
    catch { throw new GenerationError("This tool's visual template is missing. Please try another tool.", 503); }
    state.starts.push(Date.now());
    const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2.5-sunburst";
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
      method: "POST", headers: { Authorization: `Bearer ${key}` }, body: payload,
      signal: AbortSignal.any([signal, AbortSignal.timeout(240_000)]), cache: "no-store",
    });
    if (!response.ok) {
      // Inspect only a known error code; never echo upstream bodies, which can
      // contain prompts, file details or credentials.
      const upstream = await response.json().catch(() => null) as { error?: { code?: unknown } } | null;
      const code = typeof upstream?.error?.code === "string" ? upstream.error.code : "";
      if (response.status === 401 || response.status === 403) throw new GenerationError("The configured OpenAI account could not access image generation. Check the API key and model access.", 502);
      if (response.status === 429) {
        if (["credit_balance_exhausted", "insufficient_quota", "organization_spend_limit_exceeded", "project_spend_limit_exceeded", "organization_usage_limit_exceeded"].includes(code)) throw new GenerationError("OpenAI credits or the account spending limit are exhausted. Check billing or limits before retrying.", 429);
        const retrySeconds = Number(response.headers.get("retry-after"));
        const retryHint = Number.isInteger(retrySeconds) && retrySeconds > 0 && retrySeconds <= 3600 ? ` Wait at least ${retrySeconds} seconds before retrying.` : " Try again after a cooldown.";
        throw new GenerationError(`OpenAI is rate limiting image requests.${retryHint}`, 429);
      }
      if (response.status === 400) throw new GenerationError("OpenAI could not process this request. The image may not be supported, the request may be restricted, or the configured model may be unavailable. Try a clear permitted photo or check the server model setting.", 422);
      throw new GenerationError("OpenAI image generation is temporarily unavailable. Please try again later.", 502);
    }
    const data = await response.json() as { data?: { b64_json?: string }[] };
    const encoded = data.data?.[0]?.b64_json;
    if (!encoded || encoded.length > 60_000_000) throw new GenerationError("No valid result image was returned. Please try again.", 502);
    const bytes = Buffer.from(encoded, "base64");
    if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new GenerationError("The image service returned an unexpected format.", 502);
    return { bytes, slug };
  } finally { state.active--; }
}
