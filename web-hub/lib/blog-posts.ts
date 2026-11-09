import type { CategoryId, Tool } from "@/lib/catalog";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  toolSlugs: string[];
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

/** Original, published guides. Add a post here and its category/tool associations
 * automatically place it beside relevant tool pages. */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "find-your-face-shape-from-a-photo",
    title: "How to find your face shape from a photo",
    description: "A practical way to compare forehead, cheekbones and jawline without treating face-shape labels as rigid rules.",
    category: "face-analysis",
    toolSlugs: ["face-shape-analyzer", "face-beauty-analysis", "hairstyle-changer"],
    sections: [
      { heading: "Start with a useful photo", paragraphs: ["Choose a front-facing portrait taken near eye level. Pull hair away from the sides of your face if you can, and avoid a wide-angle selfie taken very close to the camera. Lens distortion, a strong tilt and deep shadows can change the outline you are trying to see.", "You do not need a perfectly symmetrical image. You only need a clear view of the forehead, cheekbones and jaw. If the first image is heavily filtered, try a second, unedited photo before drawing a conclusion."] },
      { heading: "Compare the broad proportions", paragraphs: ["Look at which part appears widest. A wider forehead with a narrower chin can suggest a heart-like outline; similar width through the forehead, cheeks and jaw can read more square; gentle curves and a longer overall outline often read oval. Many faces sit between these descriptions.", "The label is a shorthand for discussing a silhouette, not a verdict about your features. Small changes in expression, hairstyle and camera angle can move the apparent outline from one category toward another."] },
      { heading: "Use the result as a styling reference", paragraphs: ["If you are planning a haircut, bring both your portrait and a few styles you like. A stylist can account for hair density, texture and how much time you want to spend styling it. The shape guide can help you explain what you want to emphasize, but it should not tell you which cuts you are allowed to wear.", "Try a visual hair preview before making a change. Compare the full portrait—not just the face outline—and choose the direction that feels most like you."] },
    ],
  },
  {
    slug: "what-facial-symmetry-really-shows",
    title: "What a facial symmetry preview can—and cannot—show",
    description: "Understand left-right portrait guides, camera effects and why an illustrative symmetry view is not a precise measurement.",
    category: "face-analysis",
    toolSlugs: ["facial-symmetry", "face-golden-ratio", "face-comparison"],
    sections: [
      { heading: "Every portrait has a camera angle", paragraphs: ["A symmetry preview compares visible landmarks on the two sides of a photo. It can help you notice how the brows, eyes or jaw appear in that particular frame. It cannot measure your face the way a clinical imaging system would.", "Even a slight head turn changes what the camera sees. Lighting may make one cheek look fuller, while a phone lens may stretch whichever side is closer. That is why a single photograph is a poor source for absolute claims."] },
      { heading: "Read a guide, not a grade", paragraphs: ["Natural faces are not mirror images. Expression gives one side a different shape from the other, and that is part of what makes a portrait recognizable. A visual line or side-by-side guide is best understood as a way to explore the composition of a photo.", "If a result uses a number, treat it as an illustrative photo score rather than a scientific assessment of appearance. Compare photos taken under similar conditions if you want to see how angle or lighting affects the view."] },
      { heading: "Make the next photo more consistent", paragraphs: ["Stand a little farther from the camera, keep the lens at eye level and use even light from the front. Relax your expression and take more than one frame. These simple changes can reduce the camera effects that are easy to mistake for facial differences.", "The most useful outcome is often a better understanding of your photos, not a quest for perfect symmetry."] },
    ],
  },
  {
    slug: "seasonal-color-palette-photo-guide",
    title: "A photo-first guide to seasonal color palettes",
    description: "Use a neutral-light portrait to explore color families while leaving room for personal taste and real-world fabric checks.",
    category: "glow-up",
    toolSlugs: ["seasonal-color-palette", "beauty-tips", "lip-color-changer"],
    sections: [
      { heading: "Choose a neutral starting image", paragraphs: ["Color suggestions are only as dependable as the photo they start from. Daylight near a window is useful; a colored room light or beauty filter can shift the visible tone of skin, hair and eyes. If possible, compare more than one photo taken in different neutral settings.", "Wear a simple top and avoid very bright light bouncing from nearby walls or clothing. You are trying to see color relationships, not produce a studio portrait."] },
      { heading: "Look for families, not rules", paragraphs: ["A palette groups colors that often work together. Use it to compare muted with vivid shades, and warm-looking with cool-looking combinations. A digital preview can make those differences easier to picture, but screens and fabrics do not reproduce color identically.", "There is no reason to discard a favorite color because a label places it outside a season. Try the color in a different depth, fabric or position in your outfit before deciding whether it works for you."] },
      { heading: "Try one change at a time", paragraphs: ["Start with a small experiment: a lip shade, scarf or shirt near your face. Take a photo in the same light and compare it with another option. This gives you a practical reference that is more useful than memorizing a list of permitted colors.", "A seasonal palette is a way to explore choices faster. Your preferences, culture, occasion and confidence matter just as much as a color category."] },
    ],
  },
  {
    slug: "natural-looking-portrait-retouch",
    title: "How to keep a portrait retouch looking natural",
    description: "Compare texture, light and facial detail before saving a retouched photo that still looks like the person in it.",
    category: "skin-retouch",
    toolSlugs: ["ai-skin-enhancement", "smart-beauty", "face-beauty-retouch", "ai-face-enhancer", "skin-analysis"],
    sections: [
      { heading: "Decide what the photo needs", paragraphs: ["A portrait may feel flat because of a dim room, an unusual color cast or a soft focus. Those are different problems from skin texture. Before applying any effect, identify the one or two distractions you actually want to address.", "A light adjustment to exposure or contrast can sometimes do more than a strong smoothing pass. Keep the unedited image beside the preview so it is easy to notice when the edit has gone too far."] },
      { heading: "Keep the details that make a face familiar", paragraphs: ["Freckles, fine lines and natural variation in skin tone carry personality. When they all disappear, a photo can feel less like a person and more like a plastic surface. Look at the full image as well as a close crop to judge whether the face still reads naturally.", "Pay special attention to hair edges, glasses and the boundary between skin and background. These are places where aggressive edits can become obvious even when the center of the face looks smooth."] },
      { heading: "Compare before exporting", paragraphs: ["Step away from the screen for a moment and reopen both versions. If the retouch is the first thing you notice, consider a gentler finish. A good edit supports the expression and lighting already in the frame.", "Photo-based skin tools are for visual editing and exploration. They cannot diagnose skin conditions or replace advice from a qualified professional."] },
    ],
  },
  {
    slug: "plan-a-hair-change-with-a-preview",
    title: "Plan a hair change with a photo preview",
    description: "Make a virtual hairstyle or color preview more useful before you discuss the real cut with a stylist.",
    category: "hair-beard",
    toolSlugs: ["hairstyle-changer", "ai-hair-color", "face-shape-analyzer"],
    sections: [
      { heading: "Give the preview a clear starting point", paragraphs: ["Use a portrait with the hairline and sides of the head visible. Strong shadows, a hat or hair covering much of the face can make it harder to understand how a new silhouette would sit around your features.", "A front-facing image is useful for comparing overall shape. If you are seriously considering a cut, collect a side view as well so a stylist can see your current length and texture."] },
      { heading: "Compare shape before detail", paragraphs: ["First look at the outline: where does the volume sit, and how does the length change the frame around your face? Then look at the fringe, parting or color. This order keeps you from choosing a style only because its finishing details look attractive in a mockup.", "Hair texture, density and growth pattern matter in real life. A generated image cannot promise that a cut will fall exactly the same way after a wash or without styling."] },
      { heading: "Bring a useful reference to the salon", paragraphs: ["Save the preview alongside a photo of your current hair and one or two real-world examples. Explain which part of the idea you like—the length, the shape, or the color—rather than asking for a pixel-perfect copy.", "The best preview starts a conversation. It makes an unfamiliar idea easier to describe while leaving room for professional judgment and your daily routine."] },
    ],
  },
  {
    slug: "virtual-makeup-try-on-lighting",
    title: "What to check in a virtual makeup try-on",
    description: "Use lighting, finish and whole-face balance to judge a lip or eye preview without mistaking it for an exact product swatch.",
    category: "makeup-tryon",
    toolSlugs: ["lip-color-changer", "eyeshadow-try-on", "colored-contacts"],
    sections: [
      { heading: "Start with visible features", paragraphs: ["Choose a clear portrait in even light. For lipstick, keep the lips unobscured and avoid an existing strong shade. For eye looks, a forward-facing photo with open eyes makes the placement easier to understand.", "A filtered or underexposed image can make a shade appear brighter or duller than it would in person. Try another photo before dismissing a color that surprises you."] },
      { heading: "Judge the whole look", paragraphs: ["A shade can look striking in a close crop yet feel different next to your hair, clothes and skin tone. Step back to view the full portrait. Consider whether the finish—soft, matte, glossy or bold—fits the occasion you have in mind.", "The preview is most useful for narrowing a color family. It is not a precise match to a product formula, which changes with lighting, screen settings and the material on your skin."] },
      { heading: "Use it as a shopping reference", paragraphs: ["Save one or two directions you like and compare them with real swatches when possible. If you are choosing colored contacts, follow product safety and fitting advice from a qualified eye-care professional rather than relying on a visual effect.", "A try-on should make experimentation easier, not turn beauty into a set of rules. Keep the choices that feel comfortable and interesting to you."] },
    ],
  },
  {
    slug: "virtual-outfit-preview-limits",
    title: "What a virtual outfit preview can tell you",
    description: "See where a visual try-on helps with color and silhouette—and where fabric, sizing and movement still need a real fitting.",
    category: "fashion-style",
    toolSlugs: ["virtual-try-on-clothes"],
    sections: [
      { heading: "Use a photo that shows the garment area", paragraphs: ["A clothing preview needs enough of the body in frame to place the garment. Stand naturally, keep arms from covering the outfit area when possible, and avoid a crop that cuts off the part you want to evaluate.", "If you are adding a garment reference, choose a clean image with the shape and details visible. A busy background or folded item makes it harder to imagine the complete look."] },
      { heading: "Compare the visual direction", paragraphs: ["Look at the color next to your face and the overall silhouette. A preview can help you decide whether to explore a style further or compare two ideas before shopping.", "It cannot prove how fabric drapes when you walk, where a seam will land, or whether a size will feel comfortable. Those details still require measurements, product information and, ideally, a real fitting."] },
      { heading: "Keep your decision grounded", paragraphs: ["Use the generated image as a mood-board reference rather than a purchase guarantee. Save it with notes about what you liked—the neckline, color or proportion—so you can search more intentionally.", "If the preview changes body proportions unexpectedly, rely on the original photo and the garment’s real measurements. The point is to explore an outfit, not to judge your body."] },
    ],
  },
  {
    slug: "creative-portrait-effects-responsibly",
    title: "Make a creative portrait effect feel personal",
    description: "Choose a clear source photo, keep recognizable details and use playful transformations with consent.",
    category: "fun-effects",
    toolSlugs: ["cartoon-yourself", "face-filters", "halloween-mask"],
    sections: [
      { heading: "Pick a portrait with character", paragraphs: ["A slight smile, a favorite jacket or a familiar background can make a stylized image feel specific to you. Choose a photo where the face is clear and there is enough room around the head for the effect to develop.", "Very small faces, heavy blur and strong filters leave less detail to preserve. If a result feels generic, a better starting image often helps more than adding another effect."] },
      { heading: "Try a direction, then compare", paragraphs: ["A comic portrait and a softer illustrated portrait tell different stories. Compare one creative direction at a time and ask what remained recognizable: the expression, pose, hair or personal style.", "Generated effects are interpretations, not faithful records. Keep the original photo nearby, particularly if you plan to share the result as part of a memory or profile."] },
      { heading: "Share with context and consent", paragraphs: ["Use your own image or one you have permission to transform. If someone else appears in the frame, ask before posting a stylized version of them.", "Label an altered portrait when the distinction matters. A playful result works best when the people in it understand what was changed and why."] },
    ],
  },
  {
    slug: "restore-an-old-family-photo",
    title: "How to prepare an old family photo for restoration",
    description: "Scan or photograph a print carefully, preserve the original and review restored details before sharing a family memory.",
    category: "photo-tools",
    toolSlugs: ["old-photo-restoration"],
    sections: [
      { heading: "Capture as much detail as you can", paragraphs: ["If you have a print, scan it flat at a useful resolution. If you are using a phone, place the photo on a level surface and shoot straight down in soft, even light. Avoid flash glare and strong reflections from a glossy finish.", "Do not cut away the edges too early. A border can reveal where fading, folds or missing corners begin, and that context helps you judge a restoration preview."] },
      { heading: "Keep an untouched copy", paragraphs: ["Save the original scan separately before editing. A restoration may reduce scratches, contrast loss and blur, but it can also infer details that the source no longer contains. The old image remains the most faithful record of what survives.", "Compare the faces, clothing and background in both versions. If a feature looks invented or a person no longer resembles the original, prefer a gentler result."] },
      { heading: "Add the story around the image", paragraphs: ["When sharing a restored photo with family, note who appears in it, an approximate date if known, and where the original came from. This information is often more valuable than a perfectly polished image.", "A good restoration helps a memory become easier to see while respecting the uncertainty in damaged parts of the photograph."] },
    ],
  },
];

export const getBlogPost = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug);

export function getRelatedBlogPosts(tool: Tool, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.category === tool.category || post.toolSlugs.includes(tool.slug))
    .sort((a, b) => Number(b.toolSlugs.includes(tool.slug)) - Number(a.toolSlugs.includes(tool.slug)))
    .slice(0, limit);
}
