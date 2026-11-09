import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap">
      <Image src="/img/favicon.png" alt="" width={34} height={34} className="rounded-xl" />
      <span className={`font-display text-[19px] font-semibold sm:text-xl tracking-tight ${light ? "text-white" : "text-ink"}`}>
        AI Beauty <span className={light ? "text-rose" : "text-berry"}>Styling</span>
      </span>
    </Link>
  );
}
