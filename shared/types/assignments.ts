export type SubmissionStatus = 'pending' | 'submitted' | 'graded';

export interface Assignment {
  id: string;
  lesson_id: string;
  title: string;
  due_date: string;
  max_score: number;
}

export interface AssignmentCreate {
  lesson_id: string;
  title: string;
  due_date: string;
  max_score?: number;
}

export interface AssignmentUpdate {
  title?: string;
  due_date?: string;
  max_score?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  user_id: string;
  file_url: string;
  submitted_at: string;
  score: number | null;
  status: SubmissionStatus;
}
