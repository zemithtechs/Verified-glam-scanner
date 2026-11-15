import type { CategoryId, Tool } from "@/lib/catalog";

/** One piece of article content. Inline links written as [anchor](/path or https://...) work in every text field. */
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string; id?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string; source?: { label: string; url?: string } }
  | { type: "image"; src: string; alt: string; width?: number; height?: number; caption?: string; creditText?: string; creditUrl?: string; license?: string }
  | { type: "callout"; tone: "tip" | "warning" | "note"; title?: string; text: string }
  | { type: "steps"; items: Array<{ title: string; text: string }> }
  | { type: "cta"; variant: "app" | "tool"; headline: string; text?: string; label?: string; toolSlug?: string }
  | { type: "summary"; title?: string; text: string };

export type BlogSection = {
  heading: string;
  /** Anchor id; derived from the heading when left out. */
  id?: string;
  /** Plain paragraphs, rendered before `blocks`. Old posts use only this. */
  paragraphs?: string[];
  blocks?: BlogBlock[];
};

export type BlogSource = { title: string; url: string; publisher: string; accessed: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  toolSlugs: string[];
  /** ISO dates shown on the page and in BlogPosting schema. */
  published: string;
  updated: string;
  /** 4 to 7 short points. When left out they are derived from the first sentence of each section. */
  keyTakeaways?: string[];
  /** Opening paragraph shown after the Key Takeaways. */
  intro?: string;
  sections: BlogSection[];
  faqs: Array<[string, string]>;
  sources?: BlogSource[];
  /** Tool slugs to feature; defaults to toolSlugs. */
  relatedTools?: string[];
  /** Guide slugs to feature; defaults to other guides in the same category. */
  relatedPosts?: string[];
  /** Defaults to BLOG_AUTHOR. */
  author?: string;
  /** Lead picture, stored in R2 at /blog/<slug>/<file>. */
  heroImage?: { src: string; alt: string; width: number; height: number; credit?: string };
  /** Overrides for the headline of the tool and app calls to action. */
  cta?: { toolHeadline?: string; appHeadline?: string };
};

/** Author line used on every guide. Never a named person. */
export const BLOG_AUTHOR = "AI Beauty Styling editorial team";

/** Original, published guides. Add a post here and its category/tool associations
 * automatically place it beside relevant tool pages. */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "find-your-face-shape-from-a-photo",
    title: "How to Find Your Face Shape From a Photo (Step by Step)",
    description: "Oval, round, square or heart? Find your face shape from one photo, avoid the common selfie mistakes and pick hairstyles and glasses that suit you.",
    category: "face-analysis",
    toolSlugs: ["face-shape-analyzer", "face-beauty-analysis", "hairstyle-changer", "facial-landmarks"],
    published: "2026-11-01",
    updated: "2026-11-14",
    keyTakeaways: [
      "A front-facing photo at eye level is a fair starting point for comparing your forehead, cheekbones and jaw.",
      "Look at which part of the face is widest, then at how long the face is compared with its width.",
      "Selfies taken at arm's length enlarge the nose and forehead and can make the jaw look narrower.",
      "Most people recognize parts of two or three shapes, so treat a label as a styling reference, not a rule.",
      "Take two or three photos in the same light; if the answers agree, you have a working description.",
    ],
    intro: "Before you book a haircut or shop for glasses, it helps to know how to describe your face outline in plain words. This guide shows how to read the proportions from one good photo and what to do with the answer.",
    sections: [
      { heading: "Why a photo is a fair starting point", paragraphs: ["Face shape is a way of describing the outline of a face: how wide the forehead, cheekbones and jaw are in relation to each other, and how long the face looks overall. Common labels include oval, round, square, heart and diamond. They are shorthand used by stylists and makeup artists so that two people can talk about a silhouette without a ruler.", "A photograph is a reasonable place to start because it freezes the outline and lets you study it calmly. It also has limits. A camera flattens a three-dimensional head into two dimensions, and the result depends heavily on lens, distance and angle. Treat anything you read from a single picture as a first impression that you can test with a second photo."] },
      { heading: "Start with a useful photo", paragraphs: ["Choose a front-facing portrait taken near eye level. Pull hair away from the sides of your face if you can, and avoid a wide-angle selfie taken very close to the camera. Lens distortion, a strong tilt and deep shadows can change the outline you are trying to see.", "You do not need a perfectly symmetrical image. You only need a clear view of the forehead, cheekbones and jaw. If the first image is heavily filtered, try a second, unedited photo before drawing a conclusion. Soft daylight from a window in front of you works better than an overhead bulb, which carves shadows under the brows and chin."], blocks: [
        { type: "callout", tone: "tip", text: "Stand about an arm and a half from the camera, then crop the photo afterwards. Distance is the easiest fix for a distorted outline." },
      ] },
      { heading: "Compare the broad proportions", paragraphs: ["Look at which part appears widest. A wider forehead with a narrower chin can suggest a heart-like outline; similar width through the forehead, cheeks and jaw can read more square; gentle curves and a longer overall outline often read oval; widest cheekbones with a narrower forehead and jaw point toward diamond. Many faces sit between these descriptions, and that is normal.", "If you would like help looking, the [Face Shape Analyzer](/face-shape-analyzer) places an overview of your outline beside your photo so you can see which description fits best. For a more detailed look at where the main features sit, the [Facial Landmarks Map](/facial-landmarks) gives an illustrative guide to visible features. Both are visual aids for exploring a photo, not anatomical measurements.", "The label is a shorthand for discussing a silhouette, not a verdict about your features. Small changes in expression, hairstyle and camera angle can move the apparent outline from one category toward another. If you want to understand why one angle can change how balanced a face looks, read our guide to [what a facial symmetry preview can and cannot show](/blog/what-facial-symmetry-really-shows)."] },
      { heading: "Use the result as a styling reference", paragraphs: ["If you are planning a haircut, bring both your portrait and a few styles you like. A stylist can account for hair density, texture and how much time you want to spend styling it. The shape guide can help you explain what you want to emphasize, but it should not tell you which cuts you are allowed to wear.", "A visual preview makes this easier. With the [Hairstyle Changer](/hairstyle-changer) you can see a few different cuts on your own portrait and compare the full picture, not just the face outline. Our guide on how to [plan a hair change with a photo preview](/blog/plan-a-hair-change-with-a-preview) explains what to look at first.", "Glasses, necklines and earrings are also easier to think about once you know which areas of your outline you would like to balance or echo. As with hair, treat any suggestion as an idea to try rather than a rule."] },
      { heading: "Common mistakes to avoid", paragraphs: ["The most frequent mistake is judging from a selfie taken at arm's length. Close, wide-angle shots enlarge whatever is nearest the lens, usually the nose and forehead, and make the jaw look narrower. Step back, zoom in a little, and hold the phone at eye level.", "Another mistake is treating a label as a limit. Nobody needs permission to wear a fringe, a short crop or a bold frame because of a category. Labels describe common patterns; real faces are a mixture, and they change with expression, age and lighting.", "Finally, avoid comparing yourself with edited photos. Filters and beauty modes smooth and reshape the outline, so a portrait that has been through an app can give you a misleading answer. Use an untouched image whenever you can."] },
      { heading: "How the five common shapes are usually described", paragraphs: ["Oval faces are usually described as longer than they are wide, with a forehead slightly wider than the chin and softly curved edges. Round faces have similar length and width, with fuller cheeks and a rounded chin and jawline. Square faces have a broad forehead and a strong, angular jaw, with width that stays fairly even from top to bottom.", "Heart-shaped faces are widest at the forehead and taper to a narrower chin, often with high cheekbones. Diamond faces are narrowest at the forehead and jaw and widest across the cheekbones. These are descriptions of tendencies, and most people recognize parts of two or three of them in themselves."], blocks: [
        { type: "table", caption: "The five common face shapes at a glance", headers: ["Shape", "Widest point", "Jaw and chin", "Overall length"], rows: [
          ["Oval", "Slightly wider forehead than chin", "Softly curved", "Longer than wide"],
          ["Round", "Cheeks, about as wide as long", "Rounded chin and jaw", "Similar to width"],
          ["Square", "Even from forehead to jaw", "Strong, angular jaw", "Fairly even"],
          ["Heart", "Forehead", "Tapers to a narrower chin", "Medium"],
          ["Diamond", "Cheekbones", "Narrow forehead and jaw", "Medium to long"],
        ], source: { label: "Common styling descriptions, summarised by the AI Beauty Styling editorial team" } },
      ] },
      { heading: "How hair and frames change the picture", paragraphs: ["Hair has a large effect on how a face outline is perceived. A middle parting with hair tucked behind the ears shows the full forehead and jaw, while a heavy fringe hides the forehead and shortens the face. Volume at the crown adds length, and volume at the sides adds width. This is why many stylists ask to see your hair pulled back before suggesting a cut.", "Glasses work in a similar way. A frame that is wider than the cheekbones can make a face look narrower, while a very small frame can make the lower face look larger. Trying a few styles on, either in a shop or in a photo, shows you more than any label can."] },
      { heading: "What to do next", paragraphs: ["Take two or three photos in the same light with a neutral expression, run them through a shape tool if you like, and see whether the answers agree. If they do, you have a reasonable working description. If they do not, that is useful information too: it means your outline sits between categories.", "For a broader report that includes a face shape note alongside other visible features and a subjective photo-harmony impression, try [Face Beauty Analysis](/face-beauty-analysis). Remember that every score and label on this site is an entertainment-style impression of one photo, intended for adults, and not a professional or medical assessment."], blocks: [
        { type: "steps", items: [
          { title: "Take two or three photos", text: "Use the same light and a neutral expression, with the camera at eye level." },
          { title: "Compare the outline", text: "Check which part is widest and how long the face looks next to its width." },
          { title: "Try a shape tool", text: "Run the photos through the [Face Shape Analyzer](/face-shape-analyzer) and see whether the answers agree." },
        ] },
        { type: "summary", text: "A good photo, a calm look at the widest point and a second opinion from a tool give you a working description of your face shape, which is all a stylist needs." },
      ] },
    ],
    faqs: [
      ["Can a photo tell me my real face shape?", "A photo can give a useful approximation of the outline, but it cannot give an exact answer. Camera angle, lens distance, lighting and hairstyle all change how the forehead, cheeks and jaw appear. Compare two or three untouched photos taken under similar conditions before settling on a label."],
      ["Is one face shape better than another?", "No. Face shapes are descriptive labels, not rankings. They are used to talk about proportions when choosing haircuts, glasses or makeup placement, and every shape can suit every style."],
      ["Should I smile in the photo?", "A relaxed, neutral expression gives the clearest view of the jaw and cheekbones. A broad smile lifts the cheeks and shortens the lower face, which can make the outline look rounder."],
    ],
  },
  {
    slug: "what-facial-symmetry-really-shows",
    title: "Facial Symmetry Test: What Your Photo Can and Can't Show",
    description: "Is your face really symmetrical? See what a facial symmetry test from a photo shows, why camera angles fool it and how to read the result honestly.",
    category: "face-analysis",
    toolSlugs: ["facial-symmetry", "face-golden-ratio", "face-comparison", "facial-landmarks"],
    published: "2026-11-02",
    updated: "2026-11-14",
    sections: [
      { heading: "Every portrait has a camera angle", paragraphs: ["A symmetry preview compares visible landmarks on the two sides of a photo. It can help you notice how the brows, eyes or jaw appear in that particular frame. It cannot measure your face the way a clinical imaging system would.", "Even a slight head turn changes what the camera sees. Lighting may make one cheek look fuller, while a phone lens may stretch whichever side is closer. That is why a single photograph is a poor source for absolute claims, and why this site describes its guides as illustrative."] },
      { heading: "What the tool actually draws", paragraphs: ["The [Facial Symmetry Test](/facial-symmetry) lays a small set of visual guides over your portrait: a centerline, markers for the height of the eyes and brows, and a view of how the two halves of the face compare. These are there to give you context, so that a difference you notice by eye has something to be compared against.", "The guides are not calibrated. A mark that sits a few pixels higher on one side tells you something about that photograph, not about the structure of your face. If a result includes a number, read it as a subjective impression of the image, similar to how a photographer might comment on balance in a frame."] },
      { heading: "Read a guide, not a grade", paragraphs: ["Natural faces are not mirror images. Expression gives one side a different shape from the other, and that is part of what makes a portrait recognizable. A visual line or side-by-side guide is best understood as a way to explore the composition of a photo.", "People often assume that perfect symmetry is the goal. It is not. Many faces that people find striking have clear differences between the left and right sides, and a face with exactly mirrored halves can look unnatural. Treat the guide as curiosity, not as a target to reach."] },
      { heading: "Related ways to look at proportion", paragraphs: ["If you like exploring a portrait with guides, two other tools take a different view. The [Face Golden Ratio](/face-golden-ratio) tool shows face thirds and eye spacing next to the idea of phi, which is a reference concept rather than a rule of beauty. The [Facial Landmarks Map](/facial-landmarks) shows where the main features sit so you can see how the pieces fit together.", "If you have two portraits and want to see how they differ in styling, framing and visible features, [Face Comparison](/face-comparison) puts them side by side in a single report. It describes what is visible and does not identify anyone or rate who is better."] },
      { heading: "Make the next photo more consistent", paragraphs: ["Stand a little farther from the camera, keep the lens at eye level and use even light from the front. Relax your expression and take more than one frame. These simple changes can reduce the camera effects that are easy to mistake for facial differences.", "If you want to compare how lighting or angle affects the result, keep everything else the same and change just one thing between photos. Two images taken a minute apart in the same spot make a much better experiment than two photos from different years and different phones.", "For a related look at outline rather than balance, see our guide on [finding your face shape from a photo](/blog/find-your-face-shape-from-a-photo)."] },
      { heading: "Why the two sides of a face differ", paragraphs: ["Almost everyone has small differences between the two halves of the face. One eye may sit slightly higher, one brow may arch more, and the nose or jaw may lean a little to one side. Habits matter too: chewing on one side, sleeping on one side or smiling more strongly on one side all shape how a face looks over the years.", "A symmetry preview will usually find these differences, because it is built to compare the two sides. That does not mean anything is wrong. It means the tool did what it was designed to do on one frame."] },
      { heading: "Mirror images can be misleading", paragraphs: ["A popular trick is to mirror each half of a portrait to create two new faces. The results often look odd, and people are surprised that neither looks like them. The reason is simple: the face you recognize is the real one, with its natural differences, not a perfectly balanced version.", "If you try this for fun, remember that what you see depends on exactly where the centerline is placed. A small shift changes both halves, so mirror pictures are an entertaining experiment and not a measurement of anything."] },
      { heading: "Keep the result in perspective", paragraphs: ["The most useful outcome is often a better understanding of your photos, not a quest for perfect symmetry. If a guide shows a difference you like, such as a smile that lifts one side a little more, that is simply part of your expression. If you are curious about a change in your face and think it may be medical, a qualified professional is the right person to ask, not an app.", "These tools are made for adults and for entertainment and self-discovery. Scores and guides are not medical, clinical or scientific measurements."] },
    ],
    faqs: [
      ["Is a facial symmetry test accurate?", "Not in a clinical sense. The guides on this site are illustrative and depend on the angle, lighting and expression in one photo. They are good for exploring how a portrait looks, not for measuring a face."],
      ["Can my symmetry change from photo to photo?", "Yes. Head tilt, camera position, expression and lighting all shift the apparent balance of a face. Comparing photos taken under the same conditions is the best way to see what is the camera and what is the face."],
      ["Does a more symmetrical face look more attractive?", "Not necessarily. Perceived attractiveness depends on many things, including expression, grooming, light and personal taste. Slight asymmetry is normal and often part of what makes a face familiar."],
    ],
  },
  {
    slug: "seasonal-color-palette-photo-guide",
    title: "Seasonal Color Palette From a Photo: The Simple Guide",
    description: "Spring, summer, autumn or winter? Use one daylight photo to find the colors that suit you, then check them in real life before you shop.",
    category: "glow-up",
    toolSlugs: ["seasonal-color-palette", "beauty-tips", "lip-color-changer", "beauty-routine-challenge"],
    published: "2026-11-03",
    updated: "2026-11-14",
    sections: [
      { heading: "What a seasonal palette is", paragraphs: ["Seasonal color analysis sorts colors into groups named after the four seasons, usually based on how warm or cool, light or deep, and soft or clear a set of shades looks next to a person's skin, hair and eyes. The idea is that a group of colors can look harmonious on one person and less so on another. It is a popular styling framework, not a scientific law.", "The [Seasonal Color Palette](/seasonal-color-palette) tool applies this idea to a photo. It suggests a direction and shows a set of colors as a starting point for experiments with clothes, makeup and accessories. Because it works from an image, the quality of that image matters as much as anything else."] },
      { heading: "Choose a neutral starting image", paragraphs: ["Color suggestions are only as dependable as the photo they start from. Daylight near a window is useful; a colored room light or beauty filter can shift the visible tone of skin, hair and eyes. If possible, compare more than one photo taken in different neutral settings.", "Wear a simple top and avoid very bright light bouncing from nearby walls or clothing. You are trying to see color relationships, not produce a studio portrait. Remove heavy makeup if you can, and keep your hair as it normally looks."] },
      { heading: "Look for families, not rules", paragraphs: ["A palette groups colors that often work together. Use it to compare muted with vivid shades, and warm-looking with cool-looking combinations. A digital preview can make those differences easier to picture, but screens and fabrics do not reproduce color identically.", "There is no reason to discard a favorite color because a label places it outside a season. Try the color in a different depth, fabric or position in your outfit before deciding whether it works for you. A shade that looks harsh as a collar can be lovely as a bag or a scarf worn lower down."] },
      { heading: "Test colors near your face", paragraphs: ["The most reliable test is physical. Hold a few fabrics or garments under your chin in daylight and look at the whole face, not just the cloth. Notice whether your skin looks brighter and more even, or whether shadows and redness stand out. Take a photo of each option so you can compare them later without relying on memory.", "Makeup follows the same logic. If you want to see how a lip shade from your palette reads on your own picture, the [Lip Color Changer](/lip-color-changer) lets you compare a few shades before you buy one. Our guide to [what to check in a virtual makeup try-on](/blog/virtual-makeup-try-on-lighting) covers lighting and finish in more detail."] },
      { heading: "Try one change at a time", paragraphs: ["Start with a small experiment: a lip shade, scarf or shirt near your face. Take a photo in the same light and compare it with another option. This gives you a practical reference that is more useful than memorizing a list of permitted colors.", "If you would like ideas beyond color, [Personalized Beauty Tips](/beauty-tips) turns the visible features in your photo into a set of suggestions, and the [7-Day Glow-Up Challenge](/beauty-routine-challenge) offers a gentle daily routine built from your latest scan. Both are for inspiration and self-care, not for treating any condition."] },
      { heading: "Warm, cool, light, deep, soft and clear", paragraphs: ["Most seasonal systems describe color along a few simple axes. Warm colors lean yellow or golden, and cool colors lean blue or pink. Light colors are pale and airy, and deep colors are rich and dark. Soft colors are muted and slightly grayed, while clear colors are bright and saturated.", "A person is then matched to the group whose colors share the qualities of their own coloring. If you would like to practice on your own, look at two shades of the same color, such as a warm coral and a cool pink, held against your face in daylight. The one that makes your skin look more even is the one to note."] },
      { heading: "Using a palette when you shop", paragraphs: ["A palette is most useful when you are choosing something new. Instead of trying to match every item you own, use it to narrow down what you try on. Take a screenshot of your suggested colors, or save the result image, and keep it on your phone for shopping trips.", "Remember that store lighting is often very different from daylight. If you are unsure, step near a window or outside with a garment before buying it, and check the return policy. A palette should save you time and money, not add pressure."] },
      { heading: "Keep personal taste in charge", paragraphs: ["A seasonal palette is a way to explore choices faster. Your preferences, culture, occasion and confidence matter just as much as a color category. If you love a shade that sits outside your suggested group, wear it. If a palette suggests something you would never choose, you can ignore that too.", "Results on this site are entertainment-style impressions of one photograph, and the tools are for adults aged 18 and over."] },
    ],
    faqs: [
      ["Can a photo really tell me my season?", "A photo can suggest a direction, but it cannot replace trying colors in person. Screen settings, filters and room light all change how skin and hair appear, so treat the result as a starting point to test."],
      ["What if I am between two seasons?", "That is very common. Many people sit between groups, and the colors that work for them come from both. Test the in-between shades near your face in daylight and keep the ones you like."],
      ["Do I have to follow the palette for every outfit?", "No. A palette is easiest to use for pieces worn close to the face, such as tops, scarves and lip color. Trousers, shoes and bags can follow whatever you enjoy."],
    ],
  },
  {
    slug: "natural-looking-portrait-retouch",
    title: "How to Retouch a Portrait Without Making It Look Fake",
    description: "Smooth skin, fix the light and keep your real face. Learn what to adjust, what to leave alone and how to check a retouched photo before you post it.",
    category: "skin-retouch",
    toolSlugs: ["ai-skin-enhancement", "smart-beauty", "face-beauty-retouch", "ai-face-enhancer", "skin-analysis"],
    published: "2026-11-05",
    updated: "2026-11-14",
    sections: [
      { heading: "Decide what the photo needs", paragraphs: ["A portrait may feel flat because of a dim room, an unusual color cast or a soft focus. Those are different problems from skin texture. Before applying any effect, identify the one or two distractions you actually want to address.", "A light adjustment to exposure or contrast can sometimes do more than a strong smoothing pass. Keep the unedited image beside the preview so it is easy to notice when the edit has gone too far."] },
      { heading: "Pick the right kind of tool", paragraphs: ["Different tools solve different problems. [AI Skin Enhancement](/ai-skin-enhancement) is aimed at evening out tone and softening the look of blemishes while keeping real skin texture visible. [Smart Beauty Retouch](/smart-beauty) is a one-tap portrait retouch with adjustable strength, which suits a quick all-round polish. The [Face Beauty Editor](/face-beauty-retouch) lets you choose between three natural finish levels when you want finer control over smoothing and shine.", "If the real problem is that the photo is blurry or low resolution, smoothing will not help. The [AI Face Enhancer](/ai-face-enhancer) is built for sharpening soft portraits into clearer ones. Keep in mind that it can improve clarity but cannot recover details that were never in the source image."] },
      { heading: "Keep the details that make a face familiar", paragraphs: ["Freckles, fine lines and natural variation in skin tone carry personality. When they all disappear, a photo can feel less like a person and more like a plastic surface. Look at the full image as well as a close crop to judge whether the face still reads naturally.", "Pay special attention to hair edges, glasses and the boundary between skin and background. These are places where aggressive edits can become obvious even when the center of the face looks smooth."] },
      { heading: "Look at light before you look at skin", paragraphs: ["Much of what people call skin problems in a photo is actually lighting. Harsh overhead light creates shadows under the eyes and highlights on the forehead and nose. Light from a flash flattens everything and exaggerates shine. Soft window light from the front or side is far kinder, and it often removes the need for heavy editing altogether.", "If you can retake the photo, do that first. Stand facing a window, keep the camera at eye level and wipe the lens, since a smudged lens softens detail and adds a hazy glow. A better source image gives every tool a better starting point and makes a gentle edit look more convincing."] },
      { heading: "Compare before exporting", paragraphs: ["Step away from the screen for a moment and reopen both versions. If the retouch is the first thing you notice, consider a gentler finish. A good edit supports the expression and lighting already in the frame.", "Check the result at the size it will be used. A profile picture seen at thumbnail size can take a stronger edit than a large print. If you plan to share the image widely, consider saying that it has been edited, particularly if it is for professional use."] },
      { heading: "Signs that an edit has gone too far", paragraphs: ["There are a few giveaways. Skin that has no pores or texture anywhere looks like a smooth surface, not like skin. Eyes that are sharper than everything around them look unnatural, and teeth that are much whiter than the rest of the image stand out. Edges that look slightly blurred or doubled around the jaw, the hair or the shoulders suggest that an effect has bled into the background.", "Another sign is that the person looks different from how they look in real life. A good retouch makes someone look like a well-rested version of themselves on a good day, not like a different person."] },
      { heading: "A simple workflow you can repeat", paragraphs: ["First, choose the best source photo you have: sharp, evenly lit and free of heavy filters. Second, make one change at a time and compare it with the original. Third, view the result at the size you will use it and at full size. Fourth, wait a few minutes, then look again with fresh eyes.", "If a change is only visible when you flick between before and after, it is probably subtle enough to look natural. If you can see it at once, consider reducing the strength."] },
      { heading: "When to leave a photo alone", paragraphs: ["Not every photo needs editing. A candid portrait with natural light, a real smile and a bit of texture often looks better untouched than a polished version. If you find yourself reaching for an edit out of habit, try posting the original and see how it feels.", "Editing works best as a deliberate choice for a specific reason: an important profile photo, a print for a relative, or fixing one distracting detail. Used that way, it supports the photo instead of replacing it."] },
      { heading: "A note on skin health", paragraphs: ["Retouching changes how skin looks in a picture; it does not change the skin. If you are interested in looking after your skin itself, general guidance from a qualified source is a better place to start than an app. The American Academy of Dermatology publishes [advice on everyday sun protection](https://www.aad.org/public/everyday-care/sun-protection), which is a good example of the basics worth knowing.", "The [AI Skin Analysis](/skin-analysis) tool describes visible features such as texture and tone variation in a photo. It cannot diagnose a condition, measure hydration or replace a clinician. If you are worried about a mark, a change in a mole or any skin symptom, ask a doctor or dermatologist.", "Photo-based skin tools are for visual editing and exploration, made for adults, and are not medical advice."] },
    ],
    faqs: [
      ["How do I stop a retouch from looking fake?", "Use a light touch, keep skin texture visible and compare the result with the original at full size. If the edit is the first thing you notice, lower the strength or choose a gentler finish."],
      ["Will an enhancer fix a blurry photo?", "It can make a soft portrait look clearer, but it cannot recover detail that was never captured. A sharper, better-lit source photo will always give a better result."],
      ["Can a retouch tool improve my actual skin?", "No. It changes how skin looks in a picture only. For skin care, use guidance from a qualified professional or a trusted health source such as a dermatology association."],
    ],
  },
  {
    slug: "plan-a-hair-change-with-a-preview",
    title: "Preview a New Hairstyle on Your Photo: Plan the Cut First",
    description: "Thinking about a new cut or color? Learn how to use a hairstyle preview, what to show your stylist and what a preview can't tell you.",
    category: "hair-beard",
    toolSlugs: ["hairstyle-changer", "ai-hair-color", "face-shape-analyzer", "beard-styling"],
    published: "2026-11-06",
    updated: "2026-11-14",
    sections: [
      { heading: "Why preview a hair change first", paragraphs: ["A haircut or a new color is one of the easiest ways to change how you look and one of the harder things to undo. Hair grows slowly, color can be expensive to correct, and a style that looks good on a model may not suit your texture or routine. A virtual preview will not remove that risk, but it can help you rule out ideas and explain the ones you like before you sit in the chair.", "A hairstyle changer takes your own photo and shows how a different cut or color might look around your face. That is more useful than browsing pictures of other people, because the proportions, skin tone and background are yours."] },
      { heading: "Give the preview a clear starting point", paragraphs: ["Use a portrait with the hairline and sides of the head visible. Strong shadows, a hat or hair covering much of the face can make it harder to understand how a new silhouette would sit around your features.", "A front-facing image is useful for comparing overall shape. If you are seriously considering a cut, collect a side view as well so a stylist can see your current length and texture. Natural light and a plain background help the tool separate hair from everything else."] },
      { heading: "Compare shape before detail", paragraphs: ["First look at the outline: where does the volume sit, and how does the length change the frame around your face? Then look at the fringe, parting or color. This order keeps you from choosing a style only because its finishing details look attractive in a mockup.", "The [Hairstyle Changer](/hairstyle-changer) shows four distinct cuts and styles on your photo, which is enough to compare a few directions side by side. If you are not sure which outline works with your features, the [Face Shape Analyzer](/face-shape-analyzer) can give you a starting description, and our guide to [finding your face shape from a photo](/blog/find-your-face-shape-from-a-photo) explains how to use it sensibly."] },
      { heading: "Try color separately from cut", paragraphs: ["Color and cut are two separate decisions, and it helps to judge them one at a time. The [AI Hair Color Changer](/ai-hair-color) previews five shades, from natural browns to a bold pastel, on the same photo. Looking at color on its own tells you whether you like the tone against your skin and eyes without being distracted by a new shape.", "Remember that real hair color depends on your starting color, previous dye and the hair's condition. A preview shows an idea of the result, not what a colorist can achieve in one visit. Ask your stylist how many sessions a big change would take."] },
      { heading: "Beards and facial hair", paragraphs: ["The same approach works for facial hair. [AI Beard Styling](/beard-styling) previews different beard shapes and lengths on your portrait, so you can compare a short stubble with a fuller shape before you stop shaving. As with hair, texture and growth patterns vary a lot, and patchy areas may not fill in the way a preview shows."] },
      { heading: "Questions to ask before you commit", paragraphs: ["A preview shows how a style might look on one day, in one photo. Real life adds questions the picture cannot answer. How long does the style take to do each morning? Does it need regular trims, and how often? Will it suit the weather where you live? How will it look in a ponytail or when it grows out?", "Write these questions down and ask your stylist. A good stylist will be happy to talk about maintenance and will tell you honestly if a style is likely to be difficult for your hair type."] },
      { heading: "Hair color and your starting point", paragraphs: ["Color changes depend heavily on where you begin. Going from dark brown to a light pastel usually means lightening the hair first, which can take more than one visit and needs careful aftercare. Going from a light shade to a darker one is usually simpler, but it can be harder to reverse.", "Use the preview to choose a direction, such as warmer or cooler, lighter or deeper, and let a colorist suggest the way to get there safely. If you have a sensitive scalp or have had a reaction to hair dye before, say so, and ask about a patch test."] },
      { heading: "Keeping the change in proportion", paragraphs: ["Big changes feel exciting in a preview and can feel startling in the mirror. If you are unsure, take a smaller step first: a few inches off the length, a softer shade, or a fringe that can be grown out. You can always go further at the next appointment, but you cannot easily add length back.", "A friend's honest opinion is also worth asking for. Show them two or three previews and notice which one they react to, since a second view often shows you something you have missed."] },
      { heading: "Bring a useful reference to the salon", paragraphs: ["Save the preview alongside a photo of your current hair and one or two real-world examples. Explain which part of the idea you like, whether that is the length, the shape or the color, rather than asking for a pixel-perfect copy.", "Hair texture, density and growth pattern matter in real life. A generated image cannot promise that a cut will fall exactly the same way after a wash or without styling. Ask your stylist what daily care the style needs and how it will grow out.", "The best preview starts a conversation. It makes an unfamiliar idea easier to describe while leaving room for professional judgment and your daily routine."] },
    ],
    faqs: [
      ["Will my real haircut look like the preview?", "Not exactly. A preview shows an idea of a style on your photo. Your hair texture, density, growth pattern and how it is cut and styled will all affect the real result, so use it as a reference for a conversation with your stylist."],
      ["What photo works best for a hairstyle preview?", "A clear, front-facing portrait in even light with your hairline and the sides of your head visible. Avoid hats, heavy shadows and photos where hair covers much of your face."],
      ["Can I preview a color without changing my cut?", "Yes. A hair color preview changes the shade while keeping the shape of your current hair, which makes it easy to judge tone on its own."],
    ],
  },
  {
    slug: "virtual-makeup-try-on-lighting",
    title: "Virtual Makeup Try-On: How to Judge Shades Before You Buy",
    description: "Will that lipstick really suit you? Check lighting, finish and balance in a virtual makeup try-on so the shade you buy looks like the preview.",
    category: "makeup-tryon",
    toolSlugs: ["lip-color-changer", "eyeshadow-try-on", "colored-contacts", "ai-eyebrows"],
    published: "2026-11-07",
    updated: "2026-11-14",
    sections: [
      { heading: "What a virtual try-on is good for", paragraphs: ["A virtual makeup try-on applies a shade to a photo so you can judge it before you buy or apply anything. It is best at answering broad questions: is this family of colors flattering, would a bolder or softer version suit the occasion, and does this shade clash with what I usually wear? It is less good at telling you exactly how a particular product will look, because formulas, coverage and skin all vary.", "Think of it as a shortlist maker. It helps you narrow a wall of options to two or three that are worth testing in person."] },
      { heading: "Start with visible features", paragraphs: ["Choose a clear portrait in even light. For lipstick, keep the lips unobscured and avoid an existing strong shade. For eye looks, a forward-facing photo with open eyes makes the placement easier to understand.", "A filtered or underexposed image can make a shade appear brighter or duller than it would in person. Try another photo before dismissing a color that surprises you."] },
      { heading: "Lips: shade and finish", paragraphs: ["With the [Lip Color Changer](/lip-color-changer) you can try shades from soft nudes through berry to a classic red, in matte or glossy finishes. Compare at least two shades on the same photo so you are judging them against each other rather than against your memory of a lipstick.", "Look at how the shade sits next to your teeth and skin, and how bold it feels in the full portrait. A shade that looks stunning in a close crop can feel heavy in a full-face view, and the finish changes the mood: matte looks more graphic, gloss looks softer and fresher."] },
      { heading: "Eyes and brows", paragraphs: ["For eye makeup, the [Eyeshadow Try-On](/eyeshadow-try-on) shows palettes on your own eyes, which helps you judge how colors work with your eye color and lid shape. Keep your eyes open and your gaze straight ahead in the source photo, since closed or downcast eyes hide the area where the color sits.", "Brows frame the whole face, and small changes make a visible difference. [AI Eyebrows](/ai-eyebrows) lets you try different shapes and thickness. Go gently: a preview that exaggerates a shape can look striking on screen yet be very different from what your natural brows can achieve."] },
      { heading: "Colored contacts need extra care", paragraphs: ["The [Colored Contacts Try-On](/colored-contacts) shows how a different eye color, such as blue, green, hazel or gray, looks on your photo. It is a cosmetic image preview only. Real lenses are different. In the United States the FDA treats decorative contact lenses as medical devices and explains that they should be fitted and prescribed by an eye-care professional, even when they do not correct vision; see its page on [decorative contact lenses](https://www.fda.gov/medical-devices/contact-lenses/decorative-contact-lenses).", "If you are thinking about real lenses, talk to an optometrist or ophthalmologist rather than relying on a visual effect."] },
      { heading: "Lighting changes everything", paragraphs: ["Light is the single biggest reason a preview differs from reality. Warm indoor bulbs push everything toward yellow and orange, which makes a pink lipstick look more coral. Cool daylight pushes toward blue and can make a warm shade look flat. Overhead lights cast shadows around the eyes and make shadow colors look darker than they are.", "For the most reliable comparison, take your source photo near a window in the daytime, facing the light, with the camera at eye level. Try two photos in different light if you can, and see which shades are stable and which change a lot."] },
      { heading: "Screens, skin tone and swatches", paragraphs: ["Screens are another variable. Brightness, night mode and color settings change how a shade appears, so the same image can look different on two devices. Your own skin tone also affects how a color looks when it is applied, since most makeup is slightly translucent and blends with what is underneath.", "That is why a swatch on your hand or jawline in daylight is a good final check. Use the preview to narrow the choice, and the swatch to decide."] },
      { heading: "Building a simple comparison routine", paragraphs: ["A routine makes previews more trustworthy. Take one neutral photo in daylight and use it for every shade, so the only thing that changes is the color. Keep a note of the shades you try and what you thought, and give each one a quick rating from the full-face view, not just the crop.", "After a week, look again at your top two. If you still like both, they are the ones to buy as samples or swatch in a shop. If you have lost interest in one, you have saved yourself a purchase."] },
      { heading: "Judge the whole look and use it as a shopping reference", paragraphs: ["A shade can look striking in a close crop yet feel different next to your hair, clothes and skin tone. Step back to view the full portrait. Consider whether the finish, whether soft, matte, glossy or bold, fits the occasion you have in mind.", "Save one or two directions you like and compare them with real swatches when possible, ideally in daylight. If you also want to explore the colors that suit your hair and skin more generally, our guide to [seasonal color palettes](/blog/seasonal-color-palette-photo-guide) is a good companion.", "A try-on should make experimentation easier, not turn beauty into a set of rules. Keep the choices that feel comfortable and interesting to you."] },
    ],
    faqs: [
      ["Will the real lipstick look exactly like the preview?", "Not exactly. The preview is a close visual idea, but formula, finish, lighting and your own lip color all change the real result. Use it to choose a direction, then test a swatch in daylight."],
      ["Why does the same shade look different in two photos?", "Light changes how color is recorded. A warm lamp, a cool window or a phone filter can shift a shade noticeably, so compare photos taken in similar conditions."],
      ["Is it safe to buy colored contacts based on a preview?", "A preview only shows how a color might look in a picture. Contact lenses, including decorative ones, should be fitted and prescribed by an eye-care professional."],
    ],
  },
  {
    slug: "virtual-outfit-preview-limits",
    title: "Virtual Outfit Try-On: What It Shows and What It Can't",
    description: "Can you trust a virtual clothes try-on? See what it tells you about color and shape, and what only a real fitting can answer before you buy.",
    category: "fashion-style",
    toolSlugs: ["virtual-try-on-clothes", "ai-tattoo-generator", "ai-waist-slimming", "seasonal-color-palette"],
    published: "2026-11-08",
    updated: "2026-11-14",
    sections: [
      { heading: "What an outfit preview is for", paragraphs: ["Online shopping removes the fitting room, and that is the main reason people return clothes. A virtual outfit preview tries to bring part of it back: you give it a photo of yourself and an image of a garment, and it shows an image of how that garment might look on you. It is a way to explore a color, a cut or a style before you spend money.", "It is worth being clear about what that means. The result is a generated picture. It can say useful things about color and overall silhouette. It cannot say anything reliable about size, stretch, comfort or how a fabric moves."] },
      { heading: "Use a photo that shows the garment area", paragraphs: ["A clothing preview needs enough of the body in frame to place the garment. Stand naturally, keep arms from covering the outfit area when possible, and avoid a crop that cuts off the part you want to evaluate.", "If you are adding a garment reference, choose a clean image with the shape and details visible. A busy background or folded item makes it harder to imagine the complete look. A product photo on a plain background, or a garment laid flat, usually works best."] },
      { heading: "Compare the visual direction", paragraphs: ["With [Virtual Clothes Try-On](/virtual-try-on-clothes) you upload a photo and a garment and review a generated preview of the combination. Look at the color next to your face and the overall silhouette. A preview can help you decide whether to explore a style further or compare two ideas before shopping.", "It cannot prove how fabric drapes when you walk, where a seam will land, or whether a size will feel comfortable. Those details still require measurements, product information and, ideally, a real fitting."] },
      { heading: "Check color against your palette", paragraphs: ["Color is the part of an outfit a preview handles best. If you have already explored the shades that suit you with the [Seasonal Color Palette](/seasonal-color-palette), use the preview to see how a garment's color sits near your face. Our guide to [seasonal color palettes](/blog/seasonal-color-palette-photo-guide) explains how to test colors in real light so that you can confirm what you see on screen.", "Screens vary, so a rust orange on your laptop may look brighter or duller on your phone. Judge color in more than one place and read the product description."] },
      { heading: "Other style previews", paragraphs: ["Style is more than clothes. The [AI Tattoo Generator](/ai-tattoo-generator) previews one of three original tattoo motifs on your skin, which is a safe way to think about placement and size before making a permanent decision. Treat it as a mood-board tool: a real tattoo artist will adapt the design to your body and skin.", "The [Silhouette Preview](/ai-waist-slimming) shows how a garment's fit shapes your silhouette. It is meant for exploring how clothes sit, not for judging your body. If a preview changes proportions in a way that does not match you, trust your original photo and the garment's real measurements."] },
      { heading: "Getting a better source photo", paragraphs: ["The quality of a try-on depends on the photo you start with. A straight-on image with your full torso visible and your arms relaxed at your sides gives the tool the clearest view of where a top or dress would sit. Tight, plain clothing underneath helps, because loose layers can confuse the placement of the new garment.", "Avoid mirror selfies with a phone covering your body, strong backlight that turns you into a silhouette, and angles taken from below or above, which distort proportions. A friend taking the photo from a short distance often gives a much better result than a selfie."] },
      { heading: "Questions a preview cannot answer", paragraphs: ["Even a convincing image leaves a list of practical questions. Does the fabric stretch or hold its shape? Is it see-through under bright light? Will it wrinkle in the first hour? Does the size chart match your measurements? Is the garment cut for a different height?", "Read reviews with photos from real customers, check the material and care label, and measure a garment you already own and like to compare it with the size chart. The preview tells you how an idea might look, and the details tell you whether it will work."] },
      { heading: "Using previews responsibly and kindly", paragraphs: ["Previews should make shopping calmer, not more critical. If you notice that you are judging your body against an image, close the tab and come back later. The tool is there to explore color and style, and clothes should be chosen because they feel good, not because they match an ideal.", "If you are previewing clothes for another person, such as a gift, only use a photo you have permission to use, and let them choose what they actually wear."] },
      { heading: "Keep your decision grounded", paragraphs: ["Use the generated image as a mood-board reference rather than a purchase guarantee. Save it with notes about what you liked, whether that was the neckline, color or proportion, so you can search more intentionally.", "Before you buy, check the size chart, the fabric content and the return policy. If the preview changes body proportions unexpectedly, rely on the original photo and the garment's real measurements. The point is to explore an outfit, not to judge your body.", "Tools on this site are made for adults and for entertainment and self-discovery, and a generated preview is not a guarantee of fit or appearance."] },
    ],
    faqs: [
      ["Does a virtual try-on show how clothes will really fit?", "No. It shows an image of color, pattern and apparent drape. Size, stretch, comfort and movement need measurements, product details and, ideally, a real fitting."],
      ["What kind of photo should I use?", "A clear photo of you standing naturally, with the area where the garment would sit visible and not covered by arms or objects. Even light and a plain background help."],
      ["Can I preview a garment I have not bought yet?", "Yes, if you have a clear image of it, such as a product photo. The preview is a visual idea of how it could look and should be combined with the real size and material information."],
    ],
  },
  {
    slug: "creative-portrait-effects-responsibly",
    title: "Fun AI Portrait Effects: Make Them Personal and Stay Safe",
    description: "Cartoon, filter or face swap? Pick a clear source photo, keep your features recognizable and use playful AI effects with consent.",
    category: "fun-effects",
    toolSlugs: ["cartoon-yourself", "face-filters", "halloween-mask", "birthday-image-generator", "elf-name-generator", "ai-fortune-teller", "pregnant-filter"],
    published: "2026-11-09",
    updated: "2026-11-14",
    sections: [
      { heading: "Why playful effects are worth doing well", paragraphs: ["Creative portrait effects are the lightest part of AI photo editing. They turn a selfie into a cartoon, a seasonal costume or a birthday card, and most of the time they are meant to be shared with friends. A small amount of care makes the difference between a result that feels like you and one that looks like any other filtered image.", "Most of that care happens before you press the button: choosing the right photo, picking an effect that fits the occasion, and thinking about who will see the result."] },
      { heading: "Pick a portrait with character", paragraphs: ["A slight smile, a favorite jacket or a familiar background can make a stylized image feel specific to you. Choose a photo where the face is clear and there is enough room around the head for the effect to develop.", "Very small faces, heavy blur and strong filters leave less detail to preserve. If a result feels generic, a better starting image often helps more than adding another effect."] },
      { heading: "Try a direction, then compare", paragraphs: ["A comic portrait and a softer illustrated portrait tell different stories. [Cartoon Yourself](/cartoon-yourself) turns a selfie into anime, 3D or comic art, so you can compare a few directions from the same photo. Ask what remained recognizable: the expression, pose, hair or personal style.", "Generated effects are interpretations, not faithful records. Keep the original photo nearby, particularly if you plan to share the result as part of a memory or profile. If you want a lighter touch than a full cartoon, [AI Face Filters](/face-filters) offers trending effects in one tap."] },
      { heading: "Seasonal and occasion ideas", paragraphs: ["Some effects belong to a moment. The [AI Halloween Mask](/halloween-mask) adds spooky masks and makeup for October, and the [Birthday Image Generator](/birthday-image-generator) creates a personalized card from a photo, which makes a nicer message than a generic template.", "If you enjoy fantasy, the [Elf Name Generator](/elf-name-generator) gives you an elf name and portrait, and the [AI Fortune Teller](/ai-fortune-teller) offers a playful face-reading fortune. Both are for fun only. They do not predict anything and should never be taken as advice."] },
      { heading: "Pranks need extra thought", paragraphs: ["Some effects are made for jokes between friends. The [Pregnancy Joke Filter](/pregnant-filter) is one of them. A joke about pregnancy can land very differently depending on who sees it, and it can be painful for people who are trying to conceive, have lost a pregnancy or are dealing with something private. Use it only on your own photo or with the clear, enthusiastic agreement of the person in it, and think before posting anywhere public."] },
      { heading: "Keeping the original in the picture", paragraphs: ["Creative effects are more fun when you can still see yourself in them. A cartoon of you should keep your smile, your hair shape or your glasses. If you cannot recognize yourself, try a source photo with a clearer expression, or a closer crop of the face.", "It also helps to change one thing at a time. If you apply a cartoon effect, a mask and a filter in sequence, little of the original survives. Pick one idea, enjoy it, and save the rest for another day."] },
      { heading: "Thinking about where the result will go", paragraphs: ["A result that is fine in a group chat may not be suitable for a work profile, a school page or a public post. Think about the audience first. Stylized images of real people can be reshared far beyond the original conversation, and once an image is out it is difficult to take back.", "For anything you plan to post publicly, check that you are comfortable with it staying online for years. If you are making something for someone else, such as a birthday card, ask them what they would like and respect their answer."] },
      { heading: "Choosing the right effect for the moment", paragraphs: ["It helps to start from the purpose. A cartoon avatar suits a profile picture or a fun message to friends. A seasonal mask suits a party invitation. A fortune or a fantasy name suits a game night. Matching the effect to the occasion makes the result feel intentional, and it keeps you from posting something that does not fit the place where it will appear.", "Try two or three options on the same photo and keep the one that makes you smile. If none of them do, try a different photo. A relaxed, natural expression usually transforms better than a stiff pose, because the effect has more of your personality to work with."] },
      { heading: "Share with context and consent", paragraphs: ["Use your own image or one you have permission to transform. If someone else appears in the frame, ask before posting a stylized version of them. This matters for children, too: avoid uploading photos of other people's kids without a parent's agreement.", "Label an altered portrait when the distinction matters, for example on a profile or in a news-like context where people might take it for a real photo. A playful result works best when the people in it understand what was changed and why.", "Tools on this site are made for adults aged 18 and over. If you want to share a group photo while keeping bystanders private, the [Face Blur](/face-blur) tool can obscure faces, though you should review the result carefully before posting."] },
    ],
    faqs: [
      ["Which photo gives the best cartoon or filter result?", "A clear, well-lit portrait where the face is large in the frame and there is space around the head. Avoid heavy filters, small faces and strong blur."],
      ["Do the fortune and name tools predict anything?", "No. They are entertainment. The fortune and fantasy name are generated for fun and have no connection to your future or personality."],
      ["Can I use a friend's photo?", "Only with their permission. Ask before transforming or sharing someone else's image, and say clearly that the picture has been edited."],
    ],
  },
  {
    slug: "restore-an-old-family-photo",
    title: "How to Restore an Old Family Photo Without Ruining It",
    description: "Torn, faded or water damaged? Learn what to do first, how to scan it safely and which repair route to choose. Free and AI options compared.",
    category: "photo-tools",
    toolSlugs: ["old-photo-restoration", "ai-face-enhancer", "face-blur", "merge-portraits"],
    published: "2026-11-10",
    updated: "2026-11-15",
    heroImage: {
      src: "/posts/restore-an-old-family-photo/old-photo-restoration-before-and-after.webp",
      alt: "Cracked sepia couple portrait next to its restored black and white version",
      width: 1400,
      height: 788,
      credit: "Result made with AI Beauty Styling Old Photo Restoration",
    },
    keyTakeaways: [
      "A wet, stuck-together or moldy photo is an emergency. Don't scan it and don't pull it apart. NEDCC says mold can start within 48 hours in warm, humid air, and stuck prints need a conservator.",
      "Hold prints by the edges with clean, dry hands. No tape, glue, paper clips, rubber bands or sticky album pages, and blow loose dust off with a bulb blower, not canned air or a brush.",
      "Scan flat and save a TIFF. The top level in the FADGI archive guidelines is 600 ppi, which is an archive standard and more than most home projects need.",
      "Keep the first scan untouched and repair a copy. Free editors fix dust and small scratches. AI restoration is faster on fading and cracks.",
      "AI restoration invents plausible detail where the photo has none, so compare every face with the original before you share the result.",
      "Keep the original print after scanning, and back the scan up with the 3-2-1 rule: three copies, two kinds of storage, one stored off-site.",
      "Our Old Photo Restoration costs 5 credits per result, and the 10 free credits on a new account cover two results. It's one option among several, compared below. Colorizing is a separate, optional step, and it guesses.",
    ],
    intro: "Restoring an old family photo starts before any software: somebody hands you a shoebox, or one portrait has a crease through a face you love. Software matters less than order. Protect the print first, scan second, repair a copy last. This guide covers each step, says when to stop and call a conservator, and compares free, AI and professional options fairly, including ours.",
    sections: [
      {
        heading: "Work out what kind of damage you have first",
        id: "damage-guide",
        blocks: [
          { type: "p", text: "Dust and fading you can fix at home. Wet or stuck prints can't wait. Wet or pest-infested items need quick action, and stuck-together items, mold, many loose pieces and rolled items that tear when opened are all reasons to call a conservator ([National Archives](https://www.archives.gov/preservation/family-archives/repairing.html))." },
          { type: "table", caption: "A damage-by-damage decision guide for old prints", headers: ["What you see", "First step with the print", "Best repair route", "Call a conservator?"], rows: [
            ["Dust and light scratches", "Blow dust off with a bulb blower", "Scan, then a free editor or AI restore", "No"],
            ["Fading or yellowing", "Leave it alone and store it away from light", "Scan, then AI restore or a tone fix in an editor", "No"],
            ["Creases and cracks", "Don't flatten it by force", "Scan flat, then AI restore or an editor", "Only if it's rolled and tears as you open it"],
            ["Torn in pieces", "No tape or glue; keep the pieces together", "Scan each piece, join them in an editor, then repair", "Yes if there are many pieces"],
            ["Missing corner or face", "Scan what's left", "Photo editor or a professional restorer; AI will guess", "Optional"],
            ["Stains and spots", "Don't scrub or use cleaners", "Scan, then an editor or AI restore", "Yes if it could be mold"],
            ["Wet or stuck together", "Don't scan or pull apart", "Conservator first", "Yes, now"],
            ["Mold", "Don't try to clean it", "Conservator first", "Yes"],
          ], source: { label: "Compiled by us from National Archives and NEDCC guidance; the repair routes are our advice", url: "https://www.archives.gov/preservation/family-archives/repairing.html" } },
          { type: "h3", text: "If the photo is wet, stuck or moldy, stop here", id: "wet-photos" },
          { type: "p", text: "NEDCC's emergency leaflet says mold can grow within 48 hours at 60% relative humidity and 70F, so a wet photo can't wait for the weekend. Its advice for photos that are stuck together or stuck to glass is to bag them while still damp and freeze them, then consult a conservator. Don't peel them apart. If the prints are separate and you can air dry, the leaflet says to rinse only if the print is visibly dirty and the emulsion is intact, in a tray of clean water, then spread the photos out face up with air moving over them ([NEDCC Leaflet 3.7](https://nedcc.org/free-resources/preservation-leaflets/3.-emergency-management/3.7-emergency-salvage-of-wet-photographs))." },
          { type: "image", src: "/posts/restore-an-old-family-photo/water-damaged-print-gelatin-dissolved.webp", alt: "A black and white photo of a cathedral whose gelatin layer has dissolved and dripped, stuck to a backing board", width: 1400, height: 949, caption: "Water-damaged print: the gelatin has dissolved and dripped. A print in this state needs a conservator, not a scanner.", creditText: "Heritage Preservation Department, Minnesota Historical Society (photo by Bob Herskovitz), CC BY-SA 4.0, via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Water-damaged_photo_materials-01.jpg", license: "CC BY-SA 4.0" },
          { type: "callout", tone: "warning", title: "Take a phone photo of the damage first", text: "NEDCC advises it before and during salvage. And if you still have the negative or a digital file, saving the wet print may not be the best use of your time. Prints stuck hard to album pages should be removed by a conservator; the American Institute for Conservation has a Find a Professional directory, linked from the National Archives page above." },
          { type: "image", src: "/posts/restore-an-old-family-photo/moldy-photo-album-page-water-spotting.webp", alt: "An album page of six small black and white photos held by corner mounts, covered in dark spots from water damage or mold", width: 1400, height: 942, caption: "Spotting like this on an album page can be mold or water damage. A conservator can tell which and what's safe to do.", creditText: "Heritage Preservation Department, Minnesota Historical Society (photo by Bob Herskovitz), CC BY-SA 4.0, via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Water-damaged_photo_materials-18.jpg", license: "CC BY-SA 4.0" },
          { type: "cta", variant: "tool", headline: "Restore this photo in a few minutes", text: "Once your print is dry and scanned, upload the scan to Old Photo Restoration. New accounts start with 10 free credits, enough for two results.", label: "Open Old Photo Restoration", toolSlug: "old-photo-restoration" },
        ],
      },
      {
        heading: "Handle the print gently and skip the home fixes",
        id: "handle-with-care",
        blocks: [
          { type: "p", text: "The Library of Congress says to handle photographs by the edges with clean hands or clean nitrile gloves, and to avoid touching the image area ([Library of Congress](https://www.loc.gov/preservation/care/photo.html)). Skin oils can bleach a print or leave a silver mirror (NEDCC). The don't list matters more than the do list, in our view: tape, glue and wet cleaning are the usual home mistakes." },
          { type: "h3", text: "What to do" },
          { type: "list", items: [
            "Work on a clean, flat surface with clean, dry hands.",
            "Remove loose dust with an air bulb blower. The Library of Congress says even soft brushes can scratch, and recommends against canned air.",
            "If you must write on a print, use a soft graphite pencil on the back near the edge. Labeling the folder or sleeve is better.",
            "Keep negatives separate from prints.",
          ] },
          { type: "h3", text: "What not to do" },
          { type: "list", items: [
            "Don't use tape, glue, sticky notes, paper clips or rubber bands. Pressure-sensitive tape, rubber cement, rusting clips and dry rubber bands all damage photographs (NEDCC).",
            "Don't leave prints on self-stick or magnetic album pages. Self-stick pages are acidic and can bond to photos (NEDCC).",
            "Don't try to fix a torn photo with tape on either side. Scan the pieces and repair the image digitally instead.",
            "Don't force a curled print flat. Tightly curled materials must not be forced to lay flat (FADGI).",
            "Don't store prints in an attic, basement or near a vent, radiator or exterior wall.",
            "Don't use vacuum thermal drying on wet photographs. Gelatin prints can mottle and stick (NEDCC).",
          ] },
        ],
      },
      {
        heading: "Scan old photos flat, at high resolution, as a TIFF",
        id: "scan-old-photos",
        blocks: [
          { type: "p", text: "FADGI, the US federal guidelines for digitizing cultural heritage, sets 600 ppi as its top level for prints and photographs, saved as TIFF or JPEG 2000 ([FADGI Technical Guidelines, third edition, 2023](https://www.digitizationguidelines.gov/guidelines/FADGITechnicalGuidelinesforDigitizingCulturalHeritageMaterials_ThirdEdition_05092023.pdf)). That's an archive standard, not a home requirement. At home, 600 dpi is a good default: more detail for the repair tool and room to enlarge. (ppi means pixels per inch, and scanner software often uses dpi for the same thing.) Expect big files: a 4 x 6 inch print at 600 ppi in 16-bit color is roughly 50 MB uncompressed." },
          { type: "table", caption: "FADGI levels for scanning prints and photographs", headers: ["Level", "Resolution", "Bit depth"], rows: [
            ["1 star", "200 ppi", "8 bit"],
            ["2 star", "250 ppi", "8 bit"],
            ["3 star", "400 ppi", "8 or 16 bit"],
            ["4 star", "600 ppi", "16 bit"],
          ], source: { label: "FADGI Technical Guidelines for Digitizing Cultural Heritage Materials, section 3.8", url: "https://www.digitizationguidelines.gov/guidelines/FADGITechnicalGuidelinesforDigitizingCulturalHeritageMaterials_ThirdEdition_05092023.pdf" } },
          { type: "image", src: "/posts/restore-an-old-family-photo/flatbed-scanner-lid-open.webp", alt: "A flatbed photo scanner with its lid open, showing the empty glass bed", width: 1400, height: 1187, caption: "A flatbed scanner gives the flattest, most even capture. Dust on the glass ends up in your file, so wipe it first.", creditText: "Santeri Viinamäki, CC BY-SA 4.0, via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Epson_V850_scanner_open_20230920.jpg", license: "CC BY-SA 4.0" },
          { type: "h3", text: "A flatbed scanning checklist", id: "scanning-checklist" },
          { type: "steps", items: [
            { title: "Clean the glass, not the photo", text: "Wipe the scanner glass and blow loose dust off the print with a bulb. FADGI notes that dust and dirt on the glass end up in the file." },
            { title: "Place the print face down, square to the edges", text: "Don't press a curled or fragile print flat. FADGI's rule for any risk to the original is to stop immediately and seek assistance." },
            { title: "Choose 600 dpi, color mode, and 16 bit if offered", text: "FADGI says black and white prints are to be scanned in color at its upper levels (3 star and up), because subtle tone and color differences are part of a print's character. For a wallet-size print, MemoryCherish suggests 1200 dpi." },
            { title: "Turn off the scanner's dust removal and auto enhancement", text: "FADGI says a digitized master should show the original as it was at capture, and lists removing dust, stains and scratches among the edits to avoid. Switch off the scanner's automatic dust and scratch removal, and do your repairs on a copy." },
            { title: "Scan the whole border and save as TIFF", text: "The border shows where fading, folds or missing corners begin. Save a TIFF as your master and make a smaller JPEG for sharing." },
            { title: "Name the file and keep it untouched", text: "The National Archives suggests only letters A to Z, hyphens or underscores and no spaces, plus who, what, where and when in the metadata. Work on a copy from now on." },
          ] },
          { type: "h3", text: "No scanner? Photograph it or use a scanning app", id: "no-scanner" },
          { type: "p", text: "A phone works if you control the light. Lay the print on a flat surface by a window, turn the flash off, hold the camera straight above the print and fill the frame. Take several shots and keep the sharpest. Google PhotoScan, listed on Google Play, takes multiple shots to remove glare, crops automatically and saves to Google Photos. It only scans: it won't repair anything ([Google Play listing](https://play.google.com/store/apps/details?id=com.google.android.apps.photos.scanner))." },
          { type: "h3", text: "Torn photos: scan every piece", id: "torn-photos" },
          { type: "p", text: "To fix a torn photo, scan each piece separately and flat, then join them in an editor on a copy. Never tape the back. A seam in the image is easy to retouch. Tape on the back is almost impossible to undo. If you have many fragments, the National Archives suggests asking a conservator." },
          { type: "image", src: "/posts/restore-an-old-family-photo/album-page-with-torn-hole-two-photos.webp", alt: "An old brown album page with two small black and white photos of a tree-lined promenade and a large torn hole where a third photo once sat", width: 1400, height: 1143, caption: "Missing areas, like this torn hole in an album page, are the hardest to repair, because nothing is left to restore.", creditText: "Unknown author, public domain, via Wikimedia Commons", creditUrl: "https://commons.wikimedia.org/wiki/File:Hungarian_family_photo_album,_page_20.jpg", license: "Public domain" },
        ],
      },
      {
        heading: "Free and paid ways to restore an old family photo, compared",
        id: "restoration-options",
        blocks: [
          { type: "p", text: "There isn't one best way to restore an old family photo. A scanning app, a photo editor, an AI restore tool and a professional each solve a different part of the job. Where we couldn't confirm a price, we say so." },
          { type: "table", caption: "Restoration options compared, as checked on 2026-11-15", headers: ["Option", "Good for", "Cost", "Where it falls short"], rows: [
            ["Phone scan app (Google PhotoScan)", "Glare-free scans without a scanner", "Free to install on Google Play", "Scans only, repairs nothing"],
            ["Free photo editor (GIMP, Google Photos editor)", "Dust, small scratches, tone, joining torn pieces", "Free", "Manual work; GIMP has a steeper learning curve, in our view. Google Photos lists general edit tools, not restoration"],
            ["Full photo editor (Adobe Photoshop)", "Detailed manual repair", "We could not confirm pricing; check Adobe's pricing page", "Takes skill and time"],
            ["Other AI enhancer (MyHeritage Photo Enhancer)", "Face-focused enhancing", "We could not confirm pricing", "Same limit as every AI tool: it invents detail"],
            ["Old Photo Restoration (ours)", "Scratches, fading and blur in family photos, in the browser", "5 credits per result; 10 free credits for a new account (two results); $10 a month for 200 credits", "Guesses where the photo has no information; not for wet or stuck prints"],
            ["Professional restorer", "Missing areas, hard cases, large prints", "One vendor says from $38 per photo and quotes studios at $50 to $500; get a written quote", "Cost and waiting time"],
            ["Conservator", "Wet, stuck, moldy or fragile originals", "Quote-based, price not published", "Treats the physical print; doesn't retouch the image"],
          ], source: { label: "Vendor pages and Google Play, read 2026-11-15; professional price from MemoryCherish", url: "https://memorycherish.com/how-to-restore-old-photos/" } },
          { type: "p", text: "A free editor like [GIMP](https://www.gimp.org/) is enough for dust and small scratches if you're patient. AI restoration is quicker for fading, cracks and blur across a whole portrait. A professional is worth paying for when a face is missing or the photo is the only record of someone. Treat the vendor price range as a rough guide: it comes from one company's marketing page." },
        ],
      },
      {
        heading: "Restore an old family photo with Old Photo Restoration",
        id: "old-photo-restoration-steps",
        blocks: [
          { type: "p", text: "Our [Old Photo Restoration](/old-photo-restoration) tool repairs scratches, fading and blur in old family photos. The pair at the top of this page is one of its results: the cracks and creases are gone, and the faces and glasses are sharper. Notice that the restored version came back in black and white, not the sepia of the print, so check the tone matches what you want." },
          { type: "steps", items: [
            { title: "Upload a copy of your scan", text: "Use the JPEG made from your untouched TIFF, with the whole photo in frame." },
            { title: "Run the restoration", text: "Each result costs 5 credits. A new account starts with 10 free credits, which covers two results." },
            { title: "Compare it with your scan", text: "Zoom in on faces, hair and clothing, and keep the version that stays closer to the original." },
            { title: "Sharpen a soft face if needed", text: "If a face is still blurry, the [AI Face Enhancer](/ai-face-enhancer) works on portraits, with the same caution about invented detail." },
          ] },
          { type: "cta", variant: "app", headline: "Scan and restore from your phone", text: "Prefer your phone? Get the AI Beauty Styling app on Google Play, or use the web app in any browser.", label: "Get it on Google Play" },
          { type: "p", text: "The monthly plan is $10 for 200 credits, which is 40 results (see [pricing](/pricing)). If you want two relatives in one picture, [Merge Portraits](/merge-portraits) can blend two separate portraits, and you should get their permission and label the result as a composite." },
        ],
      },
      {
        heading: "Repair in the right order, then colorize or print if you want to",
        id: "repair-order",
        blocks: [
          { type: "p", text: "Scanning before repairing is like photographing a room before you clean it: you keep a record of how things were. After that, order saves time. This sequence is our own advice, not a standard." },
          { type: "steps", items: [
            { title: "Scan and save the master", text: "A TIFF, untouched, stored where you won't edit it." },
            { title: "Make a working copy", text: "Crop to the photo edges and fix overall tone, brightness and contrast first." },
            { title: "Repair the big damage", text: "Cracks, creases and tears, with an editor or an AI restorer." },
            { title: "Clean up dust and small spots last", text: "They're quick to fix once the big problems are gone." },
            { title: "Retouch lightly and export", text: "Save a JPEG for sharing, and keep both the master and the working copy." },
          ] },
          { type: "h3", text: "Should you colorize a black and white photo?", id: "colorize" },
          { type: "p", text: "Only if you want a keepsake version, and only on a copy. A colorizer has to guess the color of clothes, skin and walls, and it can't know them. FADGI lists colorization among the edits to avoid on a master, so keep your black and white scan as the record. Say it's colorized when you share it." },
          { type: "h3", text: "How big can you print a restored photo?", id: "print-size" },
          { type: "p", text: "A common rule of thumb is about 300 pixels per inch for a good photo print. A 4 x 6 inch print scanned at 600 ppi is 2400 x 3600 pixels, so it can be printed at 8 x 12 inches and still reach 300 ppi. Past that, an upscaler adds pixels, not real detail, so check faces at full size before you order a large print." },
        ],
      },
      {
        heading: "Check the restored photo for invented detail before you share it",
        id: "check-the-result",
        blocks: [
          { type: "p", text: "AI restoration works by generating a cleaner picture, so where the damage has removed information, the tool makes a plausible guess. Every AI restorer does this, ours included. It can smooth a crack well, and it can also give someone a slightly different nose. Our guide to [keeping a retouch natural](/blog/natural-looking-portrait-retouch) covers the same instinct for modern portraits." },
          { type: "list", items: [
            "Put the scan and the result side by side at full size and look at the eyes, the mouth and the hairline.",
            "Check small text, jewelry and patterns. These are the details most likely to be invented.",
            "Ask a relative who knew the person. A face that's technically clean but doesn't look like them is a failed restoration.",
            "Prefer the gentler result when two versions disagree.",
            "Keep both files. A master should show the original as captured, not what it may once have looked like if restored (FADGI).",
          ] },
          { type: "callout", tone: "note", title: "A short privacy note before you share", text: "Old family photos often show people who never agreed to be online, including children and relatives who have died. Before posting, think about who is in the picture. [Face Blur](/face-blur) can hide faces of bystanders you don't want to share, and our guide to [creative portrait effects](/blog/creative-portrait-effects-responsibly) covers consent. Services differ in how they treat uploads, so read each privacy page before uploading a photo you'd mind seeing elsewhere." },
        ],
      },
      {
        heading: "Store the original and back up the scan with the 3-2-1 rule",
        id: "store-and-back-up",
        blocks: [
          { type: "p", text: "Keep the original print after you digitize it. The National Archives says digital files have their own preservation risks and can easily be lost, and it recommends the 3-2-1 rule: three copies, stored on two different media, with one copy located off-site ([National Archives](https://www.archives.gov/preservation/family-archives/digitizing.html)). In practice that's your original TIFF on your computer, a copy on an external drive, and a third in cloud storage or at a relative's house." },
          { type: "p", text: "For the print itself, the Library of Congress recommends 70F or below and 30 to 50% relative humidity, with humidity changing by less than 5% in 24 hours. Use enclosures that pass ISO 18902, including the Photographic Activity Test, and avoid attics, basements and exterior walls. NEDCC says chemical deterioration roughly doubles with each 10F rise in temperature, so cool and steady beats warm and changeable." },
          { type: "summary", text: "Triage first, scan flat, repair a copy, check every face, and keep the original." },
          { type: "cta", variant: "tool", headline: "Try your first restoration free", text: "Upload your scan to Old Photo Restoration and compare the result with the original. Your first two results are covered by the 10 free credits.", label: "Restore a photo", toolSlug: "old-photo-restoration" },
        ],
      },
    ],
    faqs: [
      ["Can old, damaged photos be restored?", "Yes, most can. Dust, fading, scratches and creases repair well from a good scan. Missing areas are harder because nothing is left to restore, so a tool has to guess. Wet, stuck or moldy prints need a conservator first, before any scanning, because the original is the one thing you can't replace."],
      ["What dpi should I scan old photos at?", "600 dpi is a safe choice. FADGI's top level for prints is 600 ppi, with 400 ppi at the level below. That's an archive standard, so a lower setting works for a casual copy, but 600 gives a repair tool more detail and lets you enlarge. Save the master as a TIFF."],
      ["Should I clean an old photo before scanning?", "No, only remove loose dust. Use an air bulb blower, not canned air or a brush, because the Library of Congress says even soft brushes can scratch photographs. Never wipe or wet-clean a dry print at home. Wipe the scanner glass instead, since dust on the glass ends up in your scan."],
      ["Can I fix a torn photo with tape?", "No. NEDCC lists pressure-sensitive tape and rubber cement among the materials that damage photographs, and tape is almost impossible to undo. Scan each piece separately and flat, join them in an editor on a copy, and keep the physical pieces together in a clean folder. Many fragments call for a conservator."],
      ["How do I save water damaged photos?", "Act fast. NEDCC says mold can grow within 48 hours at 60% relative humidity and 70F. Photos stuck together should be bagged while damp and frozen, then shown to a conservator. Don't pull them apart. Separate prints can be air dried face up with air moving over them."],
      ["Can AI restore a photo with a missing face?", "It can generate a face, but not the real one. AI fills gaps with plausible detail, not recovered detail, so the result may look like someone else. For a missing face, a human restorer working from other photos of that person is a safer choice. Compare the result with relatives' memories."],
      ["How much does professional photo restoration cost?", "Vendors quote roughly tens to a few hundred dollars per photo. One vendor says from $38 per photo and puts studios at $50 to $500, but that's marketing, not an independent survey. We couldn't find a neutral price survey, so ask for a written quote and a sample before you commit."],
      ["Do I keep the original photo after scanning?", "Yes. The National Archives says digital files have their own preservation risks and can easily be lost, and a better restoration may be possible later. Store the print somewhere cool and stable, away from attics and basements, and back up the scan with the 3-2-1 rule."],
      ["Is Old Photo Restoration free?", "You can try it free. A new account starts with 10 credits and each result costs 5 credits, so that's two free results. After that, the monthly plan is $10 for 200 credits, which is 40 results. Other tools in the comparison table have their own pricing."],
    ],
    relatedTools: ["old-photo-restoration", "ai-face-enhancer", "face-blur", "merge-portraits"],
    relatedPosts: ["natural-looking-portrait-retouch", "creative-portrait-effects-responsibly"],
    sources: [
      { title: "Care, Handling and Storage of Photographs", url: "https://www.loc.gov/preservation/care/photo.html", publisher: "Library of Congress", accessed: "2026-11-15" },
      { title: "Leaflet 5.3: Care of Photographs", url: "https://nedcc.org/free-resources/preservation-leaflets/5.-photographs/5.3-care-of-photographs", publisher: "Northeast Document Conservation Center (NEDCC)", accessed: "2026-11-15" },
      { title: "Leaflet 3.7: Emergency Salvage of Wet Photographs", url: "https://nedcc.org/free-resources/preservation-leaflets/3.-emergency-management/3.7-emergency-salvage-of-wet-photographs", publisher: "Northeast Document Conservation Center (NEDCC)", accessed: "2026-11-15" },
      { title: "Repairing and Conserving Family Archives", url: "https://www.archives.gov/preservation/family-archives/repairing.html", publisher: "National Archives", accessed: "2026-11-15" },
      { title: "Digitizing Family Archives", url: "https://www.archives.gov/preservation/family-archives/digitizing.html", publisher: "National Archives", accessed: "2026-11-15" },
      { title: "Technical Guidelines for Digitizing Cultural Heritage Materials, Third Edition", url: "https://www.digitizationguidelines.gov/guidelines/FADGITechnicalGuidelinesforDigitizingCulturalHeritageMaterials_ThirdEdition_05092023.pdf", publisher: "Federal Agencies Digital Guidelines Initiative (FADGI)", accessed: "2026-11-15" },
      { title: "Google PhotoScan", url: "https://play.google.com/store/apps/details?id=com.google.android.apps.photos.scanner", publisher: "Google Play", accessed: "2026-11-15" },
      { title: "Edit photos in Google Photos", url: "https://support.google.com/photos/answer/6128850", publisher: "Google Photos Help", accessed: "2026-11-15" },
      { title: "GIMP", url: "https://www.gimp.org/", publisher: "GIMP project", accessed: "2026-11-15" },
      { title: "MyHeritage Photo Enhancer", url: "https://www.myheritage.com/photo-enhancer", publisher: "MyHeritage", accessed: "2026-11-15" },
      { title: "How to restore old photos", url: "https://memorycherish.com/how-to-restore-old-photos/", publisher: "MemoryCherish (vendor, source of the professional price claim)", accessed: "2026-11-15" },
    ],
  },];

export const getBlogPost = (slug: string) => BLOG_POSTS.find((post) => post.slug === slug);

/** Hand-picked guides for each tool, most relevant first. A tool lists only guides that fit it, and never more than two. */
const TOOL_GUIDES: Record<string, string[]> = {
  "face-beauty-analysis": ["find-your-face-shape-from-a-photo", "what-facial-symmetry-really-shows"],
  "facial-symmetry": ["what-facial-symmetry-really-shows", "find-your-face-shape-from-a-photo"],
  "face-golden-ratio": ["what-facial-symmetry-really-shows", "find-your-face-shape-from-a-photo"],
  "attractiveness-test": ["find-your-face-shape-from-a-photo", "natural-looking-portrait-retouch"],
  "face-comparison": ["what-facial-symmetry-really-shows", "natural-looking-portrait-retouch"],
  "beauty-score-showdown": ["natural-looking-portrait-retouch"],
  "face-shape-analyzer": ["find-your-face-shape-from-a-photo", "plan-a-hair-change-with-a-preview"],
  "skin-analysis": ["natural-looking-portrait-retouch"],
  "facial-landmarks": ["what-facial-symmetry-really-shows", "find-your-face-shape-from-a-photo"],
  "seasonal-color-palette": ["seasonal-color-palette-photo-guide", "virtual-makeup-try-on-lighting"],
  "beauty-tips": ["seasonal-color-palette-photo-guide"],
  "beauty-routine-challenge": ["seasonal-color-palette-photo-guide"],
  "ai-skin-enhancement": ["natural-looking-portrait-retouch"],
  "smart-beauty": ["natural-looking-portrait-retouch"],
  "face-beauty-retouch": ["natural-looking-portrait-retouch"],
  "ai-face-enhancer": ["natural-looking-portrait-retouch", "restore-an-old-family-photo"],
  "ai-face-slimming": ["natural-looking-portrait-retouch"],
  "hairstyle-changer": ["plan-a-hair-change-with-a-preview", "find-your-face-shape-from-a-photo"],
  "ai-hair-color": ["plan-a-hair-change-with-a-preview", "seasonal-color-palette-photo-guide"],
  "beard-styling": ["plan-a-hair-change-with-a-preview", "find-your-face-shape-from-a-photo"],
  "beard-remover": ["plan-a-hair-change-with-a-preview"],
  "hair-loss-simulation": ["plan-a-hair-change-with-a-preview"],
  "bald-filter": ["plan-a-hair-change-with-a-preview"],
  "lip-color-changer": ["virtual-makeup-try-on-lighting", "seasonal-color-palette-photo-guide"],
  "eyeshadow-try-on": ["virtual-makeup-try-on-lighting", "seasonal-color-palette-photo-guide"],
  "colored-contacts": ["virtual-makeup-try-on-lighting"],
  "ai-eyelashes": ["virtual-makeup-try-on-lighting"],
  "ai-eyebrows": ["virtual-makeup-try-on-lighting"],
  "ai-lip-enhancement": ["virtual-makeup-try-on-lighting"],
  "virtual-try-on-clothes": ["virtual-outfit-preview-limits", "seasonal-color-palette-photo-guide"],
  "ai-tattoo-generator": ["creative-portrait-effects-responsibly"],
  "ai-waist-slimming": ["virtual-outfit-preview-limits"],
  "cartoon-yourself": ["creative-portrait-effects-responsibly"],
  "face-filters": ["creative-portrait-effects-responsibly"],
  "facial-expression-changer": ["creative-portrait-effects-responsibly"],
  "age-gender-swap": ["creative-portrait-effects-responsibly"],
  "ai-face-swap": ["creative-portrait-effects-responsibly"],
  "square-face-filter": ["creative-portrait-effects-responsibly"],
  "big-head-effect": ["creative-portrait-effects-responsibly"],
  "halloween-mask": ["creative-portrait-effects-responsibly"],
  "pregnant-filter": ["creative-portrait-effects-responsibly"],
  "birthday-image-generator": ["creative-portrait-effects-responsibly"],
  "ai-fortune-teller": ["creative-portrait-effects-responsibly"],
  "elf-name-generator": ["creative-portrait-effects-responsibly"],
  "old-photo-restoration": ["restore-an-old-family-photo", "natural-looking-portrait-retouch"],
  "face-blur": ["restore-an-old-family-photo", "creative-portrait-effects-responsibly"],
  "merge-portraits": ["creative-portrait-effects-responsibly"],
};

/** One-sentence blurbs per guide. Each has several phrasings, and the tool name makes the sentence specific to the page. */
const GUIDE_BLURBS: Record<string, string[]> = {
  "find-your-face-shape-from-a-photo": ["Check your face shape by hand first, then see how {tool} reads the same photo.", "A plain guide to reading your outline, so your {tool} result makes sense.", "Learn what a face shape label means in practice before you act on {tool}.", "Start here if you want to know which outline {tool} is looking at.", "Follow these steps on your photo and compare them with what {tool} shows."],
  "what-facial-symmetry-really-shows": ["See what a symmetry guide can and cannot show before you read your {tool} result.", "A calm look at why faces are never perfectly even, written for {tool} users.", "Learn how camera angle can fake asymmetry, then run {tool} with that in mind.", "Read this before you decide what {tool} says about the two sides of your face.", "Understand the centerline guide that {tool} draws on your portrait."],
  "seasonal-color-palette-photo-guide": ["Learn how daylight and bare skin change the colors you see, then try {tool} again.", "A photo-first guide to seasons, written for people using {tool}.", "See how a palette is read from a photo before you shop with your {tool} result.", "Read how to take a photo that gives {tool} a fair view of your coloring.", "Find out why one season is only a starting point, whatever {tool} shows."],
  "natural-looking-portrait-retouch": ["Learn how to keep a retouch natural, then judge your {tool} result with fresh eyes.", "See which details to leave alone when you use {tool} on a portrait.", "A guide to light edits that still look like you, written for {tool}.", "Check your edit against this list before you save the {tool} version.", "Read how to compare the original and the edit when you use {tool}."],
  "plan-a-hair-change-with-a-preview": ["Plan your hair change from a photo before you act on {tool}.", "See how to turn a preview into a clear request for your stylist after {tool}.", "Learn what a photo preview cannot tell you about real hair, then use {tool}.", "A short guide to choosing a change you will still like after {tool}.", "Read how to talk to your stylist with your {tool} image in hand."],
  "virtual-makeup-try-on-lighting": ["See how light changes color on screen, then check your {tool} result in daylight.", "Learn why a shade looks different in a shop, and what that means for {tool}.", "A lighting guide for virtual makeup, written for people using {tool}.", "Read this before you buy anything based on your {tool} preview.", "Learn how to photograph your face so {tool} starts from true color."],
  "virtual-outfit-preview-limits": ["See what an outfit preview can show, and what {tool} cannot know about fit.", "Learn which details to check in the shop after you use {tool}.", "A guide to the limits of a clothing preview, written for {tool} users.", "Read this before you spend money on an idea you saw in {tool}.", "Compare a preview with the real thing, step by step, after {tool}."],
  "creative-portrait-effects-responsibly": ["Learn how to share an edited picture kindly, especially one made with {tool}.", "Read how to ask permission and label your {tool} result before you post it.", "A short guide to playful edits that still respect the people in them, for {tool}.", "See how to keep a {tool} picture fun and clearly marked as edited.", "Check this list before you send your {tool} image to anyone."],
  "restore-an-old-family-photo": ["Learn how to prepare a print before you scan it, then use {tool}.", "See how to save the original beside the new version when you use {tool}.", "A guide to scanning and storing old photos, written for people using {tool}.", "Read what a repair can and cannot bring back before you rely on {tool}.", "Follow these steps to give {tool} the best scan you can."],
};

export function guideBlurb(tool: Tool, post: BlogPost): string {
  const options = GUIDE_BLURBS[post.slug];
  if (!options) return post.description;
  let hash = 0;
  for (const char of tool.slug + post.slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return options[hash % options.length].replace("{tool}", tool.name);
}

export function getRelatedBlogPosts(tool: Tool, limit = 2): BlogPost[] {
  const picked = TOOL_GUIDES[tool.slug];
  if (picked) return picked.map((slug) => getBlogPost(slug)).filter((post): post is BlogPost => Boolean(post)).slice(0, limit);
  return BLOG_POSTS.filter((post) => post.toolSlugs.includes(tool.slug)).slice(0, limit);
}
