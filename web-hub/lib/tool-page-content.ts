import type { CategoryId, Tool } from "@/lib/catalog";
import { GENERATION_SPECS } from "@/lib/generation-specs";
import { TOOL_FEATURES } from "@/lib/tool-features";
import { TOOL_COPY } from "@/lib/copy";

type FeatureStory = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
};

type CategoryTemplate = {
  resultLabel: string;
  heroLead: string;
  steps: [string, string, string];
  stories: [FeatureStory, FeatureStory, FeatureStory];
  goodFor: [string, string, string];
  categoryFaq: [string, string];
};

export type ToolPageContent = {
  heroTitle: string;
  heroLead: string;
  resultLabel: string;
  steps: Array<{ title: string; body: string }>;
  stories: FeatureStory[];
  goodFor: string[];
  visuals: string[];
  faqs: Array<[string, string]>;
  /** Optional SEO/conversion copy (lib/copy). Pages fall back to generic wording when absent. */
  metaTitle?: string;
  metaDescription?: string;
  howToHeading?: string;
  featuresHeading?: string;
  featuresIntro?: string;
  downloadBanner?: { title: string; body: string };
  faqHeading?: string;
  photoTip: string;
  expectation: string;
};

const EXPECTATIONS: Partial<Record<string, string>> = {
  "face-beauty-analysis": "The photo-harmony score is a subjective impression of one image, not a measurement of beauty or personal value.",
  "facial-symmetry": "The centerline and feature guides are illustrative. They are not calibrated measurements of facial symmetry.",
  "face-golden-ratio": "Phi is shown as a reference concept; the guide does not measure exact ratios or define an ideal face.",
  "attractiveness-test": "Photo harmony is subjective and can change with lighting, framing and expression. It is not a ranking of people.",
  "face-comparison": "The report describes visible styling and framing only. It cannot verify identity, kinship or a resemblance percentage.",
  "beauty-score-showdown": "The two scores are subjective photo impressions. This is not a contest, leaderboard or measure of anyone's worth.",
  "face-shape-analyzer": "The shape label is an approximation from a photograph, not an anatomical measurement or a rule for your style.",
  "skin-analysis": "The close-ups describe visible appearance only. They cannot diagnose a condition or measure hydration or skin type.",
  "seasonal-color-palette": "Lighting and screens affect color. Treat the suggested season as a direction to test in person, not an absolute classification.",
  "beauty-routine-challenge": "The seven-day plan is a set of attainable self-care ideas, not a prediction of physical change or health outcome.",
  "ai-face-enhancer": "Clarity can improve, but details absent from the source cannot be factually recovered.",
  "virtual-try-on-clothes": "The preview suggests color and drape, but it cannot tell you the garment's size, stretch or real-world fit.",
  "colored-contacts": "This is a cosmetic image preview, not advice on lens fit or eye safety. Ask an eye-care professional about real contacts.",
  "old-photo-restoration": "Restored missing details are plausible interpretations, not verified historical facts. Keep the original scan.",
  "face-blur": "Blur can obscure a face, but clothing, setting and reflections may still identify someone. Review every part before sharing.",
};

function practicalGuidance(tool: Tool) {
  const spec = GENERATION_SPECS[tool.slug];
  const photoTip = spec.inputs === 2
    ? tool.slug === "virtual-try-on-clothes"
      ? "Use a full-length or upper-body photo with the outfit area visible, plus a separate clear image of the garment. Avoid crossed arms or objects covering the clothing."
      : "Choose two clear portraits in similar light. Make sure both adults have agreed to their photos being used."
    : spec.samples === "vintage"
      ? "Scan the original print straight on at the highest quality you can. Avoid glare, cropped edges and repeated compression."
      : spec.samples === "body"
        ? "Show the complete area you want to edit, with a little space around it and no overlapping objects. Use even light."
        : tool.category === "makeup-tryon"
          ? "Use a sharp, front-facing photo in natural light. Keep the lips or eyes clear of heavy filters so the shade has a realistic starting point."
          : "Use a sharp, well-lit portrait with the whole head in frame. Avoid a strong filter, deep shadow or anything covering the relevant feature.";
  const expectation = EXPECTATIONS[tool.slug]
    ?? (spec.layout === "report"
      ? "This is a photo-based visual guide, not a medical, biometric or identity assessment. Interpret the notes with the photo's lighting and angle in mind."
      : spec.layout === "comparison"
        ? "This is a visual edit, not a guarantee of a real-world result. Compare the full before and after image before using it as a reference."
        : "This is a fictional creative image. Keep its edited nature clear when you share it and use photos only with permission.");
  return { photoTip, expectation };
}

const CATEGORY_CONTENT: Record<CategoryId, CategoryTemplate> = {
  "face-analysis": {
    resultLabel: "personal face report",
    heroLead: "Turn one clear portrait into an easy-to-read visual breakdown. Explore proportions and photo balance without changing the face in your original image.",
    steps: [
      "Choose a front-facing portrait with the full face visible and soft, even light.",
      "Start the analysis and let the preview organize the visible details into a simple report.",
      "Review the visual notes, compare each section, and save the ideas that feel useful to you.",
    ],
    stories: [
      {
        eyebrow: "A clearer read",
        title: "See the whole face and the small details together",
        body: "A good report should not leave you decoding a wall of numbers. The layout pairs the complete portrait with focused feature cards so the context stays visible.",
        points: ["Whole-face overview", "Feature-level observations", "Plain-language explanations"],
      },
      {
        eyebrow: "Your photo stays yours",
        title: "Analysis without reshaping the portrait",
        body: "The source portrait remains recognizable throughout the experience. Visual guides sit around the image instead of hiding it behind heavy effects.",
        points: ["Original portrait preserved", "Non-destructive visual overlays", "Easy side-by-side review"],
      },
      {
        eyebrow: "Useful, not absolute",
        title: "Treat the report as a creative point of view",
        body: "Lighting, expression, lens choice, and angle all affect what a camera sees. Results are framed as observations for self-discovery, never as a verdict on appearance.",
        points: ["Photo-aware context", "Respectful language", "Entertainment and styling use"],
      },
    ],
    goodFor: ["Exploring a new portrait", "Understanding photo balance", "Planning hair, makeup, or eyewear"],
    categoryFaq: ["Does the tool change my face?", "No. The analysis view adds information around your portrait; it does not reshape your uploaded face."],
  },
  "glow-up": {
    resultLabel: "personal color and style guide",
    heroLead: "Use the colors and visible details in your portrait to build a practical beauty direction you can revisit when choosing makeup, clothing, and accessories.",
    steps: [
      "Upload a portrait taken in neutral light, ideally without a strong color filter.",
      "Let the tool read the visible color relationships in your skin, hair, eyes, and overall styling.",
      "Explore the suggested palette or routine and keep the ideas that work with your taste and wardrobe.",
    ],
    stories: [
      {
        eyebrow: "Color made practical",
        title: "Move from abstract swatches to real styling ideas",
        body: "Your guide connects a focused palette to everyday choices, making it easier to imagine each color in makeup, clothing, and accessories.",
        points: ["Coordinated color families", "Wearable styling examples", "Simple combinations to try"],
      },
      {
        eyebrow: "A plan that fits",
        title: "Start small instead of replacing everything",
        body: "The experience favors useful next steps: one lip shade, one accent color, or one routine change at a time. Your existing style remains the starting point.",
        points: ["Low-pressure suggestions", "Mix-and-match ideas", "Built for everyday routines"],
      },
      {
        eyebrow: "Designed around you",
        title: "Use the guide as inspiration, not a dress code",
        body: "Personal style is personal. The result offers a visual direction while leaving room for mood, culture, occasion, and the colors you simply love wearing.",
        points: ["Flexible recommendations", "No rigid beauty rules", "Easy to revisit"],
      },
    ],
    goodFor: ["Refreshing a makeup bag", "Planning outfits", "Building a simple beauty routine"],
    categoryFaq: ["Do I have to follow every suggestion?", "Not at all. The result is a starting point for experimentation, and your own taste always comes first."],
  },
  "skin-retouch": {
    resultLabel: "natural portrait preview",
    heroLead: "Create a polished portrait preview with adjustments that support the photo rather than replacing natural skin texture and recognizable features.",
    steps: [
      "Choose a sharp portrait with even lighting and enough space around the face.",
      "Run the preview and review the suggested balance of clarity, tone, and texture.",
      "Compare the original and result before deciding whether the finish feels natural to you.",
    ],
    stories: [
      {
        eyebrow: "Keep the person",
        title: "A polished finish that still looks like the original",
        body: "The visual direction is built around restraint: refine distracting photo issues while preserving expression, facial structure, and real skin character.",
        points: ["Recognizable features", "Texture-aware finish", "Balanced contrast"],
      },
      {
        eyebrow: "Compare with confidence",
        title: "See what changed before you save anything",
        body: "A clear comparison view makes the edit understandable. You can judge the complete portrait instead of relying on an over-zoomed beauty filter.",
        points: ["Original always visible", "Full-portrait context", "Quick reset and retry"],
      },
      {
        eyebrow: "Made for real photos",
        title: "Use the preview across everyday portrait moments",
        body: "From profile photos to event pictures, the experience focuses on a clean, versatile finish rather than a single exaggerated social-media look.",
        points: ["Profile-ready portraits", "Event photo cleanup", "Subtle editorial finish"],
      },
    ],
    goodFor: ["Profile photos", "Event portraits", "Testing a softer edit before sharing"],
    categoryFaq: ["Will the result look heavily filtered?", "The design direction favors a natural finish and keeps the original available for an honest comparison."],
  },
  "hair-beard": {
    resultLabel: "personal look preview",
    heroLead: "Explore a new hair or grooming direction on your own portrait before making a real-world change. Compare the idea in context with your face and personal style.",
    steps: [
      "Upload a well-lit portrait with the hairline, jaw, and sides of the face clearly visible.",
      "Choose the direction you want to explore, then generate a visual preview on your portrait.",
      "Compare the silhouette from a distance and save a reference for your next salon or grooming visit.",
    ],
    stories: [
      {
        eyebrow: "Preview the silhouette",
        title: "Judge a look in the context of your own features",
        body: "Hair and facial hair change the outline around a face. A full-portrait view helps you assess that relationship more naturally than a disconnected style board.",
        points: ["Face-aware placement", "Full look context", "Easy visual comparison"],
      },
      {
        eyebrow: "Explore before committing",
        title: "Try a bolder direction with no awkward growing-out phase",
        body: "Use the preview as a low-pressure way to consider a different length, shape, or color before discussing the real change with a professional.",
        points: ["Risk-free exploration", "Salon conversation starter", "Multiple directions to compare"],
      },
      {
        eyebrow: "Your style, your call",
        title: "A visual reference—not a promise of an exact cut",
        body: "Hair texture, density, lighting, and professional technique affect real-world results. The preview is best used as inspiration and a communication aid.",
        points: ["Clear expectation setting", "Texture-aware framing", "Helpful reference image"],
      },
    ],
    goodFor: ["Planning a salon visit", "Comparing shapes and lengths", "Exploring a new color direction"],
    categoryFaq: ["Will the real style look exactly the same?", "The preview is an inspiration image. A stylist or barber can help adapt the idea to your hair texture, density, and routine."],
  },
  "makeup-tryon": {
    resultLabel: "virtual makeup preview",
    heroLead: "Test a new makeup direction on your portrait and see how color, finish, and intensity work with the rest of your look before reaching for a product.",
    steps: [
      "Use a front-facing photo in natural light with the relevant facial area clearly visible.",
      "Pick a shade or style direction, then generate a preview on the uploaded portrait.",
      "Compare the overall balance and use the result as a reference when choosing real products.",
    ],
    stories: [
      {
        eyebrow: "Color in context",
        title: "See the shade with your whole look—not on a generic swatch",
        body: "A color can feel completely different beside your skin tone, hair, eyes, and clothing. The portrait preview keeps all of those relationships visible.",
        points: ["Portrait-based preview", "Whole-look balance", "Multiple directions to compare"],
      },
      {
        eyebrow: "Try more, waste less",
        title: "Narrow the field before you shop",
        body: "Use the result to identify a promising color family or level of intensity. It can make a product search more focused without pretending to replace an in-person swatch.",
        points: ["Faster shade exploration", "Useful shopping reference", "Low-pressure experimentation"],
      },
      {
        eyebrow: "A realistic reference",
        title: "Keep lighting and product finish in perspective",
        body: "Screens, lighting, and real product formulas can shift color. The preview is a creative guide, so the page explains those limits alongside the result.",
        points: ["Honest color caveat", "Clear visual comparison", "Original portrait preserved"],
      },
    ],
    goodFor: ["Trying a new color family", "Planning an event look", "Narrowing product choices"],
    categoryFaq: ["Will the product color match the preview exactly?", "Not always. Screen settings, lighting, and the real formula can change how a shade appears, so use the result as a direction rather than an exact match."],
  },
  "fashion-style": {
    resultLabel: "personal style preview",
    heroLead: "Place a new style idea in the context of your own portrait. Explore proportion, color, and overall mood before making a permanent or expensive decision.",
    steps: [
      "Upload a clear photo with the area you want to style fully visible and free from heavy shadows.",
      "Add or choose the style direction you want to explore, then create the preview.",
      "Review the complete composition and keep the result as a reference for shopping or planning.",
    ],
    stories: [
      {
        eyebrow: "See the complete idea",
        title: "Move beyond imagination to a visual starting point",
        body: "The preview brings the style direction and your portrait into one frame, helping you assess the idea as a complete look rather than separate pieces.",
        points: ["Personalized context", "Color and proportion view", "Shareable reference"],
      },
      {
        eyebrow: "Plan before you commit",
        title: "Explore high-consideration choices with less pressure",
        body: "A visual concept can make it easier to refine a purchase, placement, or styling conversation before money or permanence enters the picture.",
        points: ["Low-risk experimentation", "Useful planning artifact", "More confident conversations"],
      },
      {
        eyebrow: "Keep expectations clear",
        title: "Use the result as inspiration for the real decision",
        body: "Fit, fabric, body movement, artist technique, and lighting all matter outside the screen. The result is designed to inform your next step, not guarantee it.",
        points: ["Transparent limitations", "Full-look review", "Easy comparison"],
      },
    ],
    goodFor: ["Planning a purchase", "Building a visual mood board", "Discussing an idea with a professional"],
    categoryFaq: ["Is this an exact fit or placement guarantee?", "No. The preview is a visual concept. Real materials, measurements, movement, and professional technique affect the final result."],
  },
  "fun-effects": {
    resultLabel: "creative portrait",
    heroLead: "Turn a familiar photo into a playful new character or visual style. The experience is made for experimentation, sharing, and a little creative surprise.",
    steps: [
      "Choose a clear portrait with one face visible and enough room around the head and shoulders.",
      "Pick the mood or effect you want to explore and create the preview.",
      "Review the transformation, try another direction, or save your favorite creative result.",
    ],
    stories: [
      {
        eyebrow: "Recognizable and playful",
        title: "Give the portrait a new mood without losing its personality",
        body: "The strongest creative effects keep a thread of the original expression and pose, making the transformation feel personal instead of interchangeable.",
        points: ["Portrait-led composition", "Distinct creative direction", "Share-ready framing"],
      },
      {
        eyebrow: "Built for trying again",
        title: "Explore several ideas from the same starting photo",
        body: "A simple reset-and-retry flow keeps experimentation moving. Change the direction, compare outcomes, and choose the one that best captures your sense of humor or style.",
        points: ["Fast creative iteration", "Multiple moods to explore", "Original always available"],
      },
      {
        eyebrow: "Play responsibly",
        title: "Use photos you own or have permission to transform",
        body: "Creative tools are more fun when consent is part of the process. The page keeps respectful use and clear entertainment framing close to the experience.",
        points: ["Consent-first guidance", "Entertainment use", "Clear result labeling"],
      },
    ],
    goodFor: ["Profile-picture experiments", "Party and seasonal ideas", "Sharing a playful concept with friends"],
    categoryFaq: ["Can I use someone else’s photo?", "Only use a photo you own or have permission to transform, especially before saving or sharing the result."],
  },
  "photo-tools": {
    resultLabel: "finished photo preview",
    heroLead: "Handle a focused photo task with a clean before-and-after workflow. Keep the original visible, understand the change, and decide what you want to save.",
    steps: [
      "Upload the clearest available version of the photo and check that the important areas are visible.",
      "Run the tool and let the preview apply the selected photo treatment.",
      "Inspect the result at full composition, compare it with the original, and save only when you are happy.",
    ],
    stories: [
      {
        eyebrow: "One focused job",
        title: "A simple workspace that keeps the photo at the center",
        body: "The interface removes unnecessary controls and focuses on the task at hand, making the path from upload to comparison easy to follow.",
        points: ["Clear upload state", "Visible processing step", "Straightforward result view"],
      },
      {
        eyebrow: "Compare before saving",
        title: "Keep the original close throughout the edit",
        body: "The before-and-after structure helps you spot unwanted changes and makes the result easier to judge as a complete photograph.",
        points: ["Original preserved", "Full-image context", "Reset whenever needed"],
      },
      {
        eyebrow: "Purposeful output",
        title: "Finish with a result that is ready for the next step",
        body: "Whether the goal is privacy, restoration, or composition, the result is organized around a practical use instead of an endless editing session.",
        points: ["Task-specific outcome", "Easy visual review", "Clear use guidance"],
      },
    ],
    goodFor: ["Quick photo cleanup", "Preparing an image to share", "Solving one task without a full editor"],
    categoryFaq: ["Will my original photo be overwritten?", "No. The original remains available in the preview so you can compare, reset, or leave without saving the result."],
  },
};

function visualsFor(slug: string): string[] {
  const image = `/img/results/${slug}.png`;
  return slug === "face-beauty-analysis"
    ? [image, ...[1, 2, 3].map(index => `/img/results/${slug}-detail-${index}.png`)]
    : [image, ...[1, 2, 3].map(index => `/img/results/${slug}-feature-${index}.png`)];
}

function baseToolPageContent(tool: Tool): ToolPageContent {
  const template = CATEGORY_CONTENT[tool.category];
  const spec = GENERATION_SPECS[tool.slug];
  const stories = tool.slug === "face-beauty-analysis" ? [
    { eyebrow: "", title: "A face score with the details behind it", body: "Keep a subjective photo-harmony score beside your portrait, with short observations about the outline, eye spacing and lighting. It is a creative impression of a photograph, not an objective measure of beauty.", points: [] },
    { eyebrow: "", title: "Explore your face shape and proportions", body: "Look beyond one number. Brief observations connect the overall impression to visible features, without claiming calibrated measurements from a selfie.", points: [] },
    { eyebrow: "", title: "The face in the report is still yours", body: "The report adds information around your portrait. Natural skin texture, beard detail, expression and recognizable features remain part of the image.", points: [] },
    { eyebrow: "", title: "Small observations, practical styling ideas", body: "Explore a hair or frame suggestion and save the complete report as a reference. Your own taste matters more than an AI score.", points: [] },
  ] : TOOL_FEATURES[tool.slug] || template.stories;
  const what = spec.layout === "comparison" ? "a side-by-side image of your original and a generated edit" : spec.layout === "report" ? "a visual report that keeps the supplied photo beside the relevant observations" : "one complete creative image based on the supplied photo";
  const photoAdvice = spec.samples === "body" ? "Show the complete garment or relevant body area in even light. Leave space around sleeves and arms; avoid overlapping limbs or objects that hide the area to edit." : spec.samples === "vintage" ? "Use a clear scan or a straight-on photograph of the print. Avoid glare, cropped edges and extra compression. The original subjects and era should remain visible." : "Use a clear portrait with the complete head visible in soft, even light. Avoid strong beauty filters, heavy shadows and objects covering the area this tool needs.";
  const specialty: [string, string] = tool.slug === "skin-analysis" ? ["Can this diagnose a skin condition?", "No. The report describes visible photo detail such as texture and tone variation. It cannot diagnose conditions, measure hydration or replace a clinician."]
    : tool.slug === "face-blur" ? ["Does face blur guarantee anonymity?", "No. Check the downloaded image carefully for missed faces, reflections and identifying details in clothing or surroundings. No unblurred original is included in this tool's export."]
    : tool.slug === "virtual-try-on-clothes" ? ["Will the garment fit exactly like the preview?", "No. The image explores color, pattern and apparent drape. It cannot determine size, material stretch or real-world fit."]
    : tool.category === "face-analysis" ? ["Are the scores or guides objective measurements?", "No. Any score is a subjective photo-based impression. Guides and observations are illustrative, not calibrated biometric measurements, identity verification or a judgment of personal worth."]
    : template.categoryFaq;
  return {
    heroTitle: `${tool.name} Online`,
    heroLead: `Create ${what} with ${tool.name}. Try a sample or use your own photo, review the result, and download a single PNG.`,
    resultLabel: template.resultLabel,
    ...practicalGuidance(tool),
    steps: [
      { title: spec.inputs === 2 ? "Add both images" : "Choose a photo or sample", body: spec.inputs === 2 ? `Add your photo and the ${(spec.secondLabel || "second portrait").toLowerCase()}. Sample images let you explore the same workflow before using your own.` : `Upload a JPG, PNG or WebP, or select one of the sample portraits. ${photoAdvice}` },
      { title: spec.options ? "Choose a style and generate" : "Create your result", body: spec.options ? "Pick a style, confirm permission to process the photo, and generate the preview. Your selected image is sent to OpenAI only when you run the tool." : "Confirm permission to process the selected photo, then generate. The tool sends that image to OpenAI with instructions for this specific result format." },
      { title: "Review and download", body: "Inspect the complete result at full size. Save the PNG with the photo and useful result elements already together, or change the input and try again." },
    ],
    stories,
    goodFor: template.goodFor,
    visuals: visualsFor(tool.slug),
    faqs: [
      [`What will I get from ${tool.name}?`, `You get ${what}, saved as a downloadable PNG. ${stories[0]?.body || template.heroLead}`],
      [`How do I try ${tool.name} without uploading my photo?`, "Choose a thumbnail under Try a sample. It becomes the input image for the same generation workflow. Samples are fictional adults; selecting one does not automatically start a paid request."],
      ["What kind of image should I upload?", photoAdvice + " Each file must be a still JPG, PNG or WebP under 10 MB and at least 128 pixels on each side."],
      [spec.inputs === 2 ? "Why does this tool need two images?" : "What can I choose before generating?", spec.inputs === 2 ? `This task combines information from your first photo and a ${(spec.secondLabel || "second portrait").toLowerCase()}. Both must be selected, and you need permission to use both.` : spec.options ? `The current choices are ${spec.options.join(", ")}. The selected choice is included in the same output instructions used to define the examples.` : "This tool has one focused task. Choose a suitable image and confirm permission; the output instructions are specific to this tool rather than a generic beauty filter."],
      specialty,
      ["Will my result look exactly like an example?", "The examples show the intended composition and feature treatment, not a guaranteed result. The live workflow uses your input and the same visual rules, but AI output can vary. Review details and identity preservation before saving or sharing."],
      ["Is this local preview free to generate?", "The image examples are free to view and download. Live generation uses the locally configured OpenAI API account and may incur provider charges. Website credit billing and production sign-in are not connected here."],
      ["Where do my uploaded images go?", "Selecting a photo keeps it in the browser until you generate. Generation sends the selected files to the local server and OpenAI. This local app does not write uploads or results to disk; provider data handling still applies. Download your result before leaving the page."],
      ["How long does generation take, and can I cancel?", "Generation can take a few minutes. The local preview allows one active request and limits usage to 12 starts per hour. Stop waiting cancels the browser request, but work already started with the provider may still finish and incur a charge."],
      ["Can I use a photo of someone else?", "Only use images you own or have permission to process. This preview is for adults. Get consent before transforming or sharing another person's photo, and make clear when an image has been edited."],
    ],
  };
}

export function getToolPageContent(tool: Tool): ToolPageContent {
  const base = baseToolPageContent(tool);
  const copy = TOOL_COPY[tool.slug];
  if (!copy) return base;
  return {
    ...base,
    heroTitle: copy.h1,
    heroLead: copy.heroLead,
    steps: [...copy.steps],
    // Copy stories are paired by index with the existing feature images.
    stories: copy.stories.map((story) => ({ eyebrow: "", title: story.title, body: story.body, points: story.points ? [...story.points] : [] })),
    faqs: copy.faqs,
    metaTitle: copy.metaTitle,
    metaDescription: copy.metaDescription,
    howToHeading: copy.howToHeading,
    featuresHeading: copy.featuresHeading,
    featuresIntro: copy.featuresIntro,
    downloadBanner: copy.downloadBanner,
    faqHeading: copy.faqHeading,
  };
}
