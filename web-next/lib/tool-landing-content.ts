import type { ToolLandingContent } from "./tool-landing-types";
import type { FeatureType } from "./tools";
import { TOOL_DEEP_GUIDES } from "./tool-deep-guides";

const SHARED_REVIEWS = [
  {
    name: "Maya R.",
    text: "Verified Glam Scanner made my results feel clear and personal. I liked seeing the notes connected to my own photo.",
    rating: 5,
  },
  {
    name: "Jordan K.",
    text: "The scan was fast, the page looked premium, and the tips were easy to understand without feeling harsh.",
    rating: 5,
  },
  {
    name: "Priya S.",
    text: "I use it before trying a new look. The score is fun, but the real value is the detailed breakdown.",
    rating: 5,
  },
];

function withReviews(content: Omit<ToolLandingContent, "reviews" | "guide">, featureType: FeatureType): ToolLandingContent {
  return { ...content, reviews: SHARED_REVIEWS, guide: TOOL_DEEP_GUIDES[featureType] };
}

const CONTENT: Record<FeatureType, ToolLandingContent> = {
  FACE_BEAUTY_ANALYSIS: withReviews({
    headline: "Free AI Face Beauty Analysis and Beauty Score",
    subheadline:
      "Upload a clear selfie and get an instant AI beauty report with facial feature scores, symmetry notes, and practical styling suggestions.",
    whyChoose: [
      { title: "Instant beauty score", description: "Get a polished score and feature summary without booking a studio session." },
      { title: "Feature level detail", description: "Review eyes, lips, symmetry, proportions, and facial balance in one clean report." },
      { title: "Practical beauty guidance", description: "Turn your scan into simple ideas for makeup placement, grooming, hair framing, and better photos." },
      { title: "Built for web and mobile", description: "Use Verified Glam Scanner from your browser, then sign in to keep your results connected." },
    ],
    showcase: [
      {
        title: "See your beauty score with visual context",
        description:
          "Verified Glam Scanner places your result next to your own photo, so the score feels understandable. The report focuses on facial balance, feature harmony, and the visible details that shape the final result.",
      },
      {
        title: "Understand what affects your face analysis",
        description:
          "Instead of giving a single number and leaving you guessing, the report separates the main signals behind your score. You can review symmetry, feature balance, and photo quality before deciding what to improve.",
      },
      {
        title: "Find the features that already stand out",
        description:
          "The page highlights strengths first, then gives light guidance for areas where styling, camera angle, or grooming can make a visible difference.",
      },
      {
        title: "Use the report for everyday beauty choices",
        description:
          "Your analysis can guide blush placement, brow shaping, hair framing, and the kind of lighting that flatters your face in photos.",
      },
    ],
    howTo: [
      { title: "Upload a clear selfie", description: "Use a front-facing photo with even lighting and minimal filters." },
      { title: "Let AI scan your features", description: "The system reads facial landmarks, balance, and visible proportions." },
      { title: "Review your report", description: "Get a score, visual context, and personalized beauty suggestions." },
    ],
    faq: [
      { question: "How does AI face beauty analysis work?", answer: "The tool detects facial landmarks and estimates visual balance, symmetry, and feature harmony from your uploaded photo." },
      { question: "What kind of photo should I upload?", answer: "A clear front-facing selfie with your face centered, good light, and no heavy filter gives the best result." },
      { question: "Is the beauty score a judgment?", answer: "No. The score is a cosmetic and entertainment guide. It is meant to help you understand styling opportunities, not define your worth." },
      { question: "Can I use it on desktop?", answer: "Yes. Verified Glam Scanner works on desktop, laptop, tablet, and mobile browsers." },
      { question: "Do I need an account?", answer: "You can start the flow quickly, but signing in lets you save scans and keep results connected." },
      { question: "Is this medical advice?", answer: "No. It is not medical, dermatology, or professional health advice." },
    ],
  }, "FACE_BEAUTY_ANALYSIS"),
  COLOR_ANALYSIS: withReviews({
    headline: "AI Seasonal Color Palette for Makeup, Hair, and Style",
    subheadline:
      "Upload a selfie to discover color families that suit your skin tone, contrast, hair color, and overall visual warmth.",
    whyChoose: [
      { title: "Personal color direction", description: "Get a season style result based on visible undertone, depth, and contrast." },
      { title: "Useful shopping guidance", description: "Shortlist makeup, hair, clothing, and accessory colors before you buy." },
      { title: "Clear swatch categories", description: "Review flattering neutrals, accent shades, lip colors, blush tones, and wardrobe ideas." },
      { title: "Easy to repeat", description: "Scan again after changing hair color, makeup style, or lighting to compare how your palette shifts." },
    ],
    showcase: [
      {
        title: "Find your best color direction online",
        description:
          "Verified Glam Scanner reads your selfie for color cues and turns them into a practical seasonal palette. The goal is to help you choose shades that lift your face instead of washing it out.",
      },
      {
        title: "Use color analysis before buying makeup",
        description:
          "The report helps you narrow lipstick, blush, eyeshadow, and foundation direction so your next purchase feels less random.",
      },
      {
        title: "Plan hair and wardrobe colors with more confidence",
        description:
          "Explore warm, cool, soft, bright, light, and deep color directions before making a bold hair or clothing decision.",
      },
      {
        title: "Compare looks as your style changes",
        description:
          "Run a new scan when your hair, makeup, or lighting changes. It helps you see which colors still support your natural features.",
      },
    ],
    howTo: [
      { title: "Upload in natural light", description: "Use a clear selfie with minimal color filters and visible hair." },
      { title: "AI reads color cues", description: "The scan estimates undertone, depth, and contrast from your image." },
      { title: "Review your palette", description: "See practical color groups for makeup, hair, wardrobe, and accessories." },
    ],
    faq: [
      { question: "What is seasonal color analysis?", answer: "It groups colors that tend to harmonize with your skin, hair, and eyes so you can make stronger style choices." },
      { question: "Can lighting change my result?", answer: "Yes. Natural daylight and minimal filters usually produce the clearest read." },
      { question: "Can this help with makeup shopping?", answer: "Yes. The palette can guide lipstick, blush, eyeshadow, and foundation direction." },
      { question: "Does the tool replace a professional color consultant?", answer: "No. It gives a strong starting point, but personal taste and professional advice can still matter." },
      { question: "Can I scan with makeup on?", answer: "You can, but a natural look often gives a more useful baseline." },
      { question: "Can I save my palette?", answer: "Signed-in users can keep scans and return to their results." },
    ],
  }, "COLOR_ANALYSIS"),
  GLOW_UP_GUIDE: withReviews({
    headline: "AI Beauty Routine Challenge and Glow Up Plan",
    subheadline:
      "Start with a photo, then get a structured beauty routine challenge with daily steps, progress checkpoints, and realistic next moves.",
    whyChoose: [
      { title: "Personal starting point", description: "Your baseline scan helps the routine feel connected to your face and goals." },
      { title: "Simple daily structure", description: "Know what to focus on each day without building a routine from scratch." },
      { title: "Progress friendly", description: "Milestone scans help you compare changes and refresh your guidance." },
      { title: "Beauty and care together", description: "Balance skincare habits, grooming ideas, and optional glam practice in one plan." },
    ],
    showcase: [
      {
        title: "Begin your glow up with a baseline scan",
        description:
          "The challenge starts with a clear photo so the plan can reflect what you want to improve, maintain, or understand better.",
      },
      {
        title: "Follow a routine that feels manageable",
        description:
          "Instead of vague advice, you get a structured path with easy beauty habits, care reminders, and small steps that build momentum.",
      },
      {
        title: "Use milestone scans to check your progress",
        description:
          "Repeat scans help you see how lighting, skin care, grooming, and consistency can change how your face reads in photos.",
      },
      {
        title: "Keep your routine realistic",
        description:
          "The plan is designed for real life. It supports simple products, steady habits, and beauty choices that fit your schedule.",
      },
    ],
    howTo: [
      { title: "Upload your baseline photo", description: "Start with a clear front-facing image in even lighting." },
      { title: "Set your beauty goals", description: "Choose the areas you want to focus on during the challenge." },
      { title: "Follow daily steps", description: "Use the plan, check off habits, and refresh your guidance with new scans." },
    ],
    faq: [
      { question: "How long is the routine challenge?", answer: "The plan is structured in phases so you can repeat, extend, or restart when needed." },
      { question: "Do I need expensive products?", answer: "No. The routine can work with products you already trust and tolerate." },
      { question: "Is this skincare advice?", answer: "It includes cosmetic care suggestions, but it is not dermatology or medical advice." },
      { question: "Can beginners use it?", answer: "Yes. The steps are designed to be easy to follow even if you are new to beauty routines." },
      { question: "Can I pause the challenge?", answer: "Yes. You can return when you are ready and continue from your account." },
      { question: "Will it guarantee a glow up?", answer: "No tool can guarantee a result, but structure can help you stay consistent and make better beauty choices." },
    ],
  }, "GLOW_UP_GUIDE"),
  BEAUTY_TIPS: withReviews({
    headline: "AI Beauty Tips Personalized to Your Face",
    subheadline:
      "Turn one selfie into practical beauty tips for makeup, grooming, skincare focus, and styling choices that match your visible features.",
    whyChoose: [
      { title: "Personalized tips", description: "Suggestions are connected to your face shape, proportions, and visible cues." },
      { title: "Easy to apply", description: "Get short guidance you can use today instead of a long generic beauty article." },
      { title: "Helpful for daily glam", description: "Use the report for brows, lips, contour, blush, hair framing, and photo angles." },
      { title: "Confidence focused", description: "The tone is constructive, supportive, and built around your natural features." },
    ],
    showcase: [
      {
        title: "Get beauty tips that match your face",
        description:
          "Verified Glam Scanner reads visible structure and gives suggestions that feel more personal than a generic makeup tutorial.",
      },
      {
        title: "Improve makeup placement with simple cues",
        description:
          "The report can guide contour, blush, highlight, brow shape, and lip definition based on your facial balance.",
      },
      {
        title: "Use your scan for skincare focus",
        description:
          "A clear selfie can surface care reminders around hydration, texture, SPF, and gentle consistency. It stays cosmetic, not medical.",
      },
      {
        title: "Build a beauty routine you can actually follow",
        description:
          "Save the most useful tips and repeat scans when your look, skin, hair, or goals change.",
      },
    ],
    howTo: [
      { title: "Upload a clear selfie", description: "Use natural lighting and avoid heavy filters." },
      { title: "AI reads your features", description: "The scan reviews visible structure, balance, and cosmetic cues." },
      { title: "Apply your tips", description: "Use the guidance for makeup, hair, skincare focus, and photos." },
    ],
    faq: [
      { question: "Are these beauty tips medical advice?", answer: "No. They are cosmetic suggestions and should not replace a dermatologist or licensed professional." },
      { question: "Can I use a photo with makeup?", answer: "Yes. Use the look you want feedback on." },
      { question: "How personalized are the tips?", answer: "The guidance is generated from your scan, feature profile, and visible image cues." },
      { question: "Can I save my tips?", answer: "Signed-in users can keep scan history and return to useful recommendations." },
      { question: "How often should I rescan?", answer: "Rescan when your hair, makeup, skin, or goals change." },
      { question: "Will tips work for every face?", answer: "They are designed to be flexible, supportive, and based on what the photo shows." },
    ],
  }, "BEAUTY_TIPS"),
  CELEBRITY_LOOKALIKE: withReviews({
    headline: "Celebrity Look Alike Finder with AI Face Matching",
    subheadline:
      "Upload a portrait and discover celebrity look alike matches based on facial structure, feature similarity, and visual resemblance.",
    whyChoose: [
      { title: "Fast face matching", description: "Get ranked celebrity style matches from one clear portrait." },
      { title: "Feature explanations", description: "See which traits support the result, like eyes, smile, face shape, or jawline." },
      { title: "Fun and shareable", description: "Use matches for entertainment, mood boards, and style inspiration." },
      { title: "Clear disclaimer", description: "Results are similarity estimates for fun, not identity verification." },
    ],
    showcase: [
      {
        title: "Find your celebrity look alike online",
        description:
          "Verified Glam Scanner compares your facial structure with reference patterns to suggest celebrities who share a similar visual feel.",
      },
      {
        title: "Understand why each match appears",
        description:
          "The report focuses on shared features, not random names. You can review which facial traits contribute to each match.",
      },
      {
        title: "Turn matches into style inspiration",
        description:
          "Use your top matches as ideas for makeup, hair, color, photo style, and red carpet inspired looks.",
      },
      {
        title: "Keep the experience fun and safe",
        description:
          "Celebrity look alike results are for entertainment and self discovery. They do not verify identity or imply endorsement.",
      },
    ],
    howTo: [
      { title: "Upload your portrait", description: "Center your face with a natural expression and good lighting." },
      { title: "AI compares features", description: "The scan reviews face shape, feature spacing, and visual resemblance." },
      { title: "View your matches", description: "Explore top look alike results and shared trait notes." },
    ],
    faq: [
      { question: "How does celebrity look alike matching work?", answer: "The tool compares visible facial patterns and estimates resemblance for entertainment and style inspiration." },
      { question: "Are the matches exact?", answer: "No. Matches are similarity estimates, not identity verification." },
      { question: "Can filters affect results?", answer: "Yes. Heavy filters can change facial cues, so a natural photo is better." },
      { question: "Can I share my result?", answer: "Yes, but remember the feature is for fun and does not imply a real connection to any public figure." },
      { question: "Do I need an account?", answer: "Signing in helps you save scans and view your match history." },
      { question: "Is this face recognition?", answer: "It is a look alike and resemblance experience, not an identity verification product." },
    ],
  }, "CELEBRITY_LOOKALIKE"),
  FACIAL_SYMMETRY: withReviews({
    headline: "AI Facial Symmetry Analyzer and Face Balance Test",
    subheadline:
      "Measure facial symmetry online with AI landmarks, visual overlays, and region level notes for eyes, brows, nose, jawline, and face shape.",
    whyChoose: [
      { title: "Symmetry score", description: "Get a clear balance estimate from a front-facing photo." },
      { title: "Region breakdown", description: "Review left and right balance across major facial areas." },
      { title: "Visual overlays", description: "See guide lines on your own photo so the result feels easier to understand." },
      { title: "Photo improvement tips", description: "Learn how pose, expression, hair, and lighting affect perceived symmetry." },
    ],
    showcase: [
      {
        title: "Run a facial symmetry test from your browser",
        description:
          "Upload a clear portrait and Verified Glam Scanner estimates how balanced key landmarks appear from left to right.",
      },
      {
        title: "See more than one symmetry number",
        description:
          "The report can separate eye, brow, nose, mouth, and jawline balance so you understand the pattern behind the score.",
      },
      {
        title: "Use overlays to understand the result",
        description:
          "Guide lines and visual regions help explain what the AI measured on your own image.",
      },
      {
        title: "Improve photo balance with small changes",
        description:
          "Pose, lighting, camera height, and hair placement can change how symmetry appears. The report helps you notice those details.",
      },
    ],
    howTo: [
      { title: "Upload a straight photo", description: "Face the camera directly with a relaxed expression." },
      { title: "AI maps landmarks", description: "The scan compares paired features around the face midline." },
      { title: "Review balance notes", description: "See your score, regions, overlays, and practical suggestions." },
    ],
    faq: [
      { question: "How is facial symmetry measured?", answer: "The tool compares paired landmarks on both sides of the face relative to the center line." },
      { question: "Is perfect symmetry normal?", answer: "No. Slight asymmetry is natural and common." },
      { question: "What affects my score?", answer: "Pose, lighting, expression, hair placement, and camera angle can all affect the result." },
      { question: "Can symmetry change over time?", answer: "Your actual features change slowly, but styling and photos can change how symmetry appears." },
      { question: "Is this medical analysis?", answer: "No. It is cosmetic and entertainment analysis, not medical advice." },
      { question: "Can I retake the scan?", answer: "Yes. Retaking with better lighting or a straighter photo can improve the usefulness of the result." },
    ],
  }, "FACIAL_SYMMETRY"),
  BEAUTY_SCORE_SHOWDOWN: withReviews({
    headline: "Beauty Score Showdown for Friendly AI Comparisons",
    subheadline:
      "Compare beauty scores with a fun AI showdown built for friends, creators, and group challenges with clear category notes.",
    whyChoose: [
      { title: "Side by side scoring", description: "Compare results in a clean format without confusing spreadsheets." },
      { title: "Category notes", description: "See where each person stands out across visible beauty signals." },
      { title: "Share friendly", description: "Designed for fun group moments, content ideas, and lighthearted comparison." },
      { title: "Consistent pipeline", description: "Every participant is analyzed with the same scoring flow." },
    ],
    showcase: [
      {
        title: "Run a friendly beauty score challenge",
        description:
          "Beauty Score Showdown lets users compare AI beauty results in a structured way while keeping the tone playful and positive.",
      },
      {
        title: "Compare categories, not just totals",
        description:
          "The report can show category level strengths so the result feels more nuanced than a simple winner and loser.",
      },
      {
        title: "Keep comparison fair",
        description:
          "Use similar lighting, similar pose, and clear photos so each participant has the same chance at a useful result.",
      },
      {
        title: "Create shareable beauty content",
        description:
          "The format works well for friends, creators, couples, siblings, and light social challenges when everyone has consented.",
      },
    ],
    howTo: [
      { title: "Add participant photos", description: "Use clear portraits with similar lighting where possible." },
      { title: "Run the AI showdown", description: "The system scores each photo with the same analysis logic." },
      { title: "Compare results", description: "Review scores, category notes, and shareable highlights." },
    ],
    faq: [
      { question: "Is the showdown meant to be serious?", answer: "No. It is designed as a fun comparison tool with a constructive tone." },
      { question: "Are scores objective?", answer: "Scores are AI estimates based on visual patterns. Beauty is personal and subjective." },
      { question: "Can friends use one account?", answer: "One signed-in user can run the flow, but each person should consent to their photo being uploaded." },
      { question: "What photos work best?", answer: "Use clear, front-facing photos with similar lighting and no heavy filters." },
      { question: "Can we run a rematch?", answer: "Yes. You can upload new photos and compare again." },
      { question: "Can results be shared?", answer: "Yes, but share respectfully and only with permission from the people in the photos." },
    ],
  }, "BEAUTY_SCORE_SHOWDOWN"),
  FACIAL_RESEMBLANCE: withReviews({
    headline: "AI Face Comparison and Facial Resemblance Test",
    subheadline:
      "Upload two portraits to compare facial resemblance, shared traits, feature similarity, and visual differences in one clean report.",
    whyChoose: [
      { title: "Two face comparison", description: "Purpose built for comparing two visible faces in one analysis." },
      { title: "Similarity estimate", description: "Get a clear resemblance score with supporting trait notes." },
      { title: "Shared feature insights", description: "Compare eyes, nose, jawline, face shape, and overall visual structure." },
      { title: "Fun for pairs", description: "Useful for friends, siblings, couples, family resemblance, and creator content." },
    ],
    showcase: [
      {
        title: "Compare two faces online",
        description:
          "Verified Glam Scanner aligns visible facial features from two portraits and estimates how similar they appear.",
      },
      {
        title: "See shared traits and differences",
        description:
          "The report explains where faces look alike and where they differ, which makes the result more helpful than a simple percentage.",
      },
      {
        title: "Use it for family resemblance and fun content",
        description:
          "Compare parent and child photos, siblings, friends, couples, or old and new portraits for an entertaining resemblance check.",
      },
      {
        title: "Keep comparison clear and respectful",
        description:
          "The feature is for visual similarity, not identity confirmation. Clear photos and consent make the experience better.",
      },
    ],
    howTo: [
      { title: "Upload two portraits", description: "Use one clear face per image for the best comparison." },
      { title: "AI aligns features", description: "The scan compares visible landmarks and facial structure." },
      { title: "Read the resemblance report", description: "Review score, shared traits, and differences." },
    ],
    faq: [
      { question: "Can I compare family members?", answer: "Yes. Family resemblance is one of the most common use cases." },
      { question: "Do the photos need the same background?", answer: "No, but similar lighting and pose can improve the result." },
      { question: "Is this identity verification?", answer: "No. It is a resemblance and entertainment tool, not identity verification." },
      { question: "Can I compare old and new photos?", answer: "Yes. It can be fun to compare photos across time or different styles." },
      { question: "What if one face is hidden?", answer: "Both faces should be clearly visible for the best result." },
      { question: "Are uploads private?", answer: "Photos are processed for your requested scan. Review the privacy policy for retention details." },
    ],
  }, "FACIAL_RESEMBLANCE"),
  FACE_READING: withReviews({
    headline: "AI Attractiveness Test with Feature Based Ratings",
    subheadline:
      "Take an online attractiveness test that focuses on facial balance, feature harmony, and practical style notes instead of harsh judgment.",
    whyChoose: [
      { title: "Feature based rating", description: "The result connects the score to visible traits like balance, proportion, and photo quality." },
      { title: "Constructive tone", description: "The report is designed to support confidence and style decisions." },
      { title: "Visual result page", description: "Your own photo remains central, with score cards and notes around it." },
      { title: "Useful next steps", description: "Get simple ideas for grooming, camera angle, hair framing, and makeup direction." },
    ],
    showcase: [
      {
        title: "Take an attractiveness test with context",
        description:
          "Verified Glam Scanner estimates visible beauty signals and presents them in a way that is easier to understand and less judgmental.",
      },
      {
        title: "Review what supports the score",
        description:
          "Instead of only showing a number, the report explains feature harmony, balance, and photo factors that can influence the result.",
      },
      {
        title: "Use the result for styling confidence",
        description:
          "The goal is to help you choose better angles, grooming choices, and beauty details that support your look.",
      },
      {
        title: "Keep the experience healthy",
        description:
          "Attractiveness is personal. The scan is a cosmetic guide for self discovery, not a final judgment of how you look.",
      },
    ],
    howTo: [
      { title: "Upload your photo", description: "Use a front-facing image with a relaxed expression." },
      { title: "AI rates visible features", description: "The scan estimates balance, proportions, and feature harmony." },
      { title: "Explore your score", description: "Review the result, strengths, and practical style suggestions." },
    ],
    faq: [
      { question: "Is attractiveness subjective?", answer: "Yes. The tool estimates visible patterns, but real attractiveness includes personality, confidence, culture, and preference." },
      { question: "Will this hurt my confidence?", answer: "The copy and report are designed to be constructive. If scores feel unhelpful, it is best to skip this type of tool." },
      { question: "How is the score calculated?", answer: "The score is estimated from visible signals like symmetry, proportion, facial balance, and photo quality." },
      { question: "Can I retake the test?", answer: "Yes. Lighting, camera angle, expression, and grooming can change the result." },
      { question: "Do I need makeup?", answer: "No. Choose the look you want feedback on." },
      { question: "Is this professional advice?", answer: "No. It is an AI cosmetic and entertainment tool." },
    ],
  }, "FACE_READING"),
  GOLDEN_RATIO: withReviews({
    headline: "Face Golden Ratio Calculator and AI Phi Beauty Analysis",
    subheadline:
      "Upload a portrait to explore facial thirds, fifths, proportions, and golden ratio inspired harmony with clear visual guidance.",
    whyChoose: [
      { title: "Golden ratio inspired", description: "Explore classic proportion ideas applied to your own photo." },
      { title: "Visual proportion map", description: "See guides for facial thirds, fifths, balance, and harmony." },
      { title: "Educational result", description: "Learn how angle, framing, and proportions affect how a face reads in photos." },
      { title: "Balanced perspective", description: "The report treats ratios as guides, not beauty rules." },
    ],
    showcase: [
      {
        title: "Explore golden ratio face analysis online",
        description:
          "Verified Glam Scanner places proportion guidance on your photo so classical beauty ratios feel easier to understand.",
      },
      {
        title: "Read facial thirds and fifths in plain language",
        description:
          "The report explains proportional signals without forcing you to interpret technical diagrams on your own.",
      },
      {
        title: "Use proportion guidance for better photos",
        description:
          "Camera distance, lens angle, head tilt, and hair volume can change how proportions appear. The scan helps you notice those shifts.",
      },
      {
        title: "Keep beauty standards in perspective",
        description:
          "Golden ratio analysis can be interesting, but natural variation is normal. The tool is for learning, styling, and self discovery.",
      },
    ],
    howTo: [
      { title: "Upload a level portrait", description: "Keep your head straight and your face unobstructed." },
      { title: "AI measures proportions", description: "The scan estimates facial thirds, fifths, and harmony signals." },
      { title: "Review the map", description: "Study your score, visual guides, and practical photo notes." },
    ],
    faq: [
      { question: "What is the golden ratio in faces?", answer: "It is a classic proportion idea often used to discuss visual harmony in art, design, and faces." },
      { question: "Do I need to match the golden ratio exactly?", answer: "No. Real faces vary naturally, and ratios are only a guide." },
      { question: "Can hairstyle affect the result?", answer: "Yes. Hair covering the jaw, forehead, or face edges can change the visual read." },
      { question: "Is this scientific proof of beauty?", answer: "No. It is a cosmetic analysis inspired by proportion theory and should be interpreted lightly." },
      { question: "Can photographers use it?", answer: "Yes. It can help with angle, crop, and framing ideas." },
      { question: "What photo works best?", answer: "A clear, forward-facing photo with even lighting and a neutral expression is best." },
    ],
  }, "GOLDEN_RATIO"),
};

export function landingContentForFeature(featureType: FeatureType): ToolLandingContent {
  return CONTENT[featureType];
}
