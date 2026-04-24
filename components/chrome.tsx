'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from './icons';
import { Wordmark, Spotmark } from './brand';
import { MOCK } from '@/lib/data';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Home', href: '/', count: null },
  { id: 'courses', label: 'My Courses', icon: 'Courses', href: '/lesson', count: '4' },
  { id: 'live', label: 'Live Classes', icon: 'Live', href: '#', count: '1', live: true },
  { id: 'exams', label: 'Exams & MCQ', icon: 'Exam', href: '#', count: '3' },
  { id: 'materials', label: 'Study Materials', icon: 'Materials', href: '#', count: null },
  { id: 'performance', label: 'Performance', icon: 'Analytics', href: '#', count: null },
  { id: 'v3', label: 'Command Center', icon: 'Target', href: '/v3', count: null },
];

const SUPPORT = [
  { id: 'mentor', label: 'Mentor', icon: 'Mentor', href: '#' },
  { id: 'calendar', label: 'Calendar', icon: 'Calendar', href: '#' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand">
        <Spotmark size={26} />
        <Wordmark size={17} />
        <div className="brand-badge">PRO</div>
      </div>

      <div className="nav-section-label">Learn</div>
      {NAV.map(item => {
        const Icon = Icons[item.icon as keyof typeof Icons];
        const active = item.href !== '#' && pathname === item.href;
        return (
          <Link key={item.id} href={item.href} className={`nav-item ${active ? 'active' : ''}`}>
            <Icon className="nav-icon" size={16} />
            <span>{item.label}</span>
            {item.live && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', marginLeft: 'auto', boxShadow: '0 0 0 3px oklch(0.58 0.18 25 / 0.15)' }} />
            )}
            {!item.live && item.count && <span className="count">{item.count}</span>}
          </Link>
        );
      })}

      <div className="nav-section-label">Support</div>
      {SUPPORT.map(item => {
        const Icon = Icons[item.icon as keyof typeof Icons];
        return (
          <Link key={item.id} href={item.href} className="nav-item">
            <Icon className="nav-icon" size={16} />
            <span>{item.label}</span>
          </Link>
        );
      })}

      <div className="footer-card">
        <div className="avatar">{MOCK.student.initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {MOCK.student.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {MOCK.student.batch}
          </div>
        </div>
        <Icons.Settings size={14} style={{ color: 'var(--ink-3)' }} />
      </div>
    </aside>
  );
}

export function Topbar({ crumbs }: { crumbs?: { label: string; active?: boolean }[] }) {
  return (
    <div className="topbar">
      {crumbs ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-3)' }}>
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && <Icons.ChevronRight size={12} />}
              <span style={{ color: c.active ? 'var(--ink)' : 'var(--ink-3)' }}>{c.label}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="cmd">
        <Icons.Search size={14} />
        <span>Search courses, lessons, exams…</span>
        <span className="k">⌘K</span>
      </div>

      <div className="topbar-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-3)' }}>
          <Icons.Flame size={14} style={{ color: 'var(--amber)' }} />
          <span className="mono">{MOCK.student.streakDays}</span>
          <span>day streak</span>
        </div>
        <div className="vr" style={{ height: 18 }} />
        <button className="icon-btn" aria-label="Notifications">
          <Icons.Bell size={16} />
          <span className="dot" />
        </button>
        <div className="avatar avatar-sm" style={{ width: 28, height: 28, fontSize: 11 }}>
          {MOCK.student.initials}
        </div>
      </div>
    </div>
  );
}
