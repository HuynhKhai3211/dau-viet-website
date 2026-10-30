import { useEffect, useState } from 'react';
import { Leaf, Pause, Play } from 'lucide-react';
import '../../styles/components/ambientBackground.css';

const STORAGE_KEY = 'dau-viet-ambient-enabled';
const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Stable values keep the scene unchanged across renders and route changes.
const particles = Array.from({ length: 42 }, (_, index) => {
  const leaf = index % 3 !== 2;
  const side = index % 2 === 0 ? 'left' : 'right';
  return {
    id: index,
    leaf,
    style: {
      [side]: `${0.5 + ((index * 17) % 5)}%`,
      '--particle-size': `${leaf ? 8 + (index * 7) % 5 : 2 + index % 3}px`,
      '--particle-duration': `${leaf ? 30 + (index * 7) % 19 : 23 + (index * 11) % 21}s`,
      '--particle-delay': `${-((index * 13) % 47)}s`,
      '--particle-drift': `${(side === 'left' ? 1 : -1) * (12 + (index * 7) % 28)}px`,
      '--particle-turn': `${(side === 'left' ? 1 : -1) * (100 + (index * 23) % 180)}deg`,
      '--particle-angle': `${(index * 47) % 360}deg`,
      '--particle-opacity': leaf ? 0.26 + (index % 4) * 0.03 : 0.34 + (index % 4) * 0.06,
      '--particle-color': index % 2 === 0 ? '#80572f' : '#a57832',
    },
  };
});

function readPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export default function AmbientBackground() {
  const [enabled, setEnabled] = useState(readPreference);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia(MOTION_QUERY).matches);
  const [paused, setPaused] = useState(() => document.hidden);
  const active = enabled && !reducedMotion;

  useEffect(() => {
    const motion = window.matchMedia(MOTION_QUERY);
    const handleMotion = () => setReducedMotion(motion.matches);
    const handleVisibility = () => setPaused(document.hidden);
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) setEnabled(readPreference());
    };
    motion.addEventListener('change', handleMotion);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('storage', handleStorage);
    handleMotion();
    handleVisibility();
    return () => {
      motion.removeEventListener('change', handleMotion);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggle = () => {
    if (reducedMotion) return;
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(nextEnabled));
    } catch {
      // The control still works when browser storage is unavailable.
    }
  };

  return (
    <>
      <div
        className={`ambient-background${paused ? ' ambient-background--paused' : ''}`}
        aria-hidden="true"
        hidden={!active}
      >
        {active && <>
          <div className="ambient-sunlight ambient-sunlight--left" />
          <div className="ambient-sunlight ambient-sunlight--right" />
          <div className="ambient-background__viewport">
            {particles.map(({ id, leaf, style }) => (
              <span key={id} className={`ambient-particle ${leaf ? 'ambient-particle--leaf' : 'ambient-particle--dust'}`} style={style}>
                {leaf && <svg viewBox="0 0 24 32" fill="none">
                  <path d="M19.5 1.5C6 2 0 11 4.5 21.5c1.2 2.8 3.4 4.4 6 4.2C21 25 24 13 19.5 1.5Z" fill="currentColor" />
                  <path d="M4 30C7 20 12 12 18 5M8 21l-1-7m5 1 6-3" stroke="#654729" strokeWidth=".8" strokeLinecap="round" />
                </svg>}
              </span>
            ))}
          </div>
        </>}
      </div>
      <button
        type="button"
        className="ambient-toggle"
        aria-label="Nền động"
        aria-pressed={active}
        aria-describedby="ambient-motion-status"
        disabled={reducedMotion}
        title={reducedMotion ? 'Đã tắt theo cài đặt giảm chuyển động của thiết bị' : `${active ? 'Tắt' : 'Bật'} nền động`}
        onClick={toggle}
      >
        <Leaf size={16} aria-hidden="true" />
        <span>Nền động</span>
        <span className="ambient-toggle__state" aria-hidden="true">{active ? 'Bật' : 'Tắt'}</span>
        {active ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
      </button>
      <span id="ambient-motion-status" className="ambient-motion-status" role="status">
        {reducedMotion ? 'Nền động đã tắt theo cài đặt giảm chuyển động của thiết bị.' : `Nền động đang ${enabled ? 'bật' : 'tắt'}.`}
      </span>
    </>
  );
}
