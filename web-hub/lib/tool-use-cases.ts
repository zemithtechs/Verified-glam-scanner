import type { CategoryId, Tool } from "@/lib/catalog";
import { TOOL_COPY } from "@/lib/copy";
import type { UseCase } from "@/lib/copy/types";

export type { UseCase };

// Concrete applications, not promises about an AI-generated outcome. These sit
// beside each tool's existing feature copy and keep the landing pages distinct.
const TOOL_CASES: Record<string, [UseCase, UseCase]> = {
  "lip-color-changer": [
    { title: "Compare an everyday shade with a night-out shade.", body: "Preview rose nude, berry, red or peach gloss on the same portrait, so your skin, hair and light stay the same. Seeing two shades on one face shows you which one you would actually wear. Save both images and look at them again the next morning, when the colors feel less exciting." },
    { title: "Narrow your shortlist before you buy a lipstick.", body: "Save the color family you like, then test real formulas in a shop or ask for a sample. Screens change color, so treat the preview as a direction and not an exact swatch. Write down the color family name from your result, and take it with you so a shop assistant can suggest real shades." },
  ],
  "eyeshadow-try-on": [
    { title: "Pick a mood for your next event.", body: "Try soft bronze, rose shimmer or smoky plum on one portrait and judge the whole face, not an isolated palette. Choose the look that still feels like you in that light. Look at the result on your phone and again on a bigger screen, because eye makeup can read differently at each size." },
    { title: "Check placement and intensity on your own eye shape.", body: "Look at where the color sits on your lid and how strong it reads at normal size. Your original eye shape stays visible, so you can compare before you buy a palette. If the shimmer looks too strong, run the tool again with a softer shade and compare the two images." },
  ],
  "colored-contacts": [
    { title: "See how a new eye color looks on your face.", body: "Compare hazel, green, blue and gray on your own portrait. Pupil size and reflections stay natural, so the color reads as part of your face and not a sticker. Check the result next to your own photo, and pick the shade that you would still like in a week." },
    { title: "Use it as a style idea, not as eye-care advice.", body: "The image shows color only. Lens fit, hygiene and eye health need an eye-care professional, so ask one before you buy real contacts. Real lenses can feel different, change how you see and need proper cleaning, so use the image only to decide which color you like. Book an eye exam before you buy any lens." },
  ],
  "virtual-try-on-clothes": [
    { title: "Check an outfit's mood before you buy it.", body: "Pair a clear photo of yourself with a separate photo of the garment to see its color and how it drapes on you. It tells you fast whether the style deserves a closer look. Try more than one garment photo on the same picture of you, and keep the one that makes you want to wear it out." },
    { title: "Build a shopping shortlist from the result.", body: "Use the before-and-after image to rule a style in or out. Then check the real size, fabric and return policy before you pay, because a preview cannot know them. Screenshot the best looks into one folder, then compare prices and reviews for each item before you spend money." },
  ],
  "cartoon-yourself": [
    { title: "Make a playful profile picture that still looks like you.", body: "Try soft 3D, comic ink or anime and check that your hair, expression and clothes are still recognizable. The best result is a funny version of you, not a stranger. Try the same photo with two different styles and ask a friend which one looks more like you." },
    { title: "Turn the cartoon into a party invitation.", body: "Use the illustrated portrait on an invitation or a party graphic. Ask the person in the photo first, and say the picture is an edited cartoon. Keep the invitation short, add the date and the place, and tell guests that the picture is a cartoon made from a real photo. That way nobody is confused." },
  ],
  "old-photo-restoration": [
    { title: "Clean up a family print before you share it.", body: "Start with the clearest scan you have and review the repaired scratches and faded areas. Check that the people still look like themselves before you send it around. Share the restored version with relatives and ask whether it looks like the person they remember. Their memory is the best check you have." },
    { title: "Keep the original scan next to the restored one.", body: "Save the source file separately. Restored detail is a plausible guess, not proof of what was there, so keep both versions. Name the two files clearly, such as grandma-original and grandma-restored, and store them together. Years from now you will know exactly what was changed and which version is the real print." },
  ],
  "face-blur": [
    { title: "Hide faces before you post a group photo.", body: "Blur the faces of people who did not agree to be shared, then check the whole image. Name tags, clothing and reflections can still identify someone, so look at every corner before you post. If you are not sure whether a person is still recognizable, blur more, or crop them out of the frame completely." },
    { title: "Keep the original and share only the blurred copy.", body: "Download the blurred version as a new file and leave your source untouched. Share the blurred file only, and store the original somewhere private. Do not upload the original to a chat or a shared album by mistake. A clear file name such as blurred-final helps you pick the right image when you are in a hurry." },
  ],
  "merge-portraits": [
    { title: "Put two people in one picture with permission.", body: "Add two adult portraits, with both people's agreement, and see them combined into one image. It works best when both photos have similar light and the faces point the same way. Ask both people first, tell them where the picture will be shared, and delete it if either of them changes their mind." },
    { title: "Check both faces before you share the merge.", body: "Open the result at full size and look at the edges, the hair and the skin tone where the two photos meet. Say the image is edited when you post it. If one face looks off, go back and try a different pair of photos with closer light and angles." },
  ],
};

const CATEGORY_CASES: Record<CategoryId, [UseCase, UseCase]> = {
  "face-analysis": [
    { title: "Read the guides against your own photo.", body: "Start with a straight-on portrait in even light, then look at what the report points out beside your face. The guides are illustrative, so treat them as notes about one photo and not as measurements of you. Take the notes one at a time and ask whether you can see each point in your picture." },
    { title: "Try a second angle before you decide.", body: "Upload another photo taken in different light or at a different camera height, and compare the two reports. If they disagree, the camera caused it, not your face. That tells you which photo to trust. Use two or three photos taken on different days and keep the notes that appear in all of them." },
  ],
  "glow-up": [
    { title: "Start with one idea you can wear this week.", body: "Pick a single color or styling direction from your result and pair it with clothes you already own. One lipstick or one scarf is enough to find out whether the idea suits you before you spend anything. Write the idea on your phone, and check it in daylight before you decide." },
    { title: "Keep what matches your taste and drop the rest.", body: "Your result is a starting point, not a dress code. Save the suggestions that feel like you and ignore anything that does not fit your routine, your budget or the way you like to look. A short list of two or three ideas is easier to use than a long one, so cut it down before you shop." },
  ],
  "skin-retouch": [
    { title: "Check the whole portrait before you save it.", body: "Put the edited photo beside the original and look at the full frame, not only the area you changed. If the edit still looks like you, it works. If something feels off, try again with a lighter touch. Look at your eyes, hair and background too, because an edit can change more than you expect." },
    { title: "Zoom in to make sure your features survive.", body: "Open the result at full size and look at texture, freckles and the lighting on your face. A good edit tidies a distraction and leaves the details that make the photo recognizably yours. If freckles, moles or fine lines disappeared in a way you do not like, save a lighter version instead." },
  ],
  "hair-beard": [
    { title: "Take a picture of the idea to your stylist.", body: "Show the preview instead of describing a cut in words. A stylist or barber can then tell you what works with your hair texture and density, and what would need more upkeep than you want. Bring two or three images, so your stylist can see what you like about each one, and ask what the cut needs each morning." },
    { title: "Compare several shapes before you book.", body: "Look at how each style frames your forehead and jaw from a few steps back, not only in a close crop. The outline around your face is what people notice first, so judge that. Save the images side by side and ask a friend which one looks most like you, then book that appointment." },
  ],
  "makeup-tryon": [
    { title: "See the shade on your whole face.", body: "A color looks different beside your hair, skin and clothes than it does on a swatch. Judge the preview as one complete look, then note the color family you liked before you go shopping. Look at it from arm's length as well, because that is how most people will see you." },
    { title: "Test the real product before you buy it.", body: "Screens, daylight and real formulas all change how a shade looks. Use the preview to narrow the choice to two or three colors, then try those in a shop or ask for a sample. Ask the shop for a tester or a sample, and check the color in daylight before you pay." },
  ],
  "fashion-style": [
    { title: "Try the idea on a photo before you spend money.", body: "Use the result to check color, proportion and overall mood on your own picture. It is a planning aid that helps you rule a style in or out before you pay for it. Save the preview and look at it again after a day, then decide whether you still want it." },
    { title: "Check the real thing before you commit.", body: "A preview cannot know your size, your skin or how a material moves. Keep the result next to your original photo, then confirm measurements, placement and the return policy or an artist's advice before you decide. Ask the shop or the artist for sizing, material and return details, and show them your result so they know what you want." },
  ],
  "fun-effects": [
    { title: "Make a playful image that still looks like you.", body: "Pick an effect and check that your expression and hair are still recognizable in the result. The best ones feel like a funny version of you, which is what makes friends smile when they see it. Pick the effect that makes you smile and keep the others as spares for later." },
    { title: "Share it only when everyone in the photo agrees.", body: "Use photos of adults who have said yes to being edited. Tell people the image is made with an effect before you post it, so nobody mistakes it for a real photo. A quick message asking whether it is fine to post takes a minute and keeps your friendships safe." },
  ],
  "photo-tools": [
    { title: "Fix one specific problem with your photo.", body: "Start from the clearest original you have, run the tool once and look at the whole result. A focused fix beats a long editing session, and you keep full control of what you save. Pick one problem, such as blur or a faded print, and judge the result only on that point." },
    { title: "Keep your original file safe.", body: "Download the new version as a separate file and leave the source untouched. That way you can always go back and compare, or try again with a different photo. Give the new file a different name, such as holiday-edited, and keep both in the same folder. Nothing is lost if you change your mind, and you can start again whenever you like." },
  ],
};

export function getToolUseCases(tool: Tool): [UseCase, UseCase] {
  return TOOL_COPY[tool.slug]?.useCases ?? TOOL_CASES[tool.slug] ?? CATEGORY_CASES[tool.category];
}
