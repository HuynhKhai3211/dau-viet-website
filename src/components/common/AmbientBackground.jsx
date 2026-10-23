import { useEffect, useState } from 'react';
import bronzeDrum from '../../assets/branding/dong-son-bronze-drum.webp';
import '../../styles/components/ambientBackground.css';

export default function AmbientBackground() {
  const [paused, setPaused] = useState(() => typeof document !== 'undefined' && document.hidden);
  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return <div className={`ambient-background ${paused ? 'ambient-background--paused' : ''}`} aria-hidden="true">
    <div className="ambient-background__viewport">
      <div className="ambient-sunlight ambient-sunlight--left" />
      <div className="ambient-sunlight ambient-sunlight--right" />
      <img className="ambient-drum ambient-drum--left" src={bronzeDrum} alt="" width="1254" height="1254" decoding="async" fetchPriority="low" draggable={false} />
      <img className="ambient-drum ambient-drum--right" src={bronzeDrum} alt="" width="1254" height="1254" decoding="async" fetchPriority="low" draggable={false} />
      <div className="ambient-mist ambient-mist--left" />
      <div className="ambient-mist ambient-mist--right" />
    </div>
  </div>;
}
