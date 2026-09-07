export function Section({
  children,
  className = "",
  tint = false,
}: {
  children: React.ReactNode;
  className?: string;
  tint?: boolean;
}) {
  return (
    <section className={`py-14 px-4 sm:px-6 ${tint ? "bg-(--color-surface)" : ""} ${className}`}>
      <div className="max-w-(--max-content) mx-auto">{children}</div>
    </section>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10">
      <h2 className="text-[26px] sm:text-[32px] font-extrabold text-(--color-burgundy-dark)">{title}</h2>
      {subtitle && <p className="mt-3 text-(--color-text-muted) leading-relaxed">{subtitle}</p>}
    </div>
  );
}
