/**
 * Headline capitalization used at render time for headings only.
 * Small words stay lowercase in the middle of a heading. Every other word is
 * capitalized, including any word of four letters or more. Words that are all
 * caps, contain a digit or have an inner capital (AI, 3D, 7-Day, PNG, iPhone)
 * are left alone. The first word, the last word and the first word after a
 * colon or full stop are always capitalized, and each part of a hyphenated word
 * is capitalized too.
 */
const SMALL_WORDS = new Set(["a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet", "to", "of", "in", "on", "at", "by", "as", "per", "via", "vs"]);

const upperFirst = (part: string) => part.replace(/[A-Za-z]/, (letter) => letter.toUpperCase());

function keepAsIs(core: string) {
  return /\d/.test(core) || /[A-Z]{2,}/.test(core) || /[a-z][A-Z]/.test(core);
}

/** Hyphenated compounds: the first and last part are capitalized, small words in between stay lowercase (One-of-a-Kind). */
/** Acronyms that are written in capitals even when the source text is lowercase. */
const ACRONYMS = new Set(["dpi", "ppi", "tiff", "jpeg", "jpg", "png", "pdf", "faq", "ai", "uv", "seo", "diy", "url", "usb", "hd", "fadgi", "nedcc"]);

function capitalizeWord(core: string) {
  if (keepAsIs(core)) return core;
  if (ACRONYMS.has(core.toLowerCase())) return core.toUpperCase();
  const parts = core.split("-");
  return parts.map((part, index) => {
    if (keepAsIs(part)) return part;
    const middle = index > 0 && index < parts.length - 1;
    return middle && SMALL_WORDS.has(part.toLowerCase()) ? part.toLowerCase() : upperFirst(part);
  }).join("-");
}

/** "on" belongs to the verb in these phrases, so it is capitalized (Try On Clothes). */
const PHRASAL_VERBS = new Set(["try", "put", "turn"]);

export function titleCase(text: string): string {
  const words = text.split(/(\s+)/);
  const indexes = words.map((word, index) => (/\S/.test(word) ? index : -1)).filter((index) => index >= 0);
  const last = indexes[indexes.length - 1];
  let afterBreak = true;
  let previous = "";
  return words.map((token, index) => {
    if (!/\S/.test(token)) return token;
    const match = token.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/)!;
    const [, lead, core, trail] = match;
    if (!core) return token;
    const phrasal = core.toLowerCase() === "on" && PHRASAL_VERBS.has(previous);
    const small = SMALL_WORDS.has(core.toLowerCase()) && !phrasal;
    previous = core.toLowerCase();
    const edge = afterBreak || index === last;
    let out: string;
    if (keepAsIs(core)) out = core;
    else if (small && !edge) out = core.toLowerCase();
    else out = capitalizeWord(core);
    afterBreak = /[:.!?]$/.test(trail);
    return lead + out + trail;
  }).join("");
}
