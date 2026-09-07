import Image from "next/image";
import { Star } from "lucide-react";
import { Section, SectionTitle } from "./Section";
import type { ReviewItem } from "@/lib/tool-landing-types";

type ReviewWithAvatar = ReviewItem & { avatar?: string };

export function ReviewsSection({ items }: { items: ReviewWithAvatar[] }) {
  return (
    <Section tint>
      <SectionTitle title="What people are saying" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((review) => (
          <div key={review.name} className="rounded-2xl bg-white border border-(--color-border) p-6">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review.rating ? "text-(--color-burgundy) fill-(--color-burgundy)" : "text-(--color-border)"}
                />
              ))}
            </div>
            <p className="text-sm text-(--color-text) leading-relaxed">&ldquo;{review.text}&rdquo;</p>
            <div className="mt-3 flex items-center gap-2.5">
              {review.avatar && (
                <Image
                  src={`/images/reviews/${review.avatar}`}
                  alt={review.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              )}
              <p className="text-sm font-semibold text-(--color-text-muted)">{review.name}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
