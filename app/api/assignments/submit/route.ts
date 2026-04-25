import { NextRequest, NextResponse } from 'next/server';
import { ASSIGNMENTS, addSubmission, type Submission } from '@/lib/assignments';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const assignmentId  = formData.get('assignmentId') as string | null;
    const studentId     = (formData.get('studentId')    as string | null) ?? 'student-1';
    const studentEmail  = (formData.get('studentEmail') as string | null) ?? 'arafat.rahman@student.mathpy.bd';
    const file          = formData.get('file') as File | null;

    if (!assignmentId || !file) {
      return NextResponse.json({ error: 'assignmentId and file are required' }, { status: 400 });
    }

    const assignment = ASSIGNMENTS.find(a => a.id === assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files accepted' }, { status: 400 });
    }

    const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large — max 20 MB' }, { status: 400 });
    }

    const submission: Submission = {
      id:           `sub_${Date.now()}`,
      assignmentId,
      studentId,
      studentEmail,
      fileName:     file.name,
      fileSize:     file.size,
      submittedAt:  new Date().toISOString(),
    };

    addSubmission(submission);

    // TODO: persist file to storage (S3 / Vercel Blob / local disk)
    // const buffer = Buffer.from(await file.arrayBuffer());
    // await uploadToStorage(`assignments/${assignmentId}/${studentId}/${file.name}`, buffer);

    return NextResponse.json({ ok: true, submission });
  } catch (err) {
    console.error('[assignments/submit]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
