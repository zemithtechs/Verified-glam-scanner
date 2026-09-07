import catalogJson from "./data/vg_viral_challenges_catalog.json";

/**
 * Ported from lib/services/vg_challenge_templates.dart +
 * lib/services/vg_challenge_service.dart's issue-resolution helpers
 * (Flutter app). The challenge plan is NOT AI-generated — worker-api's
 * GLOW_UP_GUIDE analyze call only returns detected skin spots/findings
 * (see worker-api/src/lib/analyze-prompts.ts, which explicitly forbids
 * `days[]` in that response). The day-by-day plan comes from this static
 * template catalog (vg_viral_challenges_catalog.json, copied verbatim from
 * the Flutter app's lib/data/), keyed by a detected issue code + severity.
 */

type StepDef = { title: string; mainTask: string; supportTask: string; whyLine: string; estMinutes: number };
type ChallengeDef = { id: string; title: string; durations: number[]; steps: StepDef[] };
type Catalog = { disclaimer: string; issueMap: Record<string, string[]>; challenges: ChallengeDef[] };

const catalog = catalogJson as Catalog;

export type ChallengeDay = {
  dayNumber: number;
  title: string;
  mainTask: string;
  supportTask: string;
  whyLine: string;
  estMinutes: number;
};

export type ResolvedTemplate = {
  issueCode: string;
  issueLabel: string;
  challengeName: string;
  durationDays: number;
  days: ChallengeDay[];
};

export type Issue = { code: string; label: string; severity: string; count: number };

export function normalizeIssueCode(raw: string): string {
  const v = raw.toLowerCase();
  if (v.includes("acne") || v.includes("pimple") || v.includes("breakout")) return "acne";
  if (v.includes("pigment") || v.includes("dark") || v.includes("spot")) return "pigmentation";
  if (v.includes("texture") || v.includes("scar")) return "texture";
  if (v.includes("aging") || v.includes("sag") || v.includes("firm")) return "aging";
  if (v.includes("sensitive") || v.includes("redness")) return "sensitivity";
  if (v.includes("oily") || v.includes("pore") || v.includes("sebum")) return "oily";
  if (v.includes("dry") || v.includes("dehydrat") || v.includes("flaky")) return "dryness";
  if (v.includes("uneven") || v.includes("tone") || v.includes("rosacea")) return "uneven_tone";
  return "acne";
}

function humanIssueLabel(code: string): string {
  switch (code) {
    case "pigmentation":
      return "Hyperpigmentation & Dark Spots";
    case "texture":
      return "Texture & Acne Scars";
    case "aging":
      return "Aging & Sagging Skin";
    case "sensitivity":
      return "Sensitivity & Redness";
    case "oily":
      return "Oily Skin & Enlarged Pores";
    case "dryness":
      return "Dry & Dehydrated Skin";
    case "uneven_tone":
      return "Uneven Skin Tone & Rosacea";
    default:
      return "Acne & Breakouts";
  }
}

function severityWeight(severity: string): number {
  switch (severity) {
    case "high":
      return 3;
    case "medium":
      return 2;
    default:
      return 1;
  }
}

/** Ranks issues from a GLOW_UP_GUIDE/BEAUTY_TIPS analyze payload's
 * detectedIssues (preferred) or findings (fallback), most severe first. */
export function rankIssues(payload: Record<string, unknown>): Issue[] {
  const detected = Array.isArray(payload.detectedIssues) ? (payload.detectedIssues as Record<string, unknown>[]) : [];
  if (detected.length > 0) {
    const ranked = detected.map((d): Issue => {
      const issueId = String(d.issueId ?? "");
      const severity = String(d.severity ?? "low").toLowerCase();
      const confidence = typeof d.confidence === "number" ? d.confidence : 0.7;
      const code = normalizeIssueCode(issueId);
      const label = String(d.label ?? humanIssueLabel(code));
      return { code, label, severity, count: Math.round(confidence * 100) };
    });
    ranked.sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity) || b.count - a.count);
    return ranked;
  }

  const findings = payload.findings;
  if (Array.isArray(findings) && findings.length > 0) {
    const normalized = findings
      .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
      .map((entry): Issue => {
        const severity = String(entry.severity ?? "low").toLowerCase();
        const count = typeof entry.spotCount === "number" ? entry.spotCount : 0;
        const categoryName = String(entry.categoryName ?? "");
        const categoryId = String(entry.categoryId ?? "");
        const code = normalizeIssueCode(`${categoryName} ${categoryId}`);
        const label = categoryName || humanIssueLabel(code);
        return { code, label, severity, count };
      });
    normalized.sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity) || b.count - a.count);
    if (normalized.length > 0) return normalized;
  }

  return [];
}

export function resolvePrimaryIssue(payload: Record<string, unknown>): Issue {
  const ranked = rankIssues(payload);
  if (ranked.length > 0) return ranked[0];
  const concern = typeof payload.concern === "string" ? payload.concern : "";
  const severity = String(payload.severity ?? "low").toLowerCase();
  const code = normalizeIssueCode(concern);
  return { code, label: humanIssueLabel(code), severity, count: 1 };
}

function durationFromSeverity(severity: string): number {
  switch (severity.toLowerCase()) {
    case "high":
      return 7;
    case "medium":
      return 5;
    default:
      return 3;
  }
}

function routeDuration(issueCode: string, severity: string): number {
  const sev = severity.toLowerCase();
  if (issueCode === "uneven_tone") return 7;
  if (issueCode === "sensitivity") return sev === "high" ? 5 : 3;
  return durationFromSeverity(severity);
}

function nearestDuration(options: number[], target: number): number {
  if (options.includes(target)) return target;
  return [...options].sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
}

function challengeNameFor(issueCode: string, severity: string, fallbackTitle: string): string {
  const sev = severity.toLowerCase();
  if (issueCode === "acne") {
    if (sev === "high") return "Your 7-Day Acne Reset Challenge";
    if (sev === "medium") return "Your 5-Day Clear Skin Challenge";
    return "Your 3-Day Skin Refresh";
  }
  if (issueCode === "pigmentation") return sev === "high" ? "Your 7-Day Brightening Challenge" : "Your 5-Day Glow Challenge";
  if (issueCode === "texture") return sev === "high" ? "Your 7-Day Skin Renewal Challenge" : "Your 5-Day Smooth Skin Challenge";
  if (issueCode === "aging") return sev === "high" ? "Your 7-Day Lift & Firm Challenge" : "Your 5-Day Face Yoga Challenge";
  if (issueCode === "sensitivity") return sev === "high" ? "Your 5-Day Calm Skin Challenge" : "Your 3-Day Skin Reset";
  if (issueCode === "oily") return sev === "high" ? "Your 7-Day Oil Control Challenge" : "Your 5-Day Pore Minimising Challenge";
  if (issueCode === "dryness") return sev === "high" ? "Your 7-Day Deep Hydration Challenge" : "Your 5-Day Moisture Surge Challenge";
  if (issueCode === "uneven_tone") return "Your 7-Day Even Tone Challenge";
  return `Your ${durationFromSeverity(severity)}-Day ${fallbackTitle}`;
}

function buildDays(steps: StepDef[], duration: number): ChallengeDay[] {
  const out: ChallengeDay[] = [];
  for (let i = 0; i < duration; i++) {
    const step = steps[i % steps.length];
    out.push({
      dayNumber: i + 1,
      title: step.title,
      mainTask: step.mainTask,
      supportTask: `${step.supportTask} Track your progress selfie today.`,
      whyLine: step.whyLine,
      estMinutes: step.estMinutes,
    });
  }
  return out;
}

export function resolveTemplate(issueCode: string, issueLabel: string, severity: string): ResolvedTemplate {
  const normalized = normalizeIssueCode(issueCode);
  const duration = routeDuration(normalized, severity);
  const picks = catalog.issueMap[normalized] ?? catalog.issueMap["acne"] ?? [];

  const ranked = catalog.challenges
    .filter((c) => picks.includes(c.id))
    .sort((a, b) => picks.indexOf(a.id) - picks.indexOf(b.id));
  const chosen = ranked[0] ?? catalog.challenges[0];
  const targetDuration = nearestDuration(chosen.durations, duration);

  return {
    issueCode: normalized,
    issueLabel,
    challengeName: challengeNameFor(normalized, severity, chosen.title),
    durationDays: targetDuration,
    days: buildDays(chosen.steps, targetDuration),
  };
}

export function introForIssue(issueTag: string, durationDays: number): string {
  return `We've analysed your skin. We noticed ${issueTag} and built a ${durationDays}-day challenge with simple daily habits that many creators say may help when done consistently.`;
}

export const challengeDisclaimer = catalog.disclaimer;
