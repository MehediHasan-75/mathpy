'use client';

export function Wordmark({ size = 18, showDot = true }: { size?: number; showDot?: boolean }) {
  return (
    <span className="mp-wordmark" style={{ fontSize: size }}>
      mathpy{showDot && <span className="dot" />}
    </span>
  );
}

export function Spotmark({ size = 26 }: { size?: number }) {
  return (
    <span className="mp-spotmark" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 19V6M19 19V6M5 6l7 8 7-8" />
      </svg>
    </span>
  );
}
