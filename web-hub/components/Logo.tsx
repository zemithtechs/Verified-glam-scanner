import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap sm:gap-2.5" aria-label="AI Beauty Styling home">
      <Image src="/img/favicon.png" alt="" width={34} height={34} className="h-[30px] w-[30px] rounded-xl sm:h-[34px] sm:w-[34px]" />
      {/* Under 340px wide the name is dropped so the icon, Log in and Start buttons still fit on one row. */}
      <span className={`font-display text-[16px] font-semibold tracking-tight min-[390px]:text-[19px] sm:text-xl max-[339px]:hidden ${light ? "text-white" : "text-ink"}`}>
        AI Beauty <span className={light ? "text-rose" : "text-berry"}>Styling</span>
      </span>
    </Link>
  );
}
