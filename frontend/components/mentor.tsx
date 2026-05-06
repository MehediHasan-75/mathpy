'use client';

import { useState } from 'react';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

const MESSAGES = [
  { id: 'msg1', from: 'mentor', text: 'Great work on Chapter 11! Your score jumped to 82% — that\'s a 6-point improvement. Keep this momentum going.', time: '2h ago' },
  { id: 'msg2', from: 'student', text: 'Thank you! I spent extra time on nucleophilic addition reactions. Do you think I should review carbonyl compounds again before the model test?', time: '2h ago' },
  { id: 'msg3', from: 'mentor', text: 'Yes, absolutely. Focus on the reaction mechanisms, especially for aldehydes vs. ketones. I\'ve left 3 practice questions below — try those first.', time: '1h 45m ago' },
  { id: 'msg4', from: 'mentor', text: 'Also, your Physics score dipped slightly (−3). That\'s from Kinematics — spend 30 minutes on vector resolution before Thursday.', time: '1h 44m ago' },
  { id: 'msg5', from: 'student', text: 'Got it! I\'ll do the Chemistry questions now and review Physics vectors tonight.', time: '1h 30m ago' },
];

const QUESTIONS = [
  { id: 'q1', text: 'Explain why aldehydes are more reactive than ketones in nucleophilic addition.', subject: 'Chemistry', difficulty: 'Medium', answered: false },
  { id: 'q2', text: 'Write the mechanism for the reaction of acetone with HCN.', subject: 'Chemistry', difficulty: 'Hard', answered: false },
  { id: 'q3', text: 'What is the product when benzaldehyde reacts with NaBH₄?', subject: 'Chemistry', difficulty: 'Easy', answered: true },
];

const DIFF_COLOR: Record<string, string> = {
  Easy: 'oklch(0.93 0.035 165)',
  Medium: 'oklch(0.94 0.03 75)',
  Hard: 'oklch(0.92 0.035 30)',
};

export function MentorPage() {
  const [message, setMessage] = useState('');

  return (
    <div className="artboard-shell">
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={[{ label: 'Mentor' }, { label: MOCK.mentor.name, active: true }]} />

        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {/* Left: chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--rule)' }}>

            {/* Mentor header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--rule)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: 15, flexShrink: 0 }}>{MOCK.mentor.initials}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{MOCK.mentor.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{MOCK.mentor.title}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm">
                  <Icons.Calendar size={13} /> Schedule
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {MESSAGES.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex', gap: 12,
                  flexDirection: msg.from === 'student' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                }}>
                  {msg.from === 'mentor' && (
                    <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0, marginBottom: 0 }}>{MOCK.mentor.initials}</div>
                  )}
                  <div style={{
                    maxWidth: '68%',
                    background: msg.from === 'student' ? 'var(--ink)' : 'var(--bg-sunk)',
                    color: msg.from === 'student' ? 'var(--bg)' : 'var(--ink)',
                    borderRadius: msg.from === 'student' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    padding: '12px 16px',
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}>
                    {msg.text}
                    <div style={{ fontSize: 10, color: msg.from === 'student' ? 'oklch(0.75 0.01 260)' : 'var(--ink-4)', marginTop: 6 }} className="mono">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '16px 28px 24px', borderTop: '1px solid var(--rule)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write a message to your mentor…"
                  rows={2}
                  style={{
                    flex: 1, resize: 'none', background: 'var(--bg-sunk)',
                    border: '1px solid var(--rule)', borderRadius: 8,
                    padding: '10px 14px', fontSize: 13, fontFamily: 'inherit',
                    color: 'var(--ink)', outline: 'none', lineHeight: 1.5,
                  }}
                />
                <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>Send</button>
              </div>
            </div>
          </div>

          {/* Right: questions + stats */}
          <div style={{ width: 340, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '24px 24px 0' }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, letterSpacing: '-0.01em' }}>
                Questions from mentor <span className="mono" style={{ color: 'var(--ink-4)', fontWeight: 400 }}>{QUESTIONS.filter(q => !q.answered).length} pending</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
                {QUESTIONS.map(q => (
                  <div key={q.id} className="card" style={{ padding: '14px 16px', opacity: q.answered ? 0.6 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                        background: DIFF_COLOR[q.difficulty], padding: '2px 7px', borderRadius: 4, color: 'oklch(0.30 0.04 260)',
                        flexShrink: 0,
                      }}>{q.difficulty}</span>
                      {q.answered && <span style={{ fontSize: 10, color: 'var(--ink-4)' }} className="mono">Answered</span>}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{q.text}</div>
                    {!q.answered && (
                      <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Answer</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.01em' }}>Session stats</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {[
                  { label: 'Sessions', value: '14' },
                  { label: 'Avg score lift', value: '+8%' },
                  { label: 'Questions done', value: '47' },
                  { label: 'Streak', value: '23d' },
                ].map(stat => (
                  <div key={stat.label} className="card" style={{ padding: '14px 16px' }}>
                    <div className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 2 }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{stat.label}</div>
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
