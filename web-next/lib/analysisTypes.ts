// Payload shapes returned by POST /analyze, transcribed field-for-field from
// worker-api/src/lib/analyze-normalize.ts (+ showdown.ts / celebrity.ts enrichment).
// Kept intentionally permissive (optional fields) since the AI model output is
// normalized server-side but individual fields can still be absent.

export type Point = { x: number; y: number };

export type Annotation = { text: string; anchor: Point; labelSide: "left" | "right" | "top" | "bottom" };

export type FaceBeautyPayload = {
  beautyScore: number;
  ratingLabel: string;
  subscores: { symmetry: number; featureBalance: number; skinQuality: number; youthfulCues: number; overallBeauty: number };
  annotations: Annotation[];
  guides?: { verticalCenter?: number; eyeLineY?: number; lipLineY?: number; browCurve?: Point[]; noseBridge?: Point[]; jawCurve?: Point[] };
};

export type SymmetryRegion = { id: string; label: string; percent: number; color: number; icon: string; anchor: Point; labelSide: "left" | "right" };

export type FacialSymmetryPayload = {
  guides: { verticalCenter: number; verticalSideLines: number[]; horizontalLines: number[] };
  regions: SymmetryRegion[];
  overallSymmetryScore: number;
  overallPercent: number;
  tierLabel: string;
  subscores: { beauty: number; cuteness: number; skinSmoothness: number; handsomeness: number; faceShape: number; facialSymmetry: number };
  annotations: [];
};

export type FaceReadingPayload = {
  overallScore: number;
  overallPercent: number;
  tierLabel: string;
  subtitle: string;
  facialAge: number;
  appearanceScores: { beauty: number; handsomeness: number; cuteness: number; faceShape: number; facialSymmetry: number; skinSmoothness: number };
  traitScores: { funFactor: number; intelligence: number; confidence: number; credibility: number };
  faceBox: { x: number; y: number; width: number; height: number };
  landmarks: Point[];
  meshConnections: [number, number][];
};

export type ShowdownPodiumEntry = {
  rank: number;
  displayName: string;
  name: string;
  score: number;
  isSimulated: boolean;
  avatarUrl?: string;
  isCurrentUser?: boolean;
};

export type BeautyScoreShowdownPayload = {
  yourScore: number;
  averageScore: number;
  rankPosition: number;
  totalParticipants: number;
  rankLabel: string;
  engagementNote: string;
  podium: ShowdownPodiumEntry[];
  landmarks?: Point[];
  meshConnections?: [number, number][];
};

export type ResemblanceFace = { id: string; label: string; color: number; contourPoints: [number, number][]; center: Point };

export type FacialResemblancePayload = {
  similarity: number;
  scoreLabel: string;
  relationshipHint: string;
  sharedTraits: string[];
  contourComparison: string;
  explanation: string;
  faces: ResemblanceFace[];
};

export type GoldenRatioMeasurement = {
  id: string;
  name: string;
  ratio: number;
  ideal: number;
  delta: number;
  scoreOutOf20: number;
  pass: boolean;
  lineType: "horizontal" | "verticalBracket";
  from: Point;
  to: Point;
  calloutAnchor: Point;
  labelSide: "left" | "right";
  highlightBracket: boolean;
};

export type GoldenRatioPayload = {
  idealPhi: number;
  goldenRatioIndex: number;
  harmonyPercent: number;
  overallScore: number;
  ratingLabel: string;
  landmarks: Record<string, Point>;
  measurements: GoldenRatioMeasurement[];
  deviations: string[];
};

export type CelebrityMatch = { name: string; percent: number; traits: string[]; why: string; imageUrl?: string | null; tmdbId?: number; imageSource?: "generated" };

export type CelebrityLookalikePayload = {
  matches: CelebrityMatch[];
  detectedGender: string;
  disclaimer: string;
  landmarks?: Point[];
  meshConnections?: [number, number][];
};

export type SkinFinding = { categoryId: string; categoryName: string; severity: "high" | "medium" | "low"; shortLabel?: string; spotCount: number; anchor?: Point; labelSide?: string; color?: number };
export type SkinTip = { priority: number; categoryId: string; title: string; body: string; disclaimer: string };
export type DetectedIssue = { issueId: string; label: string; severity: string; confidence: number; anchors: Point[] };
export type SkinAnnotation = { text: string; anchor: Point; labelSide: "left" | "right" | "top" | "bottom"; color?: number; spotId?: string };

export type BeautyTipsPayload = {
  findings: SkinFinding[];
  annotations: SkinAnnotation[];
  tips: SkinTip[];
  detectedIssues: DetectedIssue[];
  summary?: string;
  globalDisclaimer?: string;
};

export type GlowUpGuidePayload = {
  findings: SkinFinding[];
  annotations: SkinAnnotation[];
  detectedIssues: DetectedIssue[];
  summary?: string;
  globalDisclaimer?: string;
};

export type ColorAnalysisPayload = {
  samplePoint?: Point;
  palette: string[];
  paletteHex: string[];
  skin: string;
  hair: string;
  eyes: string;
  season: string;
  avoid: string[];
  annotations?: SkinAnnotation[];
};

export type AnyPayload =
  | FaceBeautyPayload
  | FacialSymmetryPayload
  | FaceReadingPayload
  | BeautyScoreShowdownPayload
  | FacialResemblancePayload
  | GoldenRatioPayload
  | CelebrityLookalikePayload
  | BeautyTipsPayload
  | GlowUpGuidePayload
  | ColorAnalysisPayload
  | Record<string, unknown>;
