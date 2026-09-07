/** Shared face scoring: parse, spread repair, derive overall, display boost.
 * Verbatim port of supabase/functions/analyze-scan/scoring.ts — pure
 * functions, zero platform dependencies, no changes needed for D1/Workers. */

export function clampScore(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function toNum(raw: unknown, fallback = 0): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  if (typeof raw === "string") {
    const t = raw.trim();
    const n = Number(t);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

const QUALITATIVE_SCORES: Record<string, number> = {
  exceptional: 92,
  excellent: 88,
  veryhigh: 85,
  very_high: 85,
  high: 78,
  good: 72,
  aboveaverage: 68,
  above_average: 68,
  average: 58,
  moderate: 52,
  fair: 48,
  low: 42,
  poor: 35,
  smooth: 72,
  glowing: 80,
  radiant: 82,
  even: 74,
  hydrated: 76,
  wellhydrated: 76,
  "well-hydrated": 76,
  soft: 70,
  angular: 66,
  almond: 74,
  full: 72,
  oval: 73,
  round: 68,
  square: 65,
  harmonious: 80,
  balanced: 78,
  symmetric: 82,
  asymmetric: 55,
};

/** Coerce API value to 0–100 raw score before display boost. */
export function parseNumericScore(raw: unknown, fallback = 75): number {
  if (raw == null) return fallback;

  if (typeof raw === "number" && Number.isFinite(raw)) {
    let n = raw;
    if (n > 0 && n <= 1) n *= 100;
    else if (n > 1 && n <= 10) n *= 10;
    return clampScore(Math.round(n), 0, 100);
  }

  if (typeof raw === "string") {
    const t = raw.trim();
    const direct = Number(t);
    if (Number.isFinite(direct)) {
      return parseNumericScore(direct, fallback);
    }
    const key = t.toLowerCase().replace(/\s+/g, "");
    if (QUALITATIVE_SCORES[key] != null) {
      return QUALITATIVE_SCORES[key];
    }
    for (const [token, score] of Object.entries(QUALITATIVE_SCORES)) {
      if (key.includes(token.replace(/_/g, ""))) return score;
    }
  }

  return fallback;
}

/** Encouraging display boost that preserves rank order and spread. */
export function displayBoost(raw: number): number {
  const s = clampScore(Math.round(raw), 0, 100);
  if (s <= 30) return clampScore(Math.round(s * 2), 0, 55);
  if (s <= 50) return clampScore(Math.round(s + 20 + (50 - s) * 0.25), 0, 100);
  if (s <= 75) return clampScore(s + 12, 0, 100);
  if (s <= 90) return clampScore(s + 6, 0, 100);
  return clampScore(Math.min(96, s + 2), 0, 100);
}

export function displayBoostOutOf10(raw: number): number {
  const pct = displayBoost(Math.round(raw * 10));
  return clampScore(Math.round(pct) / 10, 0, 10);
}

/** If scores are too flat, apply per-key offsets from the mean. */
export function ensureSpread(
  scores: Record<string, number>,
  offsets: Record<string, number>,
  minSpread = 8,
): Record<string, number> {
  const keys = Object.keys(scores);
  if (keys.length < 2) return { ...scores };

  const values = keys.map((k) => scores[k]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max - min >= minSpread) return { ...scores };

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const out: Record<string, number> = {};
  for (const key of keys) {
    const offset = offsets[key] ?? 0;
    out[key] = clampScore(Math.round(mean + offset), 0, 100);
  }
  return out;
}

/** Weighted average of sub-scores (raw, before boost). */
export function deriveOverall(subs: Record<string, number>, weights: Record<string, number>): number {
  let sum = 0;
  let weightSum = 0;
  for (const [key, value] of Object.entries(subs)) {
    const w = weights[key] ?? 1;
    sum += value * w;
    weightSum += w;
  }
  if (weightSum <= 0) return 75;
  return clampScore(Math.round(sum / weightSum), 0, 100);
}

export function boostScoreMap(scores: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(scores)) {
    out[key] = displayBoost(value);
  }
  return out;
}

export function parseAndSpread(
  raw: Record<string, unknown>,
  keys: string[],
  offsets: Record<string, number>,
  fallback = 75,
): Record<string, number> {
  const parsed: Record<string, number> = {};
  for (const key of keys) {
    parsed[key] = parseNumericScore(raw[key], fallback);
  }
  return ensureSpread(parsed, offsets);
}

export function attractivenessTierFor(score: number): string {
  if (score >= 9.0) return "Exceptionally charming";
  if (score >= 8.5) return "Very Attractive";
  if (score >= 8.0) return "Attractive";
  if (score >= 7.0) return "Above average";
  return "Developing potential";
}

export function beautyHarmonyTierFor(percent: number): string {
  if (percent >= 85) return "Stunning harmony";
  if (percent >= 70) return "Beautiful balance";
  if (percent >= 55) return "Natural charm";
  return "Unique features";
}

export function symmetryTierFor(percent: number): string {
  if (percent >= 85) return "Exceptional balance";
  if (percent >= 70) return "Well balanced";
  if (percent >= 55) return "Naturally balanced";
  return "Distinct character";
}

export const FACE_SCORING_RUBRIC =
  "\n\nFACE SCORING RUBRIC (mandatory):\n" +
  '- Every score MUST be an integer from 0 to 100. Never use words like "smooth", "high", or "glowing" as scores.\n' +
  "- Score each dimension independently from THIS portrait's visible features.\n" +
  "- No two sub-scores in the same group may be identical — keep at least 8 points spread across the set.\n" +
  "- overallScore / beautyScore / overallPercent must equal the weighted average of sub-scores (do not invent a separate overall).\n" +
  "- Use on-device face hints (landmarks, bounding boxes) when provided for proportion estimates.\n" +
  "- Lower scores for visible asymmetry, texture issues, or disproportion; higher for clear balance and even skin.\n";

export const FACE_BEAUTY_WEIGHTS: Record<string, number> = {
  symmetry: 1.2,
  featureBalance: 1.1,
  skinQuality: 1.0,
  youthfulCues: 0.9,
  overallBeauty: 1.0,
};

export const FACE_BEAUTY_OFFSETS: Record<string, number> = {
  symmetry: 4,
  featureBalance: 0,
  skinQuality: 6,
  youthfulCues: -8,
  overallBeauty: 2,
};

export const SYMMETRY_SUB_OFFSETS: Record<string, number> = {
  beauty: 4,
  cuteness: -6,
  skinSmoothness: 5,
  handsomeness: -2,
  faceShape: 0,
  facialSymmetry: 6,
};

export const SYMMETRY_SUB_WEIGHTS: Record<string, number> = {
  beauty: 1.0,
  cuteness: 0.8,
  skinSmoothness: 1.0,
  handsomeness: 0.8,
  faceShape: 1.0,
  facialSymmetry: 1.2,
};

export const APPEARANCE_OFFSETS: Record<string, number> = {
  beauty: 5,
  handsomeness: -2,
  cuteness: -6,
  faceShape: 0,
  facialSymmetry: 6,
  skinSmoothness: 4,
};

export const APPEARANCE_WEIGHTS: Record<string, number> = {
  beauty: 1.2,
  handsomeness: 0.9,
  cuteness: 0.8,
  faceShape: 1.0,
  facialSymmetry: 1.1,
  skinSmoothness: 1.0,
};

export const TRAIT_OFFSETS: Record<string, number> = {
  funFactor: -5,
  intelligence: 4,
  confidence: 0,
  credibility: -3,
};

export const SYMMETRY_REGION_DEFAULTS: Record<string, number> = {
  eyebrow: 80,
  eyes: 82,
  nose: 76,
  mouth: 74,
  cheeks: 78,
};

export const SYMMETRY_REGION_OFFSETS: Record<string, number> = {
  eyebrow: 2,
  eyes: 4,
  nose: -2,
  mouth: -4,
  cheeks: 0,
};

/** Stagger flat celebrity match percents. */
export function ensureCelebritySpread(percents: number[]): number[] {
  if (percents.length === 0) return percents;
  const sorted = [...percents].sort((a, b) => b - a);
  const top3 = sorted.slice(0, 3);
  if (top3.length >= 2 && top3[0] - top3[top3.length - 1] < 5) {
    const staggered = [88, 79, 71, 64, 58];
    return percents.map((_, i) => staggered[i] ?? staggered[staggered.length - 1]);
  }
  return percents;
}
