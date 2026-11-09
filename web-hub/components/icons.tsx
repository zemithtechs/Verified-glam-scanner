import type { ComponentType, ReactNode } from "react";
import {
  IconAdjustmentsHorizontal, IconArrowsLeftRight, IconArrowsMaximize, IconArrowsMinimize, IconBabyBottle, IconBlur, IconBrush, IconBulb,
  IconCake, IconCalendarWeek, IconCoin, IconColorFilter, IconColorPicker, IconColorSwatch, IconCrystalBall, IconDroplet, IconDropletHalf, IconEye, IconEyeEdit,
  IconEyeSpark, IconFaceId, IconFlipHorizontal, IconFolder, IconGridDots, IconGridGoldenratio, IconHanger, IconHeartSpark, IconHome,
  IconHourglass, IconLayersIntersect, IconLayoutGrid, IconLeaf, IconMasksTheater, IconMoodSmileBeam, IconMoodEmpty, IconMoodHappy,
  IconMoodSpark, IconMoodWink, IconMoustache, IconNeedle, IconPalette, IconPhoto, IconRazor, IconReplaceUser, IconRestore, IconRulerMeasure,
  IconScissors, IconShape, IconShirt, IconSparkles, IconSquareRounded, IconStar, IconTrendingDown, IconTrophy, IconUserScan,
  IconWand, IconZoomIn, IconZoomScan,
} from "@tabler/icons-react";
import type { CategoryId } from "@/lib/catalog";
export { ToolGlyph, CategoryGlyph } from "./ProductIcons";

/** Standard utility/navigation marks; product icons live in ProductIcons.tsx. */
type TablerIcon = ComponentType<{ size?: number | string; stroke?: number | string; className?: string }>;

export const GLYPHS: Record<string, TablerIcon> = {
  /* navigation */
  home: IconHome, folder: IconFolder, coin: IconCoin, grid: IconLayoutGrid,

  /* categories */
  "c-face": IconFaceId, "c-color": IconPalette, "c-skin": IconDropletHalf, "c-hair": IconScissors,
  "c-makeup": IconBrush, "c-fashion": IconHanger, "c-fun": IconMoodHappy, "c-photo": IconPhoto,

  /* face analysis */
  "face-scan": IconUserScan, symmetry: IconFlipHorizontal, "golden-ratio": IconGridGoldenratio, attractiveness: IconHeartSpark,
  celebrity: IconStar, compare: IconArrowsLeftRight, versus: IconTrophy, "face-shape": IconShape, "skin-scan": IconZoomScan, landmarks: IconGridDots,

  /* glow-up & color */
  swatches: IconColorSwatch, tips: IconBulb, calendar: IconCalendarWeek,

  /* skin & retouch */
  sparkles: IconSparkles, wand: IconWand, sliders: IconAdjustmentsHorizontal, enhance: IconArrowsMaximize, slim: IconArrowsMinimize,

  /* hair & beard */
  hairstyle: IconScissors, "hair-color": IconDroplet, beard: IconMoustache, razor: IconRazor, receding: IconTrendingDown, bald: IconMoodEmpty,

  /* makeup */
  lips: IconBrush, eyeshadow: IconColorPicker, contacts: IconEye, lashes: IconEyeSpark, brows: IconEyeEdit, "lips-plus": IconMoodSpark,

  /* fashion */
  tee: IconShirt, anchor: IconNeedle, dress: IconRulerMeasure,

  /* fun effects */
  cartoon: IconMoodSmileBeam, layers: IconColorFilter, expression: IconMoodWink, hourglass: IconHourglass, swap: IconReplaceUser,
  "square-face": IconSquareRounded, "big-head": IconZoomIn, mask: IconMasksTheater, bottle: IconBabyBottle, cake: IconCake, crystal: IconCrystalBall, leaf: IconLeaf,

  /* photo tools */
  restore: IconRestore, blur: IconBlur, merge: IconLayersIntersect,
};

export const CATEGORY_GLYPH: Record<CategoryId, string> = {
  "face-analysis": "c-face",
  "glow-up": "c-color",
  "skin-retouch": "c-skin",
  "hair-beard": "c-hair",
  "makeup-tryon": "c-makeup",
  "fashion-style": "c-fashion",
  "fun-effects": "c-fun",
  "photo-tools": "c-photo",
};

export const TOOL_GLYPH: Record<string, string> = {
  "face-beauty-analysis": "face-scan", "facial-symmetry": "symmetry", "face-golden-ratio": "golden-ratio", "attractiveness-test": "attractiveness",
  "celebrity-look-alike": "celebrity", "face-comparison": "compare", "beauty-score-showdown": "versus", "face-shape-analyzer": "face-shape",
  "skin-analysis": "skin-scan", "facial-landmarks": "landmarks",
  "seasonal-color-palette": "swatches", "beauty-tips": "tips", "beauty-routine-challenge": "calendar",
  "ai-skin-enhancement": "c-skin", "smart-beauty": "wand", "face-beauty-retouch": "sliders", "ai-face-enhancer": "enhance", "ai-face-slimming": "slim",
  "hairstyle-changer": "hairstyle", "ai-hair-color": "hair-color", "beard-styling": "beard", "beard-remover": "razor", "hair-loss-simulation": "receding", "bald-filter": "bald",
  "lip-color-changer": "lips", "eyeshadow-try-on": "eyeshadow", "colored-contacts": "contacts", "ai-eyelashes": "lashes", "ai-eyebrows": "brows", "ai-lip-enhancement": "lips-plus",
  "virtual-try-on-clothes": "tee", "ai-tattoo-generator": "anchor", "ai-waist-slimming": "dress",
  "cartoon-yourself": "cartoon", "face-filters": "layers", "facial-expression-changer": "expression", "age-gender-swap": "hourglass", "ai-face-swap": "swap",
  "square-face-filter": "square-face", "big-head-effect": "big-head", "halloween-mask": "mask", "pregnant-filter": "bottle", "birthday-image-generator": "cake",
  "ai-fortune-teller": "crystal", "elf-name-generator": "leaf",
  "old-photo-restoration": "restore", "face-blur": "blur", "merge-portraits": "merge",
};

export function Glyph({ name, size = 20, className = "", strokeWidth = 1.75 }: { name: string; size?: number; className?: string; strokeWidth?: number }) {
  const Icon = GLYPHS[name] ?? IconFaceId;
  return <Icon size={size} stroke={strokeWidth} className={className} aria-hidden="true" />;
}

/** Flat, quiet tile used behind icons in cards. No gradients. */
export function IconTile({ children, size = 36, tone = "soft", className = "" }: { children: ReactNode; size?: number; tone?: "soft" | "ink"; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-[10px] ${tone === "ink" ? "bg-ink text-white" : "bg-blush text-plum"} ${className}`} style={{ width: size, height: size }}>
      {children}
    </span>
  );
}
