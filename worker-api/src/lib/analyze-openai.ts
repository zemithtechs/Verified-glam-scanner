import { AnalysisError, throwOpenAIError } from "./analyze-errors";
import { assertFaceDetected, normalizeCelebrityPayload, normalizePayload } from "./analyze-normalize";
import { buildSystemPrompt, buildUserPrompt } from "./analyze-prompts";
import { HIGH_DETAIL_FEATURES, type BeautyCatalog, type FeatureType } from "./analyze-types";

const FALLBACK_MODEL = "gpt-4o-mini";

// Port of analyze-scan's callOpenAI (vision variant — includes the image_url
// content block; distinct from lib/openai.ts's text-only guide.ts helper).
async function callOpenAI(opts: {
  apiKey: string;
  model: string;
  system: string;
  userText: string;
  base64: string;
  mime: string;
  imageDetail?: "low" | "high" | "auto";
}): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${opts.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: opts.system },
        {
          role: "user",
          content: [
            { type: "text", text: opts.userText },
            { type: "image_url", image_url: { url: `data:${opts.mime};base64,${opts.base64}`, detail: opts.imageDetail ?? "low" } },
          ],
        },
      ],
      max_tokens: 4096,
    }),
  });

  const rawText = await res.text();
  if (!res.ok) throwOpenAIError(rawText, res.status);

  const json = JSON.parse(rawText) as {
    choices?: Array<{ message?: { content?: string; refusal?: string }; finish_reason?: string }>;
  };
  const choice = json.choices?.[0];
  const content = choice?.message?.content;
  const refusal = choice?.message?.refusal;
  const finishReason = choice?.finish_reason;

  if (content) return content;

  console.error("OpenAI empty content", { finishReason, refusal, model: opts.model, responsePreview: rawText.slice(0, 4000) });

  if (finishReason === "content_filter" || refusal) {
    throw new AnalysisError(422, "CONTENT_POLICY", "Analysis blocked by content policy. Try a clearer front-facing photo.");
  }

  throw new AnalysisError(504, "ANALYSIS_TIMEOUT", "Analysis took too long. Please try with a clearer photo.");
}

export async function analyzeWithOpenAI(opts: {
  apiKey: string;
  model: string;
  featureType: FeatureType;
  base64: string;
  mime: string;
  detectedFaces: unknown;
  profile: Record<string, unknown>;
  beautyCatalog: BeautyCatalog | null;
}): Promise<Record<string, unknown>> {
  const system = buildSystemPrompt(opts.featureType, opts.beautyCatalog);
  const userText = buildUserPrompt(opts.featureType, opts.detectedFaces, opts.profile, opts.beautyCatalog);

  const imageDetail: "low" | "high" = HIGH_DETAIL_FEATURES.has(opts.featureType) ? "high" : "low";

  const callOpts = { apiKey: opts.apiKey, system, userText, base64: opts.base64, mime: opts.mime, imageDetail };

  const shortSystem = "Output ONLY valid JSON for facial analysis. Neutral observations only. No medical claims.";

  let content: string | null = null;
  let lastError: Error | null = null;

  for (const model of [opts.model, FALLBACK_MODEL].filter((m, i, a) => a.indexOf(m) === i)) {
    try {
      content = await callOpenAI({ ...callOpts, model });
      break;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      const msg = lastError.message;
      if (!msg.includes("Empty OpenAI response") && !msg.includes("content policy")) throw lastError;
      console.warn(`OpenAI attempt failed on ${model}: ${msg}`);
    }
  }

  if (!content) {
    try {
      content = await callOpenAI({ ...callOpts, model: FALLBACK_MODEL, system: shortSystem });
    } catch (e) {
      throw lastError ?? (e instanceof Error ? e : new Error(String(e)));
    }
  }

  const parsed = JSON.parse(content) as Record<string, unknown>;
  assertFaceDetected(opts.featureType, parsed, opts.detectedFaces);
  if (opts.featureType === "CELEBRITY_LOOKALIKE") {
    return normalizeCelebrityPayload(parsed);
  }
  return normalizePayload(opts.featureType, parsed, opts.beautyCatalog, opts.detectedFaces);
}

/**
 * Portrait generation for celebrity/showdown avatars. Originally dall-e-2,
 * but this OpenAI account's API rejects that model entirely ("The model
 * 'dall-e-2' does not exist") — it's been retired for this org in favor of
 * gpt-image-1, which has a different parameter surface: no response_format
 * (always returns b64_json), no 256x256 (1024x1024 is the smallest size),
 * and a "quality" knob instead — using "low" to keep these cheap, since
 * they're just small avatar thumbnails.
 */
export async function generatePortraitImage(openaiKey: string, prompt: string): Promise<Uint8Array | null> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt, n: 1, size: "1024x1024", quality: "low", output_format: "png" }),
  });
  if (!res.ok) {
    console.warn("OpenAI portrait generation failed", await res.text());
    return null;
  }
  const json = (await res.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
  const entry = json.data?.[0];
  if (!entry) return null;

  if (entry.b64_json) {
    const binary = atob(entry.b64_json);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  if (entry.url) {
    const imgRes = await fetch(entry.url);
    if (!imgRes.ok) return null;
    return new Uint8Array(await imgRes.arrayBuffer());
  }

  return null;
}
