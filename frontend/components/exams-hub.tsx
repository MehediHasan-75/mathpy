'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

const UPCOMING = [
  { id: 'mt-07', type: 'Model Test',     title: 'Medical Admission Model Test 07',            when: 'Tomorrow · 9:00 AM',    whenMeta: 'in 18h 42m', duration: 60, mcq: 100, subjects: ['Biology','Chemistry','Physics'], readiness: 72, urgent: true },
  { id: 'ct-12', type: 'Chapter Test',   title: 'Organic Chemistry — Ch 12: Aldehydes & Ketones', when: 'Open now · due Saturday', whenMeta: 'in 2 days',   duration: 20, mcq: 30,  subjects: ['Chemistry'],                  readiness: 84, recommended: true },
  { id: 'dp-245', type: 'Daily Practice', title: 'Daily MCQ Set 245',                           when: 'Open now · today',       whenMeta: '~15 min',    duration: 15, mcq: 25,  subjects: ['Mixed'],                      readiness: null },
  { id: 'ct-11', type: 'Chapter Test',   title: 'Biology — Ch 08: Genetics & Heredity',        when: 'Next Tuesday',           whenMeta: 'in 5 days',  duration: 25, mcq: 35,  subjects: ['Biology'],                    readiness: 68 },
  { id: 'mock-03', type: 'Mock',         title: 'Full-Length Mock Admission — Round 3',        when: 'April 30 · 8:00 AM',     whenMeta: 'in 6 days',  duration: 90, mcq: 150, subjects: ['Biology','Chemistry','Physics','English','GK'], readiness: 64 },
] as const;

const COMPLETED = [
  { id: 'mt-06',  type: 'Model Test',    title: 'Medical Admission Model Test 06',         date: 'Apr 17', score: 82, rank: 128, outOf: 4820, mcq: 100, correct: 82 },
  { id: 'ct-10',  type: 'Chapter Test',  title: 'Physics — Ch 07: Rotational Dynamics',   date: 'Apr 15', score: 76, rank: 412, outOf: 4820, mcq: 30,  correct: 23 },
  { id: 'dp-244', type: 'Daily Practice',title: 'Daily MCQ Set 244',                       date: 'Apr 14', score: 88, rank: null, outOf: null, mcq: 25,  correct: 22 },
  { id: 'ct-09',  type: 'Chapter Test',  title: 'Chemistry — Ch 11: Ethers & Epoxides',   date: 'Apr 12', score: 71, rank: 621, outOf: 4820, mcq: 30,  correct: 21 },
  { id: 'mt-05',  type: 'Model Test',    title: 'Medical Admission Model Test 05',         date: 'Apr 10', score: 78, rank: 189, outOf: 4820, mcq: 100, correct: 78 },
];

const FILTERS = [
  { id: 'all',           label: 'All',            count: UPCOMING.length + COMPLETED.length },
  { id: 'Model Test',    label: 'Model Tests',    count: 2 },
  { id: 'Chapter Test',  label: 'Chapter Tests',  count: 3 },
  { id: 'Daily Practice',label: 'Daily Practice', count: 2 },
  { id: 'Mock',          label: 'Mocks',          count: 1 },
];

const typeColor = (t: string) => t === 'Model Test' ? 'oklch(0.50 0.13 65)' : t === 'Chapter Test' ? 'var(--blue)' : t === 'Mock' ? 'var(--ink)' : 'var(--ink-3)';

export function ExamsHub() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');

  const fUpcoming = filter === 'all' ? UPCOMING : UPCOMING.filter(e => e.type === filter);
  const fCompleted = filter === 'all' ? COMPLETED : COMPLETED.filter(e => e.type === filter);

  return (
    <div className="artboard-shell">
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={[{ label: 'Exams & MCQ', active: true }]} />

        <div style={{ padding: '48px 72px 64px', maxWidth: 1200, overflowY: 'auto' }}>
          {/* Masthead */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 48 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Assessments</div>
              <h1 className="display" style={{ fontSize: 40, lineHeight: 1.05, margin: 0, letterSpacing: '-0.035em', fontWeight: 400 }}>
                Exams &amp; MCQ
              </h1>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 10 }}>
                <span style={{ color: 'var(--ink-2)' }}>2 exams this week.</span> Batch average 74% · your average <span className="mono">78.4%</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4, fontSize: 10 }}>Completed</div>
                <div className="display mono" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em' }}>47</div>
              </div>
              <div className="vr" />
              <div>
                <div className="eyebrow" style={{ marginBottom: 4, fontSize: 10 }}>Avg rank</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="display mono" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em' }}>#189</span>
                  <span style={{ fontSize: 11, color: 'var(--emerald)' }}>▲</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero — next critical exam */}
          <section style={{ padding: '32px 36px', border: '1px solid var(--amber)', borderRadius: 16, background: 'linear-gradient(135deg, var(--amber-soft) 0%, var(--bg-elev) 70%)', marginBottom: 12, position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span className="chip amber"><span className="dot" />Next critical · in 18h 42m</span>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>MODEL TEST · TOMORROW 9:00 AM</span>
                </div>
                <h2 className="display" style={{ fontSize: 26, fontWeight: 500, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Medical Admission Model Test 07
                </h2>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 22, display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span className="mono">100 MCQ</span>
                  <span style={{ color: 'var(--ink-4)' }}>·</span>
                  <span className="mono">60 min</span>
                  <span style={{ color: 'var(--ink-4)' }}>·</span>
                  <span>Biology · Chemistry · Physics</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ background: 'oklch(0.50 0.13 65)', padding: '12px 20px' }} onClick={() => router.push('/exams/practice')}>
                    <Icons.Target size={14} /> Prepare now
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '12px 18px' }}>
                    <Icons.Calendar size={13} /> Set reminder
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '12px 14px' }}>Syllabus</button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span className="eyebrow" style={{ fontSize: 10 }}>Your readiness</span>
                  <div className="mono" style={{ fontSize: 28, fontWeight: 500, color: 'oklch(0.50 0.13 65)', letterSpacing: '-0.02em' }}>72<span style={{ fontSize: 13, color: 'var(--ink-3)' }}>%</span></div>
                </div>
                <div className="readiness-gauge" style={{ marginBottom: 8 }}>
                  <div className="fill" style={{ width: '72%' }} />
                  <div className="marker" style={{ left: '85%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-3)' }} className="mono">
                  <span>0</span><span style={{ color: 'var(--ink-2)' }}>target · 85%</span><span>100</span>
                </div>
                <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, fontSize: 12, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icons.Target size={12} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                  <span>Recommended: Genetics + Organic — 2 practice sets</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats row */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 48, borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
            {[
              { label: 'This week',   value: '2',       suffix: 'exams',  meta: 'Target: 4',        accent: 'ink-3' },
              { label: '30-day avg',  value: '78.4',    suffix: '%',      meta: '+2.1 vs last month', accent: 'emerald' },
              { label: 'Best subject',value: 'Chem',    suffix: '82%',    meta: 'Top 5% batch',     accent: 'emerald' },
              { label: 'Weakest',     value: 'Physics', suffix: '71%',    meta: 'Focus needed',     accent: 'amber' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '22px 24px', paddingLeft: i === 0 ? 0 : 24, borderLeft: i === 0 ? 'none' : '1px solid var(--rule)' }}>
                <div className="eyebrow" style={{ marginBottom: 10, fontSize: 10 }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                  <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>{s.value}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{s.suffix}</div>
                </div>
                <div style={{ fontSize: 11, color: `var(--${s.accent})` }}>{s.meta}</div>
              </div>
            ))}
          </section>

          {/* Filter rail */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--rule)' }}>
            {FILTERS.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: '10px 14px', background: 'transparent', border: 'none',
                fontSize: 13, fontWeight: 500,
                color: filter === f.id ? 'var(--ink)' : 'var(--ink-3)',
                borderBottom: filter === f.id ? '1.5px solid var(--ink)' : '1.5px solid transparent',
                marginBottom: -1, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {f.label}
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{f.count}</span>
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'center' }}>
              <Icons.Calendar size={12} /> Calendar view
            </button>
          </div>

          {/* Upcoming */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="display" style={{ fontSize: 16, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>
                Upcoming <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 13, fontWeight: 400 }}>{fUpcoming.length}</span>
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {fUpcoming.map((e, i) => (
                <div key={e.id} style={{
                  display: 'grid', gridTemplateColumns: '90px 1fr 180px 130px 120px', gap: 20,
                  alignItems: 'center', padding: '20px 0',
                  borderBottom: i === fUpcoming.length - 1 ? 'none' : '1px solid var(--rule)',
                  cursor: 'pointer',
                }}>
                  <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: typeColor(e.type), fontWeight: 500 }}>
                    {e.type}
                  </span>

                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {e.title}
                      {'recommended' in e && e.recommended && <span className="chip blue" style={{ fontSize: 9.5 }}><Icons.Target size={9} />Recommended</span>}
                      {'urgent' in e && e.urgent && <span className="chip amber" style={{ fontSize: 9.5 }}><span className="dot"/>Urgent</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{e.subjects.join(' · ')}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{e.when}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2 }}>{e.whenMeta}</div>
                  </div>

                  <div>
                    {e.readiness !== null ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-3)', marginBottom: 4 }} className="mono">
                          <span>Readiness</span>
                          <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{e.readiness}%</span>
                        </div>
                        <div className="progress" style={{ height: 3 }}>
                          <span style={{ width: `${e.readiness}%`, background: e.readiness >= 80 ? 'var(--emerald)' : e.readiness >= 70 ? 'oklch(0.50 0.13 65)' : 'var(--amber)' }} />
                        </div>
                      </>
                    ) : (
                      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{e.mcq} Q · {e.duration} min</div>
                    )}
                  </div>

                  <button
                    className={`btn ${'urgent' in e && e.urgent || 'recommended' in e && e.recommended ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ justifySelf: 'end' }}
                    onClick={() => router.push('/exams/practice')}
                  >
                    {e.when.includes('Open now') ? 'Start' : 'Prepare'} <Icons.ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Completed */}
          <section>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="display" style={{ fontSize: 16, fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>
                Recent results <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 13, fontWeight: 400 }}>{fCompleted.length}</span>
              </h3>
              <button className="btn btn-ghost btn-sm">View all history <Icons.ArrowRight size={12} /></button>
            </div>

            <div>
              {fCompleted.map((e, i) => (
                <div key={e.id} style={{
                  display: 'grid', gridTemplateColumns: '90px 1fr 80px 140px 110px 100px', gap: 20,
                  alignItems: 'center', padding: '18px 0',
                  borderBottom: i === fCompleted.length - 1 ? 'none' : '1px solid var(--rule)',
                  cursor: 'pointer',
                }}>
                  <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', fontWeight: 500 }}>
                    {e.type}
                  </span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{e.title}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{e.date} · {e.correct}/{e.mcq} correct</div>
                  </div>
                  <div className="display mono" style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em', color: e.score >= 80 ? 'var(--emerald)' : e.score >= 70 ? 'var(--ink)' : 'oklch(0.50 0.13 65)' }}>
                    {e.score}<span style={{ fontSize: 11, color: 'var(--ink-3)' }}>%</span>
                  </div>
                  <div>
                    {e.rank ? (
                      <>
                        <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>Rank <span className="mono">#{e.rank}</span></div>
                        <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2 }}>of {e.outOf!.toLocaleString()}</div>
                      </>
                    ) : (
                      <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>no ranking</span>
                    )}
                  </div>
                  <div>
                    <div className="progress" style={{ height: 3 }}>
                      <span style={{ width: `${e.score}%`, background: e.score >= 80 ? 'var(--emerald)' : e.score >= 70 ? 'var(--blue)' : 'var(--amber)' }} />
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ justifySelf: 'end' }}>Review <Icons.ArrowRight size={12} /></button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
