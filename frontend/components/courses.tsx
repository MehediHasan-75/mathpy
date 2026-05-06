'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

const ALL_COURSES = [
  ...MOCK.courses,
  {
    id: 'c5', title: 'English for Medical', subtitle: 'Vocabulary + Comprehension',
    track: 'Medical' as const, instructor: 'Ms. Nadia Islam',
    progressPct: 0, completedLessons: 0, totalLessons: 24,
    nextLessonId: 'l5', nextLessonTitle: 'Medical Terminology — Part 1', nextLessonDuration: '28:00',
    color: 'ink' as const, coverTone: 'oklch(0.90 0.01 260)',
  },
  {
    id: 'c6', title: 'General Knowledge', subtitle: 'Bangladesh + Global Affairs',
    track: 'Medical' as const, instructor: 'Md. Tariqul Hasan',
    progressPct: 22, completedLessons: 8, totalLessons: 36,
    nextLessonId: 'l6', nextLessonTitle: 'History of Bangladesh — Part 3', nextLessonDuration: '35:10',
    color: 'emerald' as const, coverTone: 'oklch(0.93 0.035 165)',
  },
];

const TRACKS = ['All', 'Medical', 'Engineering', 'HSC', 'Varsity'];

export function CoursesPage() {
  const router = useRouter();
  const [track, setTrack] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = track === 'All' ? ALL_COURSES : ALL_COURSES.filter(c => c.track === track);
  const inProgress = filtered.filter(c => c.progressPct > 0);
  const notStarted = filtered.filter(c => c.progressPct === 0);

  return (
    <div className="artboard-shell">
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={[{ label: 'My Courses', active: true }]} />

        <div style={{ padding: '48px 72px 64px', maxWidth: 1200, overflowY: 'auto' }}>
          {/* Masthead */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Library</div>
              <h1 className="display" style={{ fontSize: 40, lineHeight: 1.05, margin: 0, letterSpacing: '-0.035em', fontWeight: 400 }}>
                My Courses
              </h1>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 10 }}>
                <span className="mono" style={{ color: 'var(--ink-2)' }}>{inProgress.length}</span> in progress · <span className="mono" style={{ color: 'var(--ink-2)' }}>{notStarted.length}</span> not started
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                className={`btn btn-sm ${view === 'grid' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setView('grid')}
                style={{ padding: '6px 10px' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
                  <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
                </svg>
              </button>
              <button
                className={`btn btn-sm ${view === 'list' ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => setView('list')}
                style={{ padding: '6px 10px' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Track filter */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 40, borderBottom: '1px solid var(--rule)', paddingBottom: 0 }}>
            {TRACKS.map(t => (
              <button key={t} onClick={() => setTrack(t)} style={{
                padding: '10px 14px', background: 'transparent', border: 'none',
                fontSize: 13, fontWeight: 500,
                color: track === t ? 'var(--ink)' : 'var(--ink-3)',
                borderBottom: track === t ? '1.5px solid var(--ink)' : '1.5px solid transparent',
                marginBottom: -1, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* In progress */}
          {inProgress.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <h3 className="display" style={{ fontSize: 16, fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                In progress <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 13, fontWeight: 400 }}>{inProgress.length}</span>
              </h3>

              {view === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {inProgress.map(c => (
                    <div key={c.id} className="card interactive" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => router.push('/lesson')}>
                      <div className="stripe-placeholder" style={{ aspectRatio: '16/9', fontSize: 10, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--rule)', background: `repeating-linear-gradient(45deg, oklch(from ${c.coverTone} calc(l - 0.03) c h) 0 6px, transparent 6px 12px), ${c.coverTone}` }}>
                        <span style={{ background: 'var(--bg-elev)', padding: '3px 8px', borderRadius: 4, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{c.track}</span>
                      </div>
                      <div style={{ padding: '18px 20px 20px' }}>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14 }}>{c.instructor} · {c.subtitle}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginBottom: 6 }} className="mono">
                          <span>{c.completedLessons}/{c.totalLessons} lessons</span>
                          <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{c.progressPct}%</span>
                        </div>
                        <div className={`progress ${c.color === 'ink' ? '' : c.color}`} style={{ height: 4, marginBottom: 16 }}>
                          <span style={{ width: `${c.progressPct}%` }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                            <Icons.Play size={11} /> Resume
                          </button>
                          <button className="btn btn-secondary btn-sm">Details</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {inProgress.map((c, i) => (
                    <div key={c.id} style={{
                      display: 'grid', gridTemplateColumns: '1fr 200px 100px 80px 120px', gap: 20,
                      alignItems: 'center', padding: '18px 0',
                      borderBottom: i === inProgress.length - 1 ? 'none' : '1px solid var(--rule)',
                      cursor: 'pointer',
                    }} onClick={() => router.push('/lesson')}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-sunk)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 2 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.instructor} · {c.subtitle}</div>
                      </div>
                      <div className={`progress ${c.color === 'ink' ? '' : c.color}`}><span style={{ width: `${c.progressPct}%` }} /></div>
                      <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', textAlign: 'right' }}>{c.completedLessons}/{c.totalLessons}</div>
                      <div className="mono" style={{ fontSize: 12, fontWeight: 500, textAlign: 'right' }}>{c.progressPct}%</div>
                      <button className="btn btn-secondary btn-sm" style={{ justifySelf: 'end' }}>Resume <Icons.ArrowRight size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Not started */}
          {notStarted.length > 0 && (
            <section>
              <h3 className="display" style={{ fontSize: 16, fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.01em', color: 'var(--ink-2)' }}>
                Not started <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 13, fontWeight: 400 }}>{notStarted.length}</span>
              </h3>

              {view === 'grid' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {notStarted.map(c => (
                    <div key={c.id} className="card interactive" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', opacity: 0.75 }}>
                      <div className="stripe-placeholder" style={{ aspectRatio: '16/9', fontSize: 10, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--rule)', background: `${c.coverTone}` }}>
                        <span style={{ background: 'var(--bg-elev)', padding: '3px 8px', borderRadius: 4, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>{c.track}</span>
                      </div>
                      <div style={{ padding: '18px 20px 20px' }}>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14 }}>{c.instructor} · {c.subtitle}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-4)', marginBottom: 14 }} className="mono">{c.totalLessons} lessons · not started</div>
                        <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Start course</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {notStarted.map((c, i) => (
                    <div key={c.id} style={{
                      display: 'grid', gridTemplateColumns: '1fr 200px 100px 80px 120px', gap: 20,
                      alignItems: 'center', padding: '18px 0',
                      borderBottom: i === notStarted.length - 1 ? 'none' : '1px solid var(--rule)',
                      cursor: 'pointer', opacity: 0.75,
                    }}>
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 2 }}>{c.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.instructor} · {c.subtitle}</div>
                      </div>
                      <div className="progress"><span style={{ width: '0%' }} /></div>
                      <div className="mono" style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'right' }}>0/{c.totalLessons}</div>
                      <div className="mono" style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'right' }}>0%</div>
                      <button className="btn btn-ghost btn-sm" style={{ justifySelf: 'end' }}>Start <Icons.ArrowRight size={12} /></button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
