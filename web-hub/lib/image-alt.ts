import type { Tool } from "@/lib/catalog";

/** Cut text at a sentence or word boundary so alt text stays under about 140 characters. */
export function clip(text: string, max = 140) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sentence = clean.slice(0, max).match(/^.*[.!?](?=\s|$)/);
  if (sentence && sentence[0].length > 50) return sentence[0];
  return clean.slice(0, max).replace(/\s+\S*$/, "").replace(/[,;:\-–—]$/, "");
}

const firstSentence = (text: string) => (text.match(/^.*?[.!?](?=\s|$)/) ?? [text])[0];
const noPeriod = (text: string) => text.replace(/[.\s]+$/, "");
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

/** Alt text for a feature example image: its story title plus the sentence that describes what it shows. */
export function featureAlt(tool: Pick<Tool, "name">, story: { title: string; body: string }) {
  const title = noPeriod(story.title);
  const full = `${title}: ${lowerFirst(noPeriod(firstSentence(story.body)))}`;
  const text = full.length <= 125 ? full : title;
  const suffixed = `${text} (${tool.name} example)`;
  return text.toLowerCase().includes(tool.name.toLowerCase()) || suffixed.length > 135 ? text : suffixed;
}

/** Alt text for the main result example of a tool (public/img/results/<slug>.png). */
export const resultAlt = (tool: Pick<Tool, "name" | "summary">) => `${tool.name} example result. ${clip(tool.summary, 110)}`;

/** Alt text for a tool card thumbnail: names the tool and the outcome. */
export const cardAlt = (tool: Pick<Tool, "name" | "summary">) => `${tool.name} example: ${clip(lowerFirst(noPeriod(tool.summary)), 110)}`;
