'use client';

import { useState } from 'react';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

type Section = 'profile' | 'notifications' | 'goals' | 'appearance';

export function SettingsPage() {
  const [section, setSection] = useState<Section>('profile');
  const [notifExam, setNotifExam] = useState(true);
  const [notifLive, setNotifLive] = useState(true);
  const [notifMentor, setNotifMentor] = useState(true);
  const [notifMaterial, setNotifMaterial] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(3);

  const SECTIONS: { id: Section; label: string; icon: keyof typeof Icons }[] = [
    { id: 'profile', label: 'Profile', icon: 'Home' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'goals', label: 'Study goals', icon: 'Target' },
    { id: 'appearance', label: 'Appearance', icon: 'Settings' },
  ];

  return (
    <div className="artboard-shell">
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={[{ label: 'Settings', active: true }]} />

        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflowY: 'auto' }}>
          {/* Left nav */}
          <div style={{ width: 220, borderRight: '1px solid var(--rule)', padding: '32px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)', padding: '0 12px', marginBottom: 8 }}>
              Settings
            </div>
            {SECTIONS.map(s => {
              const Icon = Icons[s.icon];
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '9px 12px', borderRadius: 7,
                    background: section === s.id ? 'var(--bg-sunk)' : 'transparent',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 13.5, fontWeight: section === s.id ? 500 : 400,
                    color: section === s.id ? 'var(--ink)' : 'var(--ink-2)',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={15} />
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '40px 56px', maxWidth: 720 }}>

            {/* Profile */}
            {section === 'profile' && (
              <div>
                <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 32px', letterSpacing: '-0.02em' }}>Profile</h2>

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 36 }}>
                  <div className="avatar" style={{ width: 60, height: 60, fontSize: 20 }}>{MOCK.student.initials}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>{MOCK.student.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{MOCK.student.batch}</div>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>Change photo</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { label: 'Full name', value: MOCK.student.name },
                    { label: 'Student ID', value: 'MP-2026-14182' },
                    { label: 'Track', value: MOCK.student.track },
                    { label: 'Batch', value: MOCK.student.batch },
                    { label: 'Email', value: 'arafat.rahman@student.mathpy.bd' },
                    { label: 'Phone', value: '+880 1712 345 678' },
                  ].map(field => (
                    <div key={field.label} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, alignItems: 'center' }}>
                      <label style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 500 }}>{field.label}</label>
                      <div style={{
                        background: 'var(--bg-sunk)', border: '1px solid var(--rule)', borderRadius: 7,
                        padding: '9px 14px', fontSize: 13, color: 'var(--ink)',
                      }}>
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--rule)', display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary btn-sm">Save changes</button>
                  <button className="btn btn-ghost btn-sm">Cancel</button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {section === 'notifications' && (
              <div>
                <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 32px', letterSpacing: '-0.02em' }}>Notifications</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {([
                    { label: 'Exam reminders', desc: 'Get notified before scheduled exams', value: notifExam, set: setNotifExam },
                    { label: 'Live class alerts', desc: 'When a live class is about to start', value: notifLive, set: setNotifLive },
                    { label: 'Mentor messages', desc: 'Receive messages from your mentor', value: notifMentor, set: setNotifMentor },
                    { label: 'New study materials', desc: 'When new PDFs or sheets are uploaded', value: notifMaterial, set: setNotifMaterial },
                  ] as const).map((item, i, arr) => (
                    <div key={item.label} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '18px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--rule)' : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{item.desc}</div>
                      </div>
                      <button
                        onClick={() => item.set(!item.value)}
                        style={{
                          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                          background: item.value ? 'var(--ink)' : 'var(--rule-strong)',
                          position: 'relative', transition: 'background 200ms',
                          flexShrink: 0,
                        }}
                      >
                        <span style={{
                          position: 'absolute', top: 3, left: item.value ? 23 : 3,
                          width: 18, height: 18, borderRadius: '50%', background: 'var(--bg)',
                          transition: 'left 200ms',
                        }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goals */}
            {section === 'goals' && (
              <div>
                <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 32px', letterSpacing: '-0.02em' }}>Study goals</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 12 }}>Daily study target</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[1, 2, 3, 4, 5, 6].map(h => (
                        <button
                          key={h}
                          onClick={() => setDailyGoal(h)}
                          className={dailyGoal === h ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 12 }}>Weekly exam target</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
                      {['1 model test + 2 practice sets', '2 model tests + 3 practice sets', 'Custom schedule'].map((opt, i) => (
                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < 2 ? '1px solid var(--rule)' : 'none', cursor: 'pointer' }}>
                          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--rule-strong)', background: i === 0 ? 'var(--ink)' : 'transparent', flexShrink: 0 }} />
                          <span style={{ fontSize: 13 }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-sunk)', border: '1px solid var(--rule)', borderRadius: 10, padding: '20px 22px' }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Current pace</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14 }}>At your current pace you&apos;re on track to complete the full syllabus 14 days before admission.</div>
                    <div className="progress emerald"><span style={{ width: '68%' }} /></div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 6 }}>68% of weekly goal · 12.2 / 18h</div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance */}
            {section === 'appearance' && (
              <div>
                <h2 className="display" style={{ fontSize: 22, fontWeight: 500, margin: '0 0 32px', letterSpacing: '-0.02em' }}>Appearance</h2>

                <div style={{ marginBottom: 32 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 16 }}>Theme</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { label: 'Light', bg: '#fff', ink: '#0a0a0a' },
                      { label: 'Dark', bg: '#0d0e11', ink: '#e8e9ec' },
                      { label: 'System', bg: 'linear-gradient(135deg, #fff 50%, #0d0e11 50%)', ink: '#0a0a0a' },
                    ].map((t, i) => (
                      <button key={t.label} style={{
                        border: i === 0 ? '2px solid var(--ink)' : '1px solid var(--rule)',
                        borderRadius: 10, padding: 16, cursor: 'pointer',
                        background: 'transparent', fontFamily: 'inherit', textAlign: 'left',
                      }}>
                        <div style={{ height: 56, borderRadius: 6, background: t.bg, marginBottom: 10, border: '1px solid var(--rule)' }} />
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{t.label}</div>
                        {i === 0 && <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>Active</div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', display: 'block', marginBottom: 12 }}>Font size</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['Small', 'Default', 'Large'] as const).map((s, i) => (
                      <button key={s} className={i === 1 ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
