'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './icons';

const QUESTION = {
  subject: 'Organic Chemistry · Ch 12',
  topic: 'Nucleophilic Addition',
  difficulty: 'Medium',
  text: 'Which of the following carbonyl compounds would undergo nucleophilic addition with HCN most readily?',
  subtext: 'Consider the effect of electronic and steric factors on the carbonyl carbon.',
  options: [
    { label: 'A', text: 'Acetone (CH₃COCH₃)' },
    { label: 'B', text: 'Acetaldehyde (CH₃CHO)' },
    { label: 'C', text: 'Benzaldehyde (C₆H₅CHO)' },
    { label: 'D', text: 'Di-tert-butyl ketone ((CH₃)₃C-CO-C(CH₃)₃)' },
  ],
};

const TOTAL_Q = 30;
const INITIAL_SELECTED: Record<number, number> = { 0:1,1:2,2:0,3:3,4:1,5:0,6:2,7:1,8:3,9:0,10:1,13:2,15:0,17:1 };
const INITIAL_MARKED = new Set([6, 13, 22]);

export function MCQPractice() {
  const router = useRouter();
  const [current, setCurrent] = useState(11);
  const [selected, setSelected] = useState<Record<number, number>>(INITIAL_SELECTED);
  const [marked, setMarked] = useState<Set<number>>(new Set(INITIAL_MARKED));

  const sel = selected[current];

  const toggleMark = () => {
    const next = new Set(marked);
    if (next.has(current)) next.delete(current); else next.add(current);
    setMarked(next);
  };

  const pick = (i: number) => setSelected({ ...selected, [current]: i });

  const statusOf = (i: number) => {
    if (i === current) return 'current';
    if (marked.has(i) && i in selected) return 'marked-answered';
    if (marked.has(i)) return 'marked';
    if (i in selected) return 'answered';
    return 'unvisited';
  };

  const answeredCount = Object.keys(selected).length;
  const counts = {
    answered: Object.keys(selected).filter(k => !marked.has(+k)).length,
    marked: marked.size,
    unvisited: TOTAL_Q - answeredCount,
  };

  const paletteBg: Record<string, string> = {
    current: 'var(--ink)', answered: 'var(--blue-soft)',
    'marked-answered': 'oklch(0.93 0.08 65)', marked: 'oklch(0.95 0.06 65)', unvisited: 'var(--bg)',
  };
  const paletteColor: Record<string, string> = {
    current: 'white', answered: 'var(--blue)',
    'marked-answered': 'oklch(0.50 0.13 65)', marked: 'oklch(0.50 0.13 65)', unvisited: 'var(--ink-3)',
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }}>
      {/* Slim exam header */}
      <header style={{ padding: '16px 32px', borderBottom: '1px solid var(--rule)', background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => router.push('/exams')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>CHAPTER TEST</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Nucleophilic Addition — 30 MCQ</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'var(--bg)', border: '1px solid var(--rule-strong)', borderRadius: 10 }}>
          <Icons.Clock size={14} style={{ color: 'var(--ink-2)' }} />
          <div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.06em' }}>TIME LEFT</div>
            <div className="mono" style={{ fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1 }}>12:47</div>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          Pause
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => router.push('/exams')}>Submit test</button>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', minHeight: 0 }}>
        {/* Question column */}
        <div style={{ padding: '48px 72px', maxWidth: 860, overflowY: 'auto' }}>
          {/* Question meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div className="display mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', fontWeight: 500 }}>
              QUESTION {String(current + 1).padStart(2, '0')} / {TOTAL_Q}
            </div>
            <div className="vr" style={{ height: 14 }} />
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
              {QUESTION.subject} · <span style={{ color: 'var(--ink-2)' }}>{QUESTION.topic}</span>
            </div>
            <div className="vr" style={{ height: 14 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--amber)' }}>
              <span style={{ width: 6, height: 6, background: 'var(--amber)', borderRadius: '50%', display: 'inline-block' }} />
              {QUESTION.difficulty}
            </div>
            <div style={{ flex: 1 }} />
            <button onClick={toggleMark} className="btn btn-ghost btn-sm" style={{ color: marked.has(current) ? 'oklch(0.50 0.13 65)' : 'var(--ink-3)' }}>
              <Icons.Bookmark size={12} />
              {marked.has(current) ? 'Marked for review' : 'Mark for review'}
            </button>
          </div>

          {/* Question text */}
          <div style={{ marginBottom: 40 }}>
            <div className="display" style={{ fontSize: 22, lineHeight: 1.45, fontWeight: 450, color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 12 }}>
              {QUESTION.text}
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.55, fontStyle: 'italic' }}>
              {QUESTION.subtext}
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
            {QUESTION.options.map((opt, i) => {
              const active = sel === i;
              return (
                <button key={i} onClick={() => pick(i)} style={{
                  display: 'grid', gridTemplateColumns: '40px 1fr 20px', gap: 16,
                  alignItems: 'center', padding: '18px 22px',
                  background: active ? 'var(--blue-soft)' : 'var(--bg-elev)',
                  border: `1.5px solid ${active ? 'var(--blue)' : 'var(--rule)'}`,
                  borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 140ms ease',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: active ? 'var(--blue)' : 'var(--bg)',
                    color: active ? 'white' : 'var(--ink-2)',
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
                    border: active ? 'none' : '1px solid var(--rule)',
                  }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--ink)', fontWeight: active ? 500 : 400, fontFamily: 'var(--font-mono)' }}>
                    {opt.text}
                  </div>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    border: `1.5px solid ${active ? 'var(--blue)' : 'var(--rule-strong)'}`,
                    background: active ? 'var(--blue)' : 'transparent',
                    display: 'grid', placeItems: 'center',
                  }}>
                    {active && <Icons.Check size={10} style={{ color: 'white', strokeWidth: 3 } as React.CSSProperties} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nav row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid var(--rule)' }}>
            <button className="btn btn-secondary" onClick={() => current > 0 && setCurrent(current - 1)} disabled={current === 0} style={{ opacity: current === 0 ? 0.4 : 1 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M19 12H5M11 19l-7-7 7-7"/></svg>
              Previous
            </button>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>← / → TO NAVIGATE · 1–4 TO SELECT</div>
            <button className="btn btn-primary" onClick={() => current < TOTAL_Q - 1 && setCurrent(current + 1)}>
              Next question <Icons.ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right rail — palette */}
        <aside style={{ borderLeft: '1px solid var(--rule)', background: 'var(--bg-elev)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--rule)' }}>
            <div className="eyebrow" style={{ marginBottom: 10, fontSize: 10 }}>Progress</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <span className="display mono" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>
                {answeredCount}<span style={{ color: 'var(--ink-3)', fontSize: 14 }}>/{TOTAL_Q}</span>
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>answered</span>
            </div>
            <div className="progress blue" style={{ height: 4 }}>
              <span style={{ width: `${(answeredCount / TOTAL_Q) * 100}%` }} />
            </div>
          </div>

          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--rule)' }}>
            <div className="eyebrow" style={{ marginBottom: 12, fontSize: 10 }}>Question palette</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {Array.from({ length: TOTAL_Q }).map((_, i) => {
                const s = statusOf(i);
                return (
                  <button key={i} onClick={() => setCurrent(i)} style={{
                    aspectRatio: '1/1', fontSize: 11,
                    fontFamily: 'var(--font-mono)', fontWeight: 500,
                    background: paletteBg[s], color: paletteColor[s],
                    border: s === 'unvisited' ? '1px solid var(--rule)' : s === 'current' ? '1px solid var(--ink)' : '1px solid transparent',
                    borderRadius: 6, cursor: 'pointer', position: 'relative',
                  }}>
                    {i + 1}
                    {marked.has(i) && (
                      <span style={{ position: 'absolute', top: 2, right: 3, width: 4, height: 4, borderRadius: '50%', background: 'oklch(0.50 0.13 65)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--rule)' }}>
            <div className="eyebrow" style={{ marginBottom: 12, fontSize: 10 }}>Legend</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11.5 }}>
              {[
                { c: 'var(--ink)',          l: 'Current question',          border: false },
                { c: 'var(--blue-soft)',    l: `Answered (${counts.answered})`,        border: true  },
                { c: 'oklch(0.95 0.06 65)', l: `Marked for review (${counts.marked})`, border: false },
                { c: 'var(--bg)',           l: `Not visited (${counts.unvisited})`,    border: true  },
              ].map((x, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 14, height: 14, borderRadius: 4, background: x.c, border: x.border ? '1px solid var(--rule)' : 'none', flexShrink: 0 }} />
                  <span style={{ color: 'var(--ink-2)' }}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 22, marginTop: 'auto' }}>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px', justifyContent: 'center' }} onClick={() => router.push('/exams')}>
              Submit test
            </button>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', marginTop: 8 }}>
              {TOTAL_Q - answeredCount} unanswered · {counts.marked} marked
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
