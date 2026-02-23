import { getSectionByPath } from "@/lib/content";
import { agentCatalog } from "@/lib/agents-catalog";
import SlideRenderer from "@/components/SlideRenderer";
import AgentCatalog from "@/components/AgentCatalog";
import { notFound } from "next/navigation";

export default function AgentsPage() {
  const section = getSectionByPath("/agents");
  if (!section) notFound();
  return (
    <main className="pb-20">
      {section.slides.map((slide, i) => (
        <SlideRenderer key={i} slide={slide} gradient={i === 0} isFirstSlide={i === 0} />
      ))}
      <AgentCatalog agents={agentCatalog} />
    </main>
  );
}
