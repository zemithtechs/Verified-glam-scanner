// Finds the lowest-scoring entry in a subscores/measurements map — used to
// surface an honest, data-backed "biggest opportunity" callout instead of a
// fabricated one.
export function lowestEntry(scores: Record<string, number>): { key: string; value: number } | null {
  const entries = Object.entries(scores);
  if (entries.length === 0) return null;
  return entries.reduce((min, [key, value]) => (value < min.value ? { key, value } : min), { key: entries[0][0], value: entries[0][1] });
}
