// Plain-language bullet list for narrative payload fields (annotation text, etc.)
// so the report reads like something a person wrote, not a JSON dump.
export function InsightsList({ title = "What we noticed", items }: { title?: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-6">
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-(--color-burgundy)">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((text, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-(--color-text)">
            <span className="mt-0.5 text-(--color-burgundy)">•</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
