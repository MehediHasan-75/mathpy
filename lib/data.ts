export type Course = {
  id: string;
  title: string;
  subtitle: string;
  track: 'Medical' | 'Engineering' | 'Varsity' | 'HSC';
  instructor: string;
  progressPct: number;
  completedLessons: number;
  totalLessons: number;
  nextLessonId: string;
  nextLessonTitle: string;
  nextLessonDuration: string;
  color: 'blue' | 'emerald' | 'amber' | 'ink';
  coverTone: string;
};

export type Exam = {
  id: string;
  title: string;
  type: 'Model Test' | 'Daily Practice' | 'Chapter Test' | 'Mock';
  scheduledAt: string;
  durationMin: number;
  totalMcq: number;
  subjects: string[];
  status: 'upcoming' | 'live' | 'completed';
  scorePct?: number;
  rank?: number;
  outOf?: number;
  urgency: 'today' | 'tomorrow' | 'this-week' | 'later';
};

export const MOCK = {
  student: {
    name: 'Arafat Rahman',
    initials: 'AR',
    track: 'Medical Admission 2026',
    batch: 'Medi-Prep · Batch 14',
    targetScore: 90,
    currentScore: 78.4,
    rankOverall: 142,
    rankOutOf: 4820,
    streakDays: 23,
    weeklyTargetPct: 68,
    weeklyTargetGoal: 18,
    weeklyTargetDone: 12.2,
  },

  primaryAction: {
    type: 'resume' as const,
    course: 'Organic Chemistry',
    lesson: 'Lecture 05 — Aldehydes & Ketones: Nucleophilic Addition',
    instructor: 'Dr. Sharmin Akter',
    watchedPct: 42,
    remaining: '28 min left',
    chapter: 'Chapter 12 of 19',
  },

  secondaryAction: {
    type: 'exam' as const,
    title: 'Medical Admission Model Test 07',
    when: 'Tomorrow · 9:00 AM',
    duration: '60 min',
    questions: 100,
    subjects: ['Physics', 'Chemistry', 'Biology'],
  },

  courses: [
    {
      id: 'c1', title: 'Organic Chemistry', subtitle: 'HSC + Medical Prep',
      track: 'Medical', instructor: 'Dr. Sharmin Akter',
      progressPct: 62, completedLessons: 34, totalLessons: 55,
      nextLessonId: 'l1', nextLessonTitle: 'Aldehydes & Ketones', nextLessonDuration: '48:12',
      color: 'blue', coverTone: 'oklch(0.92 0.04 258)',
    },
    {
      id: 'c2', title: 'Physics — Mechanics II', subtitle: 'Engineering Track',
      track: 'Engineering', instructor: 'Md. Rafiq Hasan',
      progressPct: 78, completedLessons: 42, totalLessons: 54,
      nextLessonId: 'l2', nextLessonTitle: 'Rotational Dynamics — Torque', nextLessonDuration: '36:40',
      color: 'emerald', coverTone: 'oklch(0.93 0.035 165)',
    },
    {
      id: 'c3', title: 'Biology — Cell & Genetics', subtitle: 'Medical Core',
      track: 'Medical', instructor: 'Dr. Anika Rahman',
      progressPct: 45, completedLessons: 22, totalLessons: 49,
      nextLessonId: 'l3', nextLessonTitle: 'DNA Replication & Repair', nextLessonDuration: '52:05',
      color: 'amber', coverTone: 'oklch(0.94 0.03 75)',
    },
    {
      id: 'c4', title: 'Higher Math — Calculus', subtitle: 'HSC Academic',
      track: 'HSC', instructor: 'Prof. Kamrul Islam',
      progressPct: 34, completedLessons: 18, totalLessons: 52,
      nextLessonId: 'l4', nextLessonTitle: 'Definite Integrals — Applications', nextLessonDuration: '41:20',
      color: 'ink', coverTone: 'oklch(0.90 0.01 260)',
    },
  ] as Course[],

  exams: [
    {
      id: 'e1', title: 'Medical Admission Model Test 07',
      type: 'Model Test', scheduledAt: 'Tomorrow · 9:00 AM',
      durationMin: 60, totalMcq: 100,
      subjects: ['Physics', 'Chemistry', 'Biology'],
      status: 'upcoming', urgency: 'tomorrow',
    },
    {
      id: 'e2', title: 'Physics MCQ — Rotational Dynamics',
      type: 'Daily Practice', scheduledAt: 'Today · anytime',
      durationMin: 20, totalMcq: 30,
      subjects: ['Physics'],
      status: 'upcoming', urgency: 'today',
    },
  ] as Exam[],

  notifications: [
    { id: 'n1', text: 'Model Test 07 starts in 21 hours', time: 'now', kind: 'exam' },
    { id: 'n2', text: 'Mentor Farhan left feedback on Chem Ch.11', time: '2h', kind: 'mentor' },
    { id: 'n3', text: 'New sheet uploaded — Rotational Dynamics', time: '5h', kind: 'material' },
  ],
};
