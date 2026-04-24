'use client';

import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

export function V1Executive() {
  const router = useRouter();
  const now = new Date();
  const hours = now.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 17 ? 'Good afternoon' : 'Good evening';
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const { student, primaryAction, secondaryAction } = MOCK;

  return (
    <div className="artboard-shell">
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />

        <div style={{ padding: '56px 72px 64px', maxWidth: 1200 }}>
          {/* Editorial masthead */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 64 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>{dateLabel}</div>
              <h1 className="display" style={{ fontSize: 44, lineHeight: 1.05, margin: 0, letterSpacing: '-0.035em', fontWeight: 400 }}>
                {greeting}, <span style={{ color: 'var(--ink-3)' }}>Arafat.</span>
              </h1>
              <p style={{ marginTop: 14, color: 'var(--ink-2)', fontSize: 15, maxWidth: 520, lineHeight: 1.55 }}>
                You&apos;re <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{student.streakDays} days</span> into your streak and ranked <span style={{ color: 'var(--ink)', fontWeight: 500 }}>#{student.rankOverall}</span> in Medi-Prep Batch 14. Let&apos;s keep the momentum.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', letterSpacing: '0.08em' }}>T-MINUS · MEDICAL ADMISSION</div>
              <div className="display mono" style={{ fontSize: 38, letterSpacing: '-0.02em', fontWeight: 500, fontFeatureSettings: '"tnum"' }}>
                127 <span style={{ color: 'var(--ink-3)', fontSize: 16, fontWeight: 400, marginLeft: 2 }}>days</span>
              </div>
            </div>
          </div>

          {/* THE DOMINANT ACTION */}
          <section className="card interactive" style={{
            padding: 36,
            marginBottom: 28,
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: 40,
            borderRadius: 18,
            position: 'relative',
            overflow: 'hidden',
            background: 'var(--bg-elev)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 85% 20%, var(--blue-soft) 0%, transparent 50%)',
              opacity: 0.6, pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <span className="chip blue"><span className="dot" />Continue learning</span>
                <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Organic Chemistry · {primaryAction.chapter}</span>
              </div>

              <h2 className="display" style={{ fontSize: 28, lineHeight: 1.2, margin: '0 0 8px', fontWeight: 500, letterSpacing: '-0.025em', maxWidth: 560 }}>
                {primaryAction.lesson}
              </h2>
              <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginBottom: 28 }}>
                {primaryAction.instructor} · Lecture 05 of 19
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                <div style={{ flex: 1, maxWidth: 420 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>42% · 20 min watched</span>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{primaryAction.remaining}</span>
                  </div>
                  <div className="progress blue thick"><span style={{ width: '42%' }} /></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" style={{ padding: '13px 22px', fontSize: 14 }} onClick={() => router.push('/lesson')}>
                  <Icons.Play size={14} /> Resume lesson
                  <span className="kbd" style={{ marginLeft: 6, background: 'oklch(1 0 0 / 0.14)', color: 'oklch(1 0 0 / 0.8)', borderColor: 'transparent' }}>↵</span>
                </button>
                <button className="btn btn-secondary">Mark complete</button>
                <button className="btn btn-ghost">View chapter</button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div className="stripe-placeholder" style={{ aspectRatio: '16/10', borderRadius: 12, marginBottom: 14 }}>
                LESSON · VIDEO
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-3)' }}>
                <span className="mono">CH 12 / 19</span>
                <span className="mono">48:12 total</span>
              </div>
            </div>
          </section>

          {/* Secondary critical action */}
          <section style={{
            display: 'flex', alignItems: 'center', gap: 20,
            padding: '18px 24px',
            border: '1px solid var(--rule)',
            borderRadius: 14,
            background: 'var(--bg-elev)',
            marginBottom: 56,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--amber-soft)', color: 'oklch(0.45 0.14 65)',
              display: 'grid', placeItems: 'center', flexShrink: 0,
            }}>
              <Icons.Clock size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                Next critical · Model Test
              </div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{secondaryAction.title}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 12.5, color: 'var(--ink-2)' }}>
              <div><span className="mono" style={{ color: 'var(--ink)' }}>{secondaryAction.when}</span></div>
              <div className="vr" style={{ height: 16 }} />
              <div><span className="mono">{secondaryAction.questions}</span> MCQ · <span className="mono">{secondaryAction.duration}</span></div>
              <div className="vr" style={{ height: 16 }} />
              <div>{secondaryAction.subjects.join(' · ')}</div>
            </div>
            <button className="btn btn-secondary btn-sm">Prepare</button>
          </section>

          {/* Whisper stats row */}
          <section>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderTop: '1px solid var(--rule)',
              borderBottom: '1px solid var(--rule)',
            }}>
              {[
                { label: 'Weekly target', value: '12.2', suffix: '/ 18 h', meta: '68% complete', accent: 'emerald' },
                { label: 'Average score', value: '78.4', suffix: '%', meta: '+2.1 this week', accent: 'blue' },
                { label: 'Batch rank', value: `#${student.rankOverall}`, suffix: `of ${student.rankOutOf.toLocaleString()}`, meta: '▲ 18 positions', accent: 'emerald' },
                { label: 'Focus consistency', value: `${student.streakDays}`, suffix: 'day streak', meta: 'Personal best', accent: 'amber' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: '28px 28px 28px 0',
                  paddingLeft: i === 0 ? 0 : 28,
                  borderLeft: i === 0 ? 'none' : '1px solid var(--rule)',
                }}>
                  <div className="eyebrow" style={{ marginBottom: 14, fontSize: 10 }}>{s.label}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                    <div className="display mono" style={{ fontSize: 32, fontWeight: 500, letterSpacing: '-0.02em' }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.suffix}</div>
                  </div>
                  <div style={{ fontSize: 11.5, color: `var(--${s.accent})` }}>{s.meta}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Courses in progress */}
          <section style={{ marginTop: 56 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
              <h3 className="display" style={{ fontSize: 18, fontWeight: 500, margin: 0, letterSpacing: '-0.015em' }}>In progress</h3>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>View all courses <Icons.ArrowRight size={12} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {MOCK.courses.map((c, i) => (
                <div key={c.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '24px 1fr 180px 120px 80px 120px',
                  gap: 20,
                  alignItems: 'center',
                  padding: '18px 0',
                  borderBottom: i === MOCK.courses.length - 1 ? 'none' : '1px solid var(--rule)',
                  cursor: 'pointer',
                  transition: 'background 160ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-sunk)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                onClick={() => router.push('/lesson')}
                >
                  <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>0{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 2 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c.instructor} · {c.subtitle}</div>
                  </div>
                  <div>
                    <div className={`progress ${c.color === 'ink' ? '' : c.color}`}><span style={{ width: `${c.progressPct}%` }} /></div>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', textAlign: 'right' }}>
                    {c.completedLessons}/{c.totalLessons}
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--ink)', textAlign: 'right' }}>{c.progressPct}%</div>
                  <button className="btn btn-secondary btn-sm" style={{ justifySelf: 'end' }} onClick={e => { e.stopPropagation(); router.push('/lesson'); }}>
                    Resume <Icons.ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
