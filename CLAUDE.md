@AGENTS.md

# mathpy — Project Context for Claude

## What this is
Premium LMS student dashboard. Medical/engineering admission coaching for Bangladesh. Next.js 16 + React 19 App Router. No Tailwind — all styles in `app/globals.css` using oklch color tokens.

## Stack
- **Next.js 16.2.4** — App Router, `'use client'` required for any hooks or event handlers
- **React 19** — hooks only in client components
- **TypeScript** — strict, no `any`
- **Fonts** — Inter, Inter Tight, JetBrains Mono via `next/font/google`, injected as CSS vars `--font-inter`, `--font-inter-tight`, `--font-jetbrains-mono`
- **Colors** — oklch throughout. Never use hex or rgb. All tokens in `:root` in `globals.css`
- **No external UI libraries** — buttons, cards, tabs, progress bars are all custom CSS classes

## Key files
- `app/globals.css` — single source of truth for all styles and design tokens
- `lib/data.ts` — all mock data and types (`MOCK` export)
- `lib/assignments.ts` — Assignment/Submission types + in-memory store
- `components/chrome.tsx` — `Sidebar` + `Topbar`, shared by every page
- `components/icons.tsx` — `Icons` object, custom SVG set, add new icons here
- `components/brand.tsx` — `Wordmark`, `Spotmark`
- `components/theme-provider.tsx` — `ThemeProvider` + `useTheme()` hook

## Theme system
- `ThemeProvider` wraps `<body>` in `app/layout.tsx`
- Theme stored in `localStorage`, applied as `data-theme="dark|light"` on `<html>`
- FOUC prevented by inline `<script>` in `<head>` that runs before hydration
- Default theme: **dark**
- Dark vars live in `html[data-theme="dark"]` in `globals.css`
- Toggle button in every `Topbar` via `useTheme()`

## Routes
| Route | Component |
|---|---|
| `/` | `V3Command` (Command Center — main dashboard) |
| `/v1` | `V1Executive` (classic dashboard) |
| `/courses` | `CoursesPage` |
| `/lesson` | `LessonPage` |
| `/live` | `LivePage` |
| `/exams` | `ExamsHub` |
| `/exams/practice` | `MCQPractice` |
| `/v2` | `V2Performance` |
| `/materials` | `MaterialsPage` |
| `/mentor` | `MentorPage` |
| `/calendar` | `CalendarPage` |
| `/settings` | `SettingsPage` |

## API routes
- `POST /api/assignments/submit` — multipart PDF upload, validates PDF + 20 MB limit
- `GET /api/assignments/remind` — cron endpoint, checks overdue submissions, stubs email sending
- Cron: every 6h via `vercel.json`. Protect with `CRON_SECRET` env var (Bearer token)

## CSS conventions
- All CSS classes defined in `globals.css` — never add `<style>` tags in components
- Inline styles for layout/spacing; class names for reusable visual patterns
- Available utility classes: `.mono`, `.display`, `.eyebrow`, `.tabular`
- Component classes: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-sm`, `.card`, `.card.interactive`, `.progress`, `.chip`, `.tabs`, `.tab`, `.avatar`, `.nav-item`, `.topbar`, `.sidebar`
- Progress bar colors: `progress blue`, `progress emerald`, `progress amber` — add `thick` for taller bar
- Shell layouts: `.artboard-shell` (standard pages), `.lesson-shell` (lesson player)

## Navigation
- `Sidebar` reads `NAV` + `SUPPORT` arrays in `chrome.tsx` — update those to add/rename nav items
- Active state: `pathname === item.href` via `usePathname()`
- `Topbar` accepts `crumbs` prop: `{ label, active?, href? }[]` — non-active crumbs with `href` render as `<Link>`
- Sidebar footer → `/settings`

## Mission Brief (Command Center)
- Tasks stored in `localStorage` keyed by date (`mathpy-plan-YYYY-MM-DD`) — resets each day
- `DEFAULT_TASKS` in `v3-command.tsx` is the seed for a fresh day
- Done count + progress bar % computed from state, not hardcoded

## Assignment system
- Assignments defined in `lib/assignments.ts` `ASSIGNMENTS` array
- Submissions stored in `submissionStore` Map (in-memory — resets on server restart, swap for DB in prod)
- Frontend: Assignment tab in lesson player, file picker, POST to submit API, shows confirmation
- `getOverdueUnsubmitted()` returns enrolled student emails past due with no submission — extend with real DB query in production

## Adding a new page
1. Create `components/my-page.tsx` with `'use client'` and `export function MyPage()`
2. Create `app/my-route/page.tsx` importing and rendering `MyPage`
3. Add entry to `NAV` array in `components/chrome.tsx`

## Env vars needed
```
CRON_SECRET=           # protects /api/assignments/remind
NEXT_PUBLIC_APP_URL=   # used in reminder email link
# email provider (your choice — see remind/route.ts TODO)
```
