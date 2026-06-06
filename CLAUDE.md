# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Code Compass / **NEC Co-Pilot** — a client-side single-page app that helps electricians
(apprentice → journeyman → master) study for and pass National Electrical Code (NEC) exams,
and look up code articles quickly on the job. It is a study/lookup aid, **not** a replacement
for the official NEC. Never paste copyrighted NEC text verbatim — paraphrase and cite the
article/table number (this is enforced as a product guardrail, see `MASTER_PROMPT.md`).

## Commands

This project uses **pnpm** (pinned via `packageManager` in `package.json`). Use `pnpm`, not npm/yarn.

```bash
pnpm install        # install deps (applies the wouter patch in patches/)
pnpm dev            # Vite dev server on http://localhost:3000 (--host, auto-bumps port if busy)
pnpm check          # TypeScript type-check (tsc --noEmit) — this is the only "test" gate
pnpm format         # Prettier write across the repo
pnpm build          # vite build (client → dist/public) + esbuild bundle server (→ dist/index.js)
pnpm start          # run the production server (NODE_ENV=production node dist/index.js)
pnpm preview        # preview the built client
```

There is **no test runner wired up** despite `vitest` being installed — there are no `*.test.ts`
files and no `test` script. Treat `pnpm check` (plus a manual run via `pnpm dev`) as the
verification gate before committing. If you add tests, add a `test` script and run it.

## Architecture (the big picture)

A **frontend-only React 19 + Vite 7 SPA** with a deliberately thin Express server that exists
only to serve the built static files in production.

- **`server/index.ts`** — minimal Express app. Serves `dist/public` and falls back to
  `index.html` for any route (SPA catch-all). It has **no API routes and no database**; all
  app data lives in the client bundle. Don't assume a backend exists.
- **`client/`** is the Vite `root`. Entry is `client/src/main.tsx` → `App.tsx`.
- **Routing** uses `wouter` with **hash-based location** (`useHashLocation`). Routes are declared
  in `App.tsx`: `/` (Dashboard), `/book-method`, `/exam`, `/quiz`, `/search`. Add new routes there.
  Hash routing matters because the app is served as flat static files.
- **The four study modes are the product**, each a page under `client/src/pages/`:
  - `ExamMode` — timed, scored 25-question simulated exam.
  - `QuizMode` ("Quick Drill") — rapid-fire; every answer reveals the 4-step index lookup path.
  - `SearchMode` ("Code Lookup") — keyword/article search over the question bank.
  - `BookMethod` — the "How to Use Your Book" teaching layer (primary CTA on the Dashboard).
- **`client/src/data/questionBank.ts` is the heart of the app.** It's a single typed array
  (`QuestionCard[]`) — the entire content database. Every page reads from it; there is no CMS or
  fetch. The `QuestionCard` / `LookupPath` interfaces at the top of that file define the data
  contract: `id`, `question`, `choices`, `correct_answer`, `explanation`, `nec_article`,
  `nec_versions`, `difficulty` (`journeyman` | `master` | `inspector`), `tags`, and a
  `lookup_path` teaching the exact NEC index → article/table navigation. **Adding exam content
  means appending well-formed objects to this array** — keep every field populated and accurate,
  especially `lookup_path` (the book-navigation methodology is a core feature, not filler).
- **NEC version awareness** runs through `NecVersionContext` (`contexts/NecVersionContext.tsx`,
  default `"2023"`, options `2017/2020/2023/2026`). Pages filter `questionBank` by
  `q.nec_versions.includes(version)`. When adding questions, list **every** edition the answer is
  valid for, and when adding version-sensitive logic, read the version from this context rather
  than hardcoding.
- **Theme** is dark-by-default via `ThemeContext` (`defaultTheme="dark"`). The whole app is
  wrapped in `ErrorBoundary > ThemeProvider > NecVersionProvider > TooltipProvider` in `App.tsx`.

## UI conventions

- **shadcn/ui** (new-york style) primitives live in `client/src/components/ui/` (generated —
  avoid hand-editing unless intentionally customizing). App-level components are in
  `client/src/components/` (`AppLayout`, `Map`, `ErrorBoundary`, `ManusDialog`). Compose pages
  inside `<AppLayout>`.
- **Tailwind v4** (configured via the Vite plugin + `@theme` in `client/src/index.css` — there is
  no `tailwind.config.js`). Design tokens are OKLCH CSS variables in `index.css`.
- **Design language = "Industrial Control Panel":** dark background, amber/orange `--primary`
  accent, `JetBrains Mono` for the monospace/`.stencil-label` look, and signature utility classes
  `.panel-card`, `.indicator-pulse`, `.stencil-label`. Reuse these instead of inventing new
  styling so screens stay visually consistent.
- Merge class names with `cn()` from `@/lib/utils` (clsx + tailwind-merge).
- Icons come from `lucide-react`.

## Conventions & gotchas

- **Path aliases:** `@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets`.
  Use them instead of long relative paths (configured in both `vite.config.ts` and `tsconfig.json`).
- **Prettier** is the formatter (`.prettierrc`): 80-col, 2-space, double quotes, semicolons,
  `arrowParens: avoid`. Run `pnpm format` before committing.
- **TypeScript is strict.** `pnpm check` must pass. Prefer extending the existing typed interfaces
  over `any`.
- `shared/const.ts` holds constants shared between client and (potential) server; `client/src/const.ts`
  re-exports them and builds the OAuth login URL from `VITE_*` env vars at runtime. OAuth is scaffolded
  via env (`VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`) but not yet a wired-up flow.
- **Manus tooling:** `vite.config.ts` injects dev-only plugins (`vitePluginManusRuntime`, a debug-log
  collector writing to `.manus-logs/`, and a `/manus-storage` proxy). These are scaffolding from the
  build environment — leave them alone unless the task is about them. `client/public/__manus__/` and
  `.manus-logs/` are generated, not source.
- `MASTER_PROMPT.md` and `ideas.md` capture the founder's product vision, voice, and guardrails
  (e.g. "never imply this replaces the official NEC"). Read them for product intent; they are docs,
  not code.

## Adding a new study mode (typical change)

1. Create `client/src/pages/YourMode.tsx`, wrapped in `<AppLayout>`.
2. Read content from `questionBank` and filter by `useNecVersion()`.
3. Register the route in `App.tsx` (`<Route path="/your-mode" component={YourMode} />`).
4. Add a card/link in `Dashboard.tsx`'s `MODES` list so users can reach it.
5. `pnpm check` and `pnpm format`, then verify in `pnpm dev`.
