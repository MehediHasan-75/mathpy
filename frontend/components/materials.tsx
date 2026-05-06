'use client';

import { useState } from 'react';
import { Icons } from './icons';
import { Sidebar, Topbar } from './chrome';
import { MOCK } from '@/lib/data';

const ALL_MATERIALS = [
  ...MOCK.materials,
  { id: 'm4', title: 'Genetics — Mendel\'s Laws Summary', course: 'Biology', kind: 'Notes', pages: 10, size: '1.9 MB' },
  { id: 'm5', title: 'Calculus — Integration Formulas', course: 'Math', kind: 'Sheet', pages: 4, size: '0.8 MB', downloadedAt: 'Apr 20' },
  { id: 'm6', title: 'Physics — Mechanics Formula Sheet', course: 'Physics', kind: 'Sheet', pages: 6, size: '1.2 MB', downloadedAt: 'Apr 19' },
  { id: 'm7', title: 'Organic Chemistry — Full Notes Ch 1-8', course: 'Chemistry', kind: 'PDF', pages: 48, size: '9.6 MB' },
  { id: 'm8', title: 'Biology — Anatomy Diagrams Pack', course: 'Biology', kind: 'PDF', pages: 32, size: '7.3 MB', downloadedAt: 'Apr 15' },
];

const KIND_ICON: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  Sheet: Icons.Materials,
  PDF: Icons.Materials,
  Notes: Icons.Materials,
};

const KIND_COLOR: Record<string, string> = {
  Sheet: 'oklch(0.92 0.04 258)',
  PDF: 'oklch(0.93 0.035 165)',
  Notes: 'oklch(0.94 0.03 75)',
};

const SUBJECTS = ['All', 'Chemistry', 'Physics', 'Biology', 'Math'];

export function MaterialsPage() {
  const [subject, setSubject] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = ALL_MATERIALS.filter(m => {
    const matchSubject = subject === 'All' || m.course === subject;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.course.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  const downloaded = filtered.filter(m => m.downloadedAt);
  const notDownloaded = filtered.filter(m => !m.downloadedAt);

  return (
    <div className="artboard-shell">
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar crumbs={[{ label: 'Study Materials', active: true }]} />

        <div style={{ padding: '48px 72px 64px', maxWidth: 1200, overflowY: 'auto' }}>
          {/* Masthead */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Resources</div>
              <h1 className="display" style={{ fontSize: 40, lineHeight: 1.05, margin: 0, letterSpacing: '-0.035em', fontWeight: 400 }}>
                Study Materials
              </h1>
              <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 10 }}>
                <span className="mono" style={{ color: 'var(--ink-2)' }}>{ALL_MATERIALS.length}</span> files · <span className="mono" style={{ color: 'var(--ink-2)' }}>{ALL_MATERIALS.filter(m => m.downloadedAt).length}</span> downloaded
              </div>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-sunk)', border: '1px solid var(--rule)', borderRadius: 8, padding: '8px 12px', width: 260 }}>
              <Icons.Search size={14} style={{ color: 'var(--ink-4)', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search materials…"
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--ink)', width: '100%', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Subject filter */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 40, borderBottom: '1px solid var(--rule)' }}>
            {SUBJECTS.map(s => (
              <button key={s} onClick={() => setSubject(s)} style={{
                padding: '10px 14px', background: 'transparent', border: 'none',
                fontSize: 13, fontWeight: 500,
                color: subject === s ? 'var(--ink)' : 'var(--ink-3)',
                borderBottom: subject === s ? '1.5px solid var(--ink)' : '1.5px solid transparent',
                marginBottom: -1, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {s}
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--ink-4)', fontSize: 14 }}>
              No materials found
            </div>
          )}

          {/* Downloaded */}
          {downloaded.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <h3 className="display" style={{ fontSize: 16, fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
                Downloaded <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 13, fontWeight: 400 }}>{downloaded.length}</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {downloaded.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr 90px 80px 80px 110px',
                    gap: 16, alignItems: 'center', padding: '14px 12px',
                    borderBottom: i < downloaded.length - 1 ? '1px solid var(--rule)' : 'none',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: KIND_COLOR[m.kind] ?? 'var(--bg-sunk)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icons.Materials size={16} style={{ color: 'oklch(0.35 0.04 260)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 1 }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{m.course}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--bg-sunk)', padding: '3px 8px', borderRadius: 4, color: 'var(--ink-3)' }}>{m.kind}</span>
                    </div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'right' }}>{m.pages}p · {m.size}</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'right' }}>{m.downloadedAt}</div>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-sm">Open</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Not downloaded */}
          {notDownloaded.length > 0 && (
            <section>
              <h3 className="display" style={{ fontSize: 16, fontWeight: 500, margin: '0 0 20px', letterSpacing: '-0.01em', color: 'var(--ink-2)' }}>
                Available <span className="mono" style={{ color: 'var(--ink-4)', fontSize: 13, fontWeight: 400 }}>{notDownloaded.length}</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {notDownloaded.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr 90px 80px 80px 110px',
                    gap: 16, alignItems: 'center', padding: '14px 12px',
                    borderBottom: i < notDownloaded.length - 1 ? '1px solid var(--rule)' : 'none',
                    opacity: 0.8,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: KIND_COLOR[m.kind] ?? 'var(--bg-sunk)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icons.Materials size={16} style={{ color: 'oklch(0.35 0.04 260)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 1 }}>{m.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{m.course}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--bg-sunk)', padding: '3px 8px', borderRadius: 4, color: 'var(--ink-3)' }}>{m.kind}</span>
                    </div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'right' }}>{m.pages}p · {m.size}</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'right' }}>—</div>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary btn-sm">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
