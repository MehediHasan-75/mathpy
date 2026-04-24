'use client';

import React from 'react';

type IconProps = { size?: number; className?: string; style?: React.CSSProperties };

const S = ({ size = 16, children, className, style }: IconProps & { children: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    {children}
  </svg>
);

export const Icons = {
  Home: (p: IconProps) => <S {...p}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></S>,
  Courses: (p: IconProps) => <S {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9h17M8 4.5v15"/></S>,
  Play: (p: IconProps) => <S {...p}><path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none"/></S>,
  Exam: (p: IconProps) => <S {...p}><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></S>,
  Materials: (p: IconProps) => <S {...p}><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/></S>,
  Analytics: (p: IconProps) => <S {...p}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></S>,
  Calendar: (p: IconProps) => <S {...p}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></S>,
  Mentor: (p: IconProps) => <S {...p}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6"/></S>,
  Bell: (p: IconProps) => <S {...p}><path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2H4.5zM10 20a2 2 0 0 0 4 0"/></S>,
  Search: (p: IconProps) => <S {...p}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></S>,
  Settings: (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></S>,
  ArrowRight: (p: IconProps) => <S {...p}><path d="M5 12h14M13 5l7 7-7 7"/></S>,
  Check: (p: IconProps) => <S {...p}><path d="M4 12l5 5L20 6"/></S>,
  Clock: (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></S>,
  Flame: (p: IconProps) => <S {...p}><path d="M12 3s1 3 3 5 3 4 3 6a6 6 0 0 1-12 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 2-7 2-10z"/></S>,
  Bookmark: (p: IconProps) => <S {...p}><path d="M6 3h12v18l-6-4-6 4z"/></S>,
  Download: (p: IconProps) => <S {...p}><path d="M12 4v12M7 11l5 5 5-5M4 20h16"/></S>,
  Live: (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="10" opacity="0.4"/></S>,
  Target: (p: IconProps) => <S {...p}><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></S>,
  ChevronRight: (p: IconProps) => <S {...p}><path d="M9 6l6 6-6 6"/></S>,
  More: (p: IconProps) => <S {...p}><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></S>,
  FileText: (p: IconProps) => <S {...p}><path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M8 13h8M8 17h5"/></S>,
};
