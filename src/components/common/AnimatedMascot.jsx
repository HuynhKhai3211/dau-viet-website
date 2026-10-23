import { useState, useEffect, useRef, useCallback } from 'react';
import mascotImg from '../../assets/branding/mascot-dau-viet.png';
import '../../styles/components/animatedMascot.css';

/**
 * Predefined list of friendly Vietnamese messages for click/tap interactions.
 */
const MASCOT_FRIENDLY_MESSAGES = [
  'Xin chào! Mình là bé Sử. Cùng khám phá Dấu Việt nhé!',
  'Bạn đã sẵn sàng giải mã lịch sử chưa?',
  'Mỗi Dấu Vết đều ẩn chứa một câu chuyện!',
  'Cùng khám phá chiến thắng Bạch Đằng năm 938 nào!',
  'Lịch sử sẽ thú vị hơn khi chúng ta tự khám phá!',
];

/**
 * AnimatedMascot Component
 *
 * Official Dấu Việt rhinoceros mascot with interactive animations,
 * transparent background, speech/thought bubbles, and variant behaviors.
 *
 * @param {('idle'|'greeting'|'excited'|'thinking'|'success')} variant - Animation mode
 * @param {('small'|'medium'|'large')} size - Rendered size of the mascot
 * @param {boolean} showSpeechBubble - Force speech bubble visibility
 * @param {string} message - Custom message to display in the bubble
 * @param {boolean} interactive - Allow click and hover interactions
 * @param {boolean} thoughtBubble - Render thought bubble instead of speech bubble
 * @param {string} className - Additional CSS class name
 * @param {Function} onMascotClick - Optional click callback
 * @param {string} ariaLabel - Accessible label for screen readers
 */
export default function AnimatedMascot({
  variant = 'idle',
  size = 'medium',
  showSpeechBubble = false,
  message = '',
  interactive = true,
  thoughtBubble = false,
  className = '',
  onMascotClick,
  ariaLabel = 'Bé Sử, linh vật Dấu Việt',
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [clickMessageIndex, setClickMessageIndex] = useState(-1);
  const [isDismissed, setIsDismissed] = useState(false);

  const bounceTimerRef = useRef(null);
  const autoDismissTimerRef = useRef(null);
  const nextMessageIndexRef = useRef(0);

  // Clear all pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    };
  }, []);

  // Reset dismissal when message or variant changes
  useEffect(() => {
    setIsDismissed(false);
  }, [message, variant]);

  // Determine current display message
  const getActiveMessage = useCallback(() => {
    if (clickMessageIndex === 0 && message) return message;
    if (clickMessageIndex >= 0) return MASCOT_FRIENDLY_MESSAGES[clickMessageIndex];
    if (message) return message;

    switch (variant) {
      case 'thinking':
        return 'Hãy kết nối những Dấu Vết bạn đã tìm được!';
      case 'success':
        return 'Tuyệt vời! Bạn đã hoàn thành hành trình khám phá!';
      case 'greeting':
        return 'Xin chào! Cùng khám phá Dấu Việt nhé!';
      default:
        return '';
    }
  }, [message, clickMessageIndex, variant]);

  const activeMessage = getActiveMessage();
  const isThoughtVariant = thoughtBubble || variant === 'thinking';
  const shouldShowBubble =
    !isDismissed && (showSpeechBubble || clickMessageIndex >= 0);

  // Handle Mascot Click / Tap
  const handleClick = (e) => {
    if (!interactive) return;

    // Trigger bounce animation
    setIsClicked(true);
    if (bounceTimerRef.current) clearTimeout(bounceTimerRef.current);
    bounceTimerRef.current = setTimeout(() => {
      setIsClicked(false);
    }, 550);

    // Pick next friendly message (round-robin / random cycle)
    setIsDismissed(false);
    setClickMessageIndex(nextMessageIndexRef.current);
    nextMessageIndexRef.current = (nextMessageIndexRef.current + 1) % MASCOT_FRIENDLY_MESSAGES.length;

    // Auto-dismiss message after 4.5s
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    autoDismissTimerRef.current = setTimeout(() => {
      setClickMessageIndex(-1);
    }, 4500);

    if (onMascotClick) {
      onMascotClick(e);
    }
  };

  const handleDismissBubble = (e) => {
    e.stopPropagation();
    setIsDismissed(true);
    setClickMessageIndex(-1);
    if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
  };

  const containerClasses = [
    'animated-mascot',
    `animated-mascot--${size}`,
    `animated-mascot--${variant}`,
    interactive ? 'animated-mascot--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const characterClasses = [
    'animated-mascot__character',
    isClicked ? 'animated-mascot__character--clicked' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {/* Speech / Thought Bubble */}
      {shouldShowBubble && activeMessage && (
        <aside
          className={`animated-mascot__bubble ${
            isThoughtVariant
              ? 'animated-mascot__bubble--thought'
              : 'animated-mascot__bubble--speech'
          }`}
          role="status"
          aria-live="polite"
        >
          <p className="animated-mascot__bubble-text">{activeMessage}</p>

          <button
            type="button"
            className="animated-mascot__bubble-close"
            onClick={handleDismissBubble}
            aria-label="Đóng lời nhắn của linh vật"
            title="Đóng lời nhắn"
          >
            ✕
          </button>

          {isThoughtVariant ? (
            <div className="animated-mascot__thought-dots" aria-hidden="true">
              <span className="animated-mascot__thought-dot animated-mascot__thought-dot--1" />
              <span className="animated-mascot__thought-dot animated-mascot__thought-dot--2" />
            </div>
          ) : (
            <div className="animated-mascot__bubble-tail" aria-hidden="true" />
          )}
        </aside>
      )}

      {/* Decorative Sparkles for Success Variant */}
      {variant === 'success' && (
        <div className="animated-mascot__sparkles" aria-hidden="true">
          <span className="animated-mascot__sparkle animated-mascot__sparkle--1">✨</span>
          <span className="animated-mascot__sparkle animated-mascot__sparkle--2">🌟</span>
          <span className="animated-mascot__sparkle animated-mascot__sparkle--3">❖</span>
          <span className="animated-mascot__sparkle animated-mascot__sparkle--4">✨</span>
        </div>
      )}

    </>
  );

  const characterContent = (
    <>
      {/* Character Image */}
      <div className={characterClasses}>
        <img
          src={mascotImg}
          alt={ariaLabel}
          className="animated-mascot__img"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Click interaction hint on desktop */}
      {interactive && (
        <span className="animated-mascot__hint" aria-hidden="true">
          Trò chuyện với bé Sử ✨
        </span>
      )}
    </>
  );

  return (
    <div className={containerClasses}>
      {content}
      {interactive ? (
        <button
          type="button"
          className="animated-mascot__btn"
          data-sound="mascot"
          onClick={handleClick}
          aria-label={`${ariaLabel}. Bấm để trò chuyện.`}
        >
          {characterContent}
        </button>
      ) : (
        <div className="animated-mascot__btn" aria-hidden="true">
          {characterContent}
        </div>
      )}
    </div>
  );
}
