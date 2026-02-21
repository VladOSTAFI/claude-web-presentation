import { getSectionByPath } from "@/lib/content";
import SlideRenderer from "@/components/SlideRenderer";
import SlideLayout from "@/components/SlideLayout";
import { notFound } from "next/navigation";

export default function QAPage() {
  const section = getSectionByPath("/qa");
  if (!section) notFound();
  return (
    <main className="pb-20">
      {section.slides.map((slide, i) => (
        <SlideRenderer key={i} slide={slide} gradient={i === 0} isFirstSlide={i === 0} />
      ))}

      {/* Special "Thank you" closing slide */}
      <SlideLayout gradient>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.15em] text-accent-purple">
            End of Presentation
          </p>
          <h2 className="animate-fade-in text-5xl font-semibold leading-tight text-text-primary md:text-7xl lg:text-8xl">
            Thank you!
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary md:text-lg">
            Start with CLAUDE.md and /init, grow into agents and skills, and
            reach for teams only when you need direct inter-agent communication.
          </p>
          <div className="mt-10 flex items-center gap-3">
            <span className="h-1 w-1 animate-pulse rounded-full bg-accent-purple" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-purple [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent-purple [animation-delay:300ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-purple [animation-delay:450ms]" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-accent-purple [animation-delay:600ms]" />
          </div>
        </div>
      </SlideLayout>
    </main>
  );
}
