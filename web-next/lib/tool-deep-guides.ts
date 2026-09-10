import type { FeatureType } from "./tools";
import type { GuideSection } from "./tool-landing-types";

const point = (title: string, description: string) => ({ title, description });

export const TOOL_DEEP_GUIDES: Record<FeatureType, GuideSection[]> = {
  FACE_BEAUTY_ANALYSIS: [
    {
      title: "What an AI beauty analysis looks at",
      description: "A beauty analysis begins with the visual relationships in a single photo. The scan maps visible facial landmarks, then looks at how features such as the eyes, brows, nose, lips, jawline, and face outline relate to one another. It is not a verdict on your appearance. Think of it as a structured way to notice the details that makeup, grooming, hair, lighting, and camera position can emphasize.",
      points: [
        point("Facial balance", "The report considers how major features sit together in the photo, rather than treating any one feature as a problem."),
        point("Feature harmony", "Eyes, lips, brows, and face shape are read as a combination, which gives the result more context than a single score."),
        point("Photo conditions", "Lighting, expression, lens distance, filters, and head angle can change the visual result, so they are worth considering before you compare scans."),
      ],
    },
    {
      title: "How to read your beauty score thoughtfully",
      description: "Your score is most useful when you read it alongside the notes and visual map. A number may be interesting, but the practical value comes from understanding what the analysis noticed and which choices can help you present yourself the way you want. Beauty is personal, cultural, and far broader than a photo. Use your report as a source of styling ideas, not as a standard you need to meet.",
      points: [
        point("Start with strengths", "Look for the features the report says already read clearly, then use those as anchors for a makeup or hair decision."),
        point("Treat tips as options", "A suggestion about brows, blush, or framing is an experiment you can try, skip, or adapt to your own style."),
        point("Compare like with like", "If you retake a scan, use similar lighting and a similar pose so the difference is easier to interpret."),
      ],
    },
    {
      title: "Use your report when planning a look",
      description: "Beauty reports work best when they lead to a specific next step. You might use yours before a makeup appointment, a haircut, a new brow shape, or a photo day. Instead of changing everything at once, choose one feature or one styling decision to test. That keeps the experience practical and helps you learn which details make you feel most like yourself.",
      points: [
        point("Makeup placement", "Use feature notes as a starting point for blush height, brow definition, lip shape, or a softer versus sharper eye look."),
        point("Hair framing", "Consider where volume, parting, layers, or face-framing pieces sit around the face in your current photo."),
        point("Better portraits", "Try the lighting and angle suggestions before your next profile photo, event, or creator shoot."),
      ],
    },
    {
      title: "Get a clearer scan from your photo",
      description: "A clear, front-facing portrait gives the analysis enough visual information to be useful. Choose even light, keep your face visible, and use an expression that feels natural. You do not need a perfect photo or professional camera. The aim is consistency. When the input is simple and honest, it is easier to tell whether a result reflects your features or just a dramatic camera angle.",
      points: [
        point("Use soft daylight", "Face a window or stand in open shade to avoid strong shadows that hide one side of the face."),
        point("Keep filters light", "Heavy smoothing, face reshaping, and beauty filters can move the landmarks that the scan is trying to read."),
        point("Keep the camera level", "A level camera at face height usually produces a more balanced and repeatable portrait."),
      ],
    },
  ],
  COLOR_ANALYSIS: [
    {
      title: "What seasonal color analysis can help you notice",
      description: "Personal color analysis is a practical way to study how color behaves next to your face. Your uploaded image gives the tool cues about visible warmth or coolness, contrast, depth, and clarity. Those cues can point you toward color families that make your complexion look more awake or help your eyes and hair stand out. It is a guide for experimenting, not a rulebook for your wardrobe.",
      points: [
        point("Undertone direction", "The report suggests whether the colors around your face appear more harmonious when they lean warm, cool, or neutral."),
        point("Contrast level", "It considers whether your visible features read as soft and blended or more distinct, which can guide print and makeup intensity."),
        point("Color depth", "Light, medium, and deep shades create different effects, so the palette gives a useful starting range instead of one exact color."),
      ],
    },
    {
      title: "Turn your palette into better makeup choices",
      description: "A useful palette should follow you into a makeup bag, not remain an abstract result screen. Start with the shades you wear most often: lipstick, blush, bronzer, brow products, and eyeshadow. The analysis can help you decide whether a product feels too orange, too icy, too muted, or just right against your own skin and hair. Test one change at a time in daylight.",
      points: [
        point("Lip color direction", "Try a nearby shade family first, then compare how it changes the brightness of your face in a simple front-facing photo."),
        point("Blush and bronzer", "Use the warmth and depth notes to choose between peach, rose, berry, golden, or soft neutral directions."),
        point("Eyes and brows", "A palette can also guide whether softer taupes, warmer browns, cooler browns, or richer contrast feels more balanced."),
      ],
    },
    {
      title: "Use color analysis for hair and wardrobe planning",
      description: "Hair color, clothing, jewelry, and even the colors in your glasses sit close to the face. That makes them powerful styling choices. Before a major change, use the suggested color direction to create a small reference board. You can compare a few outfit colors near a window, save your favorites, and take a new scan when your hair changes. The best palette is the one you enjoy wearing.",
      points: [
        point("Hair color ideas", "Look at warmth, depth, and contrast before choosing highlights, lowlights, glosses, or an all-over color change."),
        point("Wardrobe anchors", "Start with easy pieces such as tops, scarves, and jackets because they have the strongest visual effect near the face."),
        point("Jewelry metal", "Compare gold, silver, rose gold, and mixed metals in natural light to see which finish supports your chosen palette."),
      ],
    },
    {
      title: "Make your color result more reliable",
      description: "Light is a major part of every color result. Warm indoor bulbs, colored walls, tinted windows, and strong filters can make skin and hair look different from their everyday appearance. For a helpful baseline, take a clean photo in neutral daylight with your face and hair visible. If you want to assess a specific makeup look, take a second scan for that look rather than expecting one photo to answer every question.",
      points: [
        point("Choose neutral daylight", "A window-facing photo without strong direct sun usually shows skin and hair color more clearly."),
        point("Avoid color-changing filters", "Filters may shift redness, warmth, saturation, and contrast before the scan ever sees your original features."),
        point("Keep hair in frame", "Visible hair gives the palette more useful context, especially when you are considering clothing and makeup combinations."),
      ],
    },
  ],
  GLOW_UP_GUIDE: [
    {
      title: "Build a beauty routine from a real starting point",
      description: "A glow up plan is easier to follow when it starts with what you already do. Your baseline photo helps create a visual reference, while your own goals shape what matters most. You may want a more consistent routine, better photo confidence, a new makeup direction, or a simpler grooming habit. The plan should help you choose small actions that fit your life, not pressure you into changing your whole appearance.",
      points: [
        point("Pick one priority", "Choose a single focus for the first phase, such as hydration, brows, hair care, makeup practice, or regular sleep."),
        point("Start with your routine", "Keep products and habits that already work for you, then add only the changes you can maintain."),
        point("Use your baseline kindly", "Your first photo is a reference point for progress and styling, not a before photo you need to reject."),
      ],
    },
    {
      title: "Keep daily beauty habits manageable",
      description: "Consistency usually matters more than a complicated routine. A useful plan breaks beauty goals into short, repeatable actions so you can learn what suits your skin, schedule, and budget. It can be as simple as taking off makeup reliably, applying SPF, practicing one hairstyle, or setting aside five minutes to plan tomorrow's look. Small habits are easier to review and adjust than a strict routine you abandon after a week.",
      points: [
        point("Create a short core routine", "Keep your daily list small enough that you can complete it even on busy days."),
        point("Add one weekly check-in", "Use a weekly moment to note what felt good, what irritated your skin, and what you want to simplify."),
        point("Spend with intention", "Try techniques with products you own before buying several new items at once."),
      ],
    },
    {
      title: "Track progress without chasing perfection",
      description: "Progress photos and repeat scans can show how lighting, confidence, grooming, and consistent care affect the way a look comes together. They are most helpful when you take them under similar conditions. A routine challenge is not a promise of a dramatic transformation. It is a record of choices you made and a way to learn which choices give you the result you personally prefer.",
      points: [
        point("Use the same conditions", "Similar light, camera height, expression, and distance make repeat photos easier to compare."),
        point("Notice more than skin", "Hair, posture, makeup placement, and a relaxed expression can make a visible difference in a photo."),
        point("Refresh the plan", "When a step no longer fits or your goal changes, update the routine instead of forcing an old checklist."),
      ],
    },
    {
      title: "Choose beauty advice with care",
      description: "A cosmetic routine should be supportive, comfortable, and appropriate for you. The guide can offer ideas for presentation and everyday care, but it does not diagnose skin conditions or replace a dermatologist, stylist, or other qualified professional. If a product causes irritation, stop using it. If you have a health concern, seek professional guidance. Your routine should leave room for your preferences and your wellbeing.",
      points: [
        point("Patch test new products", "Introduce skincare carefully and follow the instructions from the brand or your professional adviser."),
        point("Avoid medical claims", "Cosmetic suggestions are not a substitute for treatment, diagnosis, or specialist care."),
        point("Keep what feels like you", "The most sustainable glow up plan supports your own style instead of copying someone else's face or routine."),
      ],
    },
  ],
  BEAUTY_TIPS: [
    {
      title: "How personalized beauty tips are created",
      description: "Personalized beauty tips begin with what is visible in your uploaded photo: facial structure, feature placement, face framing, and the overall balance of the image. The result turns those visual cues into cosmetic and styling ideas you can choose from. It is more useful than a generic list because it gives you a reason to consider a specific placement, angle, or color direction while leaving room for your own taste.",
      points: [
        point("Feature-led suggestions", "Tips can connect to eyes, lips, brows, face shape, and hair framing so you know which part of a look they relate to."),
        point("Cosmetic focus", "The guidance is about makeup, grooming, styling, and photos. It is not a medical assessment of your skin or face."),
        point("Flexible ideas", "Use a tip as a starting point, then make it softer, bolder, more natural, or more expressive for your own style."),
      ],
    },
    {
      title: "Makeup placement that feels intentional",
      description: "Makeup placement can change the visual emphasis of a face without changing who you are. A report may give you ideas about where to place blush, how high to shape a brow, or whether a soft contour or brighter lip could support your chosen look. Try the advice in front of a mirror and take a photo in the light you actually use. The best placement is the one that feels comfortable and recognizably you.",
      points: [
        point("Blush and highlight", "Experiment with height and direction to see whether a lifted, rounded, or softly diffused placement suits your goal."),
        point("Brows and eyes", "Use small adjustments in shape, fullness, liner, or shadow placement before making a major change."),
        point("Lips and balance", "A lip color or liner choice can shift the focus of a look, especially when paired with a simple eye or brow."),
      ],
    },
    {
      title: "Use styling tips beyond makeup",
      description: "Beauty choices extend beyond a makeup routine. Parting your hair differently, moving face-framing layers, choosing glasses, or changing the direction of a photo can affect the visual balance of a look. Your scan can help you collect ideas before a salon visit or a special event. Bring the suggestions as inspiration, then work with your stylist or your own experience to decide what you want to keep.",
      points: [
        point("Hair framing", "Compare a center part, side part, tuck, curl, or volume placement to see which direction you enjoy most."),
        point("Photo angles", "A slight turn, a level camera, and simple window light can make a selfie look more intentional without a filter."),
        point("Style references", "Save a few looks you genuinely like, then use the report to identify elements you may want to try."),
      ],
    },
    {
      title: "Keep your beauty feedback healthy and useful",
      description: "Beauty feedback should support curiosity, not create pressure. The tool is designed to offer constructive cosmetic ideas based on one photo, and it cannot capture your personality, movement, presence, or the many ways people experience beauty. If a suggestion does not feel helpful, leave it. If you are concerned about skin changes or irritation, speak with a qualified professional rather than relying on an image-based result.",
      points: [
        point("Choose your own goal", "You decide whether you want a natural everyday look, a full glam experiment, or simply better photos."),
        point("Avoid overcorrecting", "Try one or two ideas before changing several parts of your routine at the same time."),
        point("Ask a professional when needed", "Dermatologists, makeup artists, and stylists can give hands-on guidance that an image tool cannot replace."),
      ],
    },
  ],
  CELEBRITY_LOOKALIKE: [
    {
      title: "What a celebrity look alike result means",
      description: "A celebrity look alike result is a playful estimate of visual resemblance. The tool compares visible features in your portrait with reference patterns and suggests public figures who share a similar overall look. It does not identify you, verify anyone's identity, or suggest a personal relationship with a celebrity. The fun is in spotting familiar traits and using the result as a conversation starter or style reference.",
      points: [
        point("Similarity, not identity", "The scan estimates visual overlap in a photo. It does not prove that two people are the same or related."),
        point("A changing result is normal", "Hair, makeup, expression, lighting, age, and a different camera angle can all shift the match list."),
        point("Use it for entertainment", "Treat the results as a fun discovery feature rather than a factual ranking of who you resemble."),
      ],
    },
    {
      title: "Look beyond the celebrity name",
      description: "The useful part of a look alike report is often the feature notes beside the match. You may notice a similar eye shape, a comparable smile, a shared face outline, or a similar contrast level. Those details can be much more helpful than trying to recreate someone else's appearance exactly. Use them to identify style elements you enjoy, then adapt those ideas for your own face, budget, and routine.",
      points: [
        point("Shared feature cues", "Read the visible traits named in the report to understand why a certain match may have appeared."),
        point("Style inspiration", "Use a match to collect hair, makeup, color, and photo references without copying a person feature for feature."),
        point("Your version of the look", "Choose inspiration that fits your own comfort level, identity, and everyday lifestyle."),
      ],
    },
    {
      title: "Get a better celebrity match from your portrait",
      description: "A straightforward portrait gives the matching tool the clearest view of your face. Keep your face centered, use even lighting, and avoid a filter that changes your eyes, nose, jawline, or skin texture. You can wear makeup if you want a match for that specific look. If you want a more neutral baseline, try a second photo with softer styling and compare the results for fun.",
      points: [
        point("Keep one face visible", "Choose a photo where hair, hands, sunglasses, and accessories do not cover key facial features."),
        point("Use a relaxed expression", "A natural expression makes it easier to read the overall face shape and visible feature relationships."),
        point("Try a second version", "A second photo can show whether the match was influenced by your styling, pose, or lighting."),
      ],
    },
    {
      title: "Share look alike results respectfully",
      description: "Look alike content works best when everyone involved is comfortable with it. Only upload photos you have the right to use, and ask before sharing a friend's result publicly. A match should never be used to mock someone, make assumptions about their identity, or imply a celebrity endorsement. Keep the tone light, celebrate the interesting similarities, and remember that a photo does not tell the whole story of a person.",
      points: [
        point("Get photo consent", "Ask before uploading or sharing another person's image, especially in group content or a public post."),
        point("Avoid false claims", "Do not describe a match as confirmation of identity, relationship, or endorsement."),
        point("Keep the fun mutual", "Share results with people who will enjoy the experience and respect a request not to be included."),
      ],
    },
  ],
  FACIAL_SYMMETRY: [
    {
      title: "How a facial symmetry test reads a photo",
      description: "A facial symmetry test uses facial landmarks to compare visible points on the left and right sides of your face around a center line. It may consider the eyes, brows, nose, mouth, cheeks, and jawline. The result is a visual estimate from a single image, not a medical measurement. Natural faces are not perfectly symmetrical, and small differences are a normal part of how every face looks and moves.",
      points: [
        point("Paired landmarks", "The scan compares features that appear on both sides of the face, such as eye position, brow height, and cheek outline."),
        point("A visual estimate", "The score reflects what the camera captured, including pose and light, rather than an unchanging fact about your face."),
        point("Natural variation", "A small difference between sides is common and can be part of the character and expression of a face."),
      ],
    },
    {
      title: "Understand symmetry without chasing perfection",
      description: "Symmetry is only one visual quality. It does not measure personality, confidence, health, or overall attractiveness. The result is more helpful when you use it to understand how a particular photo reads instead of searching for a flawless score. You may learn that one brow arches differently, a smile lifts more on one side, or a hairstyle changes the balance of a portrait. Those are observations you can use or simply appreciate.",
      points: [
        point("Read the region notes", "Look at the individual areas before focusing on the total number, because different regions can be affected by different photo conditions."),
        point("Keep perspective", "Do not use a symmetry score to judge your value or compare yourself harshly with edited images online."),
        point("Use it for styling", "The report can inspire experiments with parting, makeup placement, or photo angles if that interests you."),
      ],
    },
    {
      title: "Why photo setup changes symmetry results",
      description: "Cameras turn a three-dimensional face into a flat image, so setup matters. A camera held too close can exaggerate the center of the face. Strong light from one side can hide the other side. A tilted head, wide smile, or uneven hair placement can also shift the landmark map. For the clearest baseline, use a level camera, soft even light, and a relaxed front-facing expression.",
      points: [
        point("Keep the phone level", "Place the camera at about face height and look toward the lens rather than up or down at the screen."),
        point("Use even lighting", "Face a window or open shade so one eye, cheek, or jawline is not lost in a heavy shadow."),
        point("Relax your expression", "A soft neutral expression makes it easier to compare a repeat scan with your next result."),
      ],
    },
    {
      title: "Use your symmetry report for better portraits",
      description: "Photographers and creators often use balance as a framing tool rather than a beauty rule. Your report can help you test a straighter pose, a different hair part, or more even lighting before an event, profile photo, or content shoot. Save the conditions that make you feel confident. The aim is not to make a face look identical on both sides, but to create a photo that feels composed and like you.",
      points: [
        point("Test your parting", "A center, soft side, or deep side part can change the visible balance of a portrait."),
        point("Adjust the crop", "A little more space above the head and an even eye line can make a portrait feel calmer and more intentional."),
        point("Retake with purpose", "Change one variable at a time so you know whether lighting, pose, or styling changed the visual result."),
      ],
    },
  ],
  BEAUTY_SCORE_SHOWDOWN: [
    {
      title: "Keep a beauty score showdown light and consensual",
      description: "A beauty score showdown is designed as a fun, opt-in comparison between people who want to take part. It is not a measure of anyone's worth or a serious competition. The best experience is one where every participant knows what the tool does, chooses their own photo, and can decide not to share a result. Friendly context matters more than the order of the scores on a screen.",
      points: [
        point("Ask before adding a photo", "Every person should agree before their portrait is uploaded, analyzed, or included in a shareable result."),
        point("Set the tone first", "Agree that the comparison is about fun, style, and content, never ridicule or pressure."),
        point("Let people opt out", "A participant should be able to skip the result or ask that their photo is not saved or shared."),
      ],
    },
    {
      title: "Make a comparison as fair as possible",
      description: "A side-by-side result is easier to read when the input photos are reasonably similar. You do not need identical studio images, but you should avoid giving one person a bright filtered close-up and another a dark group photo. Use front-facing portraits, similar lighting, and a comparable level of makeup or styling if you want to compare the analysis rather than the camera setup.",
      points: [
        point("Use clear portraits", "Choose one visible face per image, with no sunglasses, hands, or major objects covering key features."),
        point("Match the setup", "Similar light, distance, and pose reduce the chance that the camera affects one participant more than another."),
        point("Read categories together", "Look at the separate notes and highlights, not only the total score, to keep the comparison more nuanced."),
      ],
    },
    {
      title: "Turn results into positive creator content",
      description: "Friends, siblings, couples, and creators can use a showdown as a prompt for styling conversations or a light video format. Keep the story centered on preferences, surprise features, and the looks each person enjoys. Avoid captions that frame one person as a loser or make claims that the result is objective. Strong content lets participants have their own voice and gives viewers a clear reminder that beauty is subjective.",
      points: [
        point("Share the category highlights", "Talk about interesting feature notes, favorite style ideas, or the photos each participant selected."),
        point("Use respectful captions", "Write a caption that sets a positive tone and does not turn a cosmetic tool into a personal judgment."),
        point("Keep private results private", "Only post screenshots or images after everyone in them has agreed to the final content."),
      ],
    },
    {
      title: "Read scores with perspective",
      description: "AI scores are estimates based on visible patterns in the submitted photos. They are not universal standards and they cannot capture presence, personality, culture, or the way someone is seen by the people who know them. A showdown can be entertaining when it stays in that lane. If a result makes someone uncomfortable, the right response is to stop, not to keep comparing or trying to improve a number.",
      points: [
        point("Do not treat a score as fact", "The result is generated from one image under specific conditions and can change with a new photo."),
        point("Focus on choice", "Use any styling ideas because you like them, not because a comparison says you need to change."),
        point("Protect confidence", "A good challenge leaves every participant feeling respected, regardless of the result on screen."),
      ],
    },
  ],
  FACIAL_RESEMBLANCE: [
    {
      title: "What a facial resemblance score compares",
      description: "A facial resemblance test compares visible patterns in two portraits, such as face outline, feature placement, eye area, nose shape, mouth area, and jawline. It produces a visual similarity estimate from the images you provide. It does not establish family relationships, confirm identity, or make a legal or scientific claim about two people. Use it as an interesting way to explore what two photographs have in common.",
      points: [
        point("Shared structure", "The report looks for visible similarities in the overall arrangement and shape of facial features."),
        point("Visible differences", "It can also highlight areas that read differently, which gives the score more context than a single percentage."),
        point("Not proof of relation", "A resemblance result cannot confirm whether people are related or identify a person from a photograph."),
      ],
    },
    {
      title: "Choose photos that make comparison easier",
      description: "The clearest comparison uses two simple portraits rather than photos with dramatic pose, beauty filters, or busy backgrounds. Aim for one visible face in each image, with the camera near face height. The background does not need to match, but similar lighting and a similar expression can help the tool focus on the faces. If you are comparing family photos from different decades, expect style and camera differences to affect the result.",
      points: [
        point("Keep faces unobstructed", "Move sunglasses, masks, hands, and large shadows out of the way when possible."),
        point("Use similar angles", "Two front-facing or gently turned portraits are easier to compare than a profile photo and a close-up selfie."),
        point("Avoid heavy edits", "Face reshaping and strong filters can change the visual landmarks the comparison uses."),
      ],
    },
    {
      title: "Fun ways to use face comparison",
      description: "Face comparison can be a thoughtful prompt for family albums, sibling conversations, couple content, friendship challenges, or a before-and-after styling experiment. You might compare a parent and child, two siblings at the same age, or your own older and newer photos. Keep the purpose simple and respectful. The best result is often the discussion it starts about familiar smiles, expressions, and family traits.",
      points: [
        point("Family photo projects", "Compare portraits with consent and use the shared trait notes as prompts for stories and memories."),
        point("Style experiments", "Try two versions of your own look to see how hair, makeup, and lighting change a photo's visual feel."),
        point("Creator formats", "Use two-person comparison content only when both people are comfortable appearing in the final post."),
      ],
    },
    {
      title: "Respect privacy when comparing faces",
      description: "Faces are personal information, so only upload photos you have permission to use. That is especially important for family albums, children, and photos taken from another person's social profile. Do not use the tool to investigate a stranger, make claims about identity, or decide whether someone is related to another person. A resemblance feature should remain a consensual, entertainment-focused experience.",
      points: [
        point("Get permission", "Ask before uploading someone else's portrait or including their result in a message, post, or video."),
        point("Avoid identity claims", "A high similarity score is not evidence that two people are the same person or belong to the same family."),
        point("Review privacy details", "Check the product privacy policy if you need information about how your uploaded images are processed and retained."),
      ],
    },
  ],
  FACE_READING: [
    {
      title: "What an online attractiveness test can show",
      description: "An attractiveness test estimates visual signals in one uploaded photo, including facial balance, feature harmony, symmetry cues, and image conditions. It cannot measure your personality, confidence, warmth, style in motion, or the many individual and cultural ways people experience attraction. The result is most useful as a cosmetic and photo-styling prompt. It should never become a definition of your value or a rule for how you need to look.",
      points: [
        point("A photo-based estimate", "The tool reads the image you upload, so its result reflects the lighting, pose, expression, and styling in that moment."),
        point("More than a number", "Feature notes and visual context are more useful than focusing only on a score."),
        point("Personal perspective matters", "Keep the styles and suggestions that fit your own sense of confidence, and ignore anything that does not."),
      ],
    },
    {
      title: "Use your result for photo and style confidence",
      description: "A report can help you identify the parts of a portrait that already work well and the small details you might want to test. You may find that a particular camera height, hair part, brow shape, lip shade, or lighting direction makes you feel more put together. Use that information to build a simple reference for your next photo or event. Confidence comes from choice and comfort, not from pursuing a fixed score.",
      points: [
        point("Find your stronger angles", "Try a level camera, a slight turn, or a softer expression and compare which image feels most natural to you."),
        point("Plan one styling test", "Choose one idea, such as a brow adjustment or hair framing change, instead of trying to alter a whole look."),
        point("Save useful notes", "Keep the guidance that helps you prepare for profile photos, dates, events, or creator content."),
      ],
    },
    {
      title: "Why your result can change between photos",
      description: "It is normal for an image-based result to shift when the image changes. Different lenses alter apparent proportions, overhead light can create stronger shadows, and a smile can change how facial features sit in a frame. Makeup, hair, and even a more relaxed posture affect the visual impression. Treat repeat scans as a way to learn about photo conditions, not as a reason to chase the same number every time.",
      points: [
        point("Camera distance matters", "Holding a phone too close can exaggerate central features, while a little more distance often creates a calmer portrait."),
        point("Light changes detail", "Soft even light is generally more useful for a baseline than a dramatic light source from above or one side."),
        point("Expression changes balance", "A genuine, relaxed expression can look very different from a tense pose taken only for a score."),
      ],
    },
    {
      title: "Keep attractiveness feedback in perspective",
      description: "It is healthy to be selective about the feedback you use. If a result feels upsetting or causes you to compare yourself harshly, step away from the tool. Your appearance is not a project that requires constant optimization. The analysis is intended for entertainment and optional cosmetic ideas, never medical advice or a substitute for support from people and professionals who know you beyond one picture.",
      points: [
        point("Set a personal boundary", "Use the tool only when you are curious about a look, not when you are looking for permission to feel good about yourself."),
        point("Skip unhelpful suggestions", "You do not need to act on every note, especially if it conflicts with your comfort, identity, or style."),
        point("Seek support when needed", "Talk to someone you trust or a qualified professional if appearance concerns are affecting your wellbeing."),
      ],
    },
  ],
  GOLDEN_RATIO: [
    {
      title: "What golden ratio face analysis explores",
      description: "Golden ratio face analysis uses classic proportion ideas from art and design to look at visible relationships between facial areas. The report may map facial thirds, fifths, width, length, and other harmony cues on your photo. These ratios are interesting visual references, not scientific proof of beauty or a standard that real faces should match. Natural variation is expected, and the most useful part of the report is learning how proportions read in a photograph.",
      points: [
        point("Facial thirds", "The map may divide the face into upper, middle, and lower areas to show how those regions appear in the uploaded image."),
        point("Facial fifths", "Vertical guides can help illustrate relative width and feature spacing in a simple visual format."),
        point("Harmony, not a rule", "The analysis treats proportion as an educational design concept rather than a pass or fail beauty measurement."),
      ],
    },
    {
      title: "Read proportion guides in a practical way",
      description: "The purpose of an overlay is to make an idea visible, not to tell you that you need to correct your face. You can use the map to see why a camera angle, crop, or hairstyle makes a photo feel different. Artists, photographers, and makeup professionals often use proportion as one tool among many. Your own taste, expression, color, texture, and personal style matter just as much as any line on a diagram.",
      points: [
        point("Use the guides as context", "Look at how the lines sit on one photo, then notice which elements of the framing may have influenced them."),
        point("Avoid exact comparisons", "A ratio from a phone image is an estimate and should not be compared harshly with edited or posed reference images."),
        point("Translate to styling", "If it helps, use the map to explore hair volume, face framing, or makeup balance, not to pursue symmetry perfection."),
      ],
    },
    {
      title: "Use proportion ideas for stronger photos",
      description: "Photography can change the apparent proportions of a face more than people expect. Lens choice, camera distance, head tilt, and cropping all change what a viewer sees. Your golden ratio report can give you a starting point for testing a level camera, a slightly wider crop, or a different distance from the phone. Save the setup that makes you feel most confident rather than trying to make every photo look mathematically identical.",
      points: [
        point("Step back from the lens", "A little distance between you and the camera can reduce the exaggerated look that close selfies sometimes create."),
        point("Keep the head level", "A level head and camera make the visual guides easier to interpret and compare from one scan to the next."),
        point("Test the crop", "Try leaving a little breathing room around the face before deciding which portrait feels best to you."),
      ],
    },
    {
      title: "Keep beauty ratios in perspective",
      description: "Faces are living, expressive, and naturally varied. No proportion formula can capture the quality of a smile, a person's energy, or the way someone is perceived in real life. The tool is intended for learning, photo planning, and cosmetic curiosity. If a ratio result makes you feel pressured to change your appearance, it is okay to leave it behind. A good beauty tool should give you options, not make you feel smaller.",
      points: [
        point("No ideal face exists", "Classical ratios are one historical design idea, not a universal definition of attractiveness or value."),
        point("Keep your preferences central", "Use only the insights that support a look you already enjoy or want to explore for yourself."),
        point("Use professional advice for procedures", "An image-based proportion guide is not medical, surgical, or professional treatment advice."),
      ],
    },
  ],
};
