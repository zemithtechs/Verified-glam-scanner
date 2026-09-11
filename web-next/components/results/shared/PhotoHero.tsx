// Mirrors lib/components/vg/results/vg_face_photo_hero.dart (passport mode):
// 3:4 portrait frame, center-cropped photo, 28%-alpha black scrim, overlay slot.
export function PhotoHero({ photoUrl, overlay }: { photoUrl: string | null; overlay?: React.ReactNode }) {
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[360px] overflow-hidden rounded-[20px] bg-(--color-surface)">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="Analyzed portrait" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-(--color-blush) text-(--color-burgundy)/50" />
      )}
      <div className="absolute inset-0 bg-black/28" />
      {overlay && <div className="absolute inset-0">{overlay}</div>}
    </div>
  );
}
