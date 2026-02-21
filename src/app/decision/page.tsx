import { getSectionByPath } from "@/lib/content";
import SlideRenderer from "@/components/SlideRenderer";
import { notFound } from "next/navigation";

export default function DecisionPage() {
  const section = getSectionByPath("/decision");
  if (!section) notFound();
  return (
    <main className="pb-20">
      {section.slides.map((slide, i) => (
        <SlideRenderer key={i} slide={slide} gradient={i === 0} isFirstSlide={i === 0} />
      ))}
    </main>
  );
}
