'use client';

import { useState } from 'react';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH = 'April 2026';

// April 2026 starts on Wednesday (index 2)
const START_DAY = 2; // 0=Mon
const DAYS_IN_MONTH = 30;

type EventKind = 'exam' | 'live' | 'lesson' | 'mentor';

type CalEvent = {
  day: number;
  title: string;
  time: string;
  kind: EventKind;
};

const EVENTS: CalEvent[] = [
  { day: 24, title: 'Physics MCQ Practice', time: '9:00 AM', kind: 'exam' },
  { day: 24, title: 'Mentor Session', time: '4:00 PM', kind: 'mentor' },
  { day: 25, title: 'Model Test 07', time: '9:00 AM', kind: 'exam' },
  { day: 25, title: 'Organic Chemistry — Live', time: '3:00 PM', kind: 'live' },
  { day: 26, title: 'Biology — DNA Replication', time: '10:00 AM', kind: 'lesson' },
  { day: 27, title: 'Physics — Rotational Q&A', time: '6:00 PM', kind: 'live' },
  { day: 28, title: 'Math — Definite Integrals', time: '11:00 AM', kind: 'lesson' },
  { day: 29, title: 'Chemistry — Full Chapter Review', time: '9:00 AM', kind: 'lesson' },
  { day: 30, title: 'Model Test Review', time: '10:00 AM', kind: 'exam' },
];

const KIND_COLOR: Record<EventKind, string> = {
  exam: 'oklch(0.92 0.035 30)',
  live: 'oklch(0.58 0.18 25)',
  lesson: 'oklch(0.92 0.04 258)',
  mentor: 'oklch(0.93 0.035 165)',
};

const KIND_TEXT_COLOR: Record<EventKind, string> = {
  exam: 'oklch(0.35 0.08 30)',
  live: '#fff',
  lesson: 'oklch(0.30 0.08 258)',
  mentor: 'oklch(0.28 0.05 165)',
};

const KIND_LABEL: Record<EventKind, string> = {
  exam: 'Exam',
  live: 'Live',
  lesson: 'Lesson',
  mentor: 'Mentor',
};

const UPCOMING = EVENTS.filter(e => e.day >= 24).slice(0, 6);

export function CalendarPage() {
  const [selected, setSelected] = useState(24);

  const cells: (number | null)[] = [
    ...Array(START_DAY).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedEvents = EVENTS.filter(e => e.day === selected);

  return (
    <div className="artboard-shell">
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={[{ label: 'Calendar', active: true }]} />

        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflowY: 'auto' }}>
          {/* Left: calendar grid */}
          <div style={{ flex: 1, padding: '48px 48px 64px', minWidth: 0 }}>
            {/* Masthead */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 12 }}>Schedule</div>
                <h1 className="display" style={{ fontSize: 40, lineHeight: 1.05, margin: 0, letterSpacing: '-0.035em', fontWeight: 400 }}>
                  {MONTH}
                </h1>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost btn-sm"><Icons.ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /></button>
                <button className="btn btn-secondary btn-sm">Today</button>
                <button className="btn btn-ghost btn-sm"><Icons.ChevronRight size={14} /></button>
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, marginBottom: 1 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)', padding: '8px 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
              {cells.map((day, i) => {
                const dayEvents = day ? EVENTS.filter(e => e.day === day) : [];
                const isSelected = day === selected;
                const isToday = day === 24;

                return (
                  <div
                    key={i}
                    onClick={() => day && setSelected(day)}
                    style={{
                      minHeight: 90, padding: 8,
                      background: isSelected ? 'var(--bg-sunk)' : 'transparent',
                      border: isSelected ? '1px solid var(--rule)' : '1px solid transparent',
                      borderRadius: 8,
                      cursor: day ? 'pointer' : 'default',
                      opacity: day ? 1 : 0.2,
                    }}
                  >
                    {day && (
                      <>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: isToday ? 'var(--ink)' : 'transparent',
                          color: isToday ? 'var(--bg)' : (day < 24 ? 'var(--ink-4)' : 'var(--ink)'),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: isToday ? 700 : 400,
                          marginBottom: 6,
                        }}>
                          {day}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {dayEvents.slice(0, 3).map((ev, j) => (
                            <div key={j} style={{
                              fontSize: 10, padding: '2px 5px', borderRadius: 3,
                              background: KIND_COLOR[ev.kind],
                              color: KIND_TEXT_COLOR[ev.kind],
                              fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div style={{ fontSize: 9, color: 'var(--ink-4)' }} className="mono">+{dayEvents.length - 3} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: day detail + upcoming */}
          <div style={{ width: 300, borderLeft: '1px solid var(--rule)', padding: '48px 24px 24px', display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Selected day */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, letterSpacing: '-0.01em' }}>
                April {selected}
                <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--ink-4)', marginLeft: 8 }} className="mono">{selectedEvents.length} events</span>
              </div>

              {selectedEvents.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--ink-4)', padding: '24px 0', textAlign: 'center' }}>No events</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedEvents.map(ev => (
                    <div key={ev.title} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 14px', borderRadius: 8, background: 'var(--bg-sunk)',
                    }}>
                      <div style={{
                        width: 3, borderRadius: 2, background: KIND_COLOR[ev.kind],
                        alignSelf: 'stretch', flexShrink: 0,
                        filter: ev.kind === 'live' ? 'brightness(0.8)' : undefined,
                      }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{ev.title}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{ev.time} · {KIND_LABEL[ev.kind]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.01em' }}>Upcoming</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {UPCOMING.map(ev => (
                  <div key={`${ev.day}-${ev.title}`} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--rule)' }}>
                    <div style={{ width: 32, textAlign: 'center', flexShrink: 0 }}>
                      <div className="mono" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1 }}>{ev.day}</div>
                      <div style={{ fontSize: 9, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Apr</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>{ev.time}</div>
                    </div>
                    <div style={{
                      fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                      background: KIND_COLOR[ev.kind], color: KIND_TEXT_COLOR[ev.kind],
                      padding: '2px 6px', borderRadius: 3, flexShrink: 0,
                      filter: ev.kind === 'live' ? 'brightness(0.85)' : undefined,
                    }}>{KIND_LABEL[ev.kind]}</div>
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
