import Link from "next/link";
import Image from "next/image";

const TOOLS_COL_1 = [
  { label: "Face Beauty Analysis", href: "/face-beauty-analysis" },
  { label: "Seasonal Color Palette", href: "/seasonal-color-palette" },
  { label: "Beauty Routine Challenge", href: "/beauty-routine-challenge" },
  { label: "Beauty Tips", href: "/beauty-tips" },
  { label: "Celebrity Look Alike", href: "/celebrity-look-alike" },
];

const TOOLS_COL_2 = [
  { label: "Facial Symmetry", href: "/facial-symmetry" },
  { label: "Beauty Score Showdown", href: "/beauty-score-showdown" },
  { label: "Face Comparison", href: "/face-comparison" },
  { label: "Attractiveness Test", href: "/attractiveness-test" },
  { label: "Face Golden Ratio", href: "/face-golden-ratio" },
];

export function MarketingFooter() {
  return (
    <footer style={{ background: "#520D1C" }} className="text-white/88">
      <div className="max-w-(--max-content) mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="" width={40} height={40} className="rounded-lg" />
            <span className="font-extrabold text-white">Verified Glam Scanner</span>
          </div>
          <p className="mt-3 text-sm text-white/70 max-w-xs">
            AI beauty analysis with your photo at the center. Upload, analyze, and get personalized insights.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">AI Tools</p>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            {TOOLS_COL_1.map((tool) => (
              <Link key={tool.href} href={tool.href} className="hover:text-white">
                {tool.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-white mb-3 select-none">&nbsp;</p>
          <div className="flex flex-col gap-2 text-sm text-white/70">
            {TOOLS_COL_2.map((tool) => (
              <Link key={tool.href} href={tool.href} className="hover:text-white">
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/15 py-5">
        <div className="max-w-(--max-content) mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
          <span>&copy; {new Date().getFullYear()} Verified Glam Scanner</span>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/delete-account" className="hover:text-white">
            Delete account
          </Link>
          <Link href="/pricing" className="hover:text-white">
            Pricing
          </Link>
          <a href="mailto:support@verifiedglam.com" className="hover:text-white">
            support@verifiedglam.com
          </a>
        </div>
      </div>
    </footer>
  );
}
