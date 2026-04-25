# mathpy

Premium LMS student dashboard for Bangladeshi medical/engineering admission coaching. Built with Next.js 16 + React 19. All UI in oklch color tokens, no Tailwind.

## Pages

| Route | Description |
|---|---|
| `/` | Command Center — daily mission brief, rank, live class, courses |
| `/v1` | Classic dashboard — editorial masthead, weekly stats |
| `/courses` | My Courses — grid/list toggle, track filter, progress |
| `/lesson` | Lesson player — video, notes, chapters, assignment submission |
| `/live` | Live Classes — active stream banner, upcoming schedule, recordings |
| `/exams` | Exams & MCQ hub — upcoming tests, readiness gauges, results |
| `/exams/practice` | MCQ practice session — answer sheet, timer, submit |
| `/v2` | Performance dashboard — rank sparkline, subject breakdown, heatmap |
| `/materials` | Study Materials — search, subject filter, download state |
| `/mentor` | Mentor chat — messages, practice questions, session stats |
| `/calendar` | Calendar — monthly grid with events, day detail panel |
| `/settings` | Settings — profile, notifications, study goals, appearance |

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/assignments/submit` | `POST` | Upload PDF assignment (multipart/form-data) |
| `/api/assignments/remind` | `GET` | Check overdue submissions, trigger reminder emails |

The remind endpoint runs automatically every 6 hours via Vercel Cron (`vercel.json`). Protect it with `CRON_SECRET` env var.

## Assignment + Email Reminder Flow

1. Each lesson has an assignment with a due date
2. Student uploads PDF via the **Assignment** tab in `/lesson`
3. `POST /api/assignments/submit` validates (PDF only, max 20 MB) and stores submission
4. Cron hits `GET /api/assignments/remind` every 6h — finds students past due with no submission
5. Sends reminder email per student

**Email sending is a stub** — plug in your provider in `app/api/assignments/remind/route.ts`:

```ts
// Resend
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ from: 'noreply@mathpy.bd', to, subject, html }),
});
```

## Tech

- **Next.js 16.2** — App Router, static pre-rendering, server route handlers
- **React 19** — `useState`, `useEffect`, `useRef`, `useContext`
- **TypeScript** — strict, no `any`
- **Fonts** — Inter, Inter Tight, JetBrains Mono via `next/font/google`
- **Colors** — oklch tokens throughout, no hex/rgb
- **Theme** — dark/light toggle, `localStorage` persistence, FOUC-free via inline script

## Environment Variables

```env
# Cron endpoint protection
CRON_SECRET=your-secret-here

# Email (fill in for your provider)
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Example: Resend
RESEND_API_KEY=re_...

# Example: SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
SMTP_FROM=noreply@mathpy.bd
```

## Dev

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Project Structure

```
app/
  page.tsx                     # / → Command Center
  layout.tsx                   # root layout, fonts, ThemeProvider
  globals.css                  # all design tokens + component styles
  api/
    assignments/
      submit/route.ts          # PDF upload handler
      remind/route.ts          # overdue check + email stub
  [route]/page.tsx             # one file per page

components/
  chrome.tsx                   # Sidebar + Topbar (shared shell)
  icons.tsx                    # custom SVG icon set
  brand.tsx                    # Wordmark + Spotmark
  theme-provider.tsx           # dark/light context + localStorage
  v3-command.tsx               # Command Center (main dashboard)
  v1-executive.tsx             # Classic dashboard
  lesson.tsx                   # Lesson player + assignment
  courses.tsx                  # My Courses
  live.tsx                     # Live Classes
  exams-hub.tsx                # Exams hub
  mcq-practice.tsx             # MCQ practice session
  v2-performance.tsx           # Performance dashboard
  materials.tsx                # Study Materials
  mentor.tsx                   # Mentor chat
  calendar.tsx                 # Calendar
  settings.tsx                 # Settings

lib/
  data.ts                      # MOCK data + types
  assignments.ts               # Assignment types + in-memory store
```
