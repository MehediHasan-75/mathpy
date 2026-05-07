export type ExamSubmissionStatus = 'in_progress' | 'completed' | 'auto_submitted_focus_lost';

export interface McqOption {
  key: string;
  text: string;
}

// answers keyed by question UUID → answer key e.g. "A"
export type ExamAnswers = Record<string, string>;

export interface Exam {
  id: string;
  course_id: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  start_time: string;
  end_time: string;
  is_practice: boolean;
}

export interface ExamCreate {
  course_id: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  start_time: string;
  end_time: string;
  is_practice?: boolean;
}

export interface ExamUpdate {
  title?: string;
  duration_minutes?: number;
  total_marks?: number;
  start_time?: string;
  end_time?: string;
  is_practice?: boolean;
}

export interface Question {
  id: string;
  exam_id: string;
  text: string;
  options: McqOption[];
  correct_answer: string;
  order_index: number;
}

export interface QuestionCreate {
  exam_id: string;
  text: string;
  options: McqOption[];
  correct_answer: string;
  order_index: number;
}

export interface ExamSubmission {
  id: string;
  exam_id: string;
  user_id: string;
  answers: ExamAnswers;
  score: number | null;
  status: ExamSubmissionStatus;
  submitted_at: string | null;
}
