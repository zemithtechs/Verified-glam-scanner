import type { CopyMap } from "./types";
import { COPY_FACE_ANALYSIS } from "./face-analysis";
import { COPY_GLOWUP_SKIN_HAIR } from "./glowup-skin-hair";
import { COPY_MAKEUP_FASHION_PHOTO } from "./makeup-fashion-photo";
import { COPY_FUN_EFFECTS } from "./fun-effects";

export const TOOL_COPY: CopyMap = {
  ...COPY_FACE_ANALYSIS,
  ...COPY_GLOWUP_SKIN_HAIR,
  ...COPY_MAKEUP_FASHION_PHOTO,
  ...COPY_FUN_EFFECTS,
};
