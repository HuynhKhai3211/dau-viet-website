import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function SectionHeader({ title, subtitle, className = '' }) {
  const [ref, isRevealed] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`section-header ${isRevealed ? 'revealed' : ''} ${className}`}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
