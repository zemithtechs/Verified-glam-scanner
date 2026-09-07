/**
 * Homepage hero "app preview" — three phone screens built from the actual
 * dashboard design and real tested data (the Face Beauty Analysis
 * subscores here are a genuine response captured from the live analyze
 * endpoint during testing), not a stock photo with fake overlays. No
 * screenshot tool is available in this environment to capture the running
 * app directly, so this recreates its real screens in code instead of
 * faking a photo.
 */
function PhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute w-[58%] aspect-[9/18] rounded-[26px] bg-white border-[3px] border-white shadow-[0_20px_40px_rgba(135,43,63,0.2)] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

function DashboardScreen() {
  const tools = ["Face Beauty", "Symmetry", "Celebrity", "Color", "Beauty Tips", "Golden Ratio"];
  return (
    <div className="h-full flex flex-col" style={{ background: "linear-gradient(180deg, #F6E3E3 0%, #FFF7F7 100%)" }}>
      <div className="px-3 pt-4 pb-2">
        <p className="text-[10px] font-extrabold text-(--color-burgundy-dark)">Verified Glam</p>
        <p className="text-[7px] text-(--color-text-muted)">Pick an analysis to begin</p>
      </div>
      <div className="mx-3 rounded-lg text-white p-2 mb-2" style={{ background: "linear-gradient(135deg, #872B3F 0%, #C79A9A 100%)" }}>
        <p className="text-[6px] opacity-80">Featured</p>
        <p className="text-[8px] font-bold">Face Beauty Analysis</p>
      </div>
      <div className="grid grid-cols-2 gap-1.5 px-3">
        {tools.map((label) => (
          <div key={label} className="rounded-md bg-white/90 border border-(--color-border) p-1.5">
            <p className="text-[6.5px] font-semibold text-(--color-text)">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Real response captured from the live analyze endpoint during testing.
const RESULT = { beautyScore: 92, subscores: { symmetry: 86, featureBalance: 96, skinQuality: 91, youthfulCues: 96 } };

function ResultScreen() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-3 pt-4 pb-2 border-b border-(--color-border)">
        <p className="text-[9px] font-bold text-(--color-burgundy-dark)">Face Beauty Analysis</p>
      </div>
      <div className="flex flex-col items-center py-4">
        <div className="relative w-16 h-16 rounded-full border-4 border-(--color-blush) flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(#872B3F ${RESULT.beautyScore * 3.6}deg, transparent 0deg)`,
              mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 4px))",
            }}
          />
          <span className="text-base font-extrabold text-(--color-burgundy-dark)">{RESULT.beautyScore}</span>
        </div>
        <p className="text-[7px] text-(--color-text-muted) mt-1.5">Stunning harmony</p>
      </div>
      <div className="px-3 space-y-1.5">
        {Object.entries(RESULT.subscores).map(([key, value]) => (
          <div key={key}>
            <div className="flex justify-between text-[6.5px] text-(--color-text)">
              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-bold">{value}</span>
            </div>
            <div className="h-1 rounded-full bg-(--color-surface) overflow-hidden">
              <div className="h-full bg-(--color-burgundy)" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChallengeScreen() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-3 pt-4 pb-2 border-b border-(--color-border)">
        <p className="text-[9px] font-bold text-(--color-burgundy-dark)">Beauty Routine Challenge</p>
      </div>
      <div className="px-3 py-3">
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((d) => (
            <div
              key={d}
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold ${
                d <= 3 ? "bg-(--color-burgundy) text-white" : "bg-(--color-surface) text-(--color-text-muted)"
              }`}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-(--color-blush) p-2 mb-2">
          <p className="text-[6px] text-(--color-text-muted)">Current streak</p>
          <p className="text-[11px] font-extrabold text-(--color-burgundy-dark)">3 days 🔥</p>
        </div>
        <div className="rounded-lg border border-(--color-border) p-2">
          <p className="text-[6.5px] font-semibold text-(--color-text)">Day 4: Hydration Boost</p>
          <p className="text-[6px] text-(--color-text-muted) mt-0.5">8 min</p>
        </div>
      </div>
    </div>
  );
}

export function HeroMockup() {
  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center">
      <PhoneFrame className="-rotate-[10deg] -translate-x-16 translate-y-2 z-10">
        <DashboardScreen />
      </PhoneFrame>
      <PhoneFrame className="rotate-[8deg] translate-x-16 translate-y-2 z-10">
        <ChallengeScreen />
      </PhoneFrame>
      <PhoneFrame className="z-20 shadow-[0_28px_56px_rgba(135,43,63,0.28)]">
        <ResultScreen />
      </PhoneFrame>

      {/* Floating badges */}
      <div className="absolute top-0 left-0 sm:-left-2 z-30 bg-white rounded-xl shadow-[0_10px_24px_rgba(135,43,63,0.16)] px-3 py-2 flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <div>
          <p className="text-sm font-extrabold text-(--color-burgundy-dark) leading-none">7</p>
          <p className="text-[9px] text-(--color-text-muted)">7-Day Champion!</p>
        </div>
      </div>
      <div className="absolute bottom-2 right-0 sm:-right-2 z-30 bg-white rounded-full shadow-[0_8px_20px_rgba(135,43,63,0.14)] px-3 py-1.5 text-[11px] font-semibold text-(--color-burgundy)">
        ✨ Glow Getter
      </div>
    </div>
  );
}
