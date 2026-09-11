import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import type { ReviewItem } from "@/lib/tool-landing-types";

type ReviewWithAvatar = ReviewItem & { avatar?: string };

export function ReviewsSection({ items }: { items: ReviewWithAvatar[] }) {
  return (
    <Section tint className="py-16 sm:py-20">
      <SectionTitle title="What people are saying" subtitle="A few of the ways people use Verified Glam to make their beauty routine feel more personal." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((review) => (
          <article key={review.name} className="relative flex min-h-[250px] flex-col rounded-[22px] border border-(--color-border) bg-white p-6 shadow-[0_14px_32px_rgba(82,13,28,0.05)] sm:p-7">
            <Quote aria-hidden="true" className="absolute right-6 top-6 size-8 text-(--color-blush) sm:right-7 sm:top-7" strokeWidth={2.8} />
            <div className="mb-5 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} className={i < review.rating ? "fill-(--color-burgundy) text-(--color-burgundy)" : "text-(--color-border)"} />)}
            </div>
            <p className="max-w-[32ch] text-[15px] leading-7 text-(--color-text)">&ldquo;{review.text}&rdquo;</p>
            <div className="mt-auto flex items-center gap-3 pt-6">
              {review.avatar && (
                <Image
                  src={`/images/reviews/${review.avatar}`}
                  alt={review.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-full border-2 border-white object-cover shadow-sm"
                />
              )}
              <div><p className="text-sm font-extrabold text-(--color-burgundy-dark)">{review.name}</p><p className="mt-0.5 text-xs text-(--color-text-muted)">Verified Glam user</p></div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
