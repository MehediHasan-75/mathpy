'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';

const PLAYLIST = [
  { n: 1, title: 'Introduction to Organic Chemistry', dur: '32:10', done: true },
  { n: 2, title: 'Hydrocarbons — Alkanes & Alkenes', dur: '44:22', done: true },
  { n: 3, title: 'Alcohols & Phenols', dur: '38:15', done: true },
  { n: 4, title: 'Ethers, Epoxides & Thiols', dur: '41:08', done: true },
  { n: 5, title: 'Aldehydes & Ketones: Nucleophilic Addition', dur: '48:12', active: true, progress: 42 },
  { n: 6, title: 'Carboxylic Acids & Derivatives', dur: '52:40' },
  { n: 7, title: 'Amines & Azo Compounds', dur: '45:30' },
  { n: 8, title: 'Biomolecules Overview', dur: '38:55' },
  { n: 9, title: 'Reaction Mechanisms — SN1 / SN2', dur: '56:18' },
  { n: 10, title: 'Stereochemistry', dur: '42:50' },
];

const CHAPTERS = [
  { t: '00:00', title: 'Introduction & recap' },
  { t: '04:12', title: 'Nucleophilic addition mechanism' },
  { t: '12:45', title: 'Addition of HCN — cyanohydrins', active: true },
  { t: '22:30', title: 'Addition of alcohols — acetal formation' },
  { t: '34:10', title: 'Grignard addition' },
  { t: '41:50', title: 'Worked examples & HSC patterns' },
];

const NOTES = [
  { time: '04:12', text: 'Nucleophilic addition happens because the carbonyl C is electrophilic — partial positive charge from O pulling electrons.' },
  { time: '14:20', text: 'HCN adds to form cyanohydrin. Mechanism: CN⁻ attacks C, proton transfer. Reversible.' },
  { time: '18:45', text: 'KEY — cyanohydrins can be hydrolyzed to α-hydroxy acids. Frequently asked in admission exams.' },
];

export function LessonPage() {
  const router = useRouter();
  const [tab, setTab] = useState('notes');
  const [playing, setPlaying] = useState(false);

  return (
    <div className="lesson-shell">
      <Sidebar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={[
          { label: 'Courses', href: '/courses' },
          { label: 'Organic Chemistry' },
          { label: 'Ch 12 · Aldehydes & Ketones' },
          { label: 'Lec 05', active: true },
        ]} />

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 0 }}>
          {/* PRIMARY COLUMN */}
          <div style={{ padding: '24px 32px 32px', overflowY: 'auto' }}>
            {/* Video surface */}
            <div className="video-surface" style={{ marginBottom: 20 }}>
              <div className="scrim" />
              <div className="big-play" onClick={() => setPlaying(!playing)}>
                {playing
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                  : <Icons.Play size={26} />
                }
              </div>
              <div style={{ position: 'absolute', top: 18, left: 22, fontSize: 11, color: 'oklch(1 0 0 / 0.7)', letterSpacing: '0.08em' }} className="mono">
                LECTURE 05 · ORGANIC CHEMISTRY
              </div>
              <div className="chapter-ticks">
                {CHAPTERS.map((_, i) => (
                  <div key={i} className="t">
                    {i <= 2 && <div className="played" style={{ width: i < 2 ? '100%' : '50%' }} />}
                  </div>
                ))}
              </div>
              <div className="controls">
                <div className="ctrl-btn" onClick={() => setPlaying(!playing)}>
                  {playing
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    : <Icons.Play size={14} />
                  }
                </div>
                <div className="mono" style={{ fontSize: 12, color: 'oklch(1 0 0 / 0.85)' }}>20:16 / 48:12</div>
                <div style={{ flex: 1 }} />
                <div className="mono" style={{ fontSize: 11, color: 'oklch(1 0 0 / 0.7)', letterSpacing: '0.04em' }}>1.25×</div>
                <div className="ctrl-btn"><Icons.Settings size={14} /></div>
                <div className="ctrl-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4h6M4 4v6M20 20h-6M20 20v-6"/></svg>
                </div>
              </div>
            </div>

            {/* Lesson header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, marginBottom: 24 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span className="chip blue"><span className="dot" />In progress · 42%</span>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>CHAPTER 12 · LECTURE 05 OF 19</span>
                </div>
                <h1 className="display" style={{ fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 10 }}>
                  Aldehydes & Ketones: Nucleophilic Addition
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--ink-2)' }}>
                  <div className="avatar avatar-sm" style={{ background: 'var(--blue)', fontSize: 9 }}>SA</div>
                  Dr. Sharmin Akter
                  <span style={{ color: 'var(--ink-4)' }}>·</span>
                  <span>Senior Faculty · DMC &apos;05</span>
                  <span style={{ color: 'var(--ink-4)' }}>·</span>
                  <span className="mono">48:12</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm"><Icons.Bookmark size={12} /> Save</button>
                <button className="btn btn-secondary btn-sm"><Icons.Download size={12} /> Materials</button>
                <button className="btn btn-primary btn-sm">Mark complete</button>
              </div>
            </div>

            {/* Progress rail */}
            <div style={{ marginBottom: 20 }}>
              <div className="progress blue thick"><span style={{ width: '42%' }} /></div>
            </div>

            {/* Prev / Next */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
              <button className="card interactive" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer', background: 'var(--bg-elev)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--bg-sunk)', color: 'var(--ink-2)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 3 }}>PREVIOUS · LEC 04</div>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ethers, Epoxides & Thiols</div>
                </div>
              </button>

              <button className="card interactive" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer', background: 'var(--bg-elev)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-lg)', flexDirection: 'row-reverse' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--blue)', color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icons.ArrowRight size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 3 }}>NEXT · LEC 06</div>
                  <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Carboxylic Acids & Derivatives</div>
                </div>
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 20 }}>
              {[
                { id: 'notes', label: 'My notes', count: 3 },
                { id: 'chapters', label: 'Chapters', count: CHAPTERS.length },
                { id: 'materials', label: 'Materials', count: 4 },
                { id: 'discussion', label: 'Discussion', count: 12 },
                { id: 'transcript', label: 'Transcript', count: null },
              ].map(t => (
                <div key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                  {t.label}{t.count !== null && <span className="count">{t.count}</span>}
                </div>
              ))}
            </div>

            {/* Tab content */}
            {tab === 'notes' && (
              <div>
                <div style={{ display: 'flex', gap: 10, padding: 14, border: '1px solid var(--rule)', borderRadius: 10, background: 'var(--bg-elev)', marginBottom: 16 }}>
                  <div style={{ padding: '4px 8px', background: 'var(--bg-sunk)', borderRadius: 5, fontSize: 11, color: 'var(--ink-2)', height: 'fit-content' }} className="mono">20:16</div>
                  <input placeholder="Add a note at this timestamp…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontFamily: 'inherit' }} />
                  <button className="btn btn-secondary btn-sm">Add note</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {NOTES.map((n, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 14, padding: '14px 16px', border: '1px solid var(--rule)', borderRadius: 10, background: 'var(--bg-elev)', alignItems: 'flex-start' }}>
                      <button className="mono" style={{ fontSize: 11, color: 'var(--blue)', padding: '3px 7px', background: 'var(--blue-soft)', borderRadius: 5, fontWeight: 500 }}>{n.time}</button>
                      <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{n.text}</div>
                      <button className="icon-btn" style={{ width: 24, height: 24 }}><Icons.More size={14} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-sunk)', borderRadius: 10, borderLeft: '2px solid var(--blue)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div className="avatar avatar-sm" style={{ background: 'var(--blue)', fontSize: 9 }}>SA</div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>Dr. Sharmin Akter · Teacher note</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                    Cyanohydrin hydrolysis appears in <span style={{ color: 'var(--ink)', fontWeight: 500 }}>~30% of medical admission papers</span> since 2018. Memorize the two-step mechanism, not just the product.
                  </div>
                </div>
              </div>
            )}

            {tab === 'chapters' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {CHAPTERS.map((c, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px', gap: 14, padding: '12px 14px', borderRadius: 8, background: c.active ? 'var(--blue-soft)' : 'transparent', cursor: 'pointer', alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: 12, color: c.active ? 'var(--blue)' : 'var(--ink-3)' }}>{c.t}</span>
                    <span style={{ fontSize: 13, fontWeight: c.active ? 500 : 400 }}>{c.title}</span>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'right' }}>{i < 2 ? '✓' : i === 2 ? 'now' : ''}</span>
                  </div>
                ))}
              </div>
            )}

            {tab === 'materials' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {[
                  { title: 'Reaction sheet — Nucleophilic addition', kind: 'PDF', pages: 8, size: '2.4 MB' },
                  { title: 'HSC pattern worksheet', kind: 'Practice', pages: 12, size: '3.1 MB' },
                  { title: 'Mechanism cheat card', kind: 'Notes', pages: 2, size: '0.8 MB' },
                  { title: 'Past exam questions — 2018–2024', kind: 'PDF', pages: 24, size: '4.7 MB' },
                ].map((m, i) => (
                  <div key={i} className="card interactive" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <div style={{ width: 36, height: 44, background: 'var(--bg-sunk)', borderRadius: 5, display: 'grid', placeItems: 'center' }}>
                      <Icons.FileText size={16} style={{ color: 'var(--ink-3)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{m.title}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{m.kind} · {m.pages}p · {m.size}</div>
                    </div>
                    <button className="icon-btn"><Icons.Download size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'discussion' && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
                12 questions from your batch. <button style={{ color: 'var(--blue)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Open discussion →</button>
              </div>
            )}

            {tab === 'transcript' && (
              <div style={{ padding: 20, background: 'var(--bg-sunk)', borderRadius: 10, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.7, maxHeight: 300, overflow: 'auto' }}>
                <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 11 }}>[00:00]</span> Good afternoon everyone. Today we&apos;re going to tackle one of the most important topics for medical admission — nucleophilic addition to carbonyls...<br/><br/>
                <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 11 }}>[04:12]</span> The carbonyl group is polarized. Oxygen pulls electron density away from carbon, leaving carbon with a partial positive charge — this is why it&apos;s attacked by nucleophiles...
              </div>
            )}

            {/* Related MCQ CTA */}
            <div style={{ marginTop: 32, padding: 24, borderRadius: 14, background: 'linear-gradient(135deg, var(--blue-soft) 0%, var(--bg-elev) 70%)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--blue)', color: 'white', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icons.Target size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, color: 'var(--blue)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 4 }}>Locked in. Test yourself.</div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>30 MCQ on Nucleophilic Addition — curated for this chapter</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>~20 min · Batch average 74% · Your Chem avg 82%</div>
              </div>
              <button className="btn btn-primary">Start practice <Icons.ArrowRight size={13} /></button>
            </div>
          </div>

          {/* RIGHT RAIL — Playlist */}
          <aside style={{ borderLeft: '1px solid var(--rule)', background: 'var(--bg-elev)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid var(--rule)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div className="eyebrow" style={{ fontSize: 10 }}>Course playlist</div>
                <button className="btn btn-ghost btn-sm" style={{ padding: '3px 6px', fontSize: 11 }}><Icons.More size={13} /></button>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Organic Chemistry</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>34 of 55 lessons</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 500 }}>62%</span>
              </div>
              <div className="notch-scale blue" style={{ height: 3, marginTop: 6 }}>
                {Array.from({ length: 19 }).map((_, i) => (
                  <div key={i} className={`notch ${i < 11 ? 'filled' : i === 11 ? 'current' : ''}`} />
                ))}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
              <div style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 10px 6px', fontWeight: 500 }}>
                Chapter 12 · Aldehydes & Ketones
              </div>
              {PLAYLIST.map(l => (
                <div key={l.n} className={`playlist-row ${l.active ? 'active' : ''} ${l.done ? 'done' : ''}`}>
                  <div className="num">{String(l.n).padStart(2, '0')}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="title">{l.title}</div>
                    {l.active && l.progress ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        <div className="progress blue" style={{ height: 2, flex: 1 }}><span style={{ width: `${l.progress}%` }} /></div>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--blue)' }}>{l.progress}%</span>
                      </div>
                    ) : (
                      <div className="meta">{l.done ? 'Completed' : 'Not started'}</div>
                    )}
                  </div>
                  <div className="dur">{l.dur}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: 16, borderTop: '1px solid var(--rule)', background: 'var(--bg-sunk)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em', marginBottom: 2 }}>UP NEXT · LEC 06</div>
                <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Carboxylic Acids & Derivatives</div>
              </div>
              <button className="btn btn-secondary btn-sm"><Icons.Play size={11} /></button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
