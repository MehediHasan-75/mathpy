'use client';

import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

export function V3Command() {
  const router = useRouter();
  const { student, mentor, liveNow, materials } = MOCK;

  const tasks = [
    { done: true,  kind: 'video',    title: 'Morning: Physics lecture — Kinematics recap',       meta: '42 min · Md. Rafiq Hasan' },
    { done: true,  kind: 'pdf',      title: 'Read: Biology notes — Cell cycle diagrams',          meta: '22 pages · Dr. Anika Rahman' },
    { done: true,  kind: 'practice', title: 'Practice: Chemistry 30 MCQ',                        meta: '20 min · Auto-graded · 82% scored' },
    { done: false, active: true,     title: 'Aldehydes & Ketones — Nucleophilic Addition',        meta: '48 min · Dr. Sharmin Akter · 42% watched' },
    { done: false, kind: 'practice', title: 'Physics MCQ — Rotational Dynamics',                  meta: '20 min · 30 questions' },
  ];

  const leaderboard = [
    { rank: 140, name: 'Samira K.',  score: 79.1 },
    { rank: 141, name: 'Tanvir A.',  score: 78.7 },
    { rank: 142, name: 'You',        score: 78.4, you: true },
    { rank: 143, name: 'Nusrat J.',  score: 78.0 },
  ];

  return (
    <div className="artboard-shell dark">
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <div style={{ padding: '32px 40px 48px', overflowY: 'auto' }}>
          {/* Status ribbon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, fontSize: 12 }}>
            <span className="chip emerald"><span className="dot" />All systems on track</span>
            <span style={{ color: 'var(--ink-3)' }}>·</span>
            <span style={{ color: 'var(--ink-3)' }}>Medical Admission 2026</span>
            <span style={{ color: 'var(--ink-3)' }}>·</span>
            <span style={{ color: 'var(--ink-3)' }}>127 days to exam</span>
            <span style={{ color: 'var(--ink-3)' }}>·</span>
            <span style={{ color: 'var(--ink-3)' }}>Batch 14</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: 11.5 }}>Today</button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }}>This week</button>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }}>Month</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
            {/* LEFT COLUMN */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Mission brief */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 4 }}>
                      Today · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>Mission brief</div>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>3 OF 5 DONE</div>
                </div>

                {tasks.map((task, i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '20px 1fr auto',
                    gap: 14,
                    padding: '14px 24px',
                    borderBottom: i === tasks.length - 1 ? 'none' : '1px solid var(--rule)',
                    alignItems: 'center',
                    background: task.active ? 'var(--blue-soft)' : 'transparent',
                    cursor: 'pointer',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 5,
                      border: `1.5px solid ${task.done ? 'var(--emerald)' : task.active ? 'var(--blue)' : 'var(--rule-strong)'}`,
                      background: task.done ? 'var(--emerald)' : 'transparent',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                    }}>
                      {task.done && <Icons.Check size={10} style={{ color: 'var(--bg)', strokeWidth: 3 } as React.CSSProperties} />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 13.5,
                        fontWeight: task.active ? 500 : 400,
                        color: task.done ? 'var(--ink-3)' : 'var(--ink)',
                        textDecoration: task.done ? 'line-through' : 'none',
                        marginBottom: 2,
                      }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{task.meta}</div>
                    </div>
                    {task.active && (
                      <button className="btn btn-primary btn-sm" style={{ fontSize: 11.5 }} onClick={() => router.push('/lesson')}>
                        <Icons.Play size={11} /> Resume
                      </button>
                    )}
                    {!task.active && !task.done && (
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: 11.5 }}>Start</button>
                    )}
                  </div>
                ))}

                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div className="progress emerald thick"><span style={{ width: '60%' }} /></div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                    <span className="mono" style={{ color: 'var(--ink)' }}>60%</span> of today&apos;s plan
                  </div>
                </div>
              </div>

              {/* Live + Exam strip */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="card interactive" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '3px 8px', borderRadius: 999,
                      background: 'oklch(0.30 0.12 25)', color: 'oklch(0.88 0.14 25)',
                      fontSize: 11, fontWeight: 500,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 0 3px oklch(0.58 0.18 25 / 0.2)' }} />
                      LIVE NOW
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{liveNow.viewers} watching</span>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>{liveNow.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14 }}>
                    {liveNow.instructor} · started {liveNow.startedMinAgo}m ago
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => router.push('/live')}>Join class</button>
                </div>

                <div className="card" style={{ padding: 20, borderColor: 'var(--amber)', background: 'linear-gradient(180deg, var(--amber-soft) 0%, transparent 140%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <span className="chip amber"><span className="dot" />Exam in 20h</span>
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>Model Test 07</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14 }}>100 MCQ · 60 min · Phys / Chem / Bio</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', background: 'oklch(0.60 0.14 65)', color: 'oklch(0.15 0.04 65)' }} onClick={() => router.push('/exams')}>Prepare</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => router.push('/exams')}>Syllabus</button>
                  </div>
                </div>
              </div>

              {/* Courses strip */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Your courses</div>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }} onClick={() => router.push('/courses')}>All 4 <Icons.ArrowRight size={11} /></button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {MOCK.courses.map(c => (
                    <div key={c.id} className="card interactive" style={{ padding: 14, cursor: 'pointer' }} onClick={() => router.push('/lesson')}>
                      <div className="stripe-placeholder" style={{ aspectRatio: '16/9', marginBottom: 12, fontSize: 9, borderColor: 'var(--rule)' }}>
                        {c.track.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.title}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginBottom: 10 }}>
                        {c.completedLessons}/{c.totalLessons} lessons
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className={`progress ${c.color === 'ink' ? '' : c.color}`} style={{ height: 3, flex: 1 }}>
                          <span style={{ width: `${c.progressPct}%` }} />
                        </div>
                        <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-2)' }}>{c.progressPct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT RAIL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Rank card */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                  <div className="eyebrow">Batch rank</div>
                  <span style={{ fontSize: 11, color: 'var(--emerald)' }}>▲ 18</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                  <div className="display mono" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em' }}>#{student.rankOverall}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>of {student.rankOutOf.toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {leaderboard.map((r, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 10,
                      padding: '7px 8px', borderRadius: 6,
                      background: r.you ? 'var(--blue-soft)' : 'transparent',
                      alignItems: 'center',
                    }}>
                      <span className="mono" style={{ fontSize: 11, color: r.you ? 'var(--blue)' : 'var(--ink-3)' }}>#{r.rank}</span>
                      <span style={{ fontSize: 12, color: r.you ? 'var(--ink)' : 'var(--ink-2)', fontWeight: r.you ? 500 : 400 }}>{r.name}</span>
                      <span className="mono" style={{ fontSize: 11, color: r.you ? 'var(--ink)' : 'var(--ink-3)' }}>{r.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mentor card */}
              <div className="card" style={{ padding: 20 }}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Your mentor</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, var(--blue) 0%, oklch(0.55 0.14 280) 100%)' }}>
                    {mentor.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{mentor.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{mentor.title}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5, padding: 12, background: 'var(--bg-sunk)', borderRadius: 8, borderLeft: '2px solid var(--blue)', marginBottom: 12 }}>
                  &ldquo;{mentor.lastMessage}&rdquo;
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{mentor.timeAgo}</span>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize: 11.5 }}>Reply</button>
                </div>
              </div>

              {/* Consistency heatmap */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div className="eyebrow">Consistency</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--amber)' }}>
                    <Icons.Flame size={11} />
                    <span className="mono" style={{ fontWeight: 500 }}>{student.streakDays} day streak</span>
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 3 }}>
                    {Array.from({ length: 56 }).map((_, i) => {
                      const week = Math.floor(i / 8);
                      const intensity = Math.min(1, Math.max(0, (Math.sin(i * 1.3) + 1) / 2 * (0.3 + week * 0.1)));
                      const alpha = intensity > 0.1 ? 0.15 + intensity * 0.85 : 0.08;
                      return (
                        <div key={i} style={{
                          aspectRatio: '1',
                          borderRadius: 2,
                          background: intensity > 0.1 ? `oklch(0.58 0.12 165 / ${alpha})` : 'var(--rule)',
                        }} />
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--ink-3)' }}>
                  <span className="mono">8 weeks ago</span>
                  <span className="mono">Today</span>
                </div>
              </div>

              {/* Recent materials */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div className="eyebrow">Recent materials</div>
                  <Icons.Bookmark size={13} style={{ color: 'var(--ink-3)' }} />
                </div>
                {materials.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'grid', gridTemplateColumns: '24px 1fr auto', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < materials.length - 1 ? '1px solid var(--rule)' : 'none',
                    alignItems: 'center',
                  }}>
                    <div style={{ width: 24, height: 24, borderRadius: 5, background: 'var(--bg-sunk)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)' }}>
                      <Icons.FileText size={11} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{m.kind} · {m.pages}p · {m.size}</div>
                    </div>
                    <button className="icon-btn" style={{ width: 24, height: 24 }}><Icons.Download size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
