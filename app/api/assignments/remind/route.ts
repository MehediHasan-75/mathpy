import { NextRequest, NextResponse } from 'next/server';
import { ASSIGNMENTS, getOverdueUnsubmitted } from '@/lib/assignments';

// Protect endpoint — set CRON_SECRET env var, pass as Bearer token
const CRON_SECRET = process.env.CRON_SECRET;

// ─── TODO: replace this stub with your email backend ─────────────────────────
// Options:
//   - nodemailer (SMTP):   install nodemailer, create transporter, call sendMail()
//   - Resend:              fetch('https://api.resend.com/emails', { method: 'POST', ... })
//   - SendGrid:            @sendgrid/mail sgMail.send(...)
//   - Any HTTP email API:  POST to your own backend endpoint
async function sendReminderEmail(to: string, assignment: { title: string; dueDate: string }): Promise<void> {
  const due = new Date(assignment.dueDate).toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#888;margin-bottom:16px">
        MATHPY · ASSIGNMENT REMINDER
      </div>
      <h1 style="font-size:22px;font-weight:500;margin:0 0 12px;color:#0a0a0a">${assignment.title}</h1>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px">
        Your assignment was due on <strong>${due}</strong> and we have not received your submission yet.
      </p>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 28px">
        Please log in to <strong>mathpy</strong> and submit your PDF as soon as possible,
        or contact your mentor if you need an extension.
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/lesson"
         style="display:inline-block;background:#0a0a0a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">
        Go to lesson →
      </a>
      <p style="margin-top:32px;font-size:12px;color:#aaa">
        You are receiving this because you are enrolled in this course.
        Contact your mentor if you have questions.
      </p>
    </div>
  `;

  // TODO: swap the block below with your email provider
  // ─────────────────────────────────────────────────
  // Example with Resend:
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ from: 'noreply@mathpy.bd', to, subject: `Reminder: ${assignment.title}`, html }),
  // });
  // ─────────────────────────────────────────────────

  // Temporary: log instead of sending
  console.log(`[remind] Would send email to ${to}:`, { subject: `Reminder: ${assignment.title}`, html });
}

export async function GET(request: NextRequest) {
  if (CRON_SECRET) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const results: { assignmentId: string; emailed: string[]; errors: string[] }[] = [];

  for (const assignment of ASSIGNMENTS) {
    const overdue = getOverdueUnsubmitted(assignment);
    const emailed: string[] = [];
    const errors:  string[] = [];

    for (const email of overdue) {
      try {
        await sendReminderEmail(email, assignment);
        emailed.push(email);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${email}: ${msg}`);
        console.error(`[remind] Failed for ${email}:`, err);
      }
    }

    results.push({ assignmentId: assignment.id, emailed, errors });
  }

  return NextResponse.json({
    ok: true,
    checkedAt: new Date().toISOString(),
    results,
  });
}
