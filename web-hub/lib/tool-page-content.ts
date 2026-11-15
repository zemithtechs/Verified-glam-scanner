import type { CategoryId, Tool } from "@/lib/catalog";
import { GENERATION_SPECS } from "@/lib/generation-specs";
import { TOOL_FEATURES } from "@/lib/tool-features";
import { TOOL_COPY } from "@/lib/copy";
import { TOOL_EXPECTATIONS, TOOL_PHOTO_TIPS } from "@/lib/tool-guidance";
import { PRICING, generationsFor, money, num } from "@/lib/pricing";

type FeatureStory = {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  cta?: string;
};

type CategoryTemplate = {
  resultLabel: string;
  heroLead: string;
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
  howToIntro?: string;
  featuresHeading?: string;
  featuresIntro?: string;
  ideasHeading?: string;
  ideasIntro?: string;
  guidanceHeading?: string;
  downloadBanner?: { title: string; body: string };
  faqHeading?: string;
  photoTip: string;
  expectation: string;
};

/**
 * Plain-number credit facts, built from lib/pricing.ts so the copy cannot drift.
 * The yearly price is never stated here.
 */
const perResult = PRICING.creditsPerGeneration;
const freeResults = generationsFor(PRICING.starter.credits);
const monthlyResults = generationsFor(PRICING.monthly.credits);
export const FIRST_RESULT_FREE = "Your first result is free.";
export const CREDIT_FACTS = {
  start: `A new account starts with ${PRICING.starter.credits} free credits and one result uses ${perResult}, so you can make ${freeResults} before paying anything.`,
  monthly: `The monthly plan is ${money(PRICING.monthly.price)} for ${num(PRICING.monthly.credits)} credits, which is ${monthlyResults} results.`,
};

/** Stable per-tool choice so shared FAQ answers read differently from page to page. */
function pick<T>(slug: string, options: T[]): T {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return options[hash % options.length];
}

const EXPECTATIONS: Partial<Record<string, string>> = {
  "face-beauty-analysis": "The photo-harmony score is a subjective impression of one image. It is not a measurement of beauty or personal value.",
  "facial-symmetry": "The centerline and feature guides are illustrative. They are not calibrated measurements of facial symmetry.",
  "face-golden-ratio": "Phi is shown as a reference idea. The guide does not measure exact ratios or define an ideal face.",
  "attractiveness-test": "Photo harmony is subjective and changes with lighting, framing and expression. It is not a ranking of people.",
  "face-comparison": "The report describes visible styling and framing only. It cannot verify identity, kinship or a resemblance percentage.",
  "beauty-score-showdown": "The two scores are subjective photo impressions. This is not a contest, a leaderboard or a measure of anyone's worth.",
  "face-shape-analyzer": "The shape label is an approximation from a photograph. It is not an anatomical measurement or a rule for your style.",
  "skin-analysis": "The close-ups describe visible appearance only. They do not diagnose a condition or measure hydration or skin type.",
  "seasonal-color-palette": "Lighting and screens affect color. Treat your season as a direction to test in person, not an absolute label.",
  "beauty-routine-challenge": "The seven-day plan is a set of attainable self-care ideas. It does not predict physical change or health outcomes.",
  "ai-face-enhancer": "Clarity can improve, but details missing from the source photo cannot be recovered as fact.",
  "virtual-try-on-clothes": "The preview suggests color and drape. It cannot tell you the garment's size, stretch or real-world fit.",
  "colored-contacts": "This is a cosmetic image preview, not advice on lens fit or eye safety. Ask an eye-care professional about real contacts.",
  "old-photo-restoration": "Restored details are plausible interpretations, not verified history. Keep your original scan.",
  "hairstyle-changer": "The preview is an idea, not a promise. Real hair has its own texture, density and growth pattern, so ask your stylist what is realistic for you. Compare the before and after, and save the version you like to show them at your appointment.",
  "ai-hair-color": "The new shade is a preview on a screen. Your real color depends on the hair you start with, any earlier dye and the products your colorist uses. Take the image to your appointment and ask what it would take to get close, and how long it would last.",
  "lip-color-changer": "Screens and daylight change how a lip color looks, and real formulas vary in finish. Treat the shade as a guide to the color family you like. Test the lipstick in a shop, on your own lips, before you decide to buy it.",
  "cartoon-yourself": "The cartoon is a stylized picture and not a likeness test. Details such as hair, jewelry and clothing may change a little in the drawing. Share it as a fun image, say it is a cartoon version of a photo, and ask anyone shown before you post.",
  "ai-face-swap": "A face swap is an edited, made-up picture and never real evidence of anything. Only swap faces of adults who have agreed, never use it to mislead or embarrass anyone, and say the image is edited whenever you share it.",
  "face-blur": "Blur can hide a face, but clothing, setting and reflections may still identify someone. Check every part before you share.",
};

/** Photo advice written for each tool that shares a category with others, so no two pages carry the same tip. */
const PHOTO_TIPS: Partial<Record<string, string>> = {
  "seasonal-color-palette": "Stand by a window in daylight and take the photo without a filter. Your palette is built from your skin, hair and eye color, so makeup, tinted lighting and heavy editing can push the result toward the wrong season. Keep your hair down and your face clear.",
  "face-shape-analyzer": "Face the camera straight on with your hair pulled back from your forehead and jaw. The analyzer reads the outline of your face, so a tilted head, a fringe or a wide-angle selfie can change the shape it finds. Hold the phone at eye level and step back a little.",
  "attractiveness-test": "Choose the photo you would actually post, taken in soft light with your face fully in view. Because the score reflects one photo, a different angle or smile can change it, so try two or three pictures and compare. Skip group shots and photos with sunglasses or strong filters.",
  "skin-analysis": "Wash your face, take the photo near a window and keep the camera at eye level. The close-ups describe only what is visible, so shadows, makeup and beauty filters will hide or invent detail. A sharp picture with even light gives the notes something real to point at.",
  "hairstyle-changer": "Face the camera with your hairline, ears and shoulders in the frame, and tie back any hair that hides your face. A hat, a hood or a strong shadow across your head makes it harder to place a new cut naturally. Even daylight works better than a flash.",
  "ai-hair-color": "Show your full head of hair in even daylight, with no hat and no colored lighting. Hair color shifts easily under a warm lamp or a flash, so the shade you see may not be the shade you started with. A sharp picture helps the new color follow every strand.",
  "face-blur": "Use the original photo with every face visible, ideally at full size. Small faces at the back of a crowd are easy to miss, so zoom in and count them before you start. After the result appears, check reflections, name tags and clothing, because the tool blurs faces only.",
  "cartoon-yourself": "Choose a photo where your face is clear and your expression is easy to read, because the cartoon keeps that mood. Bright, even light and a plain background give cleaner lines. Take off sunglasses, and avoid photos where a hand or a hat covers your face.",
  "birthday-image-generator": "Pick a happy photo of the birthday person, with their permission, where the face is clear and the light is even. The tool builds the party scene around the face, so a sharp, front-facing picture works best. Group shots confuse it, so crop to one person first.",
};

const CATEGORY_PHOTO_TIPS: Record<CategoryId, (name: string) => string> = {
  "face-analysis": (name) => `For ${name}, use a straight-on portrait with your whole head in frame and soft light from the front. Take off sunglasses and pull hair back from your face. Heavy filters and deep shadows change what the camera sees, so the notes would describe the filter and not you.`,
  "glow-up": (name) => `${name} reads your skin, hair and eye color, so take the photo by a window in daylight with no filter. Skip heavy makeup if you can, and keep colored lighting out of the frame. A truer photo gives you a result you can trust in a shop.`,
  "skin-retouch": (name) => `Give ${name} a sharp portrait that shows your whole face in soft, even light. A blurry or tilted picture leaves the tool guessing, while a clear one lets it tidy small distractions and keep your real texture. Avoid beauty filters, because the edit would stack on top of them.`,
  "hair-beard": (name) => `For ${name}, show your hairline, ears and jaw with no hat, hood or glasses in the way. Face the camera and keep your hair as it normally falls. The tool needs to see the outline of your head to place a new look where it belongs.`,
  "makeup-tryon": (name) => `${name} paints the shade on the part of your face it can see, so choose a close, front-facing photo in natural light. Keep that area clear of heavy filters and strong makeup, because the preview starts from what your photo shows and is easier to judge that way.`,
  "fashion-style": (name) => `${name} works best when the part of your body you want to change is fully in view and nothing overlaps it. Stand in even light, leave a little space around the edges and avoid baggy layers, so the preview can place the idea where it will really sit.`,
  "fun-effects": (name) => `${name} keeps your face recognizable when it can see it, so choose a clear photo where your expression is easy to read. Face the camera, keep the light even and avoid sunglasses or a hand over your mouth. A clear starting photo gives the effect something real to play with.`,
  "photo-tools": (name) => `Start ${name} with the best version of the photo you have, not a screenshot or a compressed copy. A sharp file with the whole subject in view gives the tool more to work with. Check the edges, because anything cropped out cannot be repaired afterward.`,
};

const EXPECTATION_BY_CATEGORY: Record<CategoryId, (name: string) => string> = {
  "face-analysis": (name) => `${name} is a visual guide made from one photo, not a medical, biometric or identity check. Lighting, angle and expression all affect what it shows, so read the notes with that in mind and take only what is useful to you.`,
  "glow-up": (name) => `${name} gives you a styling direction from one photo and not a verdict. Screens and room light change colors, so test your favorite ideas in daylight before you buy anything.`,
  "skin-retouch": (name) => `${name} is a visual edit and not a promise of how you look in real life. Compare the full before and after image before you save it, and keep your original in case you prefer it.`,
  "hair-beard": (name) => `${name} shows an idea on your own photo. Real hair and beards grow in their own way, so use the picture as a conversation starter with your stylist or barber.`,
  "makeup-tryon": (name) => `${name} previews a look on your own face. Real products differ in finish and wear, so use the picture to narrow your choices and test the real thing before you buy.`,
  "fashion-style": (name) => `${name} shows how an idea could look on your picture. It cannot confirm size, fit or how a material moves, so check the real details before you commit.`,
  "fun-effects": (name) => `${name} makes a playful, edited image for fun. Say it is edited when you share it, and use photos only with permission from the adults in them.`,
  "photo-tools": (name) => `${name} edits one image at a time. Check the whole result before you rely on it, keep your original file, and ask anyone shown before you share.`,
};

function practicalGuidance(tool: Tool) {
  const spec = GENERATION_SPECS[tool.slug];
  const photoTip = PHOTO_TIPS[tool.slug] ?? TOOL_PHOTO_TIPS[tool.slug] ?? (spec.inputs === 2
    ? tool.slug === "virtual-try-on-clothes"
      ? "Use a full-length or upper-body photo with the outfit area visible, plus a separate clear image of the garment. Avoid crossed arms or objects covering the clothing."
      : `${tool.name} needs two clear portraits in similar light, both showing the face straight on. Make sure both adults have agreed to their photos being used, and avoid sunglasses or heavy filters on either one so the two faces match up cleanly.`
    : spec.samples === "vintage"
      ? "Scan the original print straight on at the highest quality you can. Avoid glare, cropped edges and repeated compression, because the tool can only work with the detail your scan keeps."
      : spec.samples === "body"
        ? "Show the complete area you want to edit, with a little space around it and no overlapping objects. Use even light, so the edges of the area stay easy to see."
        : CATEGORY_PHOTO_TIPS[tool.category](tool.name));
  const expectation = EXPECTATIONS[tool.slug] ?? TOOL_EXPECTATIONS[tool.slug] ?? EXPECTATION_BY_CATEGORY[tool.category](tool.name);
  return { photoTip, expectation };
}

const CATEGORY_CONTENT: Record<CategoryId, CategoryTemplate> = {
  "face-analysis": {
    resultLabel: "personal face report",
    heroLead: "Upload one clear portrait and get a visual report on your face shape, balance and photo light. The notes sit around your picture and never change your face.",
    stories: [
      {
        eyebrow: "",
        title: "You see your whole face and each detail together.",
        body: "The report puts your full portrait next to short cards for each feature, so the photo never gets lost behind numbers. Each card uses plain words. Read the overview first, then open the details that interest you. That way you can check each remark against your own picture and decide which ones feel true.",
        points: ["Whole-face overview", "Feature cards", "Plain-language notes"],
      },
      {
        eyebrow: "",
        title: "Your original photo stays exactly as you uploaded it.",
        body: "The guides and notes sit around your portrait and never change your face. You can zoom in and compare the report with your own photo at full size. Nothing is retouched unless the tool says so. Download the report and keep it beside your photo if you want a record of the difference.",
        points: ["Original portrait kept", "Notes around the photo", "Side-by-side review"],
      },
      {
        eyebrow: "",
        title: "Treat the report as a styling idea, not a verdict.",
        body: "Lighting, expression, lens and angle all change what a camera sees, so the report describes one photo and not your face for good. Use it for curiosity and for planning hair, makeup or frames. It is not medical or scientific. One clear sentence is enough here: it is an opinion about one photo, so take what helps and leave the rest.",
        points: ["Photo-aware notes", "Respectful wording", "Styling and fun use"],
      },
    ],
    goodFor: ["Exploring a new portrait", "Understanding photo balance", "Planning hair, makeup or eyewear"],
    categoryFaq: ["Does the tool change my face?", "No. The report adds notes around your portrait and leaves your uploaded face exactly as it was."],
  },
  "glow-up": {
    resultLabel: "personal color and style guide",
    heroLead: "Upload one portrait and get a color and style guide built from your own skin, hair and eyes. Use it to pick makeup, clothes and accessories with more confidence.",
    stories: [
      {
        eyebrow: "",
        title: "Abstract swatches turn into colors you can wear.",
        body: "Your result links a short palette to real choices, such as a lipstick, a blush or a scarf. Each shade sits next to your portrait, so you can judge it against your own skin, hair and eyes before you shop. Take the image shopping and skip the shades that look off in the shop light.",
        points: ["Named color families", "Wearable examples", "Easy pairings"],
      },
      {
        eyebrow: "",
        title: "Start with one change instead of a new wardrobe.",
        body: "The result points to one next step, like a single lip shade or one accent color. You keep the clothes and routine you already have and test the idea on them. If it works, add a second change later. This keeps the cost low, and you learn what suits you before you buy more.",
        points: ["One step at a time", "Mix-and-match ideas", "Fits daily routines"],
      },
      {
        eyebrow: "",
        title: "Use the guide as inspiration, not as a dress code.",
        body: "Mood, occasion and the colors you love still count. The result gives you a direction, and you decide how far to follow it. Save the image and open it again whenever you plan an outfit. It also helps to look at the result again in daylight, because screens change how colors look.",
        points: ["Flexible suggestions", "No strict rules", "Easy to revisit"],
      },
    ],
    goodFor: ["Refreshing a makeup bag", "Planning outfits", "Building a simple beauty routine"],
    categoryFaq: ["Do I have to follow every suggestion?", "No. The result is a starting point, so keep the ideas you like and skip the rest. Your own taste decides."],
  },
  "skin-retouch": {
    resultLabel: "natural portrait preview",
    heroLead: "Upload one portrait and get a polished version that still looks like you. The edit tidies the photo and keeps your real skin texture and features.",
    stories: [
      {
        eyebrow: "",
        title: "The polished finish still looks like you.",
        body: "The edit tidies distractions such as uneven light or a temporary blemish. It leaves your expression, facial structure and real skin texture alone, so freckles and fine detail stay visible and people who know you still recognize you. Compare it with your original at full size, and keep the version that feels most natural to you.",
        points: ["Recognizable features", "Real skin texture", "Balanced contrast"],
      },
      {
        eyebrow: "",
        title: "You see what changed before you save anything.",
        body: "The original sits beside the edited version, so you judge the whole portrait and not an over-zoomed close-up. If the finish feels too smooth, reset and try again with a different photo. Zoom in on your eyes, your hairline and your skin, and check that the edit did not change anything you wanted to keep.",
        points: ["Original always visible", "Full-portrait view", "Quick reset"],
      },
      {
        eyebrow: "",
        title: "One clean finish works for profile and event photos.",
        body: "A profile picture, a team page and a party photo all need a clear, natural look more than a heavy filter. This edit aims for one versatile finish that you can reuse across them. Download it once and use it on a work profile, a team page or an invitation, so you do not need a new edit for each place.",
        points: ["Profile-ready", "Event photo cleanup", "Subtle finish"],
      },
    ],
    goodFor: ["Profile photos", "Event portraits", "Testing a softer edit before sharing"],
    categoryFaq: ["Will the result look heavily filtered?", "No, the finish is meant to look natural. Your original stays beside the result so you can compare them honestly."],
  },
  "hair-beard": {
    resultLabel: "personal look preview",
    heroLead: "Upload one portrait and see a new hair or beard look on your own face before you book the appointment. Compare a few ideas and keep the one you like.",
    stories: [
      {
        eyebrow: "",
        title: "You see the new look on your own face.",
        body: "Hair and facial hair change the outline around your face. The preview places the style on your full portrait, so you can judge the shape against your forehead, jaw and eyes instead of a separate style board. Look at the picture from a few steps back too, because the outline is what people notice first.",
        points: ["Placed on your face", "Full look in view", "Easy comparison"],
      },
      {
        eyebrow: "",
        title: "Try a bolder cut without the awkward growing-out phase.",
        body: "Test a different length, shape or color on your photo first, then decide if it is worth booking. Compare a few directions side by side and keep the one that makes you smile. If the preview makes you smile, save it. If it does not, you spent a few minutes and no money.",
        points: ["No commitment", "Several looks to compare", "Salon reference"],
      },
      {
        eyebrow: "",
        title: "Bring the preview to your stylist as a reference.",
        body: "Hair texture, density and a stylist's technique decide how a real cut turns out, so treat the image as a conversation starter. Show it to your stylist and ask what would work for your hair. Real results change with your hair type and routine, so ask how much daily styling the look needs before you book.",
        points: ["Clear reference image", "Honest expectations", "Texture-aware talk"],
      },
    ],
    goodFor: ["Planning a salon visit", "Comparing shapes and lengths", "Exploring a new color direction"],
    categoryFaq: ["Will the real style look exactly the same?", "Not exactly. The preview is an inspiration image, and a stylist can adapt it to your hair texture, density and routine."],
  },
  "makeup-tryon": {
    resultLabel: "virtual makeup preview",
    heroLead: "Upload one photo and see a new makeup shade on your own face before you buy it. Compare color and intensity, then shop for the ones you liked.",
    stories: [
      {
        eyebrow: "",
        title: "You see the shade on your whole face, not a swatch.",
        body: "A color changes beside your skin, hair, eyes and clothes. The preview keeps those relationships in the picture, so you can judge the shade as part of one look before you reach for a product. Look at the full portrait, then at a close crop, and decide whether the shade still works with your hair and clothes.",
        points: ["Shown on your photo", "Whole-look balance", "Several shades to compare"],
      },
      {
        eyebrow: "",
        title: "Narrow your shopping list before you buy anything.",
        body: "Use the result to find a color family or an intensity you like, such as a soft rose or a bold berry. Then shop for two or three shades instead of testing a whole shelf. Write down the shade names you liked and take the image with you, so a shop assistant can match them.",
        points: ["Faster shade choice", "Shopping reference", "Less waste"],
      },
      {
        eyebrow: "",
        title: "Lighting and formulas change the final color.",
        body: "Screens, daylight and real product formulas can shift a shade, so the preview is a guide and not an exact match. Test the real product in person before you commit to it. A quick test on your hand or a sample from the shop will tell you more than a screen can.",
        points: ["Honest color note", "Clear comparison", "Original kept"],
      },
    ],
    goodFor: ["Trying a new color family", "Planning an event look", "Narrowing product choices"],
    categoryFaq: ["Will the product color match the preview exactly?", "Not always. Screens, lighting and the real formula can change a shade, so use the preview as a direction and test the product in person."],
  },
  "fashion-style": {
    resultLabel: "personal style preview",
    heroLead: "Upload one photo and see a new style on your own picture before you spend money on it. Check color, proportion and mood, then decide.",
    stories: [
      {
        eyebrow: "",
        title: "You see the whole idea in one frame.",
        body: "The preview puts the style next to your own portrait, so you can judge color, proportion and mood as one complete look instead of separate pieces. It is easier to decide when you can see it. Seeing it on your own picture saves you from buying something that only looks good on a model.",
        points: ["Shown on your photo", "Color and proportion", "Easy to share"],
      },
      {
        eyebrow: "",
        title: "Plan the choice before money or permanence is involved.",
        body: "A visual makes it easier to refine a purchase, a placement or a conversation with a professional. You can compare options on your photo and keep the one that feels right to you. Save the best preview and take it to the shop, the salon or the studio so the conversation starts from something real.",
        points: ["Low-risk testing", "Planning reference", "Clearer conversations"],
      },
      {
        eyebrow: "",
        title: "Use the result as inspiration for the real decision.",
        body: "Fit, fabric, movement and an artist's technique all matter outside the screen. The result helps you plan your next step. It does not promise how the real thing will look on you. Ask a professional about size, material and upkeep before you pay, and show them your preview so they can see what you want.",
        points: ["Honest limits", "Full-look review", "Easy comparison"],
      },
    ],
    goodFor: ["Planning a purchase", "Building a visual mood board", "Discussing an idea with a professional"],
    categoryFaq: ["Is this an exact fit or placement guarantee?", "No. The preview is a visual concept. Real materials, measurements, movement and professional technique affect the final result."],
  },
  "fun-effects": {
    resultLabel: "creative portrait",
    heroLead: "Upload one photo and turn it into a playful new character or style in a few minutes. Try a few moods and share the one that makes you laugh.",
    stories: [
      {
        eyebrow: "",
        title: "Your portrait gets a new mood and keeps its personality.",
        body: "The strongest effects keep a hint of your expression and pose, so the result feels like you and not like a stranger. Friends recognize you in it, which is the fun part. Share it with a friend and see whether they still guess it is you. If they laugh, the effect worked.",
        points: ["Still looks like you", "Distinct new style", "Ready to share"],
      },
      {
        eyebrow: "",
        title: "Try several ideas from the same starting photo.",
        body: "Change the effect, compare the results and keep the one that fits your sense of humor. You can reset and try again as many times as your credits allow, using the same photo. Each try uses credits, so look at the first result closely before you run another one.",
        points: ["Quick retries", "Several moods", "Original kept"],
      },
      {
        eyebrow: "",
        title: "Use photos you own or have permission to change.",
        body: "Creative tools are more fun when everyone has agreed. Only transform photos of adults who said yes, and mention that the image is edited when you share it. Ask before you edit a friend's photo, and ask again before you post it. A short yes from them keeps the fun friendly for everyone in the picture.",
        points: ["Consent first", "Fun, not factual", "Clearly labeled"],
      },
    ],
    goodFor: ["Profile-picture experiments", "Party and seasonal ideas", "Sharing a playful concept with friends"],
    categoryFaq: ["Can I use someone else's photo?", "Only if you have their permission. Ask first, especially before you save or share the result."],
  },
  "photo-tools": {
    resultLabel: "finished photo preview",
    heroLead: "Upload one photo and fix one specific problem in a few minutes. You see the result beside your original before you save anything.",
    stories: [
      {
        eyebrow: "",
        title: "One focused tool does one photo job well.",
        body: "The page asks for a photo and shows the result, with no long list of controls in between. You upload, wait a few minutes and compare. That keeps a simple fix simple. This works well when you only need one fix and do not want to learn a full photo editor first.",
        points: ["Clear upload step", "No extra controls", "Simple result view"],
      },
      {
        eyebrow: "",
        title: "Keep the original beside the new version.",
        body: "The before-and-after view helps you spot unwanted changes and judge the result as a whole photograph. Reset and retry whenever something looks off, and save only when you are happy. Download only when the result looks right, and keep your source file somewhere safe in case you want to try again.",
        points: ["Original kept", "Full-image view", "Reset any time"],
      },
      {
        eyebrow: "",
        title: "Finish with an image ready for its next job.",
        body: "Whether you want privacy, a restored print or a cleaner composition, the result is built for one practical use. Download it, share it or keep it as a reference. You get a single PNG, so you can post it, print it or add it to a document without extra steps.",
        points: ["Task-specific result", "Easy to review", "Ready to use"],
      },
    ],
    goodFor: ["Quick photo cleanup", "Preparing an image to share", "Solving one task without a full editor"],
    categoryFaq: ["Will my original photo be overwritten?", "No. Your original stays in the page so you can compare, reset or leave without saving the result."],
  },
};

/** Per-category wording for the generated banner and FAQ answers, so tool pages in different groups do not repeat each other. */
const CATEGORY_VOICE: Record<CategoryId, { bannerTitle: (name: string) => string; bannerClose: string; trySample: string; someoneElse: string; photoWhere: string }> = {
  "face-analysis": {
    bannerTitle: (name) => `Get your ${name} report on your own photo.`,
    bannerClose: "Read the full report beside your portrait before you download it.",
    trySample: "Choose a sample portrait under the upload box and the report runs on it. The people in the samples are fictional adults, and nothing is generated until you press generate.",
    someoneElse: "Only with their permission, and only for adults. Ask first, because a face report is personal even when it is just for fun.",
    photoWhere: "Your portrait stays in your browser until you press generate. Then it goes to our AI provider to make your report. Download the image before you leave the page.",
  },
  "glow-up": {
    bannerTitle: (name) => `Find your ${name} colors on your own photo.`,
    bannerClose: "Look at the swatches in daylight before you shop with them.",
    trySample: "Pick a sample portrait in the workspace to see how a palette or guide looks first. The people in the samples are fictional adults, and nothing is generated until you press generate.",
    someoneElse: "Only if the person agrees. A color guide is fun to share with a friend, so ask first and say it is a styling idea.",
    photoWhere: "Nothing leaves your browser until you run the tool. Then your photo goes to our AI provider only to build your guide. Save the PNG before you close the page.",
  },
  "skin-retouch": {
    bannerTitle: (name) => `Try ${name} on a portrait you already have.`,
    bannerClose: "Compare the edit with your original at full size before you save it.",
    trySample: "Use one of the sample portraits to see how light an edit can be. The people in the samples are fictional adults, and nothing is generated until you press generate.",
    someoneElse: "Only with their permission. Retouching someone's face without asking is not kind, so get a yes first and say the picture is edited.",
    photoWhere: "Your portrait stays in your browser until you press generate. Then it is sent to our AI provider to make the edit. Download the new image before you leave the page.",
  },
  "hair-beard": {
    bannerTitle: (name) => `See your ${name} look before you book.`,
    bannerClose: "Save the preview you like best and show it to your stylist.",
    trySample: "Pick a sample portrait to see a hair or beard preview before you use your own. The people in the samples are fictional adults, and nothing is generated until you press generate.",
    someoneElse: "Only if they say yes. A friend may enjoy seeing a new cut on their photo, but ask first and make clear it is a preview.",
    photoWhere: "Your photo stays in your browser until you press generate. Then it goes to our AI provider to build the preview. Download it before you leave the page.",
  },
  "makeup-tryon": {
    bannerTitle: (name) => `Try your ${name} shade before you buy it.`,
    bannerClose: "Check the shade in daylight, then test the real product in a shop.",
    trySample: "Choose a sample portrait to see how a shade looks before you upload your own face. The people in the samples are fictional adults, and nothing is generated until you press generate.",
    someoneElse: "Only with their permission, and only for adults. Ask first, then tell them the shade is a preview and not the real product.",
    photoWhere: "Nothing leaves your browser until you run the tool. Then your photo goes to our AI provider only to paint the preview. Save the PNG before you close the page.",
  },
  "fashion-style": {
    bannerTitle: (name) => `Preview your ${name} idea before you pay for it.`,
    bannerClose: "Take the preview with you when you check size, fabric and price.",
    trySample: "Pick a sample photo to see how the preview works before you use your own. The people in the samples are fictional adults, and nothing is generated until you press generate.",
    someoneElse: "Only if the person has agreed. Try an outfit or a design on a friend's photo only after they say yes, and tell others it is a preview.",
    photoWhere: "Your photo stays in your browser until you press generate. Then it goes to our AI provider to make the preview. Download the image before you leave the page.",
  },
  "fun-effects": {
    bannerTitle: (name) => `Make your own ${name} picture from one selfie.`,
    bannerClose: "Share it with friends once everyone in the photo has said yes.",
    trySample: "Use a sample portrait to see the effect before you try your own selfie. The people in the samples are fictional adults, and nothing is generated until you press generate.",
    someoneElse: "Only if they are in on the joke. Ask first, use photos of adults and say the picture is an effect before you post it.",
    photoWhere: "Nothing leaves your browser until you run the tool. Then your selfie goes to our AI provider only to create the effect. Save the PNG before you close the page.",
  },
  "photo-tools": {
    bannerTitle: (name) => `Fix a photo with ${name} in a few minutes.`,
    bannerClose: "Keep your original file next to the new one, just in case.",
    trySample: "Try a sample image first to see the result format. The people in the samples are fictional adults, and nothing is generated until you press generate.",
    someoneElse: "Only with permission. Restoring, blurring or merging a photo that shows other people needs their agreement, so ask before you share the result.",
    photoWhere: "Your file stays in your browser until you press generate. Then it goes to our AI provider to make the new image. Download it before you leave the page.",
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
    { eyebrow: "", title: "Your face gets a score with the details behind it.", body: "A subjective photo-harmony score sits beside your portrait, with short notes on the outline, eye spacing and lighting. It is a creative impression of one photograph, not a measure of beauty. Use the score to compare two of your own photos, and pick the one that works best for a profile.", points: [] },
    { eyebrow: "", title: "You see your face shape and proportions, not only a number.", body: "Short observations connect the overall impression to features you can see in the photo. The notes do not claim calibrated measurements from a selfie, so read them as ideas. Short notes explain what each remark is based on, so you can agree or disagree with it yourself.", points: [] },
    { eyebrow: "", title: "The face in the report is still yours.", body: "The report adds notes around your portrait. Natural skin texture, beard detail, expression and recognizable features all stay part of the image, so you can compare it with your original. The report never retouches or reshapes anything, so what you upload is what you see.", points: [] },
    { eyebrow: "", title: "Small observations turn into practical styling ideas.", body: "Try a hair or frame suggestion and save the complete report as a reference. Your own taste matters more than any score, so keep only the ideas you like. A suggestion for glasses or a fringe is easy to test, and you can come back to the saved report when you shop.", points: [] },
  ] : TOOL_FEATURES[tool.slug] || template.stories;
  const what = spec.layout === "comparison" ? "a side-by-side image of your original and a generated edit" : spec.layout === "report" ? "a visual report that keeps your photo beside the relevant notes" : "one finished image based on your photo";
  const photoAdvice = practicalGuidance(tool).photoTip;
  const second = (spec.secondLabel || "second portrait").toLowerCase();
  const specialty: [string, string] = tool.slug === "skin-analysis" ? ["Can this diagnose a skin condition?", "No. The report describes visible photo detail such as texture and tone variation. It does not diagnose conditions, measure hydration or replace a clinician."]
    : tool.slug === "face-blur" ? ["Does face blur guarantee anonymity?", "No. Check the downloaded image for missed faces, reflections and identifying details in clothing or surroundings. The export does not include an unblurred original."]
    : tool.slug === "virtual-try-on-clothes" ? ["Will the garment fit exactly like the preview?", "No. The image shows color, pattern and apparent drape. It cannot tell you size, material stretch or real-world fit."]
    : tool.category === "face-analysis" ? ["Are the scores or guides objective measurements?", "No. Any score is a subjective impression of one photo. Guides and notes are illustrative, not calibrated measurements, identity checks or a judgment of personal worth."]
    : template.categoryFaq;
  const slug = tool.slug;
  const name = tool.name;
  const voice = CATEGORY_VOICE[tool.category];
  return {
    heroTitle: `${name} Online`,
    heroLead: `${template.heroLead} ${FIRST_RESULT_FREE}`,
    resultLabel: template.resultLabel,
    ...practicalGuidance(tool),
    steps: [
      { title: spec.inputs === 2 ? "Add both of your images." : "Choose a photo or a sample.", body: spec.inputs === 2 ? `Add your photo and the ${second}. Sample images let you try the same steps before you use your own.` : `Upload a JPG, PNG or WebP, or pick one of the sample portraits. ${photoAdvice}` },
      { title: spec.options ? "Pick a style and generate." : "Press generate.", body: spec.options ? "Choose a style, confirm you have permission to use the photo, then generate. Your photo goes to our AI provider only when you run the tool." : "Confirm you have permission to use the photo, then generate. Your photo goes to our AI provider only when you run the tool." },
      { title: "Review and download your image.", body: "Check the full result at its real size. Save the PNG with your photo and the notes already together, or change the photo and try again. Look at the edges and the details before you download, and run the tool again if something looks off." },
    ],
    stories,
    goodFor: template.goodFor,
    visuals: visualsFor(slug),
    howToIntro: "Upload one photo, run the tool and download the finished image.",
    downloadBanner: {
      title: voice.bannerTitle(name),
      body: `${FIRST_RESULT_FREE} ${CREDIT_FACTS.start} ${CREDIT_FACTS.monthly} ${voice.bannerClose}`,
    },
    faqs: [
      [`What is ${name}?`, pick(slug, [
        `${name} makes ${what} from one photo you upload. The result is saved as a PNG you can download. ${stories[0]?.body || template.heroLead}`,
        `It is an AI tool that turns one uploaded photo into ${what}. You download it as a PNG. ${stories[0]?.body || template.heroLead}`,
      ])],
      [`How do I try ${name} without using my own photo?`, voice.trySample],
      ["What kind of photo should I upload?", `${photoAdvice} The file must be a still JPG, PNG or WebP under 10 MB and at least 128 pixels on each side.`],
      [spec.inputs === 2 ? "Why does this tool need two images?" : "What can I choose before I generate?", spec.inputs === 2 ? `This task combines your first photo with a ${second}. You need both images and permission to use both.` : spec.options ? `You can pick from ${spec.options.join(", ")}. Your choice is added to the instructions used to make the result.` : `Nothing to configure. ${name} does one job, so pick a suitable photo, confirm permission and run it.`],
      specialty,
      [`Is ${name} free?`, `${FIRST_RESULT_FREE} ${CREDIT_FACTS.start} ${CREDIT_FACTS.monthly} Viewing the examples and reading the guidance costs nothing.`],
      ["Where does my uploaded photo go?", voice.photoWhere],
      ["Can I use a photo of someone else?", voice.someoneElse],
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
    stories: copy.stories.map((story) => ({ eyebrow: "", title: story.title, body: story.body, points: story.points ? [...story.points] : [], cta: story.cta })),
    faqs: copy.faqs,
    metaTitle: copy.metaTitle,
    metaDescription: copy.metaDescription,
    howToHeading: copy.howToHeading,
    howToIntro: copy.howToIntro ?? base.howToIntro,
    featuresHeading: copy.featuresHeading,
    featuresIntro: copy.featuresIntro,
    ideasHeading: copy.ideasHeading,
    ideasIntro: copy.ideasIntro,
    guidanceHeading: copy.guidanceHeading,
    downloadBanner: copy.downloadBanner,
    faqHeading: copy.faqHeading,
  };
}
