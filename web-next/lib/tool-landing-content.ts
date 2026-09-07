import type { ToolLandingContent } from "./tool-landing-types";
import type { FeatureType } from "./tools";

// Ported verbatim from lib/web/content/vg_tool_landing_content.dart (Flutter
// app) — same copy as the current app/site, just presented as a React page.
// Reviews are a single shared block reused across all 10 tools in the
// source data (not per-tool), so they're defined once here too.
const SHARED_REVIEWS = [
  {
    name: "Maya R.",
    text: "Verified Glam Scanner gave me clarity I never got from a mirror selfie. The symmetry breakdown felt professional, not gimmicky.",
    rating: 5,
  },
  {
    name: "Jordan K.",
    text: "I uploaded one photo and had actionable tips in under a minute. The results screen actually uses my face — love that.",
    rating: 5,
  },
  {
    name: "Priya S.",
    text: "Finally an AI beauty tool that looks polished on desktop. Easy upload, clear scores, and suggestions I could use.",
    rating: 5,
  },
];

const CONTENT: Record<FeatureType, ToolLandingContent> = {
  FACE_BEAUTY_ANALYSIS: {
    headline: "AI Face Beauty Analysis — Know Your Beauty Score",
    subheadline:
      "Upload a clear portrait and get an instant breakdown of your facial features with AI-powered beauty analysis.",
    whyChoose: [
      {
        title: "Easy to use",
        description: "Drag and drop or click to upload. Our AI analyzes your portrait in seconds — no studio setup required.",
      },
      {
        title: "Feature-level detail",
        description: "See scores and notes for eyes, lips, symmetry, and proportions — not just a single number.",
      },
      {
        title: "Personalized guidance",
        description: "Get tailored suggestions for makeup, hair framing, and photo angles based on your unique features.",
      },
      {
        title: "Save time",
        description: "Skip guesswork. One upload replaces hours of trial-and-error with structured, visual feedback.",
      },
    ],
    showcase: [
      {
        title: "See your feature map on your own photo",
        description:
          "Verified Glam Scanner overlays scored regions directly on your portrait — eyes, lips, brows, and jawline — so every number has context. No generic diagrams: your face stays the hero while landmarks and zones explain what we measured.",
      },
      {
        title: "Regional scores, not just one beauty number",
        description:
          "Get breakdowns for symmetry, proportions, and individual features instead of a single vague score. Compare how eyes, nose, lips, and structure contribute to your overall result.",
      },
      {
        title: "Spot your strongest features instantly",
        description:
          "Clear callouts highlight what already stands out and where small grooming or makeup tweaks can elevate your look.",
      },
      {
        title: "Turn analysis into real styling moves",
        description:
          "Practical tips connect scores to blush placement, brow shaping, hair framing, and camera angles — upload once and leave with a plan.",
      },
    ],
    howTo: [
      { title: "Upload a photo", description: "Use a front-facing portrait with even lighting." },
      { title: "AI scans your face", description: "We detect landmarks and score facial features automatically." },
      { title: "Review your results", description: "Explore overlays, scores, and personalized recommendations." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      {
        question: "How does AI face beauty analysis work?",
        answer: "We detect facial landmarks, measure proportions, and score key features using AI trained on portrait analysis.",
      },
      {
        question: "What photo should I upload?",
        answer: "A clear, front-facing selfie with your face centered and minimal filters works best.",
      },
      { question: "Is my photo stored?", answer: "Photos are processed securely for your analysis. See our privacy policy for retention details." },
      {
        question: "How accurate is the beauty score?",
        answer: "Scores reflect measurable facial proportions and symmetry. They are guides for styling, not judgments.",
      },
      { question: "Can I use this on desktop?", answer: "Yes. Verified Glam Scanner is built for web — upload from your computer or phone browser." },
      { question: "Do I need an account?", answer: "Sign in to save scans and sync results across devices." },
    ],
  },
  COLOR_ANALYSIS: {
    headline: "AI Seasonal Color Palette — Colors That Suit You",
    subheadline: "Find your best seasonal palette in under a minute. Upload a photo for personalized color recommendations.",
    whyChoose: [
      { title: "Fast color typing", description: "AI reads undertone and contrast from your portrait to suggest a seasonal palette." },
      { title: "Actionable swatches", description: "Get ready-to-use color families for makeup, hair, and outfits." },
      { title: "Shop smarter", description: "Stop buying shades that wash you out — focus on colors that enhance your natural glow." },
      { title: "Works on any device", description: "Try colors online from desktop or mobile with the same Verified Glam Scanner experience." },
    ],
    showcase: [
      {
        title: "Find your seasonal color family fast",
        description:
          "Upload a clear selfie and let Verified Glam Scanner read undertone, contrast, and depth from your natural coloring. In under a minute you get a seasonal palette that explains why certain hues harmonize with your skin, hair, and eyes.",
      },
      {
        title: "Swatches you can shop with",
        description:
          "See coordinated color families for lipstick, blush, eyeshadow, and wardrobe accents — not abstract theory. Shortlist shades that flatter your undertone before you buy.",
      },
      {
        title: "Dress in colors that love you back",
        description: "Learn which metals, neutrals, and statement colors lift your complexion instead of washing you out.",
      },
      {
        title: "Compare palettes as your look evolves",
        description: "Rescan with different makeup or hair color to see how your apparent undertone shifts before committing to a bold change.",
      },
    ],
    howTo: [
      { title: "Upload a selfie", description: "Natural light and minimal makeup give the clearest read." },
      { title: "Analyze undertone", description: "AI evaluates warmth, depth, and contrast in your features." },
      { title: "Get your palette", description: "Review seasonal swatches and styling suggestions." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "What is a seasonal color palette?", answer: "It groups colors that harmonize with your natural coloring — skin, hair, and eyes — for flattering style choices." },
      { question: "Do I need professional lighting?", answer: "Even indoor daylight works. Avoid heavy filters for the most accurate palette." },
      { question: "Can this help with makeup shopping?", answer: "Yes. Use your palette to shortlist foundation, blush, and lip shades." },
      { question: "How many seasons do you support?", answer: "We map you to classic seasonal families with modern, wearable swatch groups." },
      { question: "Is seasonal color analysis accurate?", answer: "AI provides a strong starting point; personal preference always wins." },
      { question: "Can I retake with different makeup?", answer: "Yes. Compare scans to see how makeup shifts your apparent undertone." },
    ],
  },
  GLOW_UP_GUIDE: {
    headline: "Beauty Routine Challenge — Your AI Glow-Up Plan",
    subheadline: "Structured daily beauty habits based on your starting point and goals.",
    whyChoose: [
      { title: "Goal-based routines", description: "Challenges adapt to skin, aesthetic, and beauty goals you set in onboarding." },
      { title: "Daily structure", description: "Clear steps so you know what to do each morning and evening." },
      { title: "Progress mindset", description: "Celebrate small wins — consistency beats perfection." },
      { title: "Integrated scans", description: "Pair your routine with periodic scans to see visible changes." },
    ],
    showcase: [
      {
        title: "Start your glow-up with a baseline scan",
        description: "Your day-one portrait anchors the Beauty Routine Challenge. Capture where you are today in even light.",
      },
      {
        title: "Daily habits built for your goals",
        description: "Get a structured checklist of morning and evening steps tailored to your onboarding preferences.",
      },
      {
        title: "Track progress with milestone scans",
        description: "Rescan on suggested days to compare visible changes and refresh guidance.",
      },
      {
        title: "Skincare and glam in one plan",
        description: "Balance care habits with optional makeup practice so beginners and enthusiasts both stay engaged.",
      },
    ],
    howTo: [
      { title: "Upload a baseline photo", description: "Capture your starting point in even light." },
      { title: "Set your goals", description: "Complete onboarding so routines match your preferences." },
      { title: "Follow daily steps", description: "Check off habits and rescan on milestone days." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "How long is the challenge?", answer: "Routines are structured in multi-day phases you can repeat or extend." },
      { question: "Do I need products?", answer: "We suggest categories — use products you already trust and tolerate." },
      { question: "Can beginners join?", answer: "Yes. Steps start simple and scale with your comfort level." },
      { question: "Is this skincare or makeup?", answer: "Both — a balance of care habits and optional glam practice." },
      { question: "How do milestones work?", answer: "Rescan on suggested days to refresh guidance and track change." },
      { question: "Can I pause the challenge?", answer: "Yes. Resume anytime from your scan history and profile." },
    ],
  },
  BEAUTY_TIPS: {
    headline: "AI Beauty Tips — Personalized For Your Face",
    subheadline: "Turn one portrait into practical beauty advice you can use today.",
    whyChoose: [
      { title: "Personalized", description: "Tips adapt to your face shape, features, and visible skin cues." },
      { title: "Quick wins", description: "Short, actionable suggestions — not overwhelming beauty blogs." },
      { title: "Visual context", description: "Your photo stays on screen so advice maps to real features." },
      { title: "Always improving", description: "Our AI analysis pipeline updates with better beauty guidance over time." },
    ],
    showcase: [
      {
        title: "Beauty tips tied to your real features",
        description: "Verified Glam Scanner reads your face shape, proportions, and visible skin cues to generate tips you can actually use.",
      },
      {
        title: "Makeup placement made simple",
        description: "Learn where to place contour, blush, and highlight for your structure.",
      },
      {
        title: "Skincare focus from your selfie",
        description: "Bare-skin photos surface hydration, SPF, and gentle-care reminders based on visible cues.",
      },
      {
        title: "Quick wins you can apply today",
        description: "Short, actionable guidance on brows, lashes, and lip line that respects your natural symmetry.",
      },
    ],
    howTo: [
      { title: "Upload a clear selfie", description: "Minimal filter helps tips stay relevant." },
      { title: "AI reads your features", description: "We analyze structure and visible skin characteristics." },
      { title: "Apply your tips", description: "Save favorites and revisit after your next scan." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "Are beauty tips medical advice?", answer: "No. Tips are cosmetic suggestions, not dermatology diagnoses." },
      { question: "How personalized are tips?", answer: "They are generated from your scan payload and feature profile." },
      { question: "Can I get tips without makeup on?", answer: "Yes — bare-skin selfies often produce the clearest skincare guidance." },
      { question: "How often should I rescan?", answer: "Rescan when your look changes significantly or you want refreshed advice." },
      { question: "Do tips replace professionals?", answer: "They complement — not replace — licensed estheticians or dermatologists." },
      { question: "Can I save tips?", answer: "Signed-in users can save scans and revisit tip history." },
    ],
  },
  CELEBRITY_LOOKALIKE: {
    headline: "Celebrity Look Alike — See Who You Resemble",
    subheadline: "Fun, fast AI matching that compares your features to celebrity references.",
    whyChoose: [
      { title: "Instant matches", description: "Upload once and get ranked celebrity look-alikes in seconds." },
      { title: "Feature breakdown", description: "Understand which traits — eyes, jaw, smile — drive each match." },
      { title: "Share-worthy results", description: "Results use your photo as the hero with clear match cards." },
      { title: "Private & secure", description: "Your upload is used for analysis within your Verified Glam Scanner account." },
    ],
    showcase: [
      {
        title: "Discover who you resemble in seconds",
        description: "Upload a portrait and Verified Glam Scanner compares your structure to a diverse celebrity reference set.",
      },
      {
        title: "See which traits drive each match",
        description: "Every match card explains shared structure — eyes, jawline, nose bridge, smile — so results feel thoughtful, not random.",
      },
      {
        title: "Your photo stays the hero",
        description: "Results are designed for sharing: your portrait leads the screen with match cards alongside.",
      },
      {
        title: "Style inspiration from your twin",
        description: "Use top matches as mood boards for hair, makeup, and red-carpet aesthetics.",
      },
    ],
    howTo: [
      { title: "Upload your portrait", description: "Center your face with a natural expression." },
      { title: "AI compares features", description: "We match proportions against our celebrity reference set." },
      { title: "View your matches", description: "Explore top look-alikes and similarity details." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "How does celebrity look-alike detection work?", answer: "AI compares your facial structure to a database of celebrity reference faces." },
      { question: "Are matches always exact?", answer: "Matches are similarity estimates for entertainment and style inspiration." },
      { question: "Can I share my results?", answer: "Yes — results are designed with your photo and match cards for easy sharing." },
      { question: "Which celebrities are included?", answer: "Our reference set covers a diverse range of well-known public figures." },
      { question: "Do filters affect matches?", answer: "Heavy filters can skew results. Use a natural photo when possible." },
      { question: "Is an account required?", answer: "Sign in to run analyses and save your match history." },
    ],
  },
  FACIAL_SYMMETRY: {
    headline: "AI Facial Symmetry — Accurate Face Balance Analysis",
    subheadline: "See how balanced your features are with landmark-based symmetry scoring and clear visual overlays.",
    whyChoose: [
      { title: "Easy to use", description: "Upload a portrait and get symmetry metrics in seconds — no manual measuring." },
      { title: "High-accuracy detection", description: "AI landmarks map eyes, brows, nose, and jawline for reliable balance scoring." },
      { title: "Visual overlays", description: "See symmetry lines and regions on your own photo, not generic diagrams." },
      { title: "Practical tips", description: "Learn how lighting, angles, and grooming can highlight your natural balance." },
    ],
    showcase: [
      {
        title: "Measure facial symmetry on your photo",
        description: "Verified Glam Scanner maps your midline and compares left-right landmarks for a reliable symmetry score.",
      },
      {
        title: "Break down balance by region",
        description: "Explore symmetry scores for eyes, brows, nose, and lower face separately.",
      },
      {
        title: "Visual guides, not vague numbers",
        description: "Thin burgundy guides and region highlights show exactly what the AI measured.",
      },
      {
        title: "Photo-ready tips from your scan",
        description: "Small pose, expression, and lighting tweaks can change how symmetry appears on camera.",
      },
    ],
    howTo: [
      { title: "Upload a photo", description: "Face the camera directly with a neutral expression." },
      { title: "Scan & analyze", description: "AI detects landmarks and computes symmetry across regions." },
      { title: "Check results", description: "Review your score, overlays, and personalized notes." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "How is facial symmetry measured?", answer: "We compare paired landmarks on the left and right sides of your face relative to the midline." },
      { question: "Is perfect symmetry realistic?", answer: "Slight asymmetry is natural. The tool highlights balance patterns, not flaws." },
      { question: "What affects my symmetry score?", answer: "Pose, expression, hair covering the face, and lighting can all influence readings." },
      { question: "Can symmetry change over time?", answer: "Grooming, skincare, and photo angle often change how symmetry appears in images." },
      { question: "Do I need a professional photo?", answer: "A clear selfie is enough for a useful symmetry analysis." },
      { question: "Are results medical advice?", answer: "No. This is a cosmetic analysis tool for styling and self-discovery." },
    ],
  },
  BEAUTY_SCORE_SHOWDOWN: {
    headline: "Beauty Score Showdown — Compare & Compete",
    subheadline: "Friendly score comparisons with clear feature breakdowns — perfect for duos and groups.",
    whyChoose: [
      { title: "Side-by-side clarity", description: "Compare scores without confusing spreadsheets or guesswork." },
      { title: "Category winners", description: "See which features lead for each person in the showdown." },
      { title: "Party-ready", description: "Fun for friends — built for shareable, visual results." },
      { title: "Fair AI scoring", description: "Same analysis pipeline for every upload in the showdown." },
    ],
    showcase: [
      {
        title: "Head-to-head beauty scores, side by side",
        description: "Upload portraits for each participant and Verified Glam Scanner scores everyone with the same AI pipeline.",
      },
      {
        title: "See who wins each category",
        description: "Eyes, symmetry, proportions — category breakdowns reveal where each person leads.",
      },
      {
        title: "Fair scoring for every upload",
        description: "The same feature model analyzes each portrait so comparisons stay consistent.",
      },
      {
        title: "Share the results with your group",
        description: "Export-friendly layouts put each hero portrait and score on screen for social posts and group chats.",
      },
    ],
    howTo: [
      { title: "Upload participant photos", description: "Follow prompts for each person in the showdown." },
      { title: "Run AI analysis", description: "We score every portrait with the same feature model." },
      { title: "Compare results", description: "Review winners, ties, and feature highlights." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "How many people can compete?", answer: "Follow on-screen prompts for the supported showdown format." },
      { question: "Is this mean-spirited?", answer: "It is designed as light-hearted comparison with constructive feature notes." },
      { question: "Are scores objective?", answer: "Scores reflect AI measurements — beauty is personal and subjective." },
      { question: "Can we rematch?", answer: "Yes. Run new showdowns anytime with fresh photos." },
      { question: "Do both need accounts?", answer: "One signed-in user can upload all photos for a session." },
      { question: "What photo rules apply?", answer: "Similar lighting and pose make comparisons fairer." },
    ],
  },
  FACIAL_RESEMBLANCE: {
    headline: "AI Face Comparison — How Alike Are Two Faces?",
    subheadline: "Upload two portraits for resemblance scoring and shared-feature highlights.",
    whyChoose: [
      { title: "Two-face upload", description: "Purpose-built flow for exactly two faces in one analysis." },
      { title: "Resemblance score", description: "Clear percentage-style similarity with trait notes." },
      { title: "Visual pairing", description: "Both photos stay visible with matching landmark callouts." },
      { title: "Fast results", description: "Great for family photos, friends, and creator content." },
    ],
    showcase: [
      {
        title: "Compare two faces in one flow",
        description: "Purpose-built for exactly two portraits — upload both and Verified Glam Scanner aligns landmarks automatically.",
      },
      {
        title: "Resemblance you can actually see",
        description: "Dual heroes stay visible with matching callouts on eyes, jaw, and nose.",
      },
      {
        title: "Understand differences too",
        description: "Similarity is only half the story — see where faces diverge, not just overall match percentage.",
      },
      {
        title: "Fast results for pairs",
        description: "No identity verification — this is similarity analysis for insight and fun.",
      },
    ],
    howTo: [
      { title: "Upload two portraits", description: "One face per photo, clearly visible." },
      { title: "AI aligns features", description: "Landmarks are matched across both images." },
      { title: "Read resemblance", description: "Review score, shared traits, and visual callouts." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "Can I compare a parent and child?", answer: "Yes — family resemblance is a popular use case." },
      { question: "Do photos need the same background?", answer: "No, but similar pose and lighting improve accuracy." },
      { question: "What if one face is partially hidden?", answer: "Both faces should be fully visible for best results." },
      { question: "Is this facial recognition?", answer: "It is similarity analysis for entertainment and insight, not identity verification." },
      { question: "Can I compare old and new photos?", answer: "Yes — see how your features read across time or styles." },
      { question: "How private is comparison?", answer: "Uploads are tied to your account and processed securely." },
    ],
  },
  FACE_READING: {
    headline: "AI Attractiveness Test — Feature-Based Ratings",
    subheadline: "A thoughtful attractiveness analysis focused on measurable features — not harsh judgments.",
    whyChoose: [
      { title: "Feature-based", description: "Ratings tie to proportions and symmetry — not a black-box number." },
      { title: "Constructive tone", description: "Insights emphasize enhancement, not criticism." },
      { title: "Your photo first", description: "Results hero your portrait with overlays — never icon-only placeholders." },
      { title: "Quick turnaround", description: "Upload and get ratings in under a minute on web." },
    ],
    showcase: [
      {
        title: "Attractiveness ratings with real context",
        description: "Verified Glam Scanner ties ratings to measurable symmetry and proportions — not a random number from a black box.",
      },
      {
        title: "Regional breakdown beneath your photo",
        description: "See which areas score highest and why landmarks drove the result.",
      },
      {
        title: "Feature highlights that build confidence",
        description: "Callouts show strengths you might overlook in daily mirror checks.",
      },
      {
        title: "Grooming tips that respect your look",
        description: "Get hair framing, lighting, and grooming suggestions aligned with your natural features.",
      },
    ],
    howTo: [
      { title: "Upload your photo", description: "Face forward, relaxed expression." },
      { title: "AI rates features", description: "Landmarks drive proportional and symmetry-based scores." },
      { title: "Explore results", description: "Read ratings, overlays, and improvement ideas." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "Is attractiveness subjective?", answer: "Yes. Our test reflects measurable features — confidence and style matter just as much." },
      { question: "Will this hurt my self-esteem?", answer: "We focus on constructive, feature-level insights — skip if comparisons feel unhelpful." },
      { question: "How is the score calculated?", answer: "AI combines symmetry, proportion, and feature harmony metrics." },
      { question: "Can I retake the test?", answer: "Absolutely — different lighting and angles change results." },
      { question: "Is this for dating apps?", answer: "It is for self-discovery and styling; use judgment on any platform." },
      { question: "Do I need makeup on?", answer: "Either works — choose the look you want feedback on." },
    ],
  },
  GOLDEN_RATIO: {
    headline: "Face Golden Ratio — Classical Proportion Analysis",
    subheadline: "See how your facial proportions relate to golden ratio ideals — with clear visual guides.",
    whyChoose: [
      { title: "Phi-based metrics", description: "Explore classical proportion theory applied to your portrait." },
      { title: "Educational overlays", description: "Lines and ratios on your photo — not abstract charts alone." },
      { title: "Balanced perspective", description: "Ideal ratios are references; natural variation is normal." },
      { title: "Great for creators", description: "Understand how angle and framing change perceived harmony." },
    ],
    showcase: [
      {
        title: "Golden ratio guides on your face",
        description: "Verified Glam Scanner draws classical proportion guides — facial thirds, fifths, and phi relationships — directly on your portrait.",
      },
      {
        title: "Harmony scores you can read",
        description: "Summary metrics plus regional notes translate geometry into plain language.",
      },
      {
        title: "Educational overlays, not abstract charts",
        description: "Lines and ratio markers stay on your photo so the analysis feels tangible.",
      },
      {
        title: "See how framing changes perceived balance",
        description: "Hairstyle volume and camera distance affect how proportions read on screen.",
      },
    ],
    howTo: [
      { title: "Upload a frontal portrait", description: "Keep head level and face unobstructed." },
      { title: "Measure proportions", description: "AI calculates key distances and phi relationships." },
      { title: "Study your map", description: "Review overlays, scores, and harmony notes." },
    ],
    reviews: SHARED_REVIEWS,
    faq: [
      { question: "What is the golden ratio in faces?", answer: "It describes proportional relationships often associated with classical harmony." },
      { question: "Must I match phi exactly?", answer: "No — most faces deviate naturally; the tool shows patterns, not perfection targets." },
      { question: "Does hairstyle affect results?", answer: "Hair covering the jaw or forehead can shift perceived proportions." },
      { question: "Is this science or art?", answer: "It blends geometric analysis with aesthetic tradition — interpret as guidance." },
      { question: "Can photographers use this?", answer: "Yes — great for learning flattering angles and crop ratios." },
      { question: "How accurate is web analysis?", answer: "Clear, forward-facing photos produce the most reliable maps." },
    ],
  },
};

export function landingContentForFeature(featureType: FeatureType): ToolLandingContent {
  return CONTENT[featureType];
}
