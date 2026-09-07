import { Hono } from "hono";
import type { Env } from "../env";
import type { SessionVars } from "../middleware/session";
import { checkAnalysisAccess, deductCredits } from "../lib/credits";
import { prepareImageBytes } from "../lib/image";
import { analyzeWithOpenAI } from "../lib/analyze-openai";
import { enrichCelebrityMatches } from "../lib/celebrity";
import { enrichShowdown } from "../lib/showdown";
import { AnalysisError, classifyOpenAIErrorCode, mapOpenAIErrorMessage } from "../lib/analyze-errors";
import { VALID_FEATURES, type BeautyCatalog, type FeatureType } from "../lib/analyze-types";

// Port of supabase/functions/analyze-scan — last and largest in the rewrite
// order (see docs/CLOUDFLARE_MIGRATION_PLAN.md). Scoring/normalization/
// prompt logic lives in ../lib/analyze-*, unchanged from the Deno version;
// what's genuinely new here is R2-binding photo read (replaces the
// signed-URL + fetch dance) and Photon resize (replaces imagescript).

const FUNCTION_VERSION = "d1-1";
const FALLBACK_MODEL = "gpt-4o-mini";
const ALLOWED_MODELS = new Set(["gpt-4o-mini", "gpt-4o", "gpt-4o-2024-08-06", "gpt-4o-2024-11-20"]);

function resolveModel(requested: string): string {
  const model = requested.trim();
  if (ALLOWED_MODELS.has(model)) return model;
  return FALLBACK_MODEL;
}

/** Chunked to avoid call-stack limits from spreading a large Uint8Array. */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function loadBeautyTipsCatalog(db: D1Database): Promise<BeautyCatalog> {
  const [categories, entries, labels, content] = await Promise.all([
    db.prepare("select * from beauty_tip_categories order by sort_order").all<Record<string, unknown>>(),
    db.prepare("select * from beauty_tip_entries order by sort_order").all<Record<string, unknown>>(),
    db.prepare("select issue_tag, display_label from beauty_spot_label_map").all<{ issue_tag: string; display_label: string }>(),
    db.prepare("select value from app_content where key = 'beauty_tips_global_disclaimer'").first<{ value: string }>(),
  ]);

  const tipsByCategory: Record<string, Record<string, unknown[]>> = {};
  for (const entry of entries.results ?? []) {
    const cat = entry.category_id as string;
    const sev = entry.severity as string;
    tipsByCategory[cat] ??= {};
    tipsByCategory[cat][sev] ??= [];
    tipsByCategory[cat][sev].push({ title: entry.title, body: entry.body, sortOrder: entry.sort_order });
  }

  const spotLabels: Record<string, string> = {};
  for (const row of labels.results ?? []) spotLabels[row.issue_tag] = row.display_label;

  return {
    globalDisclaimer: content?.value ?? "Verified Glam does not provide medical diagnosis or treatment. Tips reflect community experiences only.",
    categories: categories.results ?? [],
    tipsByCategory,
    spotLabels,
  };
}

export const analyze = new Hono<{ Bindings: Env; Variables: SessionVars }>();

analyze.post("/", async (c) => {
  const env = c.env;
  const userId = c.get("userId");

  const openaiKey = env.OPENAI_API_KEY?.trim();
  if (!openaiKey) {
    return c.json({ error: "OPENAI_API_KEY not configured", errorCode: "SERVICE_UNAVAILABLE", version: FUNCTION_VERSION }, 503);
  }
  const openaiModel = resolveModel(env.OPENAI_MODEL || FALLBACK_MODEL);

  const body = await c.req
    .json<{
      featureType?: string;
      storagePath?: string;
      detectedFaces?: unknown;
      profile?: Record<string, unknown>;
      rewardToken?: string;
    }>()
    .catch(
      () =>
        ({}) as {
          featureType?: string;
          storagePath?: string;
          detectedFaces?: unknown;
          profile?: Record<string, unknown>;
          rewardToken?: string;
        },
    );

  const featureType = body.featureType as FeatureType;
  const storagePath = body.storagePath ?? "";
  const detectedFaces = body.detectedFaces ?? [];
  const profile = body.profile ?? {};
  const rewardToken = body.rewardToken;

  if (!VALID_FEATURES.includes(featureType)) {
    return c.json({ error: `Unknown featureType: ${featureType}`, errorCode: "INVALID_REQUEST", version: FUNCTION_VERSION }, 400);
  }
  if (!storagePath || !storagePath.startsWith(`${userId}/`)) {
    return c.json({ error: "Invalid storagePath", errorCode: "INVALID_REQUEST", version: FUNCTION_VERSION }, 400);
  }

  try {
    const access = await checkAnalysisAccess(env.DB, userId, featureType, rewardToken);

    const photoObj = await env.SCANS_BUCKET.get(storagePath);
    if (!photoObj) {
      return c.json({ error: "Could not access photo", errorCode: "INVALID_IMAGE", version: FUNCTION_VERSION }, 400);
    }
    const rawBytes = new Uint8Array(await photoObj.arrayBuffer());
    const prepared = await prepareImageBytes(rawBytes, photoObj.httpMetadata?.contentType ?? "image/jpeg", 768);
    const base64 = bytesToBase64(prepared.bytes);
    const mime = prepared.mime;

    let beautyCatalog: BeautyCatalog | null = null;
    if (featureType === "BEAUTY_TIPS" || featureType === "GLOW_UP_GUIDE") {
      beautyCatalog = await loadBeautyTipsCatalog(env.DB);
    }

    let payload = await analyzeWithOpenAI({
      apiKey: openaiKey,
      model: openaiModel,
      featureType,
      base64,
      mime,
      detectedFaces,
      profile,
      beautyCatalog,
    });

    if (featureType === "CELEBRITY_LOOKALIKE") {
      payload = await enrichCelebrityMatches(payload, env);
    }
    if (featureType === "BEAUTY_SCORE_SHOWDOWN") {
      payload = await enrichShowdown(payload, env, userId);
    }

    const creditsRemaining = access.usedRewardToken ? undefined : await deductCredits(env.DB, userId, featureType);

    return c.json({ payload, version: FUNCTION_VERSION, creditsRemaining });
  } catch (e) {
    console.error(e);
    if (e instanceof AnalysisError) {
      return c.json({ error: e.message, errorCode: e.errorCode, version: FUNCTION_VERSION }, e.status as 200);
    }
    const msg = e instanceof Error ? e.message : "Analysis failed";
    if (msg.includes("Insufficient credits") || msg.includes("INSUFFICIENT_CREDITS")) {
      return c.json(
        { error: "You need 5 credits for this analysis. Credits renew with your subscription plan.", errorCode: "INSUFFICIENT_CREDITS", version: FUNCTION_VERSION },
        429,
      );
    }
    if (msg.includes("Pro subscription required") || msg.includes("NOT_SUBSCRIBED")) {
      return c.json({ error: "Pro subscription required to run AI analysis.", errorCode: "NOT_SUBSCRIBED", version: FUNCTION_VERSION }, 403);
    }
    return c.json({ error: mapOpenAIErrorMessage(msg), errorCode: classifyOpenAIErrorCode(msg), version: FUNCTION_VERSION }, 500);
  }
});
