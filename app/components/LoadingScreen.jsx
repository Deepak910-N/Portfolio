'use client';
import { useState, useEffect, useRef } from 'react';

const LINES = [
  '> INITIALIZING DEEP SPACE TELEMETRY ......... OK',
  '> CALIBRATING NAVIGATION ARRAY .............. OK',
  '> ESTABLISHING SIGNAL LOCK .................. OK',
  '> CARRIER FREQUENCY: 14.205 MHz ............. OK',
  '> IDENTITY VERIFIED: DEEPAK.DEV ............. READY',
];

export default function LoadingScreen({ onDone }) {
  const [shown, setShown] = useState(false);
  const [lines, setLines] = useState([]);
  const [wiping, setWiping] = useState(false);
  const lineIdx = useRef(0);
  const charIdx = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('booted')) {
      onDone();
      return;
    }
    setShown(true);
    typeNext();
    return () => clearTimeout(timerRef.current);
  }, []);

  function typeNext() {
    if (lineIdx.current >= LINES.length) {
      sessionStorage.setItem('booted', '1');
      timerRef.current = setTimeout(() => {
        setWiping(true);
        timerRef.current = setTimeout(onDone, 900);
      }, 400);
      return;
    }

    const fullLine = LINES[lineIdx.current];
    if (charIdx.current <= fullLine.length) {
      setLines((prev) => {
        const next = [...prev];
        next[lineIdx.current] = fullLine.slice(0, charIdx.current);
        return next;
      });
      charIdx.current++;
      timerRef.current = setTimeout(typeNext, 28);
    } else {
      lineIdx.current++;
      charIdx.current = 0;
      timerRef.current = setTimeout(typeNext, 220);
    }
  }

  if (!shown) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 10vw',
        clipPath: wiping ? 'inset(100% 0 0 0)' : 'inset(0 0 0 0)',
        transition: wiping ? 'clip-path 0.85s cubic-bezier(0.77, 0, 0.18, 1)' : 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-geist-mono), monospace',
          fontSize: 'clamp(0.75rem, 1.8vw, 1rem)',
          color: '#6496c8',
          letterSpacing: '1px',
          lineHeight: '2.2',
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre' }}>
            <span style={{ color: i === lines.length - 1 ? '#fff' : '#4a7aaa' }}>{line}</span>
            {i === lines.length - 1 && <span style={{ animation: 'blink 1s step-end infinite', color: '#6496c8' }}>▌</span>}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
