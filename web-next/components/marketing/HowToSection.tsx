import { Section, SectionTitle } from "./Section";
import type { HowToStep } from "@/lib/tool-landing-types";

export function HowToSection({ title, steps }: { title: string; steps: HowToStep[] }) {
  return (
    <Section>
      <SectionTitle title={title} />
      <div className="grid sm:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={step.title} className="text-center">
            <div className="w-12 h-12 rounded-full bg-(--color-burgundy) text-white font-extrabold flex items-center justify-center mx-auto mb-4">
              {i + 1}
            </div>
            <p className="font-bold text-(--color-text)">{step.title}</p>
            <p className="mt-2 text-sm text-(--color-text-muted) leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
