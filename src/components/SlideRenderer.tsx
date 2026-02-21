import type { SlideContent } from "@/lib/types";
import { getIcon } from "@/lib/icons";
import SlideLayout from "./SlideLayout";
import SectionHeader from "./SectionHeader";
import FeatureCard from "./FeatureCard";
import CodeBlock from "./CodeBlock";
import TableBlock from "./TableBlock";

interface SlideRendererProps {
  slide: SlideContent;
  gradient?: boolean;
  isFirstSlide?: boolean;
}

export default function SlideRenderer({
  slide,
  gradient = false,
  isFirstSlide = false,
}: SlideRendererProps) {
  return (
    <SlideLayout gradient={gradient}>
      <div className="space-y-8">
        {/* Header */}
        <SectionHeader
          overline={slide.overline}
          title={slide.title}
          subtitle={slide.subtitle}
          headingLevel={isFirstSlide ? "h1" : "h2"}
        />

        {/* Features grid */}
        {slide.features && slide.features.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {slide.features.map((feature, i) => (
              <FeatureCard
                key={i}
                title={feature.title}
                description={feature.description}
                icon={feature.icon ? getIcon(feature.icon) : undefined}
              />
            ))}
          </div>
        )}

        {/* Bullets */}
        {slide.bullets && slide.bullets.length > 0 && (
          <ul className="space-y-3" role="list">
            {slide.bullets.map((bullet, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary md:text-base"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-purple"
                  aria-hidden="true"
                />
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {/* Code examples */}
        {slide.codeExamples && slide.codeExamples.length > 0 && (
          <div className="space-y-6">
            {slide.codeExamples.map((example, i) => (
              <CodeBlock
                key={i}
                code={example.code}
                language={example.language}
                title={example.title}
              />
            ))}
          </div>
        )}

        {/* Tables */}
        {slide.tables && slide.tables.length > 0 && (
          <div className="space-y-6">
            {slide.tables.map((table, i) => (
              <TableBlock
                key={i}
                headers={table.headers}
                rows={table.rows}
              />
            ))}
          </div>
        )}

        {/* Key takeaway */}
        {slide.keyTakeaway && (
          <blockquote className="rounded-lg border-l-4 border-accent-purple bg-secondary px-6 py-4">
            <p className="text-sm italic leading-relaxed text-text-secondary md:text-base">
              {slide.keyTakeaway}
            </p>
          </blockquote>
        )}

        {/* Notes */}
        {slide.notes && slide.notes.length > 0 && (
          <div className="space-y-3">
            {slide.notes.map((note, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-text-muted md:text-base"
              >
                {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </SlideLayout>
  );
}
