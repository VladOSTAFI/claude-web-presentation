"use client";

import { useState } from "react";
import type { AgentCatalogEntry } from "@/lib/types";
import CodeBlock from "./CodeBlock";

interface AgentCardProps {
  agent: AgentCatalogEntry;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className={[
        "rounded-xl border border-border-subtle bg-secondary p-6 md:p-8 transition-all duration-300",
        isExpanded
          ? "border-accent-purple/30 shadow-[0_0_30px_rgba(127,86,217,0.15)]"
          : "border-border-subtle hover:border-accent-purple/30 hover:shadow-[0_0_30px_rgba(127,86,217,0.15)]",
      ].join(" ")}
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-purple/10 text-2xl"
        aria-hidden="true"
      >
        {agent.icon}
      </div>

      <h3 className="mb-1 text-lg font-medium text-text-primary">{agent.name}</h3>

      <p className="text-sm leading-relaxed text-text-secondary">{agent.summary}</p>

      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
        aria-controls={`agent-file-${agent.id}`}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-accent-purple transition-colors duration-200 hover:text-accent-purple/80"
      >
        {isExpanded ? "Hide agent file" : "View agent file"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={[
            "h-4 w-4 transition-transform duration-300",
            isExpanded ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        id={`agent-file-${agent.id}`}
        className={isExpanded ? "mt-4 animate-fade-in" : "hidden"}
      >
        {isExpanded && (
          <CodeBlock
            code={agent.agentFileContent}
            language="markdown"
            title={`${agent.id}.md`}
          />
        )}
      </div>
    </article>
  );
}
