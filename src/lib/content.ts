import type { Section } from "./types";

export const sections: Section[] = [
  // ──────────────────────────────────────────────
  // SECTION 1 — What is Claude Code
  // ──────────────────────────────────────────────
  {
    id: "intro",
    path: "/",
    title: "What is Claude Code",
    shortTitle: "Intro",
    slides: [
      {
        overline: "Section 1 of 7 -- Introduction",
        title: "What is Claude Code?",
        subtitle:
          "An agentic coding CLI that lives in your terminal, understands your entire codebase, and executes tasks through natural language.",
        features: [
          {
            title: "Full-codebase awareness",
            description:
              "Reads and edits files across your entire project, not just the current file.",
            icon: "eye",
          },
          {
            title: "Shell & Git integration",
            description:
              "Runs commands, handles commits, PRs, merge conflicts, and reverts via checkpoints.",
            icon: "terminal",
          },
          {
            title: "Subagent delegation",
            description:
              "Spawns specialized agents for parallel work, each in its own context window.",
            icon: "users",
          },
          {
            title: "Multi-surface",
            description:
              "CLI, VS Code extension, JetBrains plugin, desktop app, and claude.ai/code.",
            icon: "layout",
          },
        ],
        codeExamples: [
          {
            title: "Installation",
            language: "bash",
            code: `# macOS / Linux (native installer, auto-updates)
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex

# Verify
claude --version
claude doctor`,
          },
        ],
        keyTakeaway:
          "Claude Code is not a copilot -- it is an autonomous coding agent that operates across your whole project from the terminal.",
      },
      {
        overline: "Section 1 of 7 -- Introduction",
        title: "Sessions & Context Window",
        subtitle:
          "Each conversation is a session tied to your working directory. Sessions are independent -- only CLAUDE.md persists across them.",
        tables: [
          {
            headers: ["Command", "Purpose"],
            rows: [
              ["claude -c", "Continue the most recent session"],
              ["claude --resume <id>", "Resume a specific session by ID"],
              ["claude --resume", "Interactive session picker"],
              [
                "claude --resume <id> --fork-session",
                "Branch session without affecting original",
              ],
              ["/compact", "Trigger context compaction manually"],
              [
                "/compact Focus on API changes",
                "Compact while preserving a specific topic",
              ],
              ["/clear", "Reset conversation history entirely"],
              ["/context", 'Token usage breakdown ("fuel gauge")'],
            ],
          },
        ],
        bullets: [
          "Context window holds ~200K tokens (~140-150K usable after system overhead).",
          "Auto-compaction triggers at ~95-98% usage -- Claude summarizes and continues.",
          "Performance degrades as context fills; reserve ~20% for end-of-session work.",
          "Use /clear between unrelated tasks to reclaim the full window.",
        ],
        keyTakeaway:
          "Treat sessions as independent units of work. Put anything that must survive across sessions into CLAUDE.md.",
      },
      {
        overline: "Section 1 of 7 -- Introduction",
        title: "CLAUDE.md -- Persistent Project Memory",
        subtitle:
          "A special markdown file read at the start of every session. It survives compaction and session changes.",
        bullets: [
          "Loaded in priority order: global > project > directory > local.",
          "Run /init to auto-generate a starter CLAUDE.md from codebase analysis.",
          "Keep it under ~300 lines / ~1K tokens. Use pointers (@path/to/file) instead of pasting.",
          "Hierarchical files work well for monorepos (one per package).",
        ],
        codeExamples: [
          {
            title: "Example CLAUDE.md",
            language: "markdown",
            code: `# Project Context
## Tech Stack
Next.js 16, TypeScript, Tailwind CSS 4, Drizzle ORM.

## Commands
- \`npm run dev\` -- Start dev server
- \`npm test\` -- Run tests (Jest)
- \`npm run build\` -- Production build

## Coding Standards
- TypeScript strict mode for all new files
- Functional components with hooks
- Tests alongside source: \`.test.ts\``,
          },
        ],
        tables: [
          {
            headers: ["Location", "Scope"],
            rows: [
              ["~/.claude/CLAUDE.md", "Personal global preferences"],
              ["./CLAUDE.md", "Project-level (commit to repo)"],
              ["./src/CLAUDE.md", "Directory-level overrides (monorepos)"],
              [".claude/CLAUDE.md", "Project-local (gitignored)"],
            ],
          },
        ],
        keyTakeaway:
          "CLAUDE.md is the single most important file for Claude Code productivity -- it onboards both AI and human developers.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // SECTION 2 — Agents
  // ──────────────────────────────────────────────
  {
    id: "agents",
    path: "/agents",
    title: "Agents (Subagents)",
    shortTitle: "Agents",
    slides: [
      {
        overline: "Section 2 of 7 -- Agents",
        title: "What Are Agents?",
        subtitle:
          "Specialized AI assistants that Claude delegates tasks to, each running in its own isolated context window.",
        features: [
          {
            title: "Built-in agents",
            description:
              "Explore (read-only search, Haiku), Plan (architecture, Sonnet), and a general-purpose agent (full tools, Sonnet).",
            icon: "cpu",
          },
          {
            title: "Custom agents",
            description:
              "User-defined agents with specific prompts, tools, models, and permission modes.",
            icon: "wrench",
          },
          {
            title: "CLI-defined agents",
            description:
              "Session-specific agents passed via the --agents JSON flag for ad-hoc needs.",
            icon: "command",
          },
        ],
        bullets: [
          "Each subagent gets its own context window -- prevents context pollution in the main session.",
          "Subagents cannot spawn other subagents (no infinite nesting).",
          "Claude delegates automatically based on the agent description field.",
          'Include "Use PROACTIVELY" in descriptions to encourage automatic delegation.',
        ],
        keyTakeaway:
          "Agents isolate specialized work into their own context windows, keeping the main session clean and focused.",
      },
      {
        overline: "Section 2 of 7 -- Agents",
        title: "Creating & Configuring Agents",
        subtitle:
          "Three ways to create agents: interactive menu, file-based, or CLI flag.",
        codeExamples: [
          {
            title: "Agent file (.claude/agents/code-reviewer.md)",
            language: "markdown",
            code: `---
name: code-reviewer
description: Expert code review specialist. Use proactively after code changes.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a senior code reviewer.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Review for simplicity, error handling, secrets, and test coverage

Provide feedback by priority:
- Critical (must fix)
- Warnings (should fix)
- Suggestions (nice to have)`,
          },
        ],
        tables: [
          {
            headers: ["Field", "Required", "Description"],
            rows: [
              ["name", "Yes", "Unique ID (lowercase + hyphens)"],
              [
                "description",
                "Yes",
                "When to use -- Claude reads this for delegation",
              ],
              ["tools", "No", "Comma-separated tool list; omit = inherit all"],
              ["model", "No", "sonnet, opus, haiku, or inherit"],
              [
                "permissionMode",
                "No",
                "default, acceptEdits, bypassPermissions, plan",
              ],
              ["maxTurns", "No", "Maximum agentic turns"],
              ["memory", "No", "user, project, or local -- enables persistent memory"],
            ],
          },
        ],
        keyTakeaway:
          "The description field is everything -- it determines when and why Claude will delegate to your agent.",
      },
      {
        overline: "Section 2 of 7 -- Agents",
        title: "Delegation & Parallel Execution",
        subtitle:
          "Claude delegates automatically based on descriptions, and multiple agents can run concurrently.",
        bullets: [
          "Automatic delegation: Claude matches task context against agent descriptions.",
          "Explicit delegation: \"Use the debugger agent to investigate this error.\"",
          "Parallel execution: multiple subagents run concurrently on independent tasks.",
          "Project agents (.claude/agents/) override user agents (~/.claude/agents/) on name conflict.",
        ],
        codeExamples: [
          {
            title: "Parallel agent invocation",
            language: "text",
            code: `> Have three explore agents search in parallel:
  1. Authentication code
  2. Database models
  3. API routes`,
          },
        ],
        tables: [
          {
            headers: ["Type", "Location", "Best for"],
            rows: [
              [
                "Project agents",
                ".claude/agents/",
                "Deploy, migrate, project-specific flows (commit to git)",
              ],
              [
                "User agents",
                "~/.claude/agents/",
                "Code review, debugging, personal tools (all projects)",
              ],
            ],
          },
        ],
        keyTakeaway:
          "Commit project agents to git so the entire team benefits from shared specialized workflows.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // SECTION 3 — Skills
  // ──────────────────────────────────────────────
  {
    id: "skills",
    path: "/skills",
    title: "Skills",
    shortTitle: "Skills",
    slides: [
      {
        overline: "Section 3 of 7 -- Skills",
        title: "What Are Skills?",
        subtitle:
          "Modular, filesystem-based capabilities that package domain-specific expertise into discoverable resources.",
        features: [
          {
            title: "Model-invoked",
            description:
              "Unlike slash commands (user-triggered), skills are invoked automatically by Claude when relevant.",
            icon: "zap",
          },
          {
            title: "Progressive disclosure",
            description:
              "Only name + description loaded at startup; full body read on demand. Minimal context cost.",
            icon: "layers",
          },
          {
            title: "Filesystem-based",
            description:
              "Each skill is a directory with SKILL.md, plus optional scripts, templates, and references.",
            icon: "folder",
          },
        ],
        bullets: [
          "Skills teach Claude HOW to think about tasks. Agents EXECUTE tasks in isolation.",
          "Personal skills: ~/.claude/skills/ (all projects).",
          "Project skills: .claude/skills/ (shared via git).",
          "Supporting files (scripts, references) load only when needed during execution.",
        ],
        keyTakeaway:
          "Skills inject domain knowledge on demand with minimal context overhead -- the cheapest way to make Claude smarter about your project.",
      },
      {
        overline: "Section 3 of 7 -- Skills",
        title: "SKILL.md Format & Frontmatter",
        subtitle:
          "Every skill lives in a directory with a SKILL.md file containing YAML frontmatter and instructions.",
        codeExamples: [
          {
            title: "Deploy skill (.claude/skills/deploy/SKILL.md)",
            language: "markdown",
            code: `---
name: deploy
description: Deploy the application to production. Use when deployment is requested.
context: fork
disable-model-invocation: true
---

# Deployment Skill

## Steps
1. Run the full test suite: \`npm test\`
2. Build the application: \`npm run build\`
3. Run database migrations if pending
4. Deploy to the target environment
5. Verify health checks pass
6. Report deployment status`,
          },
        ],
        tables: [
          {
            headers: ["Frontmatter field", "Purpose"],
            rows: [
              [
                "disable-model-invocation: true",
                "Only user can invoke (for side-effect workflows like /deploy)",
              ],
              [
                "user-invocable: false",
                "Only Claude can invoke (background knowledge skills)",
              ],
              [
                "context: fork",
                "Runs in a subagent with its own context window",
              ],
              [
                "allowed-tools",
                "Restricts tools available when skill is active",
              ],
            ],
          },
        ],
        keyTakeaway:
          "Use disable-model-invocation for dangerous operations (deploy, delete) and user-invocable: false for background knowledge.",
      },
      {
        overline: "Section 3 of 7 -- Skills",
        title: "Skills vs Agents vs Commands",
        subtitle:
          "Three extension points, each suited for different needs.",
        tables: [
          {
            headers: ["Feature", "Slash Commands", "Skills", "Agents"],
            rows: [
              [
                "Invocation",
                "User-triggered (/command)",
                "Model-triggered (automatic)",
                "Delegated by Claude",
              ],
              [
                "Context",
                "Runs in current context",
                "Loaded on demand",
                "Own isolated context window",
              ],
              [
                "Location",
                ".claude/commands/",
                ".claude/skills/",
                ".claude/agents/",
              ],
              [
                "Best for",
                "Manual workflows",
                "Domain knowledge",
                "Specialized task execution",
              ],
            ],
          },
        ],
        codeExamples: [
          {
            title: "Commit message skill (background knowledge)",
            language: "markdown",
            code: `---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commits.
---
1. Run \`git diff --staged\` to see changes
2. Write a commit message with:
   - Summary under 50 characters (present tense)
   - Detailed description explaining what and why
   - List of affected components`,
          },
        ],
        keyTakeaway:
          "Commands are for you. Skills are for Claude. Agents are for isolated execution.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // SECTION 4 — Workflows
  // ──────────────────────────────────────────────
  {
    id: "workflows",
    path: "/workflows",
    title: "Building Agent Workflows",
    shortTitle: "Workflows",
    slides: [
      {
        overline: "Section 4 of 7 -- Workflows",
        title: "Chaining Agents & -p Mode",
        subtitle:
          "The --print flag is the foundation for all automation -- it processes one request and exits.",
        bullets: [
          "Chain agents in natural language: analyze, then optimize, then test.",
          "Production teams use multi-stage pipelines with status tracking (e.g., READY_FOR_ARCH, READY_FOR_BUILD).",
          "Pipe data in from files, other commands, or CI systems.",
          "Session persistence lets you chain multiple -p calls across one conversation.",
        ],
        codeExamples: [
          {
            title: "Programmatic usage with -p",
            language: "bash",
            code: `# Basic headless usage
claude -p "Fix ESLint errors in src/"

# JSON output for parsing
claude -p "Review code quality" --output-format json

# Pipe data in
cat build-error.txt | claude -p "Explain this build error"

# Chain with session persistence
session_id=$(claude -p "Start review" --output-format json | jq -r '.session_id')
claude -p "Continue review" --resume "$session_id"
claude -p "Generate summary" --resume "$session_id"`,
          },
        ],
        keyTakeaway:
          "The -p flag turns Claude Code into a scriptable building block for any automation pipeline.",
      },
      {
        overline: "Section 4 of 7 -- Workflows",
        title: "Shell Script Patterns",
        subtitle:
          "Real-world patterns for security audits, auto-commits, and test-fix loops.",
        codeExamples: [
          {
            title: "Automated security review",
            language: "bash",
            code: `audit_pr() {
    local pr_number="$1"
    gh pr diff "$pr_number" | claude -p \\
      --append-system-prompt "You are a security engineer." \\
      --output-format json \\
      --allowedTools "Read,Grep,WebSearch"
}
audit_pr 123 > security-report.json`,
          },
          {
            title: "Test-and-fix loop",
            language: "bash",
            code: `claude -p "Run the test suite and fix any failures" \\
  --allowedTools "Bash,Read,Edit" \\
  --permission-mode acceptEdits \\
  --max-turns 10`,
          },
        ],
        keyTakeaway:
          "Combine --allowedTools, --permission-mode, and --max-turns for safe, scoped automation.",
      },
      {
        overline: "Section 4 of 7 -- Workflows",
        title: "GitHub Actions & Agent SDK",
        subtitle:
          "Native CI/CD integration and programmatic access via TypeScript and Python.",
        codeExamples: [
          {
            title: "GitHub Actions -- automated PR review",
            language: "yaml",
            code: `name: Code Review
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: \${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Review this PR for bugs and security issues."`,
          },
          {
            title: "Claude Agent SDK (TypeScript)",
            language: "typescript",
            code: `import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.ts",
  options: {
    model: "sonnet",
    allowedTools: ["Read", "Edit", "Bash"],
    maxTurns: 250
  }
})) {
  if (message.type === "assistant") {
    for (const block of message.message.content) {
      if ("text" in block) console.log(block.text);
    }
  }
}`,
          },
        ],
        keyTakeaway:
          "The Agent SDK gives you the same agent loop programmatically -- build Claude Code into your own tools and services.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // SECTION 5 — Agent Teams
  // ──────────────────────────────────────────────
  {
    id: "teams",
    path: "/teams",
    title: "Agent Teams",
    shortTitle: "Teams",
    slides: [
      {
        overline: "Section 5 of 7 -- Agent Teams",
        title: "What Are Agent Teams?",
        subtitle:
          "Multiple full Claude Code sessions working together on a shared project, coordinating through filesystem-based primitives.",
        bullets: [
          "One session acts as team lead (orchestrator); teammates work independently.",
          "Critical difference from subagents: teammates can message each other directly.",
          "Each teammate runs in its own context window with full tool access.",
          "Experimental feature -- enable via CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1.",
        ],
        codeExamples: [
          {
            title: "Enable agent teams",
            language: "json",
            code: `// .claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}`,
          },
        ],
        keyTakeaway:
          "Teams unlock direct inter-agent communication -- the key upgrade over subagents for complex, multi-faceted work.",
      },
      {
        overline: "Section 5 of 7 -- Agent Teams",
        title: "Seven Team Primitives",
        subtitle:
          "All team coordination flows through seven filesystem-based tools.",
        tables: [
          {
            headers: ["Tool", "Purpose"],
            rows: [
              ["TeamCreate", "Creates team directory and config file"],
              ["TaskCreate", "Defines a unit of work as a JSON file on disk"],
              [
                "TaskUpdate",
                "Claims and completes work (changes task status)",
              ],
              ["TaskList", "Returns all tasks with current status"],
              ["Task (with team_name)", "Spawns a teammate"],
              [
                "SendMessage",
                "Direct communication between any two teammates",
              ],
              ["TeamDelete", "Removes all team files"],
            ],
          },
        ],
        bullets: [
          "Orchestration flow: Create team, define tasks, spawn teammates, teammates self-claim work, coordinate via messages, shutdown.",
          "Teammates self-manage: TaskList to find work, TaskUpdate to claim it, complete it, move on.",
          "SendMessage supports direct messages, broadcasts, and shutdown requests.",
        ],
        keyTakeaway:
          "Teams use a simple filesystem-based protocol -- no special infrastructure needed.",
      },
      {
        overline: "Section 5 of 7 -- Agent Teams",
        title: "Multi-Agent Patterns & Case Studies",
        subtitle:
          "Proven patterns from real-world multi-agent deployments.",
        features: [
          {
            title: "Orchestrator + specialists",
            description:
              "Opus lead plans and coordinates; Sonnet specialists handle backend, frontend, tests, and review.",
            icon: "git-branch",
          },
          {
            title: "Parallel workers",
            description:
              "Lead creates 12 tasks, spawns 4 teammates. Each loops: claim, work, complete, repeat.",
            icon: "repeat",
          },
          {
            title: "QA swarm",
            description:
              "5 agents tested 146+ URLs and 83 blog posts in ~3 minutes, found 10 issues.",
            icon: "search",
          },
          {
            title: "Wave/pipeline",
            description:
              "Tasks execute in dependency waves. Wave 1: independent files. Wave 2: integrations. Wave 3: tests.",
            icon: "activity",
          },
        ],
        notes: [
          "Case study: 16 Claude agents built a 100,000-line Rust-based C compiler across ~2,000 sessions. It compiles Linux 6.9 on x86, ARM, and RISC-V. Cost: ~$20,000.",
          "Multi-agent Opus+Sonnet system outperformed single-agent Opus by 90.2% on research evaluations.",
        ],
        keyTakeaway:
          "Start with the orchestrator + specialists pattern -- it covers most complex development tasks.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // SECTION 6 — Decision Framework
  // ──────────────────────────────────────────────
  {
    id: "decision",
    path: "/decision",
    title: "Decision Framework",
    shortTitle: "Decisions",
    slides: [
      {
        overline: "Section 6 of 7 -- Decision Framework",
        title: "When to Use What",
        subtitle:
          "Match the right abstraction level to your task complexity and coordination needs.",
        tables: [
          {
            headers: ["Approach", "When to use", "Token cost"],
            rows: [
              [
                "Solo session",
                "Simple bug fixes, single-file work, quick questions",
                "~200K tokens",
              ],
              [
                "Subagents",
                "Focused parallel work, code review, research",
                "~440K tokens (3 agents)",
              ],
              [
                "Skills",
                "Domain expertise, conventions, deploy procedures",
                "Minimal overhead",
              ],
              [
                "Workflows (-p)",
                "CI/CD, repeatable pipelines, scheduled tasks",
                "Varies",
              ],
              [
                "Agent Teams",
                "Complex features needing cross-agent communication",
                "~800K+ tokens",
              ],
            ],
          },
        ],
        bullets: [
          "Solo session: task is self-contained (fix a bug, write a function, explain code).",
          "Subagents: results reported back, but agents do not need to talk to each other.",
          "Skills: Claude should auto-apply domain knowledge contextually.",
          "Workflows: repeatable automation (CI/CD, nightly reviews, batch processing).",
          "Teams: workers need to coordinate directly (frontend + backend + tests).",
        ],
        keyTakeaway:
          "Do NOT use teams for sequential tasks, same-file edits, or simple work -- a single session is faster and cheaper.",
      },
      {
        overline: "Section 6 of 7 -- Decision Framework",
        title: "Onboarding a New Project",
        subtitle:
          "A step-by-step recipe to make Claude Code productive in any codebase.",
        bullets: [
          "Step 1: Run /init to auto-generate a starter CLAUDE.md.",
          "Step 2: Enhance with WHAT (tech stack, structure), WHY (component purposes), HOW (build/test/deploy).",
          "Step 3: Explore the codebase with Claude -- ask it to map the repo and propose an onboarding plan.",
          "Step 4: Create a reusable /onboard command for new tasks.",
          "Step 5: Configure permissions in .claude/settings.json (allow/deny lists).",
          "Step 6: Set up project-specific agents in .claude/agents/ and commit to git.",
          "Step 7: Connect MCP servers for external tools (GitHub, Notion, etc.).",
        ],
        notes: [
          "Real-world impact: incident.io reported a new hire shipped customer value by day 2 using Claude Code for codebase exploration.",
        ],
        keyTakeaway:
          "Good CLAUDE.md files serve double duty -- onboarding both AI and new human developers.",
      },
      {
        overline: "Section 6 of 7 -- Decision Framework",
        title: "Plan First, Parallelize Second",
        subtitle:
          "The most cost-effective pattern for complex work.",
        bullets: [
          "Plan mode (Shift+Tab twice): Claude explores and plans without modifying files. Cost: ~10K tokens.",
          "Execute phase: hand the approved plan to subagents or a team for parallel execution. Cost: 500K+ tokens.",
          "A team that goes in the wrong direction costs 500K+ tokens. A plan costs 10K.",
          "Always review the plan before committing expensive execution tokens.",
        ],
        keyTakeaway:
          "Spend cheap tokens on planning before committing expensive tokens to execution. Always plan first.",
      },
    ],
  },

  // ──────────────────────────────────────────────
  // SECTION 7 — Q&A
  // ──────────────────────────────────────────────
  {
    id: "qa",
    path: "/qa",
    title: "Q&A, Tips & Gotchas",
    shortTitle: "Q&A",
    slides: [
      {
        overline: "Section 7 of 7 -- Q&A",
        title: "Top Gotchas & Workarounds",
        features: [
          {
            title: "Claude gives up too early",
            description:
              'Declares "significant progress" while work is incomplete. Break tasks into smaller, isolated pieces.',
            icon: "alert-triangle",
          },
          {
            title: "Post-compaction confusion",
            description:
              "Forgets file locations, repeats mistakes. Use /clear + git reset --hard for a full restart.",
            icon: "refresh-cw",
          },
          {
            title: "Tests modified to match bad code",
            description:
              "Claude weakens tests instead of fixing implementation. Use TDD -- write tests first, then implement.",
            icon: "shield",
          },
          {
            title: "Env vars do not persist",
            description:
              'export in one Bash command is gone in the next (cwd does persist). Chain commands with "&&".',
            icon: "alert-circle",
          },
          {
            title: "Git mishaps",
            description:
              "Claude uses odd Git commands and wrong merge bases. Drive Git yourself -- let Claude modify files only.",
            icon: "git-merge",
          },
        ],
        keyTakeaway:
          "The most reliable pattern: let Claude edit code, but drive Git, tests, and deployment yourself.",
      },
      {
        overline: "Section 7 of 7 -- Q&A",
        title: "Cost, Rate Limits & Power Tips",
        subtitle:
          "All Claude surfaces share the same usage pool. Heavy Opus usage can burn a 5-hour window in 10-15 minutes.",
        tables: [
          {
            headers: ["Plan", "Approx. Claude Code capacity"],
            rows: [
              ["Pro ($20/mo)", "~40-80 hours/week"],
              ["Max5 ($100/mo)", "~2x Pro limits"],
              ["Max20 ($200/mo)", "~5x Pro limits"],
              ["API key", "Pay-as-you-go, no rolling limits"],
            ],
          },
        ],
        bullets: [
          "Use /cost to track session spending. Set --max-budget-usd to cap costs.",
          "Set CLAUDE_CODE_SUBAGENT_MODEL to Haiku for cheaper subagents.",
          "Message queuing: type multiple prompts while Claude works. It processes them in sequence.",
          "Plan mode (Shift+Tab x2): Claude becomes read-only architect. Review before expensive execution.",
          "Hooks for auto-formatting: PostToolUse hooks run prettier/eslint automatically after edits.",
          "Start with 3-4 MCP servers, not 15+ (each adds tool definitions to context).",
        ],
        keyTakeaway:
          "Track costs with /cost, use Haiku for subagents, and invest in CLAUDE.md and hooks to get compound returns.",
      },
      {
        overline: "Section 7 of 7 -- Q&A",
        title: "Key Environment Variables",
        tables: [
          {
            headers: ["Variable", "Purpose"],
            rows: [
              ["ANTHROPIC_MODEL", "Default model"],
              ["ANTHROPIC_API_KEY", "API key for pay-as-you-go"],
              [
                "CLAUDE_CODE_SUBAGENT_MODEL",
                "Cheaper model for subagents",
              ],
              [
                "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE",
                "Auto-compaction threshold",
              ],
              ["MAX_THINKING_TOKENS", "Limit thinking tokens"],
              ["CLAUDE_CODE_MAX_OUTPUT_TOKENS", "Limit output tokens"],
              [
                "CLAUDE_CODE_EFFORT_LEVEL",
                "Reasoning depth (high/normal/low)",
              ],
              ["BASH_DEFAULT_TIMEOUT_MS", "Bash timeout (default 30s)"],
            ],
          },
        ],
        notes: [
          "Anthropic's lessons from multi-agent systems: think like your agents, teach the orchestrator how to delegate, scale effort to query complexity, and design tools carefully.",
          "Their multi-agent system (Opus lead + Sonnet subagents) outperformed single-agent Opus by 90.2% on research evaluations.",
        ],
        keyTakeaway:
          "Thank you for joining! Start with CLAUDE.md and /init, grow into agents and skills, and reach for teams only when you need direct inter-agent communication.",
      },
    ],
  },
];

/**
 * Lookup helpers
 */
export function getSectionByPath(path: string): Section | undefined {
  return sections.find((s) => s.path === path);
}

export function getSectionById(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}

export function getSectionIndex(id: string): number {
  return sections.findIndex((s) => s.id === id);
}

export function getAdjacentSections(id: string): {
  prev: Section | undefined;
  next: Section | undefined;
} {
  const idx = getSectionIndex(id);
  return {
    prev: idx > 0 ? sections[idx - 1] : undefined,
    next: idx < sections.length - 1 ? sections[idx + 1] : undefined,
  };
}

export function getAllPaths(): string[] {
  return sections.map((s) => s.path);
}

export function getTotalSlideCount(): number {
  return sections.reduce((sum, s) => sum + s.slides.length, 0);
}

/** Navigation items derived from sections — single source of truth for routes */
export const navigationItems = sections.map((s) => ({
  path: s.path,
  label: s.shortTitle,
}));
