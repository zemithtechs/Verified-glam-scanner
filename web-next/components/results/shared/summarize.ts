// Turns the top-level scalar fields of a payload into short "Label: value" lines,
// used for the share-text summary and print header. Deliberately generic so it
// works across all 10 tool payload shapes without per-tool wiring.
export function summarizeForShare(payload: Record<string, unknown>): string[] {
  return Object.entries(payload)
    .filter(([, value]) => typeof value === "string" || typeof value === "number" || typeof value === "boolean")
    .slice(0, 4)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}: ${value}`);
}
