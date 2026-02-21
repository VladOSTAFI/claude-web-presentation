# Claude Code: The Complete Webinar Preparation Guide

Claude Code is Anthropic's agentic coding CLI that lives in your terminal, understands your entire codebase, and executes tasks through natural language — from editing files and running commands to orchestrating multi-agent teams that build features in parallel. This document covers everything needed for a comprehensive webinar: sessions, agents, skills, workflows, teams, decision frameworks, and practical tips.

---

## 1. What is Claude Code and how sessions work

### The tool in a nutshell

Claude Code is an **agentic coding tool** that goes beyond inline code assistants. While traditional copilots see only the current file, Claude Code reads your entire project, proposes changes, runs shell commands, handles git workflows, and delegates specialized tasks to subagents — all from a terminal prompt. It ships as a CLI, a VS Code extension, a JetBrains plugin, a desktop app, and a browser experience at claude.ai/code.

**Key capabilities** include reading and editing files across an entire codebase, running shell commands, handling git operations (commits, PRs, merge conflicts), spawning subagents for parallel work, using extended thinking for complex reasoning, integrating with external tools via MCP (Model Context Protocol), and reverting changes via checkpoints.

### Installation

The recommended method requires no Node.js:

```bash
# macOS / Linux (native installer, auto-updates)
curl -fsSL https://claude.ai/install.sh | bash

# Windows (PowerShell)
irm https://claude.ai/install.ps1 | iex

# Homebrew (does NOT auto-update)
brew install --cask claude-code

# Verify installation
claude --version
claude doctor
```

Authentication happens on first run. Three paths exist: a **Claude Pro/Max subscription** (log in with your claude.ai account), **API Console billing** (OAuth flow to Anthropic Console), or a raw **API key** via `export ANTHROPIC_API_KEY=sk-ant-...`. Then just `cd` into your project and type `claude`.

### What is a session?

Each Claude Code conversation is a **session** tied to your working directory. Sessions track conversation history, file changes, and execution state. They are auto-saved to `~/.claude/projects/[project-path]/[session-id]/`.

**Critical design detail**: each new session starts with a **fresh context window**. Previous session history is NOT loaded — only CLAUDE.md content persists across sessions. This means sessions are independent units of work.

**Session management commands:**

```bash
claude -c                      # Continue most recent session
claude --resume abc123         # Resume specific session by ID
claude --resume                # Interactive session picker
claude --resume abc123 --fork-session  # Branch without affecting original
```

Inside a session, `/resume` shows past sessions, `/rename` gives it a memorable name, and `/context` reveals a detailed token usage breakdown.

### Context window management

The context window holds **~200K tokens** (or ~500K for Sonnet 4.5), with usable space of ~140–150K after system overhead. When context reaches ~95–98% usage, **auto-compaction** triggers: Claude summarizes the conversation, replaces old messages, and continues seamlessly.

Manual controls are essential for power users:

| Command | Purpose |
|---------|---------|
| `/compact` | Trigger compaction manually |
| `/compact Focus on the API changes` | Compact while preserving specific topics |
| `/clear` | Reset conversation history entirely |
| `/context` | Visual token breakdown (your "fuel gauge") |

**Best practice**: put persistent rules in `CLAUDE.md` (they survive compaction), use `/compact` at natural breakpoints, and start fresh sessions for distinct tasks. Performance degrades as context fills — reserve **~20%** for end-of-session operations.

### Essential CLI flags

| Flag | Description |
|------|-------------|
| `-p` / `--print` | Non-interactive mode (process request, print result, exit) |
| `-c` / `--continue` | Continue most recent conversation |
| `-r` / `--resume` | Resume specific session by ID |
| `--model` | Set model (`sonnet`, `opus`, `haiku`, or full name) |
| `--output-format` | `text`, `json`, or `stream-json` (for `-p` mode) |
| `--max-turns` | Limit agentic turns in non-interactive mode |
| `--allowedTools` | Auto-approve specific tools without prompts |
| `--dangerously-skip-permissions` | Skip all permission prompts |
| `--system-prompt` | Replace entire system prompt |
| `--append-system-prompt` | Append to default system prompt |
| `--agent` | Specify a named agent for the session |
| `--agents` | Define custom subagents via JSON |
| `--add-dir` | Add additional working directories |
| `--mcp-config` | Load MCP servers from a JSON file |
| `--json-schema` | Get validated JSON output matching a schema |

### Interactive slash commands

| Command | What it does |
|---------|-------------|
| `/help` | All available commands |
| `/init` | Generate CLAUDE.md by analyzing your codebase |
| `/model` | Switch models mid-session |
| `/agents` | Manage custom agents |
| `/cost` | Token usage and cost |
| `/memory` | Edit CLAUDE.md memory files |
| `/mcp` | MCP server status |
| `/add-dir` | Add directories mid-session |
| `/vim` | Enable vim-style editing |

**Keyboard shortcuts**: `Ctrl+R` for prompt history, `Shift+Enter` for multi-line input, `Esc Esc` to rewind to checkpoint, `Tab` to toggle extended thinking, `Shift+Tab` to cycle between normal → auto-accept → plan mode, `@filename` to reference files, `!command` to run bash directly.

### CLAUDE.md — persistent project memory

CLAUDE.md is a special markdown file read at the start of every session. It acts as persistent, project-specific memory that survives compaction and session changes.

**Locations loaded in order (all merged, deeper files take priority):**
1. `~/.claude/CLAUDE.md` — personal global preferences
2. `./CLAUDE.md` — project-level instructions (checked into repo)
3. `./src/CLAUDE.md` — directory-level overrides (monorepos)
4. `.claude/CLAUDE.md` — project-local (gitignored)

```markdown
# Project Context
## Tech Stack
Next.js 16, TypeScript, Tailwind CSS 4, Drizzle ORM with PostgreSQL.

## Commands
- `npm run dev` — Start dev server
- `npm test` — Run tests (Jest)
- `npm run build` — Build for production

## Coding Standards
- Use TypeScript strict mode for all new files
- Functional components with hooks in React
- Tests alongside source files with `.test.ts` extension

## Architecture
- Frontend: Next.js with App Router
- Database: PostgreSQL with Prisma
- Auth: NextAuth with Google provider
```

Run `/init` to auto-generate a starter CLAUDE.md from your codebase analysis.

---

## 2. Agents (subagents) in Claude Code

### What agents are

In Claude Code, **agents (officially "subagents")** are specialized AI assistants that Claude delegates tasks to. Each subagent operates in its **own isolated context window**, has a **custom system prompt**, can use a **different model**, and returns a summary to the main agent — preventing context pollution.

Three types exist:

- **Built-in subagents**: `Explore` (read-only codebase search, uses Haiku), `Plan` (architecture planning, uses Sonnet), and `general-purpose` (full tool access, uses Sonnet)
- **Custom/user-defined subagents**: agents you define with specific prompts, tools, and configurations
- **CLI-defined subagents**: session-specific agents passed via the `--agents` flag

**Key constraint**: subagents **cannot spawn other subagents** (prevents infinite nesting). They use the Task tool under the hood.

### Creating agents

**Interactive method (recommended):**
```
/agents
```
This opens an interactive menu to create, edit, delete, or list agents. Claude can generate the system prompt for you based on a description.

**File-based method:**
Create a markdown file with YAML frontmatter in `.claude/agents/` (project-level) or `~/.claude/agents/` (user-level):

```markdown
---
name: code-reviewer
description: Expert code review specialist. Use proactively after code changes.
tools: Read, Grep, Glob, Bash
model: sonnet
color: orange
---

You are a senior code reviewer ensuring high standards of code quality.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code simplicity and readability
- Proper error handling
- No exposed secrets or API keys
- Input validation
- Test coverage

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)
```

**CLI method (session-specific):**
```bash
claude --agents '{
  "debugger": {
    "description": "Debugging specialist for errors and test failures.",
    "prompt": "You are an expert debugger. Analyze errors, identify root causes, provide fixes.",
    "tools": ["Read", "Edit", "Bash", "Grep", "Glob"],
    "model": "sonnet"
  }
}'
```

### Agent configuration reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (lowercase + hyphens) |
| `description` | Yes | When to use this agent — Claude uses this for delegation decisions |
| `tools` | No | Comma-separated tool list. Omit to inherit all |
| `model` | No | `sonnet`, `opus`, `haiku`, or `inherit` |
| `permissionMode` | No | `default`, `acceptEdits`, `bypassPermissions`, `plan` |
| `skills` | No | Skills to auto-load |
| `memory` | No | `user`, `project`, or `local` |
| `maxTurns` | No | Maximum turns the agent can take |
| `hooks` | No | Lifecycle hooks (PreToolUse, PostToolUse, SubagentStop) |

### Practical agent examples

**Debugger agent:**
```markdown
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---
You are an expert debugger specializing in root cause analysis.
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works
```

**Security reviewer (using Opus for stronger reasoning):**
```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities. Use before any PR merge.
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior security engineer. Review code for:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization flaws
- Secrets or credentials in code
- Insecure data handling
Provide specific line references and suggested fixes.
```

**Agent with persistent memory:**
```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
memory: user
---
You are a code reviewer. As you review code, update your agent memory
with patterns, conventions, and recurring issues you discover.
```

When `memory` is set, the subagent automatically gets instructions for reading/writing to a persistent memory directory, building knowledge over time.

### How delegation works

Claude delegates **automatically** based on the `description` field. To encourage proactive use, include phrases like "Use PROACTIVELY" or "MUST BE USED" in descriptions. You can also delegate explicitly:

```
> Use the code-reviewer subagent to look at my recent changes
> Have the debugger investigate this error
```

**Parallel execution** is supported — multiple subagents can run concurrently on independent tasks:
```
> Have three explore agents search in parallel:
  1. Authentication code
  2. Database models
  3. API routes
```

### Project vs user-level agents

| Type | Location | Scope | Best for |
|------|----------|-------|----------|
| Project agents | `.claude/agents/` | Current project, committable to git | Deployment, migration, project-specific workflows |
| User agents | `~/.claude/agents/` | All projects | Code review, debugging, personal tools |

When names conflict, **project-level agents take precedence**.

---

## 3. Skills in Claude Code

### What skills are

**Agent Skills** are modular, filesystem-based capabilities that package domain-specific expertise into discoverable resources. Unlike slash commands (which you invoke manually), skills are **model-invoked** — Claude autonomously decides when to use them based on the task and the skill's description.

Skills follow a **progressive disclosure architecture**:
1. At startup, only skill `name` + `description` are loaded (lightweight)
2. When Claude decides a skill is relevant, it reads the full `SKILL.md` body
3. Supporting files (scripts, references) load only when needed during execution

This design keeps context consumption minimal until a skill is actually needed.

### Defining custom skills

Every skill is a directory with a `SKILL.md` file:

```
.claude/skills/deploy/
├── SKILL.md           # Required — core instructions
├── reference.md       # Optional documentation
├── scripts/
│   └── deploy.sh      # Optional helper scripts
└── templates/
    └── config.yaml    # Optional templates
```

**SKILL.md format:**
```markdown
---
name: deploy
description: Deploy the application to production. Use when deployment is requested.
context: fork
disable-model-invocation: true
---

# Deployment Skill

## Steps
1. Run the full test suite: `npm test`
2. Build the application: `npm run build`
3. Run database migrations if pending
4. Deploy to the target environment
5. Verify health checks pass
6. Report deployment status
```

**Key frontmatter options:**

| Field | Purpose |
|-------|---------|
| `disable-model-invocation: true` | Only user can invoke (for workflows with side effects like `/deploy`) |
| `user-invocable: false` | Only Claude can invoke (background knowledge skills) |
| `context: fork` | Runs in a subagent with its own context window |
| `allowed-tools` | Restricts tools available when skill is active |

### Storage locations

**Personal skills** (available across all projects): `~/.claude/skills/my-skill/`

**Project skills** (shared with team via git): `.claude/skills/my-skill/`

### Practical skill examples

**Code review skill:**
```markdown
---
name: code-reviewer
description: Review code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
allowed-tools: Read, Grep, Glob
---
## Review Checklist
1. Code organization and structure
2. Error handling completeness
3. Performance considerations
4. Security concerns
5. Test coverage gaps

Provide feedback as: Critical (must fix), Warnings (should fix), Suggestions.
```

**Commit message generator:**
```markdown
---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commits.
---
1. Run `git diff --staged` to see changes
2. Write a commit message with:
   - Summary under 50 characters (present tense)
   - Detailed description explaining what and why
   - List of affected components
```

**API conventions (background knowledge skill):**
```markdown
---
name: api-conventions
description: API design patterns for this codebase
user-invocable: false
---
When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error format: `{ error: string, code: number }`
- Include pagination for list endpoints (cursor-based)
- All responses wrapped in `{ data: T, meta: {} }`
```

**Multi-file skill with scripts:**
```
pdf-processing/
├── SKILL.md
├── FORMS.md
├── REFERENCE.md
└── scripts/
    ├── fill_form.py
    └── validate.py
```

### Skills vs agents vs commands

| Feature | Slash Commands | Skills | Agents |
|---------|---------------|--------|--------|
| Invocation | User-triggered (`/command`) | Model-triggered (automatic) | Delegated by Claude |
| Context | Runs in current context | Loaded on demand | Own isolated context window |
| Location | `.claude/commands/` | `.claude/skills/` | `.claude/agents/` |
| Best for | Manual workflows | Domain knowledge | Specialized task execution |

**Skills teach Claude *how* to think about tasks. Agents *execute* tasks in isolation.**

---

## 4. Building agent workflows

### Chaining agents for complex pipelines

Claude Code supports chaining subagents sequentially or running them in parallel. The simplest approach is natural language:

```
> First use the code-analyzer subagent to find performance issues,
  then use the optimizer subagent to fix them,
  then use the test-runner to verify nothing broke.
```

For production workflows, teams like PubNub use a **three-stage pipeline** with status tracking:
1. `pm-spec` agent → reads enhancement request, writes spec, sets status to `READY_FOR_ARCH`
2. `architect-review` agent → validates design, produces architecture decision record, sets `READY_FOR_BUILD`
3. `implementer-tester` agent → implements code and tests, updates docs, sets `DONE`

### Using Claude Code programmatically

The `--print` (`-p`) flag is the foundation for all automation — it processes one request and exits:

```bash
# Basic headless usage
claude -p "Fix ESLint errors in src/"

# With JSON output for parsing
claude -p "Review code quality" --output-format json

# Pipe data in
cat build-error.txt | claude -p "Explain the root cause of this build error"

# Chain with session persistence
session_id=$(claude -p "Start review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
claude -p "Generate summary of all issues" --resume "$session_id"
```

**JSON output structure:**
```json
{
  "type": "result",
  "subtype": "success",
  "total_cost_usd": 0.003,
  "is_error": false,
  "duration_ms": 1234,
  "num_turns": 6,
  "result": "The response text...",
  "session_id": "abc123"
}
```

### Shell script automation patterns

**Automated security review:**
```bash
audit_pr() {
    local pr_number="$1"
    gh pr diff "$pr_number" | claude -p \
      --append-system-prompt "You are a security engineer. Review for vulnerabilities." \
      --output-format json \
      --allowedTools "Read,Grep,WebSearch"
}
audit_pr 123 > security-report.json
```

**Auto-commit with scoped permissions:**
```bash
claude -p "Look at my staged changes and create an appropriate commit" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"
```

**Test-and-fix loop:**
```bash
claude -p "Run the test suite and fix any failures" \
  --allowedTools "Bash,Read,Edit" \
  --permission-mode acceptEdits \
  --max-turns 10
```

### GitHub Actions integration

Install with `/install-github-app` inside Claude Code, then configure workflows:

**Automated code review on PRs:**
```yaml
name: Code Review
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
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Review this PR for bugs and security issues."
          claude_args: "--max-turns 5"
```

**Security review on sensitive paths:**
```yaml
security-review:
  on:
    pull_request:
      paths: ['src/auth/**', 'src/api/**']
  jobs:
    review:
      steps:
        - uses: anthropics/claude-code-action@v1
          with:
            task: |
              SECURITY REVIEW:
              - Check for SQL injection, XSS, command injection
              - Verify authentication and authorization logic
              - Check secrets handling
              Flag issues as 🚨 SECURITY
```

### The Claude Agent SDK

The **Claude Agent SDK** (formerly Claude Code SDK) provides the same tools and agent loop programmatically in **TypeScript** and **Python**:

**TypeScript:**
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

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
}
```

**Python:**
```python
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Find and fix the bug in auth.py",
    options=ClaudeAgentOptions(
        allowed_tools=["Read", "Edit", "Bash"]
    ),
):
    print(message)
```

The SDK also supports custom MCP tools, structured JSON output via schemas, and project settings loading.

---

## 5. Agent teams for parallel coordination

### What agent teams are

**Agent Teams** is an experimental feature that coordinates **multiple full Claude Code sessions** working together on a shared project. One session acts as the **team lead** (orchestrator), while **teammates** work independently — each in its own context window — and can **message each other directly**.

Enable with:
```json
// .claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

**The critical difference from subagents**: subagents can only report back to the main agent. Team teammates can **communicate directly with each other**, share findings mid-task, and coordinate without the main agent as intermediary.

### The seven team primitives

| Tool | Purpose |
|------|---------|
| **TeamCreate** | Creates team directory and config file |
| **TaskCreate** | Defines a unit of work as a JSON file on disk |
| **TaskUpdate** | Claims and completes work (changes task status) |
| **TaskList** | Returns all tasks with current status |
| **Task** (with `team_name`) | Spawns a teammate |
| **SendMessage** | Direct communication between any two teammates |
| **TeamDelete** | Removes all team files |

**Orchestration flow:**
```
1. TeamCreate("dashboard")           → Create team
2. TaskCreate × N                     → Define all work units
3. Task(team_name, name, prompt) × N  → Spawn teammates
4. Teammates self-claim via TaskList + TaskUpdate
5. Teammates coordinate via SendMessage
6. Lead sends shutdown_request
7. TeamDelete cleans up
```

### Multi-agent patterns

**Pattern 1 — Orchestrator + specialists (most common):**
```
LEAD (Opus) ─── plans, coordinates, synthesizes
├── Backend Agent (Sonnet) ── API endpoints, database
├── Frontend Agent (Sonnet) ── React components, state
├── Test Agent (Sonnet) ── Unit, integration, E2E tests
└── Review Agent (Sonnet) ── Security, quality review
```

**Pattern 2 — Parallel independent workers:**
Lead creates 12 tasks, spawns 4 teammates. Each teammate loops: `TaskList()` → claim unowned task → work → complete → repeat.

**Pattern 3 — Wave/pipeline execution:**
Tasks execute in dependency waves. Wave 1 (no deps): `jwt.ts + sessions.ts + middleware.ts`. Wave 2 (after wave 1): barrel exports + import updates. Wave 3: test updates.

**Pattern 4 — QA swarm:**
Five agents test different aspects simultaneously: `qa-pages` (core responses), `qa-posts` (blog rendering), `qa-links` (navigation integrity), `qa-seo` (RSS/sitemap), `qa-a11y` (accessibility). In one real example, 5 agents tested **146+ URLs and 83 blog posts in ~3 minutes**.

**Pattern 5 — Competing hypotheses (debate):**
Spawn teammates each investigating a different theory about a bug. They challenge each other's findings like a scientific debate.

### Real-world case studies

**Anthropic's C compiler project**: **16 Claude agents** working in parallel across ~2,000 sessions built a **100,000-line Rust-based C compiler** from scratch. It can compile Linux 6.9 on x86, ARM, and RISC-V. Cost: ~$20,000 (2 billion input tokens, 140 million output tokens). Coordination used git-based file locking.

**QA swarm against a blog**: 5 agents spawned, tested 146+ URLs and 83 blog posts, found 10 issues (4 major, 2 medium, 4 minor), completed in ~3 minutes. The lead synthesized a prioritized report.

### Coordination mechanisms

Teams coordinate through **filesystem-based artifacts**:

- **Shared task list**: JSON files in `~/.claude/tasks/[team]/` move through `pending` → `in_progress` → `completed`
- **Inbox messaging**: SendMessage writes to inbox files, supporting direct messages, broadcasts, and shutdown requests
- **CLAUDE.md as shared context**: all teammates read the same project CLAUDE.md
- **Hooks for quality**: `TeammateIdle` (exit code 2 sends feedback), `TaskCompleted` (exit code 2 prevents premature completion)

---

## 6. When to use agent vs workflow vs team

### The decision framework

| Level | Approach | When to use | Approximate token cost |
|-------|----------|-------------|----------------------|
| **Solo session** | Single Claude conversation | Simple bug fixes, single-file work, quick questions | ~200K tokens |
| **Subagents** | Task delegation (own context) | Focused parallel work, code review, research | ~440K tokens (3 subagents) |
| **Skills** | Knowledge injection | Domain expertise, coding conventions, deployment procedures | Minimal overhead |
| **Workflows** | Scripted automation (`-p` mode) | CI/CD, repeatable pipelines, scheduled tasks | Varies |
| **Agent Teams** | Multi-session coordination | Complex features requiring cross-agent communication | ~800K+ tokens |

### Quick decision flowchart

**Use a solo session** when the task is self-contained: fixing a bug, writing a function, explaining code, single-file refactoring.

**Use subagents** when you need results reported back but agents don't need to talk to each other: parallel code search, independent reviews, research from multiple angles.

**Use skills** when you want Claude to automatically apply domain knowledge: API conventions, deployment procedures, coding standards that should activate contextually.

**Use workflows** when you need repeatable automation: CI/CD integration, nightly code reviews, PR validation pipelines, batch processing.

**Use agent teams** when workers need to coordinate directly with each other: multi-layer feature development (frontend + backend + tests), QA swarms, competing hypothesis debugging, research from multiple perspectives.

**Do NOT use teams for**: sequential tasks, same-file edits, work with heavy dependencies, or simple tasks where a single session is faster and cheaper.

### Onboarding a new project — step by step

**Step 1: Generate CLAUDE.md.**
```
/init
```
This analyzes your codebase and produces a starter file with detected build systems, test frameworks, and code patterns.

**Step 2: Enhance CLAUDE.md with three categories.**
- **WHAT**: tech stack, project structure, codebase map
- **WHY**: purpose of different project components
- **HOW**: build/test/lint/deploy commands, verification steps

Keep it under ~300 lines. Use pointers (`@path/to/file`) instead of pasting code. Use hierarchical CLAUDE.md files for monorepos.

**Step 3: Explore the codebase with Claude.**
```
> Map this repo: list key directories, runtime, build/test commands,
  and where configs live. Then propose a 30-minute onboarding plan.
```

**Step 4: Create a reusable onboarding command.**
Save as `~/.claude/commands/onboard.md`:
```markdown
---
argument-hint: [task description]
description: Onboard yourself onto a task with explore → clarify → plan
---
At the end of this message, you will receive your task. Onboard yourself:

### Explore
Explore the codebase and understand the structure relevant to the task.

### Clarify
Ask clarifying questions about anything unclear.

### Plan
Create a detailed, step-by-step implementation plan.

Task: $ARGUMENTS
```

Then invoke: `/onboard Add user authentication with OAuth`

**Step 5: Configure permissions and tools.**
```json
// .claude/settings.json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Bash(git *)", "Read"],
    "deny": ["Read(./.env)", "Read(./secrets/*)"]
  }
}
```

**Step 6: Set up project-specific agents.**
Create agents in `.claude/agents/` for common team workflows (code review, testing, deployment). Commit to git so the whole team benefits.

**Step 7: Connect MCP servers for external tools.**
```bash
claude mcp add github -- npx -y @modelcontextprotocol/server-github
claude mcp add --transport http notion https://mcp.notion.com/mcp
```

**Real-world impact**: incident.io reported that a new hire **shipped customer value by day 2** using Claude Code for codebase exploration. Good CLAUDE.md files serve double duty — onboarding both AI and new human developers.

### The "plan first, parallelize second" pattern

The most cost-effective approach for complex work:

1. **Plan mode** (cheap: ~10K tokens): Use `Shift+Tab` twice to enter plan mode. Claude explores the codebase and produces a step-by-step plan. Review and adjust.
2. **Execute** (expensive: 500K+ tokens): Hand the approved plan to subagents or a team for parallel execution. The plan already has the task breakdown.

A team that goes in the wrong direction costs 500K+ tokens. A plan costs 10K. Always plan first.

---

## 7. QnA preparation — gotchas, tips, and limitations

### Top gotchas and workarounds

**Claude gives up too early on large tasks.** It may declare "significant progress" while major functionality is missing. **Workaround**: break tasks into smaller, isolated pieces. Even tasks a human would group together, Claude handles better separately.

**Performance degrades after context compaction.** Claude forgets file locations, may repeat corrected mistakes. **Workaround**: use `/clear` + `git reset --hard` for a full restart if compaction causes issues. Sometimes compaction *helps* by clearing wrong-track reasoning.

**Claude modifies tests to match bad code.** It will make tests less specific rather than fix implementation bugs. **Workaround**: use TDD — write tests first, review carefully, then implement. Be extremely wary of changes to test files.

**Env vars don't persist between Bash commands.** `export MY_VAR=value` in one command won't be available in the next (working directory *does* persist). **Workaround**: use `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1` or chain commands with `&&`.

**Git mishaps.** Claude uses weird Git commands, wrong merge bases, gets confused about branch state. **Workaround**: drive Git yourself — let Claude modify files, you handle all branching, committing, and pushing.

### Cost and rate limit management

All Claude surfaces (claude.ai, Claude Code, Claude Desktop) **share the same usage pool**. Heavy Opus usage can burn through a 5-hour window in 10–15 minutes.

- **Pro** ($20/mo): ~40–80 Claude Code hours/week
- **Max5** ($100/mo): ~2× Pro limits
- **Max20** ($200/mo): ~5× Pro limits
- **API key** (`ANTHROPIC_API_KEY`): pay-as-you-go with no rolling limits

Use `/cost` to track session spending. Set `--max-budget-usd` to cap. Use `CLAUDE_CODE_SUBAGENT_MODEL=claude-haiku-4-20241022` for cheaper subagents.

### Token reduction strategies

- Use `/clear` between unrelated tasks
- Offload work to subagents (they use their own context windows)
- Reference files with `@filename` instead of pasting content
- Disable unused MCP servers (each adds tool definitions to context)
- Use `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` to control compaction threshold
- Keep CLAUDE.md under ~1K tokens; use Skills for on-demand context

### Power user tips

**Message queuing**: type multiple prompts while Claude is working. It processes them in sequence. Queue up tasks, go about your day, come back to completed work.

**Plan mode** (`Shift+Tab` twice): Claude becomes an architect — can observe and analyze but NOT modify files. Use to review plans before expensive implementation.

**Hooks for auto-formatting**: instead of telling Claude about code style in CLAUDE.md, use hooks:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "prettier --write \"$CLAUDE_FILE_PATHS\""
      }]
    }]
  }
}
```

**MCP servers**: start with 3–4 essential servers, not 15+. Popular ones include GitHub (PR management), Playwright (browser automation), Context7 (real-time library docs), and Brave Search (web search).

**Claude Code AS an MCP server**: run `claude mcp serve` to expose Claude Code's tools to other MCP clients like Claude Desktop or Cursor.

### Key environment variables reference

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_MODEL` | Default model |
| `ANTHROPIC_API_KEY` | API key for pay-as-you-go |
| `CLAUDE_CODE_SUBAGENT_MODEL` | Cheaper model for subagents |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | Auto-compaction threshold |
| `MAX_THINKING_TOKENS` | Limit thinking tokens |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Limit output tokens |
| `CLAUDE_CODE_EFFORT_LEVEL` | Reasoning depth (high/normal/low) |
| `BASH_DEFAULT_TIMEOUT_MS` | Bash timeout (default 30s) |
| `MAX_MCP_OUTPUT_TOKENS` | MCP output limit |

### Known platform limitations

- **Windows/WSL**: common "exec: node: not found" errors — use the native installer
- **Windows MCP servers**: require `cmd /c` wrapper for npx commands
- **Clipboard**: images require `Ctrl+V` (not `Cmd+V` on Mac)
- **Newlines**: `Shift+Enter` doesn't work until you run `/terminal-setup`
- **WebFetch**: can't access Reddit and some other sites — copy-paste content instead

### Anthropic's lessons from building multi-agent systems

From their engineering blog on scaling multi-agent architectures:

1. **Think like your agents** — build simulations, watch step-by-step execution
2. **Teach the orchestrator how to delegate** — each subagent needs a clear objective, output format, and tool guidance
3. **Scale effort to query complexity** — simple tasks: 1 agent; complex: 10+ subagents with clear division
4. **Tool design is critical** — bad tool descriptions send agents down wrong paths
5. **Start wide, then narrow** — broad exploration first, progressive focus
6. **Parallel tool calling transforms speed** — can cut research time by up to 90%

Their multi-agent system (Opus lead + Sonnet subagents) **outperformed single-agent Opus by 90.2%** on research evaluations. Token usage explained 80% of the performance variance.

## Conclusion

Claude Code has evolved from a simple coding assistant into a **full multi-agent orchestration platform**. The key insight for effective usage is matching the right abstraction level to your task: solo sessions for quick fixes, skills for domain knowledge injection, subagents for parallel-but-independent work, workflows for repeatable automation, and teams for complex coordinated efforts. The most productive users follow a **plan-first, parallelize-second** approach — spending cheap tokens on planning before committing expensive tokens to execution. Investing time in CLAUDE.md, project-specific agents, and permission configuration pays compound dividends across every session. The ecosystem is moving fast: agent teams, the Claude Agent SDK, and MCP integrations are all expanding what's possible, making the gap between "AI-assisted coding" and "AI-orchestrated development" narrower with each release.