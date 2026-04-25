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

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 'a-l1',
    lessonId: 'l1',
    courseId: 'c1',
    title: 'Nucleophilic Addition — Mechanism Analysis',
    description:
      'Write a detailed mechanism for the reaction of benzaldehyde with HCN. Include all intermediates, electron flow arrows, and explain why aldehydes are more reactive than ketones. Submit as a neat hand-written or typed PDF (max 5 pages).',
    dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    maxPoints: 20,
  },
  {
    id: 'a-l2',
    lessonId: 'l2',
    courseId: 'c2',
    title: 'Rotational Dynamics — Torque Problem Set',
    description:
      'Solve the 5 torque problems from the worksheet. Show all free-body diagrams, moment of inertia calculations, and angular acceleration derivations. Submit as PDF.',
    dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    maxPoints: 25,
  },
  {
    id: 'a-l3',
    lessonId: 'l3',
    courseId: 'c3',
    title: 'DNA Replication — Step-by-step Diagram',
    description:
      'Draw and annotate the complete DNA replication process including initiation, elongation, and termination. Label all enzymes and explain their roles. Submit as PDF.',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    maxPoints: 20,
  },
];

// In-memory store — swap for DB in production
const submissionStore = new Map<string, Submission[]>();

export function getSubmission(assignmentId: string, studentId: string): Submission | undefined {
  return submissionStore.get(assignmentId)?.find(s => s.studentId === studentId);
}

export function addSubmission(sub: Submission): void {
  const prev = submissionStore.get(sub.assignmentId) ?? [];
  submissionStore.set(sub.assignmentId, [
    ...prev.filter(s => s.studentId !== sub.studentId),
    sub,
  ]);
}

export function getOverdueUnsubmitted(assignment: Assignment): string[] {
  const now = new Date();
  if (now <= new Date(assignment.dueDate)) return [];
  const submitted = new Set(
    (submissionStore.get(assignment.id) ?? []).map(s => s.studentEmail)
  );
  // In production: query all enrolled students for this course, filter unsubmitted
  // For now: return mock enrolled student emails
  const enrolledEmails = ['arafat.rahman@student.mathpy.bd'];
  return enrolledEmails.filter(e => !submitted.has(e));
}
