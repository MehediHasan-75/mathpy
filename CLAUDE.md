# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo structure

```
mathpy/
├── frontend/   # Next.js 16.2 app — all UI + API routes (primary work happens here)
├── backend/    # FastAPI skeleton (placeholder, not deployed)
└── shared/     # TypeScript type definitions re-exported via shared/index.ts
```

All active development is in `frontend/`. The `backend/` is a skeleton with only a health-check endpoint. API routes live in `frontend/app/api/`.

## Dev commands

```bash
# Frontend (all work happens here)
cd frontend
npm run dev      # http://localhost:3000
npm run build
npm run start

# Backend (placeholder only)
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload   # http://localhost:8000
```

No test runner is configured. No lint script is defined in package.json.

## Next.js version note

This uses **Next.js 16.2.4** with **React 19** — breaking changes from older versions exist. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/` for current API conventions.

## Frontend architecture

See `frontend/CLAUDE.md` for full detail. Key points:

- **No Tailwind** — all styles in `frontend/app/globals.css` using oklch color tokens. Never add `<style>` tags in components or use hex/rgb colors.
- All CSS classes defined in `globals.css`; use inline styles only for per-instance layout/spacing.
- Every page component requires `'use client'` (hooks + event handlers).
- `components/chrome.tsx` — `Sidebar` + `Topbar` shell shared by all pages.
- `lib/data.ts` — all mock data; `lib/assignments.ts` — assignment types + in-memory store (resets on restart).
- `shared/` types are not currently imported by frontend (types duplicated in `lib/`).

## Adding a new page

1. Create `frontend/components/my-page.tsx` with `'use client'` + named export
2. Create `frontend/app/my-route/page.tsx` importing and rendering it
3. Add entry to `NAV` array in `frontend/components/chrome.tsx`

## Environment variables

```
CRON_SECRET=           # protects GET /api/assignments/remind (Bearer token)
NEXT_PUBLIC_APP_URL=   # used in reminder email links
# email provider keys (Resend or SMTP) — see remind/route.ts
```

Cron runs daily at 08:00 UTC via Vercel (`frontend/vercel.json`).
