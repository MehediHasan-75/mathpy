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
