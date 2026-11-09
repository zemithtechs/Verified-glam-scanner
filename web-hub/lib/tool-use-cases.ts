import type { CategoryId, Tool } from "@/lib/catalog";

export type UseCase = { title: string; body: string };

// Concrete applications, not promises about an AI-generated outcome. These sit
// beside each tool's existing feature copy and keep the landing pages distinct.
const TOOL_CASES: Record<string, [UseCase, UseCase]> = {
  "face-beauty-analysis": [
    { title: "Compare portraits before choosing a profile photo", body: "Look at framing, light and expression across your own photos. The subjective report gives you a second perspective; choose the picture that still feels like you." },
    { title: "Take styling ideas to your next appointment", body: "Keep the portrait and its brief hair or frame suggestions together as a conversation starter, rather than treating a score as a rule." },
  ],
  "facial-symmetry": [
    { title: "Understand the effect of camera tilt", body: "A slight turn can make one side appear different from the other. Use the centerline guide to notice the pose before drawing conclusions about your face." },
    { title: "Choose a more balanced headshot", body: "Try a second straight-on photo and compare the illustrative guides. They are useful for framing, not precise measurements of facial geometry." },
  ],
  "face-golden-ratio": [
    { title: "Explore face thirds visually", body: "See the upper, middle and lower sections on your portrait, then compare a straight-on photo with an angled one to understand how perspective changes the guides." },
    { title: "Put phi in context", body: "Use 1.618 as a design reference to learn the idea behind the golden ratio. It is not a target your features need to meet." },
  ],
  "attractiveness-test": [
    { title: "Find a photo that captures your expression", body: "Compare your own portraits in different lighting and poses. The photo-harmony impression is subjective and can change with the photograph." },
    { title: "Plan a more comfortable next shoot", body: "Use the framing and styling notes to test a camera height or hair placement you like, without making the score the goal." },
  ],
  "face-comparison": [
    { title: "Compare two looks side by side", body: "Place two consenting adults' portraits together to notice visible differences in hair, face outline and photo framing—not to verify identity or family relationship." },
    { title: "Test two photos of yourself", body: "Use a pair taken in similar light to see how styling and angle affect the presentation of the same person." },
  ],
  "beauty-score-showdown": [
    { title: "Make a friendly two-photo comparison", body: "Put two permitted portraits in one card with equal space for each person. The subjective notes invite conversation, not a winner." },
    { title: "Compare your own styling choices", body: "Try two photos of yourself with different hair or lighting. Read each photo-harmony impression as feedback about the image, not your worth." },
  ],
  "face-shape-analyzer": [
    { title: "Bring an outline to a haircut discussion", body: "The approximate face-shape label and contour notes can help describe what you want to a stylist. Your hair texture and routine still decide what works." },
    { title: "Compare frame shapes", body: "Use the glasses ideas as a shortlist before trying real frames. A photo-based guide cannot replace fit and comfort." },
  ],
  "skin-analysis": [
    { title: "Notice what the photo actually shows", body: "The connected close-ups call out visible texture, pores, fine lines and tone variation without turning them into a diagnosis or severity rating." },
    { title: "Prepare a consistent photo reference", body: "If you want to compare pictures over time, use similar light and camera distance. Changes in the photo do not prove changes in skin health." },
  ],
  "seasonal-color-palette": [
    { title: "Build a small outfit color shortlist", body: "Take one suggested swatch family into your wardrobe and compare it beside clothes you already own before buying anything." },
    { title: "Choose makeup colors to explore", body: "Use the palette pairings to narrow a lip or cheek color direction. Screens and lighting can change how colors appear in person." },
  ],
  "beauty-tips": [
    { title: "Make one change for your next portrait", body: "Pick a single suggestion from the hair, frames or photo-light cards and see how it works in a new photo." },
    { title: "Keep the useful ideas together", body: "Download the portrait and concise styling cards as a reference when getting dressed, choosing eyewear or planning a headshot." },
  ],
  "beauty-routine-challenge": [
    { title: "Turn a big reset into seven small actions", body: "The daily plan spans basic care, outfit pairing, hair styling, light, rest and reflection. It does not promise a physical transformation in a week." },
    { title: "Adapt the plan to real life", body: "Treat each day as a suggestion. Skip what does not fit your skin, schedule, budget or preferences." },
  ],
  "ai-skin-enhancement": [
    { title: "Prepare a portrait for sharing", body: "Try a subtle edit on temporary blemishes or uneven exposure while keeping freckles, moles and natural complexion visible." },
    { title: "Compare restraint with polish", body: "Review the original beside the edited version at full size. Choose the level that still looks like the person in the source photo." },
  ],
  "smart-beauty": [
    { title: "Balance a photo taken in tricky light", body: "A gentle exposure and shine adjustment can make a portrait easier to use without changing facial structure." },
    { title: "Keep texture in a profile picture", body: "Check the cheeks and forehead at full size before saving. Real pores and age should remain visible, even after a polished edit." },
  ],
  "face-beauty-retouch": [
    { title: "Pick a finish for the occasion", body: "Move from subtle to polished for a headshot or event portrait, then compare each result against the original." },
    { title: "Review skin details before posting", body: "Zoom in on freckles, moles and fine texture. A natural edit should not replace the features that make the portrait recognizable." },
  ],
  "ai-face-enhancer": [
    { title: "Improve a mildly soft headshot", body: "Try a clearer version of a portrait with a little blur or noise, then inspect the eyes and hairline for invented detail." },
    { title: "Save a clearer social photo", body: "Use the comparison to judge whether improved clarity helps the whole image. Severely missing detail cannot be factually recovered." },
  ],
  "hairstyle-changer": [
    { title: "Bring a cut idea to the salon", body: "Compare the curly bob, layers, pixie or fringe against your own face and save the look that starts the best conversation." },
    { title: "Check the silhouette before committing", body: "Look at how the new hair frames your forehead and jaw. Texture, growth pattern and styling effort will affect a real cut." },
  ],
  "ai-hair-color": [
    { title: "Narrow a color direction", body: "Compare chestnut, copper, black, blonde or pastel on your own haircut before discussing dye with a colorist." },
    { title: "Check color in the full portrait", body: "Notice how a shade sits beside your skin, brows and clothing. A screen preview cannot predict exact dye results." },
  ],
  "lip-color-changer": [
    { title: "Compare everyday and occasion shades", body: "Preview rose nude, berry, red or peach gloss on the same portrait so the rest of the face stays constant." },
    { title: "Start a more focused product search", body: "Save a color family you like, then test real formulas and finishes in person; the preview is not an exact swatch." },
  ],
  "eyeshadow-try-on": [
    { title: "Choose a mood for an event", body: "Try soft bronze, rose shimmer or smoky plum on one portrait and assess the complete face rather than an isolated palette." },
    { title: "Keep your eye shape in view", body: "Use the preview to judge placement and intensity while the original eye shape remains part of the comparison." },
  ],
  "colored-contacts": [
    { title: "Explore iris color in context", body: "Compare hazel, green, blue and gray against your own portrait. Pupil size and reflections should still look natural in the preview." },
    { title: "Separate style from eye safety", body: "Use the image for a visual idea only. Lens fit, hygiene and eye health require advice from an eye-care professional." },
  ],
  "virtual-try-on-clothes": [
    { title: "Test a garment's overall mood", body: "Pair a clear person photo with a separate garment photo to explore its color and apparent drape on the same body." },
    { title: "Make a shopping shortlist", body: "Use the before-and-after image to rule in or out a style direction, then check real size, fabric and return details before buying." },
  ],
  "cartoon-yourself": [
    { title: "Create a playful profile image", body: "Try soft 3D, comic ink or anime while keeping the original hair, expression and clothing recognizable." },
    { title: "Make a themed invitation", body: "Use the illustrated portrait as one visual ingredient for a personal invitation or party graphic, with the subject's permission." },
  ],
  "old-photo-restoration": [
    { title: "Prepare a family print for sharing", body: "Start with the clearest scan you have and review repaired scratches or fading without replacing the people in the photo." },
    { title: "Keep the original record", body: "Save the source scan separately. The restored version is an interpretation of damaged detail, not proof of exactly what was there." },
  ],
};

const CATEGORY_CASES: Record<CategoryId, [UseCase, UseCase]> = {
  "face-analysis": [
    { title: "Read the guide in the context of the photo", body: "Use a straight-on portrait to explore visible features. These guides are illustrative, not biometric measurements." },
    { title: "Try a second angle", body: "Compare how the same face appears under different light and camera positions before drawing conclusions." },
  ],
  "glow-up": [
    { title: "Start with one wearable idea", body: "Try a suggested color or styling direction alongside clothes you already use." },
    { title: "Make it your own", body: "Keep the parts that match your taste and ignore anything that does not fit your routine." },
  ],
  "skin-retouch": [
    { title: "Check the entire portrait", body: "Compare the edited frame with the original before deciding whether the change helps." },
    { title: "Keep recognizable detail", body: "Inspect texture, expression and lighting at full size rather than relying on a small preview." },
  ],
  "hair-beard": [
    { title: "Take a visual reference to a professional", body: "A preview can help explain a direction to a stylist or barber, who can adapt it to your real hair." },
    { title: "Compare several silhouettes", body: "Look at the shape around the whole face, not only a close crop of the hair." },
  ],
  "makeup-tryon": [
    { title: "See the shade on a whole face", body: "Judge the color beside your hair, skin and clothing instead of treating it as an isolated swatch." },
    { title: "Test products in person", body: "Lighting, screen settings and real formulas can make the final color differ from a digital preview." },
  ],
  "fashion-style": [
    { title: "Explore the idea before committing", body: "Use the visual as a planning reference, then verify fit, materials and placement in the real world." },
    { title: "Keep a realistic reference", body: "Review the full result beside the source image so the change is clear." },
  ],
  "fun-effects": [
    { title: "Make a playful personal image", body: "Keep the effect clearly fictional and the subject recognizable in the finished result." },
    { title: "Share with consent", body: "Only transform an adult's photo when you have permission to use and share it." },
  ],
  "photo-tools": [
    { title: "Solve one specific photo problem", body: "Start with the clearest original available and inspect the whole result before saving." },
    { title: "Keep the source image safe", body: "Download the edited version separately and retain your original file for comparison." },
  ],
};

export function getToolUseCases(tool: Tool): [UseCase, UseCase] {
  return TOOL_CASES[tool.slug] ?? CATEGORY_CASES[tool.category];
}
