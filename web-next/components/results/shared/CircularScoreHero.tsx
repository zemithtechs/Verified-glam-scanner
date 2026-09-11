// Premium summary header inspired by app-store-style beauty-score apps: a
// circular framed portrait with the headline score overlapping its bottom
// edge. Sits above the existing detailed (rectangular, overlay-annotated)
// photo hero — it doesn't replace it, since that one carries real overlay data.
export function CircularScoreHero({ photoUrl, score, scoreSuffix, tierLabel }: { photoUrl: string | null; score: string; scoreSuffix: string; tierLabel: string }) {
  return (
    <div className="flex flex-col items-center pb-3 pt-1 text-center">
      <div className="relative">
        <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-(--color-burgundy) shadow-[0_10px_24px_rgba(82,13,28,0.18)]">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Your portrait" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-(--color-blush)" />
          )}
        </div>
        <span className="absolute left-1/2 -bottom-3 -translate-x-1/2 whitespace-nowrap rounded-full bg-(--color-burgundy-dark) px-3 py-1 text-sm font-extrabold text-white shadow-md">
          {score}
          <span className="font-semibold opacity-70">{scoreSuffix}</span>
        </span>
      </div>
      <p className="mt-5 text-base font-extrabold text-(--color-burgundy-dark)">{tierLabel}</p>
    </div>
  );
}
