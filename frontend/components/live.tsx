'use client';

import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

const UPCOMING_LIVE = [
  { id: 'lv1', title: 'Physics — Rotational Dynamics Q&A', instructor: 'Md. Rafiq Hasan', subject: 'Physics', scheduledAt: 'Today · 6:00 PM', durationMin: 90, registered: 284 },
  { id: 'lv2', title: 'Medical Biology — Genetics Deep Dive', instructor: 'Dr. Anika Rahman', subject: 'Biology', scheduledAt: 'Tomorrow · 9:00 AM', durationMin: 120, registered: 517 },
  { id: 'lv3', title: 'Chemistry — Organic Reactions Masterclass', instructor: 'Dr. Sharmin Akter', subject: 'Chemistry', scheduledAt: 'Tomorrow · 3:00 PM', durationMin: 90, registered: 631 },
  { id: 'lv4', title: 'Math — Differential Equations', instructor: 'Prof. Kamrul Islam', subject: 'Math', scheduledAt: 'Thu · 5:30 PM', durationMin: 60, registered: 198 },
  { id: 'lv5', title: 'Model Test Review — Full Syllabus', instructor: 'Multiple Instructors', subject: 'All Subjects', scheduledAt: 'Sat · 10:00 AM', durationMin: 180, registered: 1042 },
];

const PAST_LIVE = [
  { id: 'pv1', title: 'Organic Chemistry — Carbonyl Compounds', instructor: 'Dr. Sharmin Akter', subject: 'Chemistry', recordedAt: 'Apr 22', durationMin: 88, viewers: 1203 },
  { id: 'pv2', title: 'Biology — Cell Division Mechanisms', instructor: 'Dr. Anika Rahman', subject: 'Biology', recordedAt: 'Apr 20', durationMin: 74, viewers: 891 },
  { id: 'pv3', title: 'Physics — Electromagnetic Induction', instructor: 'Md. Rafiq Hasan', subject: 'Physics', recordedAt: 'Apr 18', durationMin: 96, viewers: 754 },
];

const SUBJECT_COLORS: Record<string, string> = {
  Physics: 'oklch(0.92 0.04 258)',
  Chemistry: 'oklch(0.92 0.035 30)',
  Biology: 'oklch(0.93 0.035 165)',
  Math: 'oklch(0.94 0.03 75)',
  'All Subjects': 'oklch(0.90 0.01 260)',
};

export function LivePage() {
  const router = useRouter();

  return (
    <div className="artboard-shell">
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={[{ label: 'Live Classes', active: true }]} />

        <div style={{ padding: '48px 72px 64px', maxWidth: 1200, overflowY: 'auto' }}>
          {/* Masthead */}
          <div style={{ marginBottom: 40 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Learn Live</div>
            <h1 className="display" style={{ fontSize: 40, lineHeight: 1.05, margin: 0, letterSpacing: '-0.035em', fontWeight: 400 }}>
              Live Classes
            </h1>
            <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 10 }}>
              <span className="mono" style={{ color: 'var(--ink-2)' }}>{UPCOMING_LIVE.length}</span> upcoming · <span className="mono" style={{ color: 'var(--ink-2)' }}>{PAST_LIVE.length}</span> recorded
            </div>
          </div>

          {/* Live now banner */}
          <div style={{
            background: 'oklch(0.18 0.02 260)',
            border: '1px solid oklch(0.30 0.04 260)',
            borderRadius: 12,
            padding: '24px 28px',
            marginBottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'oklch(0.92 0.04 258)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icons.Live size={22} style={{ color: 'oklch(0.30 0.08 258)' }} />
              </div>
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 14, height: 14, borderRadius: '50%',
                background: 'var(--danger)',
                border: '2px solid oklch(0.18 0.02 260)',
                boxShadow: '0 0 0 4px oklch(0.58 0.18 25 / 0.2)',
              }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--danger)' }}>Live now</span>
                <span style={{ fontSize: 12, color: 'oklch(0.60 0.04 260)' }} className="mono">{MOCK.liveNow.viewers} watching · started {MOCK.liveNow.startedMinAgo}m ago</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: 'oklch(0.96 0.01 260)', marginBottom: 2 }}>{MOCK.liveNow.title}</div>
              <div style={{ fontSize: 13, color: 'oklch(0.65 0.04 260)' }}>{MOCK.liveNow.instructor}</div>
            </div>
            <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }} onClick={() => router.push('/lesson')}>
              <Icons.Play size={12} /> Join now
            </button>
          </div>

          {/* Upcoming */}
          <section style={{ marginBottom: 48 }}>
            <h3 className="display" style={{ fontSize: 16, fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              Upcoming <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 13, fontWeight: 400 }}>{UPCOMING_LIVE.length}</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {UPCOMING_LIVE.map(s => (
                <div key={s.id} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                    background: SUBJECT_COLORS[s.subject] ?? 'var(--bg-sunk)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icons.Live size={18} style={{ color: 'oklch(0.35 0.04 260)' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 2 }}>{s.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.instructor} · {s.subject}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 500 }}>{s.scheduledAt}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{s.durationMin} min · {s.registered.toLocaleString()} registered</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>Register</button>
                </div>
              ))}
            </div>
          </section>

          {/* Past recordings */}
          <section>
            <h3 className="display" style={{ fontSize: 16, fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.01em', color: 'var(--ink-2)' }}>
              Recordings <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 13, fontWeight: 400 }}>{PAST_LIVE.length}</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {PAST_LIVE.map(r => (
                <div key={r.id} className="card interactive" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => router.push('/lesson')}>
                  <div style={{
                    aspectRatio: '16/9', background: SUBJECT_COLORS[r.subject] ?? 'var(--bg-sunk)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderBottom: '1px solid var(--rule)', position: 'relative',
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'var(--bg-elev)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icons.Play size={16} />
                    </div>
                    <span className="mono" style={{
                      position: 'absolute', bottom: 8, right: 10,
                      fontSize: 10, background: 'oklch(0 0 0 / 0.55)', color: '#fff',
                      padding: '2px 6px', borderRadius: 4,
                    }}>{r.durationMin} min</span>
                  </div>
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{r.instructor}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 8 }}>{r.recordedAt} · {r.viewers.toLocaleString()} views</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
