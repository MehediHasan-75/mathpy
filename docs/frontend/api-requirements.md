# Frontend API requirements

Inventory of APIs the MathPy frontend needs, derived from `frontend/` components, `lib/data.ts`, `lib/assignments.ts`, and `shared/types/`.  

**Current state:** Almost all UI data is mock (`MOCK` in `lib/data.ts`, hardcoded arrays in components). Only assignment submit + reminder cron call real Next.js routes under `frontend/app/api/`. Per `AGENTS.md`, production data should come from the **FastAPI backend** via HTTP (TanStack Query); shared types in `/shared` should match Pydantic schemas.

**Auth:** Cookie-based JWT (5-minute access + refresh). See [backend auth](../backend/auth.md). All protected routes expect `Cookie: access_token=...` unless noted.

**Naming:** Backend/shared types use `snake_case`. Frontend mock types use `camelCase` — map at the client boundary.

---

## Summary table

| Area | Status | Primary routes / pages |
|------|--------|-------------------------|
| Auth | Documented (backend) | All pages |
| Assignments submit | **Implemented** (Next.js) | `/lesson` |
| Assignment reminders | **Implemented** (Next.js cron) | Vercel cron → `/api/assignments/remind` |
| Student / dashboard | Mock | `/`, `/v1`, chrome |
| Courses & lessons | Mock | `/courses`, `/lesson` |
| Exams & MCQ | Mock | `/exams`, `/exams/practice` |
| Performance | Mock | `/v2` |
| Materials | Mock | `/materials`, lesson tab |
| Live classes | Mock | `/live` |
| Mentor | Mock | `/mentor` |
| Calendar | Mock | `/calendar` |
| Settings / notifications | Mock (local theme) | `/settings` |
| Mission brief tasks | **Local only** (`localStorage`) | `/` |
| Search (topbar) | UI only | chrome |

---

## 1. Implemented today (Next.js API routes)

These live in `frontend/app/api/` and are called directly from the browser today.

### 1.1 `POST /api/assignments/submit`

**Used by:** `components/lesson.tsx` (assignment tab).

**Request:** `multipart/form-data`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `assignmentId` | string | yes | e.g. `a-l1` |
| `file` | File | yes | PDF only |
| `studentId` | string | no | defaults to `student-1` on server |
| `studentEmail` | string | no | defaults to mock email on server |

**Success `200`:**

```json
{
  "ok": true,
  "submission": {
    "id": "sub_1710000000000",
    "assignmentId": "a-l1",
    "studentId": "student-1",
    "studentEmail": "arafat.rahman@student.mathpy.bd",
    "fileName": "mechanism.pdf",
    "fileSize": 1048576,
    "submittedAt": "2026-04-24T10:30:00.000Z"
  }
}
```

**Errors:**

| Status | Body |
|--------|------|
| `400` | `{ "error": "assignmentId and file are required" }` |
| `400` | `{ "error": "Only PDF files accepted" }` |
| `400` | `{ "error": "File too large — max 20 MB" }` |
| `404` | `{ "error": "Assignment not found" }` |
| `500` | `{ "error": "Internal server error" }` |

**Production note (`AGENTS.md`):** Large PDFs must not go through serverless body limits. Replace with presigned upload (Uploadthing / S3) + backend metadata record. Target shape aligns with `shared/types/assignments.ts` → `AssignmentSubmission`.

---

### 1.2 `GET /api/assignments/remind`

**Used by:** Vercel cron (`vercel.json`, daily `08:00 UTC`). Not called from UI.

**Request headers:**

| Header | Required | Value |
|--------|----------|-------|
| `Authorization` | if `CRON_SECRET` set | `Bearer <CRON_SECRET>` |

**Success `200`:**

```json
{
  "ok": true,
  "checkedAt": "2026-04-24T08:00:00.000Z",
  "results": [
    {
      "assignmentId": "a-l1",
      "emailed": ["arafat.rahman@student.mathpy.bd"],
      "errors": []
    }
  ]
}
```

**Error `401`:** `{ "error": "Unauthorized" }`

**Production:** Move logic to FastAPI + job runner; keep same response shape for observability.

---

## 2. Authentication (FastAPI — required for all protected UI)

Documented in [auth.md](../backend/auth.md). Frontend will need TanStack Query + cookie credentials (`credentials: 'include'`).

### 2.1 `POST /api/auth/login`

**Request** `application/json`:

```json
{
  "email": "arafat.rahman@student.mathpy.bd",
  "password": "SecurePassword123!",
  "fingerprint_id": "a8f3b9c..."
}
```

**Response `200`:** Sets `access_token` and `refresh_token` cookies.

```json
{
  "message": "Login successful.",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "role": "student"
  }
}
```

**Errors:** `403` banned / device limit; invalid credentials.

---

### 2.2 `POST /api/auth/refresh`

**Request:** `Cookie: refresh_token=...` (no body).

**Response `200`:** New `access_token` cookie (and rotated refresh token).

**Errors:** `401` if session killed (new device login) or invalid token.

---

### 2.3 `POST /api/auth/logout`

**Request:** `Cookie: access_token=...`

**Response:** Clears cookies; invalidates session by `sid` from JWT.

---

## 3. Student profile & shell (FastAPI)

**Feeds:** `Sidebar`, `Topbar`, `/settings`, all dashboards.

### 3.1 `GET /api/me` (or `/api/students/me`)

**Response `200`:**

```json
{
  "id": "uuid",
  "name": "Arafat Rahman",
  "initials": "AR",
  "email": "arafat.rahman@student.mathpy.bd",
  "student_id": "MP-2026-14182",
  "phone": "+880 1712 345 678",
  "track": "Medical Admission 2026",
  "batch": "Medi-Prep · Batch 14",
  "role": "student",
  "streak_days": 23,
  "target_score_pct": 90,
  "current_score_pct": 78.4,
  "rank_overall": 142,
  "rank_out_of": 4820,
  "days_to_exam": 127
}
```

Maps from `MOCK.student` in `lib/data.ts` + settings profile fields.

---

### 3.2 `PATCH /api/me`

**Request** `application/json` (partial):

```json
{
  "name": "Arafat Rahman",
  "phone": "+880 1712 345 678"
}
```

**Response `200`:** Updated user object (same shape as `GET /api/me`).

---

### 3.3 `GET /api/notifications`

**Feeds:** Topbar bell (currently static dot).

**Response `200`:**

```json
{
  "items": [
    {
      "id": "n1",
      "text": "Model Test 07 starts in 21 hours",
      "time": "now",
      "kind": "exam",
      "read": false
    }
  ],
  "unread_count": 3
}
```

Maps from `MOCK.notifications`.

---

### 3.4 `PATCH /api/me/notification-preferences`

**Feeds:** `/settings` → Notifications section.

**Request:**

```json
{
  "exam_reminders": true,
  "live_class_alerts": true,
  "mentor_messages": true,
  "new_materials": false
}
```

**Response `200`:** Same object.

---

### 3.5 `PATCH /api/me/study-goals`

**Feeds:** `/settings` → Study goals.

**Request:**

```json
{
  "daily_study_hours": 3,
  "weekly_exam_target": "1_model_2_practice"
}
```

**Response `200`:** Goals + computed pace:

```json
{
  "daily_study_hours": 3,
  "weekly_exam_target": "1_model_2_practice",
  "weekly_target_pct": 68,
  "weekly_target_goal_hours": 18,
  "weekly_target_done_hours": 12.2
}
```

---

## 4. Dashboard & command center (FastAPI)

**Pages:** `/` (`V3Command`), `/v1` (`V1Executive`).

### 4.1 `GET /api/dashboard/summary`

**Response `200`:**

```json
{
  "primary_action": {
    "type": "resume",
    "course": "Organic Chemistry",
    "lesson": "Lecture 05 — Aldehydes & Ketones: Nucleophilic Addition",
    "instructor": "Dr. Sharmin Akter",
    "watched_pct": 42,
    "remaining": "28 min left",
    "chapter": "Chapter 12 of 19",
    "lesson_id": "l1",
    "course_id": "c1"
  },
  "secondary_action": {
    "type": "exam",
    "title": "Medical Admission Model Test 07",
    "when": "Tomorrow · 9:00 AM",
    "duration_min": 60,
    "questions": 100,
    "subjects": ["Physics", "Chemistry", "Biology"],
    "exam_id": "e1"
  },
  "live_now": {
    "title": "Organic Chemistry — Doubt Clearing",
    "instructor": "Dr. Sharmin Akter",
    "viewers": 342,
    "started_min_ago": 18,
    "lesson_id": "l1"
  } ,
  "mentor_preview": {
    "name": "Farhan Kabir",
    "title": "Senior Mentor · DMC '22",
    "initials": "FK",
    "last_message": "…",
    "time_ago": "2 hours ago"
  },
  "leaderboard_snippet": [
    { "rank": 142, "name": "You", "score_pct": 78.4, "is_you": true }
  ]
}
```

Maps from `MOCK.primaryAction`, `secondaryAction`, `liveNow`, `mentor`, and leaderboard in `v3-command.tsx`.

**Note:** Mission brief **tasks** stay client-side (`localStorage` key `mathpy-plan-YYYY-MM-DD`) — no API unless product adds sync.

---

## 5. Courses & lessons (FastAPI)

**Shared types:** `shared/types/courses.ts` (`Course`, `Chapter`, `Lesson`, `LessonProgress`, `StudyMaterial`).

**Pages:** `/courses`, `/lesson`.

### 5.1 `GET /api/courses/enrolled`

**Response `200`:** List of course cards for student.

```json
{
  "courses": [
    {
      "id": "c1",
      "title": "Organic Chemistry",
      "subtitle": "HSC + Medical Prep",
      "track": "Medical",
      "instructor": "Dr. Sharmin Akter",
      "progress_pct": 62,
      "completed_lessons": 34,
      "total_lessons": 55,
      "next_lesson_id": "l1",
      "next_lesson_title": "Aldehydes & Ketones",
      "next_lesson_duration": "48:12",
      "color": "blue",
      "cover_tone": "oklch(0.92 0.04 258)"
    }
  ]
}
```

Frontend type: `Course` in `lib/data.ts` / `CourseCard` in `shared/types/data.ts`.

---

### 5.2 `GET /api/courses/{course_id}`

**Response `200`:** Course detail + chapter/lesson tree for playlist.

```json
{
  "id": "c1",
  "title": "Organic Chemistry",
  "progress_pct": 62,
  "completed_lessons": 34,
  "total_lessons": 55,
  "chapters": [
    {
      "id": "ch12",
      "title": "Aldehydes & Ketones",
      "lessons": [
        {
          "id": "l1",
          "order": 5,
          "title": "Aldehydes & Ketones: Nucleophilic Addition",
          "duration": "48:12",
          "progress_pct": 42,
          "status": "in_progress",
          "is_active": true
        }
      ]
    }
  ]
}
```

Maps to `PLAYLIST` in `lesson.tsx`.

---

### 5.3 `GET /api/lessons/{lesson_id}`

**Response `200`:** Full lesson player payload.

```json
{
  "id": "l1",
  "course_id": "c1",
  "chapter_id": "ch12",
  "title": "Aldehydes & Ketones: Nucleophilic Addition",
  "instructor": {
    "name": "Dr. Sharmin Akter",
    "initials": "SA",
    "title": "Senior Faculty · DMC '05"
  },
  "youtube_video_id": "dQw4w9WgXcQ",
  "duration_sec": 2892,
  "watched_pct": 42,
  "watched_sec": 1216,
  "chapters": [
    { "time": "00:00", "title": "Introduction & recap" },
    { "time": "04:12", "title": "Nucleophilic addition mechanism", "active": true }
  ],
  "prev_lesson": { "id": "l0", "title": "Ethers, Epoxides & Thiols", "label": "LEC 04" },
  "next_lesson": { "id": "l2", "title": "Carboxylic Acids & Derivatives", "label": "LEC 06" },
  "teacher_note": {
    "author": "Dr. Sharmin Akter",
    "body": "Cyanohydrin hydrolysis appears in ~30% of medical admission papers…"
  },
  "discussion_count": 12,
  "materials_count": 4,
  "related_practice": {
    "title": "30 MCQ on Nucleophilic Addition",
    "duration_min": 20,
    "exam_id": "ct-12"
  }
}
```

Video: frontend renders `youtube_video_id` via Video.js (`AGENTS.md`).

---

### 5.4 `GET /api/lessons/{lesson_id}/notes`

**Response `200`:**

```json
{
  "notes": [
    { "id": "note1", "time": "04:12", "text": "Nucleophilic addition happens because…", "author": "student" }
  ]
}
```

---

### 5.5 `POST /api/lessons/{lesson_id}/notes`

**Request:**

```json
{
  "time": "20:16",
  "text": "Add a note at this timestamp…"
}
```

**Response `201`:** Created note object.

---

### 5.6 `POST /api/lessons/{lesson_id}/progress`

**Used by:** “Mark complete”, watch position updates.

**Request:**

```json
{
  "watched_sec": 1216,
  "completed": false
}
```

**Response `200`:** `{ "watched_pct": 42, "completed": false }`

Aligns with `LessonProgress` in shared types.

---

### 5.7 `GET /api/lessons/{lesson_id}/transcript`

**Response `200`:**

```json
{
  "segments": [
    { "time": "00:00", "text": "Good afternoon everyone…" }
  ]
}
```

---

## 6. Assignments (FastAPI — replace in-memory Next.js store)

**Shared types:** `shared/types/assignments.ts`.

**Pages:** `/lesson` assignment tab.

### 6.1 `GET /api/lessons/{lesson_id}/assignment`

**Response `200`:**

```json
{
  "id": "a-l1",
  "lesson_id": "l1",
  "course_id": "c1",
  "title": "Nucleophilic Addition — Mechanism Analysis",
  "description": "Write a detailed mechanism…",
  "due_date": "2026-04-26T10:00:00.000Z",
  "max_score": 20,
  "submission": {
    "id": "sub_uuid",
    "file_url": "https://…",
    "submitted_at": "2026-04-24T09:00:00.000Z",
    "status": "submitted",
    "score": null
  }
}
```

`submission` is `null` if not submitted. Frontend type: `Assignment` in `lib/assignments.ts` (camelCase in UI).

---

### 6.2 `POST /api/assignments/{assignment_id}/upload-url`

**Request:**

```json
{
  "file_name": "mechanism.pdf",
  "content_type": "application/pdf",
  "file_size": 1048576
}
```

**Response `200`:**

```json
{
  "upload_url": "https://s3…",
  "file_key": "assignments/a-l1/user/file.pdf",
  "expires_at": "2026-04-24T10:35:00.000Z"
}
```

Client uploads directly, then calls submit.

---

### 6.3 `POST /api/assignments/{assignment_id}/submissions`

**Request:**

```json
{
  "file_key": "assignments/a-l1/user/file.pdf",
  "file_name": "mechanism.pdf",
  "file_size": 1048576
}
```

**Response `201`:** `AssignmentSubmission` from shared types:

```json
{
  "id": "uuid",
  "assignment_id": "a-l1",
  "user_id": "uuid",
  "file_url": "https://cdn…/mechanism.pdf",
  "submitted_at": "2026-04-24T10:30:00.000Z",
  "score": null,
  "status": "submitted"
}
```

---

## 7. Exams & MCQ practice (FastAPI)

**Shared types:** `shared/types/exams.ts` (`Exam`, `Question`, `ExamSubmission`, `ExamAnswers`).

**Pages:** `/exams`, `/exams/practice`.

**Behavior (`AGENTS.md`):**

- After selecting an option, question is locked (`readOnly`).
- On `blur` / `visibilitychange`, auto-submit via API.
- Before submit, verify session is still active.

### 7.1 `GET /api/exams`

**Query:** `?status=upcoming|completed&filter=Model Test|Chapter Test|…`

**Response `200`:**

```json
{
  "stats": {
    "completed_count": 47,
    "avg_rank": 189,
    "batch_avg_pct": 74,
    "your_avg_pct": 78.4
  },
  "upcoming": [
    {
      "id": "mt-07",
      "type": "Model Test",
      "title": "Medical Admission Model Test 07",
      "when": "Tomorrow · 9:00 AM",
      "when_meta": "in 18h 42m",
      "duration_min": 60,
      "mcq": 100,
      "subjects": ["Biology", "Chemistry", "Physics"],
      "readiness_pct": 72,
      "urgent": true,
      "recommended": false
    }
  ],
  "completed": [
    {
      "id": "mt-06",
      "type": "Model Test",
      "title": "Medical Admission Model Test 06",
      "date": "Apr 17",
      "score_pct": 82,
      "rank": 128,
      "out_of": 4820,
      "mcq": 100,
      "correct": 82
    }
  ]
}
```

Maps to `UPCOMING` / `COMPLETED` in `exams-hub.tsx`. Also overlaps `MOCK.exams` / `ExamCard` in `lib/data.ts`.

---

### 7.2 `POST /api/exams/{exam_id}/sessions`

**Starts** an exam attempt. Validates session active.

**Request:**

```json
{
  "fingerprint_id": "optional-for-anti-cheat"
}
```

**Response `201`:**

```json
{
  "submission_id": "uuid",
  "exam_id": "ct-12",
  "title": "Nucleophilic Addition — 30 MCQ",
  "duration_min": 20,
  "total_questions": 30,
  "ends_at": "2026-04-24T11:00:00.000Z",
  "server_time": "2026-04-24T10:40:00.000Z"
}
```

---

### 7.3 `GET /api/exams/sessions/{submission_id}`

**Response `200`:** Current attempt state for practice UI.

```json
{
  "submission_id": "uuid",
  "current_index": 11,
  "time_left_sec": 767,
  "questions": [
    {
      "id": "q_uuid",
      "index": 11,
      "subject": "Organic Chemistry · Ch 12",
      "topic": "Nucleophilic Addition",
      "difficulty": "Medium",
      "text": "Which of the following carbonyl compounds…",
      "subtext": "Consider the effect of electronic…",
      "options": [
        { "key": "A", "text": "Acetone (CH₃COCH₃)" },
        { "key": "B", "text": "Acetaldehyde (CH₃CHO)" }
      ],
      "selected_key": "B",
      "marked_for_review": false,
      "locked": true
    }
  ],
  "palette": {
    "answered": 15,
    "marked": 3,
    "unvisited": 15
  }
}
```

Do **not** include `correct_answer` until after submit.

---

### 7.4 `PATCH /api/exams/sessions/{submission_id}/answers`

**Request** (one question at a time; locks after save):

```json
{
  "question_id": "q_uuid",
  "answer_key": "B",
  "marked_for_review": false
}
```

**Response `200`:**

```json
{
  "question_id": "q_uuid",
  "locked": true,
  "palette": { "answered": 16, "marked": 3, "unvisited": 14 }
}
```

---

### 7.5 `POST /api/exams/sessions/{submission_id}/submit`

**Used by:** Manual submit and focus-loss auto-submit.

**Request:**

```json
{
  "reason": "manual" ,
  "answers": {
    "q_uuid_1": "B",
    "q_uuid_2": "A"
  }
}
```

`reason`: `"manual"` | `"focus_lost"` | `"time_up"`.

**Response `200`:**

```json
{
  "submission_id": "uuid",
  "status": "completed",
  "score_pct": 84,
  "correct": 25,
  "total": 30,
  "submitted_at": "2026-04-24T10:55:00.000Z"
}
```

`status` may be `auto_submitted_focus_lost` per `ExamSubmissionStatus` in shared types.

---

## 8. Performance analytics (FastAPI)

**Page:** `/v2` (`V2Performance`).

### 8.1 `GET /api/performance/overview`

**Query:** `?period=week|month`

**Response `200`:**

```json
{
  "overall_score_pct": 78.4,
  "score_delta": 2.1,
  "target_score_pct": 90,
  "rank_overall": 142,
  "rank_delta_week": -18,
  "percentile": 97,
  "rank_out_of": 4820,
  "rank_trajectory": [220, 198, 189, 176, 168, 155, 149, 142],
  "subject_performance": [
    { "subject": "Biology", "pct": 88, "trend": 4 },
    { "subject": "Chemistry", "pct": 82, "trend": 6 },
    { "subject": "Physics", "pct": 71, "trend": -2 },
    { "subject": "Math", "pct": 79, "trend": 3 }
  ],
  "weekly_activity_hours": [1.2, 2.8, 3.1, 0.4, 2.6, 1.9, 0.2],
  "recent_results": [
    {
      "id": "r1",
      "title": "Organic Ch. 11",
      "score_pct": 82,
      "delta": 6,
      "date": "Apr 20"
    }
  ],
  "primary_action": { }
}
```

Maps from `MOCK.subjectPerformance`, `weeklyActivity`, `recentResults`, `student`.

---

## 9. Study materials (FastAPI)

**Page:** `/materials`, lesson “Materials” tab.

### 9.1 `GET /api/materials`

**Query:** `?course_id=c1` (optional)

**Response `200`:**

```json
{
  "materials": [
    {
      "id": "m1",
      "title": "Aldehydes & Ketones — Reaction Sheet",
      "course": "Organic Chemistry",
      "course_id": "c1",
      "kind": "Sheet",
      "pages": 8,
      "size": "2.4 MB",
      "file_url": "https://…",
      "downloaded_at": "Today"
    }
  ]
}
```

Shared: `StudyMaterial` in `shared/types/courses.ts`.

---

### 9.2 `GET /api/lessons/{lesson_id}/materials`

Same item shape as above, scoped to lesson.

---

## 10. Live classes (FastAPI)

**Page:** `/live`, dashboard `live_now`.

### 10.1 `GET /api/live`

**Response `200`:**

```json
{
  "live_now": {
    "id": "live1",
    "title": "Organic Chemistry — Doubt Clearing",
    "instructor": "Dr. Sharmin Akter",
    "viewers": 342,
    "started_min_ago": 18,
    "join_url": "https://…"
  },
  "upcoming": [
    {
      "id": "lv1",
      "title": "Physics — Rotational Dynamics Q&A",
      "instructor": "Md. Rafiq Hasan",
      "subject": "Physics",
      "scheduled_at": "Today · 6:00 PM",
      "duration_min": 90,
      "registered": 284
    }
  ],
  "past": [
    {
      "id": "pv1",
      "title": "Organic Chemistry — Carbonyl Compounds",
      "instructor": "Dr. Sharmin Akter",
      "subject": "Chemistry",
      "recorded_at": "Apr 22",
      "duration_min": 88,
      "viewers": 1203,
      "recording_url": "https://…"
    }
  ]
}
```

---

### 10.2 `POST /api/live/{live_id}/register`

**Response `204`** or `{ "registered": true }`.

---

## 11. Mentor (FastAPI)

**Page:** `/mentor`.

### 11.1 `GET /api/mentor`

**Response `200`:**

```json
{
  "mentor": {
    "id": "uuid",
    "name": "Farhan Kabir",
    "title": "Senior Mentor · DMC '22",
    "initials": "FK"
  }
}
```

---

### 11.2 `GET /api/mentor/messages`

**Query:** `?cursor=` (pagination)

**Response `200`:**

```json
{
  "messages": [
    {
      "id": "msg1",
      "from": "mentor",
      "text": "Great work on Chapter 11!…",
      "sent_at": "2026-04-24T08:00:00.000Z",
      "time_ago": "2h ago"
    }
  ],
  "next_cursor": null
}
```

---

### 11.3 `POST /api/mentor/messages`

**Request:**

```json
{
  "text": "Thank you! I spent extra time on…"
}
```

**Response `201`:** Created message.

---

### 11.4 `GET /api/mentor/questions`

**Response `200`:**

```json
{
  "questions": [
    {
      "id": "q1",
      "text": "Explain why aldehydes are more reactive…",
      "subject": "Chemistry",
      "difficulty": "Medium",
      "answered": false
    }
  ]
}
```

---

## 12. Calendar (FastAPI)

**Page:** `/calendar`.

### 12.1 `GET /api/calendar/events`

**Query:** `?year=2026&month=4`

**Response `200`:**

```json
{
  "month": "April 2026",
  "events": [
    {
      "id": "ev1",
      "day": 25,
      "title": "Model Test 07",
      "time": "9:00 AM",
      "kind": "exam",
      "starts_at": "2026-04-25T09:00:00+06:00"
    }
  ]
}
```

`kind`: `exam` | `live` | `lesson` | `mentor` (matches `calendar.tsx`).

---

## 13. Search (FastAPI — optional)

**UI:** Topbar command palette (`⌘K`) — placeholder only today.

### 13.1 `GET /api/search`

**Query:** `?q=organic&limit=10`

**Response `200`:**

```json
{
  "results": [
    { "type": "course", "id": "c1", "title": "Organic Chemistry", "href": "/courses" },
    { "type": "lesson", "id": "l1", "title": "Aldehydes & Ketones", "href": "/lesson?id=l1" },
    { "type": "exam", "id": "ct-12", "title": "Chapter Test — Ch 12", "href": "/exams" }
  ]
}
```

---

## 14. No backend API (client-only)

| Feature | Storage | File |
|---------|---------|------|
| Theme (dark/light) | `localStorage` + `data-theme` on `<html>` | `theme-provider.tsx` |
| Mission brief tasks | `localStorage` `mathpy-plan-YYYY-MM-DD` | `v3-command.tsx` |
| MCQ practice UI state (mock) | React state only | `mcq-practice.tsx` |

---

## 15. Environment variables (frontend)

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Bearer token for `GET /api/assignments/remind` |
| `NEXT_PUBLIC_APP_URL` | Links in reminder emails |
| `NEXT_PUBLIC_API_URL` | FastAPI base URL (when wired) |
| Email provider keys | Reminder emails (see `remind/route.ts` TODO) |

---

## 16. Migration checklist

1. Add TanStack Query provider and `credentials: 'include'` for auth cookies.
2. Replace `MOCK` imports with query hooks per section above.
3. Move assignment upload to presigned URL flow; keep or proxy submit through FastAPI.
4. Move reminder cron to backend job; frontend route can be removed.
5. Align response field names with `/shared` types and generate matching Pydantic models in backend.

**Reference files**

- Mock types: `frontend/lib/data.ts`, `frontend/lib/assignments.ts`
- Shared contracts: `shared/types/*.ts`
- Implemented routes: `frontend/app/api/assignments/submit/route.ts`, `remind/route.ts`
- Auth spec: `docs/backend/auth.md`
