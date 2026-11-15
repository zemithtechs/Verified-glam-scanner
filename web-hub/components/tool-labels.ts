import { toolsInCategory, type CategoryId } from "@/lib/catalog";

/**
 * Section wording used on tool pages when a tool has no hand-written copy.
 * Each category gets its own sentences so two tool pages never repeat the same label.
 */
type Labels = {
  source: (name: string) => string;
  meaning: (name: string) => string;
  moreTools: (name: string) => string;
  guides: (name: string) => string;
  ideas: (name: string) => string;
  ideasIntro: (name: string) => string;
  guidance: (name: string) => string;
};

export const TOOL_LABELS: Record<CategoryId, Labels> = {
  "face-analysis": {
    source: (name) => `Choose the portrait for your ${name}.`,
    meaning: (name) => `Here is how to read your ${name} result.`,
    moreTools: (name) => `Try other face reports after your ${name}.`,
    guides: (name) => `Read how to get more from your ${name}.`,
    ideas: (name) => `Two ways to use your ${name} report well.`,
    ideasIntro: (name) => `${name} works best when you ask it one question, such as which photo looks best or which frames might suit you. The two examples below show how readers turn a report into a real decision. Try the tool on your own portrait, then see which example fits you.`,
    guidance: (name) => `Take a clear portrait to get a better ${name} report.`,
  },
  "glow-up": {
    source: (name) => `Pick a daylight photo for your ${name}.`,
    meaning: (name) => `Here is what your ${name} result tells you.`,
    moreTools: (name) => `Try more color and style ideas after your ${name}.`,
    guides: (name) => `Read our guides to use your ${name} well.`,
    ideas: (name) => `Two ways to wear your ${name} result this week.`,
    ideasIntro: (name) => `${name} is most useful when you turn the result into one small change, such as a new lip shade, a scarf or a different top. The two examples below show how to test a color idea cheaply. Then try the tool on your own photo and keep what feels like you.`,
    guidance: (name) => `Use natural light to get a truer ${name} result.`,
  },
  "skin-retouch": {
    source: (name) => `Start your ${name} with a sharp portrait.`,
    meaning: (name) => `Judge your ${name} edit by how natural it looks.`,
    moreTools: (name) => `Compare another retouch tool with your ${name} result.`,
    guides: (name) => `Read our guides before you save your ${name} edit.`,
    ideas: (name) => `Two ways to use your ${name} edit with confidence.`,
    ideasIntro: (name) => `${name} helps most when you know where the photo will end up, such as a profile page, a team site or a party album. The two examples below show how to check an edit before you save it. Try the tool on your own portrait and compare it with the original.`,
    guidance: (name) => `Start with a sharp photo for a more natural ${name} edit.`,
  },
  "hair-beard": {
    source: (name) => `Choose a photo that shows your hairline for ${name}.`,
    meaning: (name) => `Take your ${name} preview to your stylist as an idea.`,
    moreTools: (name) => `Try another hair or beard look after ${name}.`,
    guides: (name) => `Read the guides that go with ${name}.`,
    ideas: (name) => `Two ways to use your ${name} preview at the salon.`,
    ideasIntro: (name) => `${name} is most useful before an appointment, when you still have time to change your mind. The two examples below show how a preview can start a better conversation with your stylist or barber. Try it on your own photo, then save the look you like best.`,
    guidance: (name) => `Show your hairline and jaw for a better ${name} preview.`,
  },
  "makeup-tryon": {
    source: (name) => `Pick a close, bright photo for ${name}.`,
    meaning: (name) => `Treat your ${name} shade as a guide, then test it.`,
    moreTools: (name) => `Try more makeup shades after ${name}.`,
    guides: (name) => `Read our guides before you buy your ${name} shade.`,
    ideas: (name) => `Two ways to use your ${name} preview before you shop.`,
    ideasIntro: (name) => `${name} saves the most money when you use it before the checkout, not after. The two examples below show how to narrow a long shade list to two or three colors worth testing. Try the tool on your own portrait and note the color family you like.`,
    guidance: (name) => `Use a bright, front-facing photo for a better ${name} preview.`,
  },
  "fashion-style": {
    source: (name) => `Choose a photo where the area for ${name} is clear.`,
    meaning: (name) => `Use your ${name} preview to plan, then check the fit.`,
    moreTools: (name) => `Test more style ideas after ${name}.`,
    guides: (name) => `Read our guides before you shop with ${name}.`,
    ideas: (name) => `Two ways to use your ${name} preview before you spend.`,
    ideasIntro: (name) => `${name} works best before you pay for a garment, a tattoo or a new style. The two examples below show how to check color and shape on your own picture first. Try the tool on your photo, then take the preview with you when you talk to a seller or an artist.`,
    guidance: () => "Show the full area you want to change in your photo.",
  },
  "fun-effects": {
    source: (name) => `Pick a photo with a clear face for ${name}.`,
    meaning: (name) => `Enjoy your ${name} result as a playful picture.`,
    moreTools: (name) => `Try a different effect after ${name}.`,
    guides: (name) => `Read our guides for more ideas like ${name}.`,
    ideas: (name) => `Two ways to enjoy your ${name} result with friends.`,
    ideasIntro: (name) => `${name} is made for play, so the best results are the ones that make someone laugh. The two examples below show how to share an effect kindly and keep it recognizably you. Try the tool on your own selfie and ask your friends which version they like.`,
    guidance: (name) => `Pick a clear, expressive photo for a better ${name} result.`,
  },
  "photo-tools": {
    source: (name) => `Start ${name} with the clearest photo you have.`,
    meaning: (name) => `Check the whole image before you rely on ${name}.`,
    moreTools: (name) => `Fix another problem after ${name}.`,
    guides: (name) => `Read our guides before you share your ${name} result.`,
    ideas: (name) => `Two ways to use your ${name} result on your photos.`,
    ideasIntro: (name) => `${name} does one practical job, so it helps to know which problem you want to fix before you start. The two examples below show how to use the result and keep your original safe. Try the tool on one photo and compare the two versions.`,
    guidance: (name) => `Start with your best original for a better ${name} result.`,
  },
};


/** Section headings written for tools whose category wording would not fit them. */
export const SLUG_LABELS: Record<string, { source: string; meaning: string; guidance: string }> = {
  "lip-color-changer": {
    "source": "Take a close photo with your lips clear and relaxed.",
    "meaning": "Treat your lip shade as a guide, then test the lipstick.",
    "guidance": "Use bare lips and daylight for a truer lip color preview."
  },
  "eyeshadow-try-on": {
    "source": "Open your eyes and keep your lids in clear view.",
    "meaning": "Judge the eyeshadow at normal size, then test the palette.",
    "guidance": "Show your lids and brows clearly for a better eyeshadow preview."
  },
  "colored-contacts": {
    "source": "Look straight at the camera with both eyes wide open.",
    "meaning": "Use the new eye color as a style idea, not eye care advice.",
    "guidance": "Use bright light and open eyes for a believable eye color."
  },
  "ai-eyelashes": {
    "source": "Show your lash line with your eyes open and clear.",
    "meaning": "Pick a lash length you like, then ask a lash artist.",
    "guidance": "Keep your lash line in view for a better lash preview."
  },
  "ai-eyebrows": {
    "source": "Keep your forehead clear so your brows are fully in view.",
    "meaning": "Use the brow shape as an idea and ask a brow artist.",
    "guidance": "Show your natural brows for a better brow shape preview."
  },
  "ai-lip-enhancement": {
    "source": "Take a close, relaxed photo of your lips in soft light.",
    "meaning": "Treat fuller lips as a makeup plan, not a procedure preview.",
    "guidance": "Relax your lips for a more believable lip enhancement preview."
  },
  "virtual-try-on-clothes": {
    "source": "Add a photo of you and a clear photo of the garment.",
    "meaning": "Use the outfit preview to plan, then check the real fit.",
    "guidance": "Show your full outfit area to get a better clothes preview."
  },
  "ai-tattoo-generator": {
    "source": "Show the patch of skin where the tattoo would go.",
    "meaning": "Take the design to an artist as a starting idea.",
    "guidance": "Photograph the exact spot for a more useful tattoo preview."
  },
  "ai-waist-slimming": {
    "source": "Stand straight so your garment and outline are visible.",
    "meaning": "Use the silhouette to compare cuts, then try the garment on.",
    "guidance": "Stand straight in even light for a better silhouette preview."
  },
  "seasonal-color-palette": {
    "source": "Pick a daylight photo with no filter and little makeup.",
    "meaning": "Treat your season as a direction to test in person.",
    "guidance": "Use natural light to find your season more reliably."
  },
  "beauty-tips": {
    "source": "Use a bright, front-facing photo with your face and hair visible.",
    "meaning": "Read the tips as suggestions, then try one at a time.",
    "guidance": "Start with a fresh photo to get tips that fit you today."
  },
  "beauty-routine-challenge": {
    "source": "Take a fresh, clear photo to start your seven-day plan.",
    "meaning": "Treat the plan as a gentle routine, not a promise.",
    "guidance": "Begin with a recent daylight photo for a plan built around you."
  },
  "cartoon-yourself": {
    "source": "Pick a photo where your expression is easy to read.",
    "meaning": "Enjoy the cartoon as an illustration made from your photo.",
    "guidance": "Choose a bright, clear selfie for a cleaner cartoon."
  },
  "face-filters": {
    "source": "Take a centered selfie with your whole face visible.",
    "meaning": "Enjoy the filter as a playful edit, not a real look.",
    "guidance": "Keep your face centered for a filter that sits properly."
  },
  "facial-expression-changer": {
    "source": "Start from a relaxed, front-facing photo of your face.",
    "meaning": "Read the new expression as an edit, not a real moment.",
    "guidance": "Begin with a neutral expression for a natural new one."
  },
  "age-gender-swap": {
    "source": "Use a sharp, front-facing portrait of an adult.",
    "meaning": "See the result as a made-up portrait, not a prediction.",
    "guidance": "Use one clear adult portrait for a more convincing swap."
  },
  "ai-face-swap": {
    "source": "Pick two clear photos of adults who both agreed.",
    "meaning": "Treat the swap as an edited picture and label it that way.",
    "guidance": "Match the angle and light of both photos for a cleaner swap."
  },
  "square-face-filter": {
    "source": "Take a straight-on selfie that fills the frame.",
    "meaning": "Treat the square face as a joke trend, not a verdict.",
    "guidance": "Face the camera directly for a neat square face effect."
  },
  "big-head-effect": {
    "source": "Use a head and shoulders portrait facing the camera.",
    "meaning": "Share the big head as a joke with people who will laugh.",
    "guidance": "Frame your head and shoulders for a clean big head caricature."
  },
  "halloween-mask": {
    "source": "Pick a bright photo with your eyes, nose and mouth clear.",
    "meaning": "Keep the spooky mask playful and say it is edited.",
    "guidance": "Show your whole face for a mask that lines up neatly."
  },
  "pregnant-filter": {
    "source": "Use a waist-up photo with your stomach in view.",
    "meaning": "Send the prank only to someone who is in on the joke.",
    "guidance": "Stand turned a little to the side for a believable joke bump."
  },
  "birthday-image-generator": {
    "source": "Pick a happy photo of the birthday person.",
    "meaning": "Share the birthday card with the person's permission.",
    "guidance": "Choose a cheerful, sharp photo for a better birthday card."
  },
  "ai-fortune-teller": {
    "source": "Take a clear portrait with a natural expression.",
    "meaning": "Read your fortune as entertainment and nothing more.",
    "guidance": "Use daylight and a clear face for a livelier fortune."
  },
  "elf-name-generator": {
    "source": "Use a clear portrait with your face turned to the camera.",
    "meaning": "Enjoy your elf name and portrait as a fantasy game.",
    "guidance": "Show your face clearly to get a better elf portrait."
  },
  "merge-portraits": {
    "source": "Pick two portraits with matching light and head angle.",
    "meaning": "Treat the merged face as a made-up picture, and label it.",
    "guidance": "Match both photos for a cleaner merge of two portraits."
  },
  "beard-styling": {
    "source": "Show your jaw and cheeks clearly in even light.",
    "meaning": "Take the beard shape to your barber as an idea.",
    "guidance": "Keep your jaw in view for a better beard preview."
  },
  "beard-remover": {
    "source": "Show your whole jaw and neck in even light.",
    "meaning": "Treat the clean-shaven look as a preview, not a promise.",
    "guidance": "Show where your beard ends for a cleaner shaved preview."
  },
  "hair-loss-simulation": {
    "source": "Keep your hairline and temples clear of hats and bangs.",
    "meaning": "Read the receding hairline as a joke, not a medical forecast.",
    "guidance": "Show your hairline for a clearer hair loss simulation."
  },
  "bald-filter": {
    "source": "Show your whole head with your hair in view.",
    "meaning": "Share the shaved look as an edit made for fun.",
    "guidance": "Use a sharp head and shoulders photo for a cleaner bald look."
  },
  "face-comparison": {
    "source": "Pick two portraits taken at a similar distance.",
    "meaning": "Read the comparison as styling notes, not a ranking.",
    "guidance": "Match both photos for a fairer face comparison."
  },
  "beauty-score-showdown": {
    "source": "Pick two photos with the same size and style.",
    "meaning": "Read the showdown as fun, not as a contest of worth.",
    "guidance": "Match both photos for a fairer beauty score showdown."
  },
  "face-beauty-analysis": {"source": "Take one clear portrait at eye level in soft light.", "meaning": "Read the score as a styling idea, then read the notes.", "guidance": "Take a clear portrait for a report that fits your face."},
  "facial-symmetry": {"source": "Look straight at the camera with your head level.", "meaning": "See the two halves as a guide, not a list of flaws.", "guidance": "Keep your head level for a fairer symmetry guide."},
  "face-golden-ratio": {"source": "Keep a neutral face and let the camera see your thirds.", "meaning": "Treat phi as a fun reference, not a rule for your face.", "guidance": "Face the camera so the golden ratio lines sit right."},
  "attractiveness-test": {"source": "Choose the photo you would actually post.", "meaning": "Read the score as one opinion about one photo.", "guidance": "Use soft light and your best angle for a fairer score."},
  "face-shape-analyzer": {"source": "Pull your hair back so your outline is visible.", "meaning": "Take your face shape as a hint for frames and cuts.", "guidance": "Show your whole outline for a clearer face shape."},
  "skin-analysis": {"source": "Wash your face and take the photo near a window.", "meaning": "Read the notes as what the photo shows, nothing more.", "guidance": "Use daylight and a clean face for clearer skin notes."},
  "facial-landmarks": {"source": "Level your head so the points land where they should.", "meaning": "See the points as a guide drawn on your photo.", "guidance": "Keep your features clear for a tidier landmarks map."},
  "ai-skin-enhancement": {"source": "Start from a sharp portrait with no beauty filter.", "meaning": "Judge the enhancement by how real your skin still looks.", "guidance": "Use an unfiltered photo for a more natural enhancement."},
  "smart-beauty": {"source": "Choose a clear portrait lit evenly from the front.", "meaning": "Raise the strength only while it still looks like you.", "guidance": "Pick a sharp photo and a light touch for smart retouching."},
  "face-beauty-retouch": {"source": "Use a large, sharp portrait for the three finish levels.", "meaning": "Pick the lightest finish that still looks polished.", "guidance": "Start with a high-resolution photo for the face editor."},
  "ai-face-enhancer": {"source": "Use the sharpest version of the portrait you have.", "meaning": "Remember that missing detail is rebuilt, not recovered.", "guidance": "Feed it your clearest copy for a better enhanced portrait."},
  "ai-face-slimming": {"source": "Face the camera at eye level with your jaw in view.", "meaning": "Stop at the point where it no longer looks like you.", "guidance": "Show your jaw and cheeks for a gentler contour edit."},
  "hairstyle-changer": {"source": "Show your hairline, ears and shoulders in the frame.", "meaning": "Show the preview to your stylist and ask what is realistic.", "guidance": "Tie back loose hair for a cleaner new hairstyle."},
  "ai-hair-color": {"source": "Show your full head of hair in even daylight.", "meaning": "Remember that a screen shade shifts on real hair and dye.", "guidance": "Use daylight, not a lamp, for a truer hair color preview."},
  "old-photo-restoration": {"source": "Scan the print straight on at the best quality you can.", "meaning": "Treat restored detail as a careful guess.", "guidance": "Scan the original well for a cleaner restoration."},
  "face-blur": {"source": "Use the original photo with every face visible.", "meaning": "Check clothing and reflections, because only faces are blurred.", "guidance": "Count every face before you blur a group photo."}
};

/** Section headings that depend on the tool's place in its group, so neighbours in a group do not share a frame. */
const MORE_TOOLS: Record<CategoryId, string[]> = {
  "face-analysis": [
    "Run another face report on a different photo.",
    "Compare this result with another face tool on the same portrait.",
    "Try a second report in a new light.",
    "See what other face tools say about the same selfie.",
    "Add a face shape or color check to your results.",
    "Keep exploring your portrait with a different tool.",
    "Look at your photo through a second kind of report."
  ],
  "glow-up": [
    "Test another color or style idea on the same photo.",
    "Try a second guide to compare with this one.",
    "Pair this result with a different glow-up tool.",
    "Build on this result with another tool.",
    "Keep going with one more idea for your look."
  ],
  "skin-retouch": [
    "Compare this edit with another retouch tool.",
    "Try a lighter or stronger edit on the same portrait.",
    "Run a second tool to see which finish you like.",
    "Check another portrait tool on this photo.",
    "See how a different edit changes the same face."
  ],
  "hair-beard": [
    "Try another hair or beard look on the same photo.",
    "Compare this style with a different cut or color.",
    "Look at one more hair idea before you book.",
    "Try a second look to show your stylist.",
    "Test a different length or shade on the same portrait."
  ],
  "makeup-tryon": [
    "Try more makeup on the same portrait.",
    "Compare this look with another feature, such as lips or eyes.",
    "Add a second product to complete the look.",
    "Test one more shade before you shop.",
    "See a different makeup tool on the same photo."
  ],
  "fashion-style": [
    "Test another outfit or style on the same photo.",
    "See a second idea before you spend money.",
    "Compare this preview with a different style tool.",
    "Try one more look for the same occasion.",
    "Look at another idea in a new photo."
  ],
  "fun-effects": [
    "Try a different effect on the same selfie.",
    "Turn the same photo into something else.",
    "Compare this effect with another playful tool.",
    "Keep playing with a second filter.",
    "Make one more version for your friends.",
    "Try the same selfie in a new style.",
    "See what a different effect does to this photo."
  ],
  "photo-tools": [
    "Fix another problem on a different photo.",
    "Try a second tool on the same picture.",
    "Compare this fix with another photo tool.",
    "Clean up one more photo from your collection.",
    "Use a different tool for the next job."
  ]
};
const GUIDES: Record<CategoryId, string[]> = {
  "face-analysis": [
    "Read what our guides say about face reports.",
    "Learn how to read a report without overthinking it.",
    "Get the background before you act on the notes.",
    "Read how to take a better photo for any face tool.",
    "Find plain-language guides to your results.",
    "Check the guides before you share a report.",
    "Read the short guides that explain your result."
  ],
  "glow-up": [
    "Read how to turn colors into real outfits.",
    "Read our guides on picking colors that last.",
    "Learn how daylight changes the colors you see.",
    "Find short guides to build a simple routine.",
    "Read how to use your result in a shop."
  ],
  "skin-retouch": [
    "Read how to keep edits looking natural.",
    "Read our guides on light, gentle retouching.",
    "Learn which details to leave alone in a portrait.",
    "Find short guides on comparing before and after.",
    "Read how to judge an edit at full size."
  ],
  "hair-beard": [
    "Read how to plan a change with a preview.",
    "Learn how to ask your stylist for what you saw.",
    "Read our guides on choosing a change you will keep.",
    "Find short guides on cuts, color and care.",
    "Read how to prepare for your appointment."
  ],
  "makeup-tryon": [
    "Read how light changes the shades you see.",
    "Read our guides on testing makeup before you buy.",
    "Learn why a shade looks different on a screen.",
    "Find short guides on choosing colors for your tone.",
    "Read how to check your pick in daylight."
  ],
  "fashion-style": [
    "Read what a preview can and cannot show.",
    "Read how to plan a real decision from a picture.",
    "Learn what to check in a shop after a preview.",
    "Find short guides on comparing styles.",
    "Read how to plan a purchase from a picture."
  ],
  "fun-effects": [
    "Read how to share playful edits kindly.",
    "Read our guides on asking before you post.",
    "Learn how to label an edited picture.",
    "Find short guides on fun edits that stay respectful.",
    "Read how to keep effects clear and light.",
    "Check the guides before you send this to friends.",
    "Read how to use effects without upsetting anyone."
  ],
  "photo-tools": [
    "Read how to scan and save photos well.",
    "Read our guides on keeping the original safe.",
    "Learn what a repair can and cannot bring back.",
    "Find short guides on sharing photos kindly.",
    "Read how to check a result before you share."
  ]
};

export function toolLabels(slug: string, category: CategoryId): Labels {
  const base = TOOL_LABELS[category];
  const own = SLUG_LABELS[slug];
  const position = Math.max(0, toolsInCategory(category).findIndex((tool) => tool.slug === slug));
  const moreTools = MORE_TOOLS[category][position % MORE_TOOLS[category].length];
  const guides = GUIDES[category][position % GUIDES[category].length];
  const shared = { moreTools: () => moreTools, guides: () => guides };
  if (!own) return { ...base, ...shared };
  return { ...base, ...shared, source: () => own.source, meaning: () => own.meaning, guidance: () => own.guidance };
}
