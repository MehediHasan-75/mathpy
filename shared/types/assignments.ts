export type Assignment = {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  maxPoints: number;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentEmail: string;
  fileName: string;
  fileSize: number;
  submittedAt: string; // ISO string
};
