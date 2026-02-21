# Claude Code Presentation Website

## Project
Presentation website for "Claude Code and how to use it in development" webinar. Replaces traditional PowerPoint.

## Stack
- Next.js (App Router), TypeScript (strict), Tailwind CSS 4, Vercel deployment

## Design
- Dark theme inspired by Covecta.io
- Colors: bg `#000`/`#131A21`, text `#fff`/`#999`, accent `#7F56D9`/`#4D65FF`
- Font: Inter (300-700), antialiased
- Border radius: 12px cards, transitions 0.3s ease

## Structure
7 section pages with arrow navigation:
1. `/` — What is Claude Code? Sessions
2. `/agents` — Agents (subagents)
3. `/skills` — Skills
4. `/workflows` — Agent workflows
5. `/teams` — Agent teams
6. `/decision` — Decision framework
7. `/qa` — Q&A

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint

## Content
All section content lives in `sections-content.md` at project root.

## Agents Team
- `team-lead` — Coordinates development
- `tech-architect` — Architecture decisions
- `ui-ux-designer` — Design system and UX
- `ai-expert` — Content quality
- `fe-developer` — Frontend implementation
- `be-developer` — Backend/server setup
- `code-reviewer` — Code quality review