/**
 * AI Beauty Styling — master tool catalog (single source of truth).
 *
 * status:
 *   live   – already shipping in the Verified Glam scanner; slug is IDENTICAL to
 *            today's URL so the domain move is a pure host-swap 301.
 *   launch – built for the day the hub opens (Phase 1).
 *   later  – planned (Phase 2/3). Shown as "Coming soon", page is noindex until
 *            it has real content, so Google/AdSense never see thin pages.
 *
 * Tools deliberately NOT in this file (held back for AdSense / Play Store policy
 * reasons — sexualised or body-shaming edits): see docs/AI_BEAUTY_STYLING_PLAN.md §6.
 */

export type CategoryId =
  | "face-analysis"
  | "glow-up"
  | "skin-retouch"
  | "hair-beard"
  | "makeup-tryon"
  | "fashion-style"
  | "fun-effects"
  | "photo-tools";

export type Status = "live" | "launch" | "later";

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  /** Tailwind gradient classes — literal strings so Tailwind can see them. */
  gradient: string;
  icon: "scan" | "palette" | "sparkles" | "scissors" | "brush" | "shirt" | "smile" | "image";
};

export type Tool = {
  slug: string;
  name: string;
  category: CategoryId;
  summary: string;
  status: Status;
  /** 0 = free tier allowed, otherwise credits per run. */
  credits: number;
  pro?: boolean;
  badge?: "NEW" | "HOT";
  popular?: boolean;
  /** Original provider endpoints folded into this one user-facing tool. */
  merges?: string[];
};

export const CATEGORIES: Category[] = [
  {
    id: "face-analysis",
    name: "Face Analysis",
    tagline: "Scores, symmetry and proportions",
    description: "Explore photo-based face reports covering visible features, facial proportions, face shape and skin details.",
    gradient: "from-rose-400 to-fuchsia-600",
    icon: "scan",
  },
  {
    id: "glow-up",
    name: "Glow-Up & Color",
    tagline: "Palettes, tips and 7-day plans",
    description: "Find your seasonal color palette, get personalised beauty tips and follow a simple daily glow-up challenge.",
    gradient: "from-amber-300 to-rose-500",
    icon: "palette",
  },
  {
    id: "skin-retouch",
    name: "Skin & Retouch",
    tagline: "Natural-looking enhancement",
    description: "Smooth, brighten and refine portraits with AI skin enhancement, smart beauty retouching and face enhancement.",
    gradient: "from-pink-300 to-purple-500",
    icon: "sparkles",
  },
  {
    id: "hair-beard",
    name: "Hair & Beard",
    tagline: "Try a new look before the salon",
    description: "Preview new hairstyles, hair colors and beard styles on your own photo before you commit.",
    gradient: "from-violet-400 to-indigo-600",
    icon: "scissors",
  },
  {
    id: "makeup-tryon",
    name: "Makeup Try-On",
    tagline: "Lips, lashes, brows and eyes",
    description: "Virtual makeup try-on for lip color, eyeshadow, lashes, brows and colored contacts.",
    gradient: "from-red-400 to-pink-600",
    icon: "brush",
  },
  {
    id: "fashion-style",
    name: "Fashion & Style",
    tagline: "Outfits, ink and accessories",
    description: "Virtual clothes try-on and tattoo previews so you can explore a style safely.",
    gradient: "from-teal-300 to-sky-600",
    icon: "shirt",
  },
  {
    id: "fun-effects",
    name: "Fun Face Effects",
    tagline: "Cartoons, filters and party looks",
    description: "Turn yourself into a cartoon, swap expressions, age yourself up or down and try seasonal face effects.",
    gradient: "from-orange-300 to-pink-500",
    icon: "smile",
  },
  {
    id: "photo-tools",
    name: "Photo Tools",
    tagline: "Restore, blur and combine",
    description: "Restore old family photos, blur faces for privacy and merge portraits into one image.",
    gradient: "from-slate-400 to-zinc-700",
    icon: "image",
  },
];

export const TOOLS: Tool[] = [
  /* ───────── Face Analysis ───────── */
  { slug: "face-beauty-analysis", name: "Face Beauty Analysis", category: "face-analysis", status: "live", credits: 5, popular: true, summary: "Get an instant beauty score with a feature-by-feature breakdown on your own photo." },
  { slug: "facial-symmetry", name: "Facial Symmetry Test", category: "face-analysis", status: "live", credits: 5, badge: "NEW", popular: true, summary: "See an illustrative left/right balance guide for your eyes, brows, nose and jaw." },
  { slug: "face-golden-ratio", name: "Face Golden Ratio", category: "face-analysis", status: "live", credits: 5, summary: "See how your proportions compare with the golden ratio (phi)." },
  { slug: "attractiveness-test", name: "Attractiveness Test", category: "face-analysis", status: "live", credits: 5, popular: true, summary: "A light, self-discovery rating of harmony, style and photo balance.", merges: ["AI Face Rating", "AI Attractiveness Analysis"] },
  { slug: "celebrity-look-alike", name: "Celebrity Look Alike", category: "face-analysis", status: "live", credits: 5, summary: "Celebrity matching is not offered. Explore face shape and color tools instead." },
  { slug: "face-comparison", name: "Face Comparison", category: "face-analysis", status: "live", credits: 5, summary: "Compare two portraits with a qualitative look at their shared and distinct features." },
  { slug: "beauty-score-showdown", name: "Beauty Score Showdown", category: "face-analysis", status: "live", credits: 5, badge: "HOT", summary: "Put two portraits side by side with subjective photo-harmony notes." },
  { slug: "face-shape-analyzer", name: "Face Shape Analyzer", category: "face-analysis", status: "launch", credits: 5, badge: "NEW", popular: true, summary: "Find out if your face is oval, round, square, heart or diamond, then get matching hair and glasses ideas.", merges: ["Face Analyzer", "Face Analyzer Advanced"] },
  { slug: "skin-analysis", name: "AI Skin Analysis", category: "face-analysis", status: "launch", credits: 5, badge: "NEW", popular: true, summary: "Explore visible texture, fine lines, pores and tone variation in a photo-based report.", merges: ["Skin Analyze", "Skin Analyze Advanced", "Skin Analyze Pro"] },
  { slug: "facial-landmarks", name: "Facial Landmarks Map", category: "face-analysis", status: "launch", credits: 5, summary: "See a guide to the visible features of your face, drawn on your own portrait." },

  /* ───────── Glow-Up & Color ───────── */
  { slug: "seasonal-color-palette", name: "Seasonal Color Palette", category: "glow-up", status: "live", credits: 5, badge: "NEW", popular: true, summary: "Discover the colors that suit your skin tone, hair and eyes." },
  { slug: "beauty-tips", name: "Personalized Beauty Tips", category: "glow-up", status: "live", credits: 5, summary: "Get beauty tips matched to the features, skin and style you can see in your photo." },
  { slug: "beauty-routine-challenge", name: "7-Day Glow-Up Challenge", category: "glow-up", status: "live", credits: 5, summary: "A simple daily routine built from your latest scan." },

  /* ───────── Skin & Retouch ───────── */
  { slug: "ai-skin-enhancement", name: "AI Skin Enhancement", category: "skin-retouch", status: "launch", credits: 5, popular: true, summary: "Even out tone and soften blemishes while keeping real skin texture.", merges: ["AI Skin Enhancement", "AI Skin Enhancement Advanced"] },
  { slug: "smart-beauty", name: "Smart Beauty Retouch", category: "skin-retouch", status: "launch", credits: 5, summary: "Tidy a portrait in one step and choose how strong the retouch should be." },
  { slug: "face-beauty-retouch", name: "Face Beauty Editor", category: "skin-retouch", status: "launch", credits: 5, pro: true, summary: "Fine-tune smoothing, shine and polish with three natural finish levels.", merges: ["Face Beauty", "Face Beauty Advanced", "Face Beauty Pro"] },
  { slug: "ai-face-enhancer", name: "AI Face Enhancer", category: "skin-retouch", status: "launch", credits: 5, popular: true, summary: "Sharpen blurry or low-resolution portraits into crisp, clear photos." },
  { slug: "ai-face-slimming", name: "AI Face Slimming", category: "skin-retouch", status: "launch", credits: 5, summary: "Preview a slightly softer face contour while the rest of the portrait stays the same." },

  /* ───────── Hair & Beard ───────── */
  { slug: "hairstyle-changer", name: "Hairstyle Changer", category: "hair-beard", status: "launch", credits: 5, pro: true, badge: "HOT", popular: true, summary: "Try four distinct cuts and styles on your own photo.", merges: ["Hairstyle Changer Pro", "Hairstyle Changer Premium"] },
  { slug: "ai-hair-color", name: "AI Hair Color Changer", category: "hair-beard", status: "launch", credits: 5, popular: true, summary: "Preview five shades, from natural browns to a bold pastel." },
  { slug: "beard-styling", name: "AI Beard Styling", category: "hair-beard", status: "launch", credits: 5, summary: "Preview different beard shapes and lengths on your own face." },
  { slug: "beard-remover", name: "AI Beard Removal", category: "hair-beard", status: "launch", credits: 5, summary: "See a clean-shaven version of your photo before you shave." },
  { slug: "hair-loss-simulation", name: "Hair Loss Simulation", category: "hair-beard", status: "launch", credits: 5, summary: "See a receding hairline on your photo for fun. This is entertainment, not medical advice." },
  { slug: "bald-filter", name: "AI Bald Filter", category: "hair-beard", status: "launch", credits: 5, summary: "See a shaved-head version of your photo before you decide, or just for a laugh." },

  /* ───────── Makeup Try-On ───────── */
  { slug: "lip-color-changer", name: "Lip Color Changer", category: "makeup-tryon", status: "launch", credits: 5, popular: true, summary: "Try lipstick shades from nude to bold red, matte or glossy.", merges: ["Lips Color Changer", "AI Red Lip Gloss"] },
  { slug: "eyeshadow-try-on", name: "Eyeshadow Try-On", category: "makeup-tryon", status: "launch", credits: 5, summary: "See different eyeshadow colors on your own eyes before you buy a palette." },
  { slug: "colored-contacts", name: "Colored Contacts Try-On", category: "makeup-tryon", status: "launch", credits: 5, popular: true, summary: "See your eyes in blue, green, hazel, gray and more." },
  { slug: "ai-eyelashes", name: "AI Eyelashes", category: "makeup-tryon", status: "launch", credits: 5, summary: "Preview natural to dramatic lash styles on your own photo." },
  { slug: "ai-eyebrows", name: "AI Eyebrows", category: "makeup-tryon", status: "launch", credits: 5, summary: "Try different brow shapes and thicknesses on your own face." },
  { slug: "ai-lip-enhancement", name: "AI Lip Enhancement", category: "makeup-tryon", status: "launch", credits: 5, summary: "Preview fuller-looking lips on your photo to plan your makeup." },

  /* ───────── Fashion & Style ───────── */
  { slug: "virtual-try-on-clothes", name: "Virtual Clothes Try-On", category: "fashion-style", status: "launch", credits: 5, pro: true, badge: "HOT", popular: true, summary: "Upload a photo and a garment, see how it looks on you.", merges: ["Try on Clothes", "Try on Clothes Pro"] },
  { slug: "ai-tattoo-generator", name: "AI Tattoo Generator", category: "fashion-style", status: "launch", credits: 5, summary: "Preview one of three original tattoo motifs on your skin." },
  { slug: "ai-waist-slimming", name: "Silhouette Preview", category: "fashion-style", status: "launch", credits: 5, summary: "Preview how a garment's fit shapes your silhouette." },

  /* ───────── Fun Face Effects ───────── */
  { slug: "cartoon-yourself", name: "Cartoon Yourself", category: "fun-effects", status: "launch", credits: 5, badge: "HOT", popular: true, summary: "Turn your selfie into anime, 3D or comic art." },
  { slug: "face-filters", name: "AI Face Filters", category: "fun-effects", status: "launch", credits: 5, summary: "Try popular face filters on your own selfie and keep the one you like." },
  { slug: "facial-expression-changer", name: "Facial Expression Changer", category: "fun-effects", status: "launch", credits: 5, summary: "Add a smile, surprise or wink to a photo." },
  { slug: "age-gender-swap", name: "Age & Gender Swap", category: "fun-effects", status: "launch", credits: 5, summary: "See a younger, older or alternate-gender version of yourself." },
  { slug: "ai-face-swap", name: "AI Face Swap", category: "fun-effects", status: "launch", credits: 5, summary: "Swap faces between two photos, with permission from both people." },
  { slug: "square-face-filter", name: "Square Face Filter", category: "fun-effects", status: "launch", credits: 5, summary: "Try the viral square-face trend on your own selfie." },
  { slug: "big-head-effect", name: "Big Head Effect", category: "fun-effects", status: "launch", credits: 5, summary: "Turn any portrait into a comic big-head caricature." },
  { slug: "halloween-mask", name: "AI Halloween Mask", category: "fun-effects", status: "launch", credits: 5, summary: "Add a spooky mask or costume makeup to your photo for Halloween." },
  { slug: "pregnant-filter", name: "Pregnancy Joke Filter", category: "fun-effects", status: "launch", credits: 5, summary: "Make a playful joke picture to send to a friend who is in on it." },
  { slug: "birthday-image-generator", name: "Birthday Image Generator", category: "fun-effects", status: "launch", credits: 5, summary: "Turn one photo into a personal birthday card." },
  { slug: "ai-fortune-teller", name: "AI Fortune Teller", category: "fun-effects", status: "launch", credits: 5, summary: "Get a playful face-reading fortune made for entertainment." },
  { slug: "elf-name-generator", name: "Elf Name Generator", category: "fun-effects", status: "launch", credits: 5, summary: "Get a fantasy elf name and portrait from your photo." },

  /* ───────── Photo Tools ───────── */
  { slug: "old-photo-restoration", name: "Old Photo Restoration", category: "photo-tools", status: "launch", credits: 5, popular: true, summary: "Repair scratches, fade and blur in old family photos." },
  { slug: "face-blur", name: "Face Blur", category: "photo-tools", status: "launch", credits: 5, summary: "Blur faces in a photo to protect privacy." },
  { slug: "merge-portraits", name: "Merge Portraits", category: "photo-tools", status: "launch", credits: 5, summary: "Blend two portraits into one picture, with both people's permission." },
];

/* ───────── helpers ───────── */
export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;
export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.id === slug);
export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const toolsInCategory = (id: CategoryId) => TOOLS.filter((t) => t.category === id);
/** The celebrity page explains alternatives; it is not a runnable matching tool. */
export const isBrowsableTool = (t: Tool) => t.slug !== "celebrity-look-alike";
export const isAvailable = (t: Tool) => isBrowsableTool(t) && t.status !== "later";

export const COUNTS = {
  total: TOOLS.length,
  available: TOOLS.filter(isAvailable).length,
  live: TOOLS.filter((t) => isBrowsableTool(t) && t.status === "live").length,
  launch: TOOLS.filter((t) => t.status === "launch").length,
  later: TOOLS.filter((t) => t.status === "later").length,
};

export const SITE = {
  name: "AI Beauty Styling",
  domain: "aibeautystyling.com",
  url: "https://aibeautystyling.com",
  tagline: "Free AI beauty tools to analyze, restyle and try on your look",
};
