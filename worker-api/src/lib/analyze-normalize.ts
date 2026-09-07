import {
  APPEARANCE_OFFSETS,
  APPEARANCE_WEIGHTS,
  attractivenessTierFor,
  beautyHarmonyTierFor,
  boostScoreMap,
  clampScore,
  deriveOverall,
  displayBoost,
  displayBoostOutOf10,
  ensureCelebritySpread,
  ensureSpread,
  FACE_BEAUTY_OFFSETS,
  FACE_BEAUTY_WEIGHTS,
  parseNumericScore,
  SYMMETRY_REGION_DEFAULTS,
  SYMMETRY_REGION_OFFSETS,
  SYMMETRY_SUB_OFFSETS,
  SYMMETRY_SUB_WEIGHTS,
  symmetryTierFor,
  toNum,
  TRAIT_OFFSETS,
} from "./scoring";
import { FACE_REQUIRED_FEATURES, type BeautyCatalog, type FeatureType } from "./analyze-types";
import { AnalysisError } from "./analyze-errors";

// Verbatim port of analyze-scan's normalization pipeline — pure functions
// operating on the parsed OpenAI JSON payload, no platform dependency.

export function toInt(v: unknown, fallback = 0): number {
  return Math.round(toNum(v, fallback));
}

export function asRecord(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  return {};
}

export function asMapList(v: unknown): Record<string, unknown>[] {
  if (Array.isArray(v)) {
    return v.filter((x) => x && typeof x === "object" && !Array.isArray(x)).map((x) => x as Record<string, unknown>);
  }
  if (v && typeof v === "object" && !Array.isArray(v)) return [v as Record<string, unknown>];
  return [];
}

export function asStringList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

export function asNumList(v: unknown): number[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => toNum(x)).filter((n) => Number.isFinite(n));
}

function severityWeight(severity: string): number {
  switch ((severity ?? "").toLowerCase()) {
    case "high":
      return 3;
    case "medium":
      return 2;
    default:
      return 1;
  }
}

function canonicalIssueId(raw: string): string {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("acne") || v.includes("breakout") || v.includes("pimple")) return "acne";
  if (v.includes("pigment") || v.includes("dark") || v.includes("spot")) return "hyperpigmentation";
  if (v.includes("texture") || v.includes("scar")) return "texture_scars";
  if (v.includes("aging") || v.includes("sag") || v.includes("firm")) return "aging";
  if (v.includes("sensitive") || v.includes("redness")) return "sensitivity";
  if (v.includes("oily") || v.includes("pore") || v.includes("sebum")) return "oily_pores";
  if (v.includes("dry") || v.includes("dehydrat") || v.includes("flaky")) return "dryness";
  if (v.includes("uneven") || v.includes("tone") || v.includes("rosacea")) return "uneven_tone";
  return "acne";
}

function issueLabel(issueId: string): string {
  switch (issueId) {
    case "hyperpigmentation":
      return "Hyperpigmentation & Dark Spots";
    case "texture_scars":
      return "Texture & Acne Scars";
    case "aging":
      return "Aging & Sagging Skin";
    case "sensitivity":
      return "Sensitivity & Redness";
    case "oily_pores":
      return "Oily Skin & Enlarged Pores";
    case "dryness":
      return "Dry & Dehydrated Skin";
    case "uneven_tone":
      return "Uneven Skin Tone & Rosacea";
    default:
      return "Acne & Breakouts";
  }
}

function buildDetectedIssues(
  spots: Record<string, unknown>[],
  findings: Record<string, unknown>[],
  categoryMap: Map<string, Record<string, unknown>>,
): Record<string, unknown>[] {
  const byIssue = new Map<
    string,
    { issueId: string; label: string; severity: string; confidenceSum: number; confidenceCount: number; anchors: Record<string, unknown>[] }
  >();

  const push = (input: { rawId: string; severity: string; confidence?: number; anchor?: Record<string, unknown>; categoryName?: string }) => {
    const issueId = canonicalIssueId(`${input.rawId} ${input.categoryName ?? ""}`);
    const item = byIssue.get(issueId) ?? { issueId, label: issueLabel(issueId), severity: "low", confidenceSum: 0, confidenceCount: 0, anchors: [] };

    if (severityWeight(input.severity) > severityWeight(item.severity)) item.severity = input.severity;
    if (typeof input.confidence === "number") {
      item.confidenceSum += input.confidence;
      item.confidenceCount += 1;
    }
    if (input.anchor) item.anchors.push(input.anchor);
    byIssue.set(issueId, item);
  };

  for (const spot of spots) {
    const categoryId = String(spot.categoryId ?? "");
    const cat = categoryMap.get(categoryId);
    push({
      rawId: categoryId,
      categoryName: String(cat?.name ?? ""),
      severity: String(spot.severity ?? "low"),
      confidence: Number(spot.confidence ?? 0),
      anchor: spot.anchor as Record<string, unknown> | undefined,
    });
  }
  for (const finding of findings) {
    const categoryId = String(finding.categoryId ?? "");
    push({
      rawId: categoryId,
      categoryName: String(finding.categoryName ?? ""),
      severity: String(finding.severity ?? "low"),
      confidence: Number(finding.confidence ?? 0.7),
      anchor: finding.anchor as Record<string, unknown> | undefined,
    });
  }

  const result = [...byIssue.values()].map((i) => ({
    issueId: i.issueId,
    label: i.label,
    severity: i.severity,
    confidence: i.confidenceCount > 0 ? Number((i.confidenceSum / i.confidenceCount).toFixed(2)) : 0.7,
    anchors: i.anchors.slice(0, 5),
  }));

  result.sort((a, b) => {
    const sev = severityWeight(String(b.severity)) - severityWeight(String(a.severity));
    if (sev !== 0) return sev;
    return Number(b.confidence) - Number(a.confidence);
  });
  return result;
}

function anchorXY(spot: Record<string, unknown>): { x: number; y: number } | null {
  const anchor = spot.anchor as Record<string, unknown> | undefined;
  if (!anchor) return null;
  const x = Number(anchor.x);
  const y = Number(anchor.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

function filterLowConfidenceSpots(spots: Record<string, unknown>[], minConfidence: number): Record<string, unknown>[] {
  return spots.filter((spot) => {
    const confidence = Number(spot.confidence ?? 1);
    return Number.isFinite(confidence) && confidence >= minConfidence;
  });
}

function dedupeSpotAnchors(spots: Record<string, unknown>[], minDistance: number): Record<string, unknown>[] {
  const kept: Record<string, unknown>[] = [];
  for (const spot of spots) {
    const a = anchorXY(spot);
    if (!a) {
      kept.push(spot);
      continue;
    }
    const tooClose = kept.some((other) => {
      const b = anchorXY(other);
      if (!b) return false;
      return Math.hypot(a.x - b.x, a.y - b.y) < minDistance;
    });
    if (!tooClose) kept.push(spot);
  }
  return kept;
}

function balanceLabelSides(spots: Record<string, unknown>[]): Record<string, unknown>[] {
  return spots.map((spot) => {
    const anchor = anchorXY(spot);
    if (!anchor) return spot;
    return { ...spot, labelSide: anchor.x < 0.5 ? "left" : "right" };
  });
}

function capSpotsBySeverity(spots: Record<string, unknown>[], maxCount: number): Record<string, unknown>[] {
  const sorted = [...spots].sort((a, b) => severityWeight(String(b.severity)) - severityWeight(String(a.severity)));
  return sorted.slice(0, maxCount);
}

export function mergeTipsFromCatalog(
  catalog: BeautyCatalog,
  spots: Record<string, unknown>[],
  findings: Record<string, unknown>[],
): Record<string, unknown>[] {
  const perTipDisclaimer = "Community tip — not medical advice. Patch test first.";

  const pairs = new Map<string, string>();
  for (const spot of spots) {
    const cat = spot.categoryId as string;
    const sev = (spot.severity as string) ?? "medium";
    if (cat) pairs.set(`${cat}:${sev}`, sev);
  }
  for (const finding of findings) {
    const cat = finding.categoryId as string;
    const sev = (finding.severity as string) ?? "medium";
    if (cat) pairs.set(`${cat}:${sev}`, sev);
  }

  const tips: Record<string, unknown>[] = [];
  let priority = 1;

  for (const [key] of pairs) {
    const [categoryId, severity] = key.split(":");
    const entries = catalog.tipsByCategory[categoryId]?.[severity] ?? [];
    const entry = entries[0] as Record<string, unknown> | undefined;
    if (entry) {
      tips.push({ priority: priority++, categoryId, title: entry.title, body: entry.body, disclaimer: perTipDisclaimer });
    }
  }

  if (tips.length === 0 && spots.length > 0) {
    const cat = spots[0].categoryId as string;
    const sev = (spots[0].severity as string) ?? "low";
    const entries = catalog.tipsByCategory[cat]?.[sev] ?? [];
    const entry = entries[0] as Record<string, unknown> | undefined;
    if (entry) {
      tips.push({ priority: 1, categoryId: cat, title: entry.title, body: entry.body, disclaimer: perTipDisclaimer });
    }
  }

  return tips;
}

function toPercent100(raw: unknown, fallback = 75): number {
  let n = toNum(raw, fallback);
  if (n > 0 && n <= 1) n *= 100;
  else if (n > 1 && n <= 10) n *= 10;
  return clampScore(Math.round(n), 0, 100);
}
void toPercent100; // kept for parity with source; unused directly here

function upliftPercent(score: number): number {
  const s = clampScore(Math.round(score), 0, 100);
  if (s <= 15) return clampScore(Math.round(32 + s * 0.75), 35, 45);
  if (s <= 50) return clampScore(Math.round(40 + s * 0.7), 0, 100);
  return clampScore(s + 5, 0, 100);
}

function toOutOf10(raw: unknown, fallback = 7.5): number {
  let n = toNum(raw, fallback);
  if (n > 10 && n <= 100) n /= 10;
  else if (n > 0 && n <= 1) n *= 10;
  return clampScore(Math.round(n * 10) / 10, 0, 10);
}

export function upliftOutOf10(score: number): number {
  const pct = upliftPercent(Math.round(score * 10));
  return clampScore(Math.round(pct) / 10, 0, 10);
}

function markScoresFinalized(parsed: Record<string, unknown>): void {
  parsed.scoresFinalized = true;
}

const SYMMETRY_REGION_META: Record<string, { label: string; color: number; icon: string; anchor: { x: number; y: number }; labelSide: string }> = {
  eyebrow: { label: "Eyebrows symmetry", color: 0x7b6fd6, icon: "star", anchor: { x: 0.28, y: 0.26 }, labelSide: "left" },
  eyes: { label: "Eyes symmetry", color: 0x5b8def, icon: "star", anchor: { x: 0.72, y: 0.36 }, labelSide: "right" },
  nose: { label: "Nose symmetry", color: 0x4caf7a, icon: "check", anchor: { x: 0.28, y: 0.48 }, labelSide: "left" },
  mouth: { label: "Mouth symmetry", color: 0xe07a9a, icon: "heart", anchor: { x: 0.72, y: 0.56 }, labelSide: "right" },
  lip: { label: "Lips symmetry", color: 0xe07a9a, icon: "heart", anchor: { x: 0.3, y: 0.66 }, labelSide: "left" },
  cheeks: { label: "Cheeks symmetry", color: 0xe8a04c, icon: "circle", anchor: { x: 0.72, y: 0.74 }, labelSide: "right" },
  jaw: { label: "Jaw symmetry", color: 0xc5a373, icon: "check", anchor: { x: 0.28, y: 0.8 }, labelSide: "left" },
};

const SHOWDOWN_FIRST_NAMES = [
  "Bella", "Loveth", "Amara", "Sofia", "Mia", "Zara", "Luna", "Aisha", "Chloe", "Nina", "Emma", "Grace", "Priya", "Layla", "Ruby",
];

export function pickShowdownNames(count: number): string[] {
  const pool = [...SHOWDOWN_FIRST_NAMES].sort(() => Math.random() - 0.5);
  return pool.slice(0, count);
}

function normalizeFacialSymmetry(parsed: Record<string, unknown>): Record<string, unknown> {
  const guidesIn = asRecord(parsed.guides);
  parsed.guides = {
    verticalCenter: toNum(guidesIn.verticalCenter, 0.5),
    verticalSideLines: asNumList(guidesIn.verticalSideLines).length >= 2 ? asNumList(guidesIn.verticalSideLines) : [0.35, 0.65],
    horizontalLines: asNumList(guidesIn.horizontalLines).length >= 3 ? asNumList(guidesIn.horizontalLines) : [0.18, 0.28, 0.38, 0.52, 0.64, 0.78, 0.88],
  };

  const baseOverallRaw = parseNumericScore(parsed.overallSymmetryScore ?? parsed.overallPercent ?? parsed.overallScore, 78);

  let rawRegions: unknown = parsed.regions;
  if (rawRegions && typeof rawRegions === "object" && !Array.isArray(rawRegions)) {
    rawRegions = Object.entries(rawRegions as Record<string, unknown>).map(([name, score]) => ({ name, score }));
  }
  const regionRows = asMapList(rawRegions);

  const rawRegionScores: Record<string, number> = {};
  for (const row of regionRows) {
    const nameKey = String(row.id ?? row.name ?? "").toLowerCase();
    const metaKey = Object.keys(SYMMETRY_REGION_META).find((k) => nameKey.includes(k)) ?? "";
    if (!metaKey || metaKey === "jaw" || metaKey === "lip") continue;
    const defaultBase = SYMMETRY_REGION_DEFAULTS[metaKey] ?? baseOverallRaw;
    rawRegionScores[metaKey] = parseNumericScore(row.percent ?? row.score ?? row.value, defaultBase);
  }

  if (Object.keys(rawRegionScores).length === 0) {
    for (const [id, base] of Object.entries(SYMMETRY_REGION_DEFAULTS)) rawRegionScores[id] = base;
  }

  const spreadRegionRaw = ensureSpread(rawRegionScores, SYMMETRY_REGION_OFFSETS);
  const regions: Record<string, unknown>[] = [];

  for (const [metaKey, rawPercent] of Object.entries(spreadRegionRaw)) {
    const meta = SYMMETRY_REGION_META[metaKey];
    if (!meta) continue;
    const row = regionRows.find((r) => String(r.id ?? r.name ?? "").toLowerCase().includes(metaKey));
    const anchorIn = row ? asRecord(row.anchor) : {};
    regions.push({
      id: metaKey,
      label: String(row?.label ?? meta.label),
      percent: displayBoost(rawPercent),
      color: toNum(row?.color, meta.color),
      icon: String(row?.icon ?? meta.icon),
      anchor: anchorIn.x != null ? row?.anchor : meta.anchor,
      labelSide: String(row?.labelSide ?? meta.labelSide),
    });
  }

  const regionAvgRaw = Math.round(Object.values(spreadRegionRaw).reduce((a, b) => a + b, 0) / Object.values(spreadRegionRaw).length);

  const subKeys = ["beauty", "cuteness", "skinSmoothness", "handsomeness", "faceShape", "facialSymmetry"];
  const subIn = asRecord(parsed.subscores);
  const rawSubs: Record<string, number> = {};
  for (const key of subKeys) rawSubs[key] = parseNumericScore(subIn[key], regionAvgRaw);
  const spreadSubs = ensureSpread(rawSubs, SYMMETRY_SUB_OFFSETS);
  const subAvgRaw = deriveOverall(spreadSubs, SYMMETRY_SUB_WEIGHTS);

  const overallRaw = Math.round((regionAvgRaw + subAvgRaw) / 2);
  const overallPercent = displayBoost(overallRaw);

  parsed.regions = regions;
  parsed.overallSymmetryScore = overallPercent;
  parsed.overallPercent = overallPercent;
  parsed.tierLabel = symmetryTierFor(overallPercent);
  parsed.subscores = boostScoreMap(spreadSubs);
  parsed.annotations = [];
  markScoresFinalized(parsed);

  return parsed;
}

function normalizeFaceBeauty(parsed: Record<string, unknown>): Record<string, unknown> {
  const subKeys = ["symmetry", "featureBalance", "skinQuality", "youthfulCues", "overallBeauty"];
  const subIn = asRecord(parsed.subscores);
  const rawSubs: Record<string, number> = {};
  for (const key of subKeys) rawSubs[key] = parseNumericScore(subIn[key], 75);
  const spreadSubs = ensureSpread(rawSubs, FACE_BEAUTY_OFFSETS);
  const derivedRaw = deriveOverall(spreadSubs, FACE_BEAUTY_WEIGHTS);
  const modelRaw = parseNumericScore(parsed.beautyScore ?? parsed.overallScore, derivedRaw);
  const overallRaw = Math.abs(modelRaw - derivedRaw) > 12 ? derivedRaw : modelRaw;
  const beautyScore = displayBoost(overallRaw);

  parsed.beautyScore = beautyScore;
  parsed.ratingLabel = beautyHarmonyTierFor(beautyScore);
  parsed.subscores = boostScoreMap(spreadSubs);

  const annotations = asMapList(parsed.annotations).map((row, i) => {
    const anchorIn = asRecord(row.anchor);
    const sides = ["left", "right", "top", "bottom"];
    return {
      text: String(row.text ?? "Harmonious facial proportions"),
      anchor: anchorIn.x != null ? row.anchor : { x: 0.5, y: 0.22 + i * 0.14 },
      labelSide: String(row.labelSide ?? sides[i % sides.length]),
    };
  });
  parsed.annotations =
    annotations.length > 0
      ? annotations.slice(0, 5)
      : [
          { text: "Facial structure appears well-defined", anchor: { x: 0.28, y: 0.3 }, labelSide: "left" },
          { text: "Feature balance looks harmonious", anchor: { x: 0.72, y: 0.48 }, labelSide: "right" },
          { text: "Skin tone reads even and healthy", anchor: { x: 0.3, y: 0.68 }, labelSide: "left" },
        ];

  markScoresFinalized(parsed);
  return parsed;
}

function defaultFaceReadingLandmarks(): { x: number; y: number }[] {
  return [
    { x: 0.28, y: 0.28 }, { x: 0.38, y: 0.25 }, { x: 0.62, y: 0.25 }, { x: 0.72, y: 0.28 },
    { x: 0.32, y: 0.38 }, { x: 0.4, y: 0.38 }, { x: 0.6, y: 0.38 }, { x: 0.68, y: 0.38 },
    { x: 0.5, y: 0.3 }, { x: 0.5, y: 0.52 }, { x: 0.44, y: 0.54 }, { x: 0.56, y: 0.54 },
    { x: 0.38, y: 0.64 }, { x: 0.5, y: 0.62 }, { x: 0.62, y: 0.64 }, { x: 0.5, y: 0.7 },
    { x: 0.24, y: 0.58 }, { x: 0.5, y: 0.84 }, { x: 0.76, y: 0.58 }, { x: 0.22, y: 0.42 }, { x: 0.78, y: 0.42 },
  ];
}

function defaultFaceReadingMeshConnections(): number[][] {
  return [
    [0, 1], [1, 2], [2, 3], [4, 5], [6, 7], [5, 6], [8, 9], [9, 10], [9, 11], [10, 11],
    [12, 13], [13, 14], [14, 15], [12, 15], [16, 17], [17, 18], [19, 16], [20, 18],
    [1, 8], [2, 8], [5, 9], [6, 9], [10, 12], [11, 14],
  ];
}

function normalizeFaceReadingLandmarks(raw: unknown): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];

  const addPoint = (item: unknown) => {
    if (!item || typeof item !== "object") return;
    const pt = item as Record<string, unknown>;
    const x = toNum(pt.x, Number.NaN);
    const y = toNum(pt.y, Number.NaN);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    points.push({ x, y });
  };

  const addFromValue = (value: unknown) => {
    if (Array.isArray(value)) {
      for (const item of value) addFromValue(item);
      return;
    }
    addPoint(value);
  };

  if (Array.isArray(raw)) {
    for (const item of raw) addFromValue(item);
  } else if (raw && typeof raw === "object") {
    for (const value of Object.values(raw as Record<string, unknown>)) addFromValue(value);
  }

  return points.length >= 4 ? points : defaultFaceReadingLandmarks();
}

function normalizeFaceReadingMesh(raw: unknown): number[][] {
  if (!Array.isArray(raw) || raw.length === 0) return defaultFaceReadingMeshConnections();
  const pairs: number[][] = [];
  for (const row of raw) {
    if (!Array.isArray(row) || row.length < 2) continue;
    const a = toInt(row[0], -1);
    const b = toInt(row[1], -1);
    if (a < 0 || b < 0) continue;
    pairs.push([a, b]);
  }
  return pairs.length > 0 ? pairs : defaultFaceReadingMeshConnections();
}

function normalizeFaceReading(parsed: Record<string, unknown>): Record<string, unknown> {
  const appearanceKeys = ["beauty", "handsomeness", "cuteness", "faceShape", "facialSymmetry", "skinSmoothness"];
  const traitKeys = ["funFactor", "intelligence", "confidence", "credibility"];

  const appearanceIn = asRecord(parsed.appearanceScores);
  const traitIn = asRecord(parsed.traitScores);

  const rawAppearance: Record<string, number> = {};
  for (const key of appearanceKeys) rawAppearance[key] = parseNumericScore(appearanceIn[key], 75);
  const spreadAppearance = ensureSpread(rawAppearance, APPEARANCE_OFFSETS);
  const derivedRaw = deriveOverall(spreadAppearance, APPEARANCE_WEIGHTS);
  const modelPercent = parseNumericScore(parsed.overallScore, derivedRaw);
  const overallRaw = Math.abs(modelPercent - derivedRaw) > 12 ? derivedRaw : modelPercent;
  const overallScore = displayBoostOutOf10(overallRaw / 10);

  parsed.overallScore = overallScore;
  parsed.overallPercent = Math.round(overallScore * 10);
  parsed.tierLabel = attractivenessTierFor(overallScore);
  parsed.subtitle = String(parsed.subtitle ?? "Proportion-based harmony reading — for wellness inspiration, not medical advice.");
  parsed.facialAge = clampScore(toInt(parsed.facialAge, Math.round(22 + overallScore)), 18, 45);

  const rawTraits: Record<string, number> = {};
  for (const key of traitKeys) rawTraits[key] = parseNumericScore(traitIn[key], overallRaw - 5);
  const spreadTraits = ensureSpread(rawTraits, TRAIT_OFFSETS);

  parsed.appearanceScores = boostScoreMap(spreadAppearance);
  parsed.traitScores = boostScoreMap(spreadTraits);

  const boxIn = asRecord(parsed.faceBox);
  const topLeft = asRecord(boxIn.topLeft);
  const bottomRight = asRecord(boxIn.bottomRight);
  if (Object.keys(topLeft).length > 0 && Object.keys(bottomRight).length > 0) {
    const x1 = clampScore(toNum(topLeft.x, 0.21), 0, 1);
    const y1 = clampScore(toNum(topLeft.y, 0.18), 0, 1);
    const x2 = clampScore(toNum(bottomRight.x, x1 + 0.58), 0, 1);
    const y2 = clampScore(toNum(bottomRight.y, y1 + 0.48), 0, 1);
    parsed.faceBox = {
      x: clampScore(x1, 0, 0.75),
      y: clampScore(y1, 0, 0.75),
      width: clampScore(Math.abs(x2 - x1), 0.2, 0.85),
      height: clampScore(Math.abs(y2 - y1), 0.2, 0.85),
    };
  } else {
    parsed.faceBox = {
      x: clampScore(toNum(boxIn.x, 0.21), 0, 0.75),
      y: clampScore(toNum(boxIn.y, 0.18), 0, 0.75),
      width: clampScore(toNum(boxIn.width, 0.58), 0.2, 0.85),
      height: clampScore(toNum(boxIn.height, 0.48), 0.2, 0.85),
    };
  }

  parsed.landmarks = normalizeFaceReadingLandmarks(parsed.landmarks);
  parsed.meshConnections = normalizeFaceReadingMesh(parsed.meshConnections);
  markScoresFinalized(parsed);

  return parsed;
}

export function normalizeShowdown(parsed: Record<string, unknown>): Record<string, unknown> {
  const yourScore = upliftOutOf10(toOutOf10(parsed.yourScore, 8.0));
  parsed.yourScore = yourScore;
  parsed.averageScore = upliftOutOf10(toOutOf10(parsed.averageScore, 7.2));
  parsed.rankPosition = toInt(parsed.rankPosition, 2);
  parsed.totalParticipants = Math.max(toInt(parsed.totalParticipants, 100), 10);

  const topPercent = Math.max(5, Math.ceil((Number(parsed.rankPosition) / Number(parsed.totalParticipants)) * 100));
  parsed.rankLabel = String(parsed.rankLabel ?? `Top ${topPercent}%`);
  parsed.engagementNote = String(parsed.engagementNote ?? "Complete challenges and scan regularly to climb the community board.");

  const podium = asMapList(parsed.podium).map((row, i) => ({
    rank: toInt(row.rank, i + 1),
    displayName: String(row.displayName ?? row.name ?? pickShowdownNames(1)[0]),
    name: String(row.name ?? row.displayName ?? pickShowdownNames(1)[0]),
    score: upliftOutOf10(toOutOf10(row.score, yourScore + 0.2)),
    isSimulated: row.isSimulated ?? true,
  }));
  parsed.podium = podium;
  return parsed;
}

function scoreLabelForRelationship(hint: string): string {
  switch (hint.toLowerCase()) {
    case "couple":
      return "Couple Similarity Score";
    case "friend":
      return "Friend Similarity Score";
    default:
      return "Sibling Similarity Score";
  }
}

function ovalPoints(cx: number, cy: number, rx: number, ry: number, segments = 24): number[][] {
  return Array.from({ length: segments }, (_, i) => {
    const t = (i / segments) * 2 * Math.PI;
    return [cx + rx * Math.cos(t), cy + ry * Math.sin(t)];
  });
}

function mockTwoFaceContours(): Record<string, unknown>[] {
  return [
    { id: "face1", label: "Face 1", color: 0xe07a9a, contourPoints: ovalPoints(0.32, 0.48, 0.14, 0.2), center: { x: 0.32, y: 0.28 } },
    { id: "face2", label: "Face 2", color: 0x5b8def, contourPoints: ovalPoints(0.68, 0.48, 0.14, 0.2), center: { x: 0.68, y: 0.28 } },
  ];
}

function facesFromDetected(detectedFaces: unknown): Record<string, unknown>[] {
  const list = asMapList(detectedFaces);
  if (list.length >= 2) {
    return list.slice(0, 2).map((f, i) => ({
      id: f.id ?? `face${i + 1}`,
      label: f.label ?? `Face ${i + 1}`,
      color: toNum(f.color, i === 0 ? 0xe07a9a : 0x5b8def),
      contourPoints: f.contourPoints ?? ovalPoints(i === 0 ? 0.32 : 0.68, 0.48, 0.14, 0.2),
      center: f.center ?? { x: i === 0 ? 0.32 : 0.68, y: 0.28 },
    }));
  }
  return mockTwoFaceContours();
}

function normalizeFacialResemblance(parsed: Record<string, unknown>, detectedFaces: unknown): Record<string, unknown> {
  const similarity = toInt(parsed.similarity, 78);
  const relationshipHint = String(parsed.relationshipHint ?? parsed.relationship ?? "sibling");
  parsed.similarity = similarity;
  parsed.scoreLabel = String(parsed.scoreLabel ?? scoreLabelForRelationship(relationshipHint));
  parsed.relationshipHint = relationshipHint;
  parsed.sharedTraits =
    asStringList(parsed.sharedTraits).length > 0
      ? asStringList(parsed.sharedTraits)
      : ["Similar face shape", "Aligned jawline contour", "Comparable cheekbone height"];
  parsed.contourComparison = String(parsed.contourComparison ?? parsed.note ?? "Both faces show similar outer contours and jawline alignment.");
  parsed.explanation = String(parsed.explanation ?? parsed.note ?? "The score reflects how closely the outer face contours align.");
  parsed.faces = facesFromDetected(detectedFaces);
  return parsed;
}

function goldenRatingFor(index: number): string {
  if (index >= 85) return "Excellent";
  if (index >= 70) return "Good";
  if (index >= 55) return "Fair";
  return "Developing";
}

function goldenScoreOutOf20(absDelta: number): number {
  if (absDelta <= 0.015) return 20;
  if (absDelta <= 0.035) return 18;
  if (absDelta <= 0.055) return 16;
  if (absDelta <= 0.085) return 13;
  if (absDelta <= 0.12) return 10;
  if (absDelta <= 0.18) return 7;
  if (absDelta <= 0.25) return 4;
  return 2;
}

function defaultGoldenLandmarks(): Record<string, { x: number; y: number }> {
  return {
    hairline: { x: 0.5, y: 0.18 },
    chin: { x: 0.5, y: 0.88 },
    faceWidthLeft: { x: 0.22, y: 0.48 },
    faceWidthRight: { x: 0.78, y: 0.48 },
    eyeInnerL: { x: 0.4, y: 0.38 },
    eyeOuterL: { x: 0.32, y: 0.38 },
    eyeInnerR: { x: 0.6, y: 0.38 },
    eyeOuterR: { x: 0.68, y: 0.38 },
    noseBridge: { x: 0.5, y: 0.3 },
    noseWingL: { x: 0.44, y: 0.54 },
    noseWingR: { x: 0.56, y: 0.54 },
    mouthCornerL: { x: 0.38, y: 0.64 },
    mouthCornerR: { x: 0.62, y: 0.64 },
    philtrum: { x: 0.5, y: 0.58 },
  };
}

function normalizeGoldenMeasurement(
  row: Record<string, unknown>,
  landmarks: Record<string, { x: number; y: number }>,
  fallbackId: string,
): Record<string, unknown> {
  const id = String(row.id ?? fallbackId);
  const ideal = toNum(row.ideal, 1.618);
  const ratio = toNum(row.ratio, ideal);
  const delta = toNum(row.delta, ratio - ideal);
  const absDelta = Math.abs(delta);
  const scoreOutOf20 = toInt(row.scoreOutOf20, goldenScoreOutOf20(absDelta));
  const pass = row.pass === true || absDelta <= 0.055;
  const from = asRecord(row.from);
  const to = asRecord(row.to);
  const defaultFrom = landmarks.hairline ?? { x: 0.5, y: 0.2 };
  const defaultTo = landmarks.chin ?? { x: 0.5, y: 0.85 };

  return {
    id,
    name: String(row.name ?? id),
    ratio: Number(ratio.toFixed(3)),
    ideal,
    delta: Number(delta.toFixed(3)),
    scoreOutOf20,
    pass,
    lineType: String(row.lineType ?? "horizontal"),
    from: from.x != null ? from : defaultFrom,
    to: to.x != null ? to : defaultTo,
    calloutAnchor: asRecord(row.calloutAnchor).x != null ? row.calloutAnchor : { x: 0.12, y: 0.42 },
    labelSide: String(row.labelSide ?? "left"),
    highlightBracket: row.highlightBracket === true || !pass,
  };
}

function normalizeGoldenRatio(parsed: Record<string, unknown>, _detectedFaces: unknown): Record<string, unknown> {
  const idealPhi = toNum(parsed.idealPhi, 1.618);
  let goldenRatioIndex = toInt(parsed.goldenRatioIndex ?? parsed.harmonyPercent, 0);
  let overallScore = toNum(parsed.overallScore, 0);
  if (goldenRatioIndex <= 0 && overallScore > 0) {
    goldenRatioIndex = Math.min(100, Math.max(0, Math.round(overallScore * 10)));
  }
  if (overallScore <= 0 && goldenRatioIndex > 0) {
    overallScore = Number((goldenRatioIndex / 10).toFixed(1));
  }
  if (goldenRatioIndex <= 0) goldenRatioIndex = 72;
  if (overallScore <= 0) overallScore = Number((goldenRatioIndex / 10).toFixed(1));

  const landmarksRaw = asRecord(parsed.landmarks);
  const landmarks = defaultGoldenLandmarks();
  for (const [key, val] of Object.entries(landmarksRaw)) {
    const pt = asRecord(val);
    if (pt.x != null && pt.y != null) landmarks[key] = { x: toNum(pt.x, 0.5), y: toNum(pt.y, 0.5) };
  }

  let measurementRows = parsed.measurements;
  if (measurementRows && typeof measurementRows === "object" && !Array.isArray(measurementRows)) {
    measurementRows = Object.entries(measurementRows as Record<string, unknown>).map(([id, val]) => ({ id, ...asRecord(val) }));
  }
  let measurements = asMapList(measurementRows).map((row, i) => normalizeGoldenMeasurement(row, landmarks, `metric_${i + 1}`));

  if (measurements.length === 0) {
    const defs = [
      { id: "faceLengthWidth", name: "Face Length : Face Width", ratio: 1.62, ideal: idealPhi, from: landmarks.hairline, to: landmarks.chin, labelSide: "left" },
      { id: "eyeDistanceFaceWidth", name: "Eye Distance : Face Width", ratio: 0.26, ideal: 0.262, from: landmarks.eyeInnerL, to: landmarks.eyeInnerR, labelSide: "right" },
      { id: "mouthWidthNoseWidth", name: "Mouth Width : Nose Width", ratio: 1.61, ideal: idealPhi, from: landmarks.mouthCornerL, to: landmarks.mouthCornerR, labelSide: "right" },
    ];
    measurements = defs.map((d) => normalizeGoldenMeasurement(d, landmarks, d.id));
  }

  const scoreSum = measurements.reduce((sum, m) => sum + toInt(m.scoreOutOf20, 0), 0);
  if (goldenRatioIndex <= 0 && measurements.length > 0) {
    goldenRatioIndex = Math.round((scoreSum / measurements.length) * 5);
  }
  overallScore = Number((goldenRatioIndex / 10).toFixed(1));

  parsed.idealPhi = idealPhi;
  const upliftedIndex = upliftPercent(goldenRatioIndex);
  parsed.goldenRatioIndex = upliftedIndex;
  parsed.harmonyPercent = upliftedIndex;
  parsed.overallScore = upliftOutOf10(upliftedIndex / 10);
  parsed.ratingLabel = String(parsed.ratingLabel ?? goldenRatingFor(upliftedIndex));
  parsed.landmarks = landmarks;
  parsed.measurements = measurements;
  parsed.deviations =
    asStringList(parsed.deviations).length > 0
      ? asStringList(parsed.deviations)
      : measurements.filter((m) => m.pass !== true).map((m) => String(m.name));
  return parsed;
}

export function normalizeCelebrityPayload(parsed: Record<string, unknown>): Record<string, unknown> {
  const raw = parsed.matches;
  const rows = Array.isArray(raw) ? raw : [];
  const draft: { name: string; rawPercent: number; traits: string[]; why: string; imageUrl: unknown }[] = [];

  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const name = String(item.name ?? item.celebrityName ?? "").trim();
    if (!name) continue;

    let traits: string[] = [];
    if (Array.isArray(item.traits)) {
      traits = item.traits.map((t) => String(t).trim()).filter(Boolean).slice(0, 4);
    } else if (Array.isArray(item.sharedFeatures)) {
      traits = item.sharedFeatures.map((t) => String(t).trim()).filter(Boolean).slice(0, 4);
    }

    const why = String(item.why ?? item.reason ?? "").trim() || (traits.length > 0 ? traits.join(", ") : "Similar facial proportions and features.");

    draft.push({ name, rawPercent: parseNumericScore(item.percent ?? item.similarity, 75), traits, why, imageUrl: item.imageUrl ?? null });
  }

  draft.sort((a, b) => b.rawPercent - a.rawPercent);
  const staggered = ensureCelebritySpread(draft.map((d) => d.rawPercent));

  const matches: Record<string, unknown>[] = draft.map((item, i) => ({
    name: item.name,
    percent: clampScore(displayBoost(staggered[i] ?? item.rawPercent), 62, 98),
    traits: item.traits,
    why: item.why,
    imageUrl: item.imageUrl,
  }));

  matches.sort((a, b) => Number(b.percent) - Number(a.percent));

  if (matches.length === 0) {
    console.warn("Celebrity payload had no valid matches after normalization");
  }

  parsed.matches = matches.slice(0, 5);
  if (parsed.detectedGender == null) parsed.detectedGender = "unknown";
  parsed.disclaimer = "Playful style resemblance for entertainment — not biometric identification.";
  markScoresFinalized(parsed);
  return parsed;
}

export function normalizePayload(
  featureType: FeatureType,
  parsed: Record<string, unknown>,
  catalog: BeautyCatalog | null,
  detectedFaces: unknown = [],
): Record<string, unknown> {
  if (featureType === "FACIAL_SYMMETRY") return normalizeFacialSymmetry(parsed);
  if (featureType === "FACIAL_RESEMBLANCE") return normalizeFacialResemblance(parsed, detectedFaces);
  if (featureType === "GOLDEN_RATIO") return normalizeGoldenRatio(parsed, detectedFaces);
  if (featureType === "FACE_BEAUTY_ANALYSIS") return normalizeFaceBeauty(parsed);
  if (featureType === "FACE_READING") return normalizeFaceReading(parsed);
  if (featureType === "BEAUTY_SCORE_SHOWDOWN") return normalizeShowdown(parsed);

  const skinScan = featureType === "BEAUTY_TIPS" || featureType === "GLOW_UP_GUIDE";
  if (!skinScan || !catalog) return parsed;

  let spots = asMapList(parsed.spots);
  spots = filterLowConfidenceSpots(spots, 0.55);
  spots = dedupeSpotAnchors(spots, 0.05);
  spots = balanceLabelSides(spots);
  spots = capSpotsBySeverity(spots, 10);
  parsed.spots = spots;

  const categoryMap = new Map<string, Record<string, unknown>>((catalog.categories ?? []).map((c) => [c.id as string, c as Record<string, unknown>]));

  if (!parsed.annotations && spots.length > 0) {
    parsed.annotations = spots
      .map((s, i) => {
        const cat = categoryMap.get(s.categoryId as string);
        return {
          text: s.label,
          anchor: s.anchor,
          labelSide: s.labelSide ?? cat?.label_side ?? "right",
          color: s.color ?? cat?.color ?? 0xffe07a9a,
          spotId: s.id ?? `spot_${i + 1}`,
        };
      })
      .slice(0, 10);
  }

  if (!parsed.findings && spots.length > 0) {
    const grouped = new Map<string, Record<string, unknown>[]>();
    for (const spot of spots) {
      const id = spot.categoryId as string;
      grouped.set(id, [...(grouped.get(id) ?? []), spot]);
    }
    parsed.findings = [...grouped.entries()].map(([categoryId, group]) => {
      const cat = categoryMap.get(categoryId);
      const severities = group.map((s) => s.severity as string);
      const severity = severities.includes("high") ? "high" : severities.includes("medium") ? "medium" : "low";
      const anchorSpot = group[0];
      return {
        categoryId,
        categoryName: cat?.name ?? categoryId,
        severity,
        shortLabel: cat?.short_label ?? "Spot",
        spotCount: group.length,
        anchor: anchorSpot?.anchor,
        labelSide: anchorSpot?.labelSide ?? cat?.label_side ?? "right",
        color: anchorSpot?.color ?? cat?.color ?? 0xffe07a9a,
      };
    });
  }

  const findings = asMapList(parsed.findings);
  parsed.findings = findings;

  if (catalog.globalDisclaimer && !parsed.globalDisclaimer) parsed.globalDisclaimer = catalog.globalDisclaimer;
  if (featureType === "BEAUTY_TIPS") parsed.tips = mergeTipsFromCatalog(catalog, spots, findings);
  parsed.detectedIssues = buildDetectedIssues(spots, findings, categoryMap);

  return parsed;
}

export function assertFaceDetected(featureType: FeatureType, parsed: Record<string, unknown>, detectedFaces: unknown): void {
  if (!FACE_REQUIRED_FEATURES.has(featureType)) return;

  const explicitCode = String(parsed.errorCode ?? parsed.error ?? "").toUpperCase();
  if (explicitCode.includes("NO_FACE")) {
    throw new AnalysisError(422, "NO_FACE_DETECTED", "We couldn't detect a face in this photo. Please try again with a clearer photo.");
  }

  if (parsed.noFaceDetected === true || parsed.faceDetected === false) {
    throw new AnalysisError(422, "NO_FACE_DETECTED", "We couldn't detect a face in this photo. Please try again with a clearer photo.");
  }

  const clientFaces = Array.isArray(detectedFaces) ? detectedFaces : [];
  if (featureType === "FACIAL_RESEMBLANCE" && clientFaces.length < 2) {
    const aiFaces = Array.isArray(parsed.faces) ? (parsed.faces as unknown[]) : [];
    const faceCount = toInt(parsed.faceCount) ?? (aiFaces.length >= 2 ? aiFaces.length : null) ?? (parsed.similarity != null ? 2 : clientFaces.length);
    if (faceCount < 2) {
      throw new AnalysisError(422, "NO_FACE_DETECTED", "We need two clear faces for face comparison. Please try again with a photo showing both people.");
    }
  }

  if (clientFaces.length === 0) {
    const hasFaceSignal =
      parsed.beautyScore != null ||
      parsed.overallScore != null ||
      parsed.overallSymmetryScore != null ||
      parsed.overallPercent != null ||
      (Array.isArray(parsed.spots) && (parsed.spots as unknown[]).length > 0) ||
      (Array.isArray(parsed.matches) && (parsed.matches as unknown[]).length > 0) ||
      (Array.isArray(parsed.regions) && (parsed.regions as unknown[]).length > 0);

    if (!hasFaceSignal && parsed.noFaceDetected !== false) {
      const message = String(parsed.message ?? "").toLowerCase();
      if (message.includes("no face") || message.includes("couldn't detect") || message.includes("cannot detect")) {
        throw new AnalysisError(422, "NO_FACE_DETECTED", "We couldn't detect a face in this photo. Please try again with a clearer photo.");
      }
    }
  }
}
