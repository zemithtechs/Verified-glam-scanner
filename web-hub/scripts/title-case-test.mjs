// Run with: node --experimental-strip-types scripts/title-case-test.mjs
import { titleCase } from "../lib/title-case.ts";

const cases = [
  ["Use your palette to shop and style with confidence.", "Use Your Palette to Shop and Style With Confidence."],
  ["Here is what your result means.", "Here Is What Your Result Means."],
  ["Try more tools on the same photo.", "Try More Tools on the Same Photo."],
  ["Pick a front-facing photo for your AI report.", "Pick a Front-Facing Photo for Your AI Report."],
  ["Get your 3D avatar as a PNG.", "Get Your 3D Avatar as a PNG."],
  ["Follow the 7-day glow-up plan.", "Follow the 7-day Glow-Up Plan."],
  ["the best way to start", "The Best Way to Start"],
  ["Start here: pick a tool to try.", "Start Here: Pick a Tool to Try."],
  ["Your first result is free. Pay only for more.", "Your First Result Is Free. Pay Only for More."],
  ["Ask before you post it up", "Ask Before You Post It Up"],
  ["Try-on clothes before you buy", "Try-On Clothes Before You Buy"],
  ["Use iPhone photos with AI tools", "Use iPhone Photos With AI Tools"],
  ["Can't sign in?", "Can't Sign In?"],
  ["Pay as you go and buy credits once.", "Pay as You Go and Buy Credits Once."],
  ["Save per credit via yearly billing", "Save per Credit via Yearly Billing"],
  ["See your skin up close.", "See Your Skin Up Close."],
  ["Take it off the list", "Take It Off the List"],
  ["Virtual try on clothes before you buy", "Virtual Try On Clothes Before You Buy"],
  ["Put on a new look", "Put On a New Look"],
  ["A one-of-a-kind look for you", "A One-of-a-Kind Look for You"],
  ["Pay-per-view style tips", "Pay-per-View Style Tips"],
  ["Glow-up ideas for you", "Glow-Up Ideas for You"],
  ["  spaced   out   words  ", "  Spaced   Out   Words  "],
];

let failed = 0;
for (const [input, expected] of cases) {
  const actual = titleCase(input);
  if (actual !== expected) { failed++; console.log(`FAIL  "${input}"\n      expected "${expected}"\n      actual   "${actual}"`); }
}
console.log(failed ? `${failed} of ${cases.length} cases failed.` : `All ${cases.length} title case cases passed.`);
process.exit(failed ? 1 : 0);
