'use client';

import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

export function V2Performance() {
  const router = useRouter();
  const { student, primaryAction, subjectPerformance, weeklyActivity, recentResults } = MOCK;

  const rankSeries = [220, 198, 189, 176, 168, 155, 149, 142];
  const maxR = Math.max(...rankSeries), minR = Math.min(...rankSeries);
  const pts = rankSeries.map((r, i) => {
    const x = (i / (rankSeries.length - 1)) * 100;
    const y = 100 - ((r - minR) / (maxR - minR)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="artboard-shell">
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <div style={{ padding: '40px 48px 56px', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Performance Dashboard · Week 14</div>
              <h1 className="display" style={{ fontSize: 28, margin: 0, fontWeight: 500, letterSpacing: '-0.025em' }}>
                Welcome back, Arafat
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm">
                <Icons.Calendar size={13} /> This week <Icons.ChevronRight size={11} style={{ opacity: 0.6 }} />
              </button>
              <button className="btn btn-secondary btn-sm">
                <Icons.Download size={13} /> Export report
              </button>
            </div>
          </div>

          {/* ROW 1: Score hero + Continue */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Score hero with rank sparkline */}
            <div className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Overall performance</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <div className="display mono" style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {student.currentScore}<span style={{ fontSize: 22, color: 'var(--ink-3)', marginLeft: 2 }}>%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--emerald)', fontSize: 13, fontWeight: 500 }}>
                      <Icons.ArrowRight size={12} style={{ transform: 'rotate(-90deg)' }} />
                      2.1
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 6 }}>
                    Target <span className="mono" style={{ color: 'var(--ink-2)' }}>{student.targetScore}%</span> · <span style={{ color: 'var(--emerald)' }}>on track</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 28 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div className="eyebrow" style={{ marginBottom: 8 }}>Batch rank</div>
                    <div className="display mono" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>#{student.rankOverall}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--emerald)', marginTop: 4 }}>▲ 18 this week</div>
                  </div>
                  <div className="vr" style={{ height: 56 }} />
                  <div style={{ textAlign: 'right' }}>
                    <div className="eyebrow" style={{ marginBottom: 8 }}>Percentile</div>
                    <div className="display mono" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 }}>97<span style={{ fontSize: 14, color: 'var(--ink-3)' }}>th</span></div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 4 }}>of {student.rankOutOf.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Rank trajectory sparkline */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginBottom: 6 }}>
                  <span className="mono">Rank trajectory · 8 weeks</span>
                  <span className="mono">#220 → #{student.rankOverall}</span>
                </div>
                <div style={{ position: 'relative', height: 90 }}>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="rankGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polyline points={`0,100 ${pts} 100,100`} fill="url(#rankGrad)" stroke="none" />
                    <polyline points={pts} fill="none" stroke="var(--blue)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                    {rankSeries.map((r, i) => {
                      const x = (i / (rankSeries.length - 1)) * 100;
                      const y = 100 - ((r - minR) / (maxR - minR)) * 100;
                      return <circle key={i} cx={x} cy={y} r="1.6" fill="var(--blue)" vectorEffect="non-scaling-stroke" />;
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* Continue Learning */}
            <div className="card interactive" style={{ padding: 24, display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => router.push('/lesson')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span className="chip blue"><span className="dot" />Continue</span>
                <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Organic Chemistry</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.3, marginBottom: 6, letterSpacing: '-0.01em' }}>
                {primaryAction.lesson}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 18 }}>{primaryAction.instructor} · {primaryAction.remaining}</div>
              <div className="stripe-placeholder" style={{ aspectRatio: '16/7', marginBottom: 16, fontSize: 10 }}>VIDEO LESSON</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginBottom: 4 }}>
                  <span className="mono">42%</span>
                  <span className="mono">20 / 48 min</span>
                </div>
                <div className="progress blue"><span style={{ width: '42%' }} /></div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 'auto', justifyContent: 'center' }}>
                <Icons.Play size={13} /> Resume lesson
              </button>
            </div>
          </div>

          {/* ROW 2: Subject mastery | Weekly activity | Next exam */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Subject mastery */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 4 }}>Subject mastery</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Where you stand by subject</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }}>Details <Icons.ArrowRight size={11} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {subjectPerformance.map(s => (
                  <div key={s.subject}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.subject}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 11, color: s.trend > 0 ? 'var(--emerald)' : 'var(--danger)' }}>
                          {s.trend > 0 ? '▲' : '▼'} {Math.abs(s.trend)}
                        </span>
                        <span className="mono" style={{ fontSize: 13, fontWeight: 500 }}>{s.pct}%</span>
                      </div>
                    </div>
                    <div className="progress" style={{ height: 5 }}>
                      <span style={{ width: `${s.pct}%`, background: s.pct >= 85 ? 'var(--emerald)' : s.pct >= 75 ? 'var(--blue)' : 'var(--amber)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--bg-sunk)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icons.Target size={13} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>
                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Physics needs focus.</span> 3 weak chapters identified — <button style={{ color: 'var(--blue)', textDecoration: 'underline', fontSize: 12, padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}>view remedial plan</button>
                </span>
              </div>
            </div>

            {/* Weekly activity */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>This week</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div className="display mono" style={{ fontSize: 24, fontWeight: 500 }}>{student.weeklyTargetDone}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>/ {student.weeklyTargetGoal} hours</div>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--emerald)', marginTop: 2 }}>{student.weeklyTargetPct}% of weekly target</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, marginBottom: 10 }}>
                {weeklyActivity.map((h, i) => {
                  const hpct = (h / 4) * 100;
                  const isToday = i === 4;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ width: '100%', height: `${hpct}%`, background: isToday ? 'var(--blue)' : 'var(--rule-strong)', borderRadius: 3, minHeight: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 6, fontSize: 10, color: 'var(--ink-3)' }}>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', fontWeight: i === 4 ? 600 : 400, color: i === 4 ? 'var(--ink)' : 'var(--ink-3)' }}>{d}</div>
                ))}
              </div>

              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--rule)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <div>
                  <div style={{ color: 'var(--ink-3)', marginBottom: 2 }}>Streak</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icons.Flame size={12} style={{ color: 'var(--amber)' }} />
                    <span className="mono" style={{ fontWeight: 500 }}>{student.streakDays} days</span>
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--ink-3)', marginBottom: 2 }}>Best day</div>
                  <div className="mono" style={{ fontWeight: 500 }}>3.1h · Wed</div>
                </div>
              </div>
            </div>

            {/* Next exam urgency */}
            <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', borderColor: 'var(--amber)', background: 'linear-gradient(180deg, var(--amber-soft) 0%, var(--bg-elev) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span className="chip amber"><span className="dot" />Exam tomorrow</span>
                <Icons.Clock size={14} style={{ color: 'oklch(0.50 0.13 65)' }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>Medical Admission Model Test 07</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 16 }}>Full-syllabus · Physics · Chemistry · Biology</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div style={{ padding: 10, background: 'var(--bg-elev)', borderRadius: 8, border: '1px solid var(--rule)' }}>
                  <div className="eyebrow" style={{ fontSize: 9, marginBottom: 3 }}>Starts in</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 500 }}>20h 42m</div>
                </div>
                <div style={{ padding: 10, background: 'var(--bg-elev)', borderRadius: 8, border: '1px solid var(--rule)' }}>
                  <div className="eyebrow" style={{ fontSize: 9, marginBottom: 3 }}>Format</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 500 }}>100 MCQ</div>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginBottom: 6 }}>Readiness</div>
                <div className="progress amber" style={{ height: 5 }}><span style={{ width: '74%' }} /></div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 4 }} className="mono">74% · chem weak</div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 'auto', justifyContent: 'center', background: 'oklch(0.45 0.14 65)' }} onClick={() => router.push('/exams/practice')}>
                Start preparation
              </button>
            </div>
          </div>

          {/* ROW 3: Recent results + Active courses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Recent results */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 4 }}>Recent MCQ results</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>Last 5 exams</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }}>All results</button>
              </div>
              <div>
                {recentResults.map((r, i) => (
                  <div key={r.id} style={{
                    display: 'grid', gridTemplateColumns: '32px 1fr 70px 60px 80px', gap: 12,
                    alignItems: 'center', padding: '12px 0',
                    borderTop: i === 0 ? '1px solid var(--rule)' : 'none',
                    borderBottom: '1px solid var(--rule)', fontSize: 13,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: r.scorePct >= 85 ? 'var(--emerald-soft)' : r.scorePct >= 75 ? 'var(--blue-soft)' : 'var(--amber-soft)',
                      color: r.scorePct >= 85 ? 'var(--emerald)' : r.scorePct >= 75 ? 'var(--blue)' : 'oklch(0.50 0.13 65)',
                      display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
                    }} className="mono">
                      {r.scorePct >= 85 ? 'A' : r.scorePct >= 75 ? 'B' : 'C'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 1 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-3)' }} className="mono">{r.date}</div>
                    </div>
                    <div className="mono" style={{ fontSize: 14, fontWeight: 500, textAlign: 'right' }}>{r.scorePct}%</div>
                    <div style={{ fontSize: 11, textAlign: 'right', color: r.delta > 0 ? 'var(--emerald)' : 'var(--danger)' }}>
                      {r.delta > 0 ? '▲' : '▼'} {Math.abs(r.delta)}
                    </div>
                    <button className="btn btn-ghost btn-sm" style={{ justifySelf: 'end', fontSize: 11 }}>Review</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active courses */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 4 }}>Active courses</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>4 in progress</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 11.5 }}>Browse library</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {MOCK.courses.map(c => (
                  <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 56px', gap: 12, alignItems: 'center', cursor: 'pointer' }} onClick={() => router.push('/lesson')}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: c.coverTone, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)' }} className="mono">
                      {c.track.slice(0, 3).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className={`progress ${c.color === 'ink' ? '' : c.color}`} style={{ height: 3, flex: 1 }}>
                          <span style={{ width: `${c.progressPct}%` }} />
                        </div>
                        <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{c.completedLessons}/{c.totalLessons}</span>
                      </div>
                    </div>
                    <div className="mono" style={{ fontSize: 12, textAlign: 'right', fontWeight: 500 }}>{c.progressPct}%</div>
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
