import type { AgentCatalogEntry } from "@/lib/types";
import AgentCard from "./AgentCard";

interface AgentCatalogProps {
  agents: AgentCatalogEntry[];
}

export default function AgentCatalog({ agents }: AgentCatalogProps) {
  return (
    <section className="px-6 py-16" aria-labelledby="agent-catalog-heading">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-3 text-sm uppercase tracking-[0.1em] text-accent-purple">
          Agent Catalog
        </p>
        <h2 id="agent-catalog-heading" className="mb-4 text-4xl font-medium leading-tight text-text-primary md:text-5xl">
          Available Agents
        </h2>
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-text-secondary">
          Ready-to-use agent definitions for Claude Code. Copy any file into your
          project&apos;s .claude/agents/ directory to activate it.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </section>
  );
}
