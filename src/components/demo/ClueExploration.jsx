import { useState } from 'react';
import {
  Waves,
  UserRound,
  Swords,
  CheckCircle2,
  Compass,
  ArrowRight,
  Eye,
  Info,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react';
import { clues, scoring } from '../../data/bachDangDemo';
import TideInteraction from './TideInteraction';
import AnimatedMascot from '../common/AnimatedMascot';

// Icon map for clues
const clueIconMap = {
  Waves,
  UserRound,
  Swords,
  MapPin,
};

function ClueFactExplorer({ clue }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = clue.explorationFacts[selectedIndex];
  const Icon = clueIconMap[clue.icon] || Compass;

  return (
    <div className="clue-sub-interaction clue-sub-interaction--facts">
      <div className="terrain-explorer">
        <div className="terrain-zone-nav" role="group" aria-label={`Khám phá ${clue.title}`}>
          {clue.explorationFacts.map((fact, index) => (
            <button
              key={fact.name}
              type="button"
              className={`terrain-zone-btn ${selectedIndex === index ? 'terrain-zone-btn--active' : ''}`}
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
            >
              <Icon size={16} aria-hidden="true" />
              <div><strong>{fact.name}</strong><small>{fact.tag}</small></div>
            </button>
          ))}
        </div>
        <div className="terrain-zone-card" aria-live="polite" aria-atomic="true">
          <div className="terrain-zone-card__header">
            <Layers size={18} aria-hidden="true" />
            <h4>{selected.name}</h4>
          </div>
          <p>{selected.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function ClueExploration({
  discoveredClues = new Set(),
  onDiscoverClue,
  onComplete,
}) {
  const [activeClueId, setActiveClueId] = useState('thuy-trieu');

  const activeClue = clues.find((c) => c.id === activeClueId) || clues[0];
  const discoveredCount = discoveredClues.size;
  const allDiscovered = discoveredCount === clues.length;

  const handleSelectClue = (clueId) => {
    setActiveClueId(clueId);
    if (!discoveredClues.has(clueId) && onDiscoverClue) {
      onDiscoverClue(clueId);
    }
  };

  return (
    <div className="clue-exploration">
      {/* Top Bar: Progress & Instructions */}
      <div className="clue-exploration__topbar">
        <div className="clue-exploration__title-wrap">
          <div className="clue-exploration__icon-badge">
            <Compass size={22} />
          </div>
          <div>
            <h2 className="clue-exploration__title">Bản Đồ Thu Thập Dấu Vết</h2>
            <p className="clue-exploration__subtitle">
              Khám phá cả 4 dấu vết lịch sử trên sông Bạch Đằng để giải mã chiến thuật của Ngô Quyền
            </p>
          </div>
        </div>

        {/* Discovery Progress Meter */}
        <div className="clue-meter">
          <div className="clue-meter__header">
            <span className="clue-meter__label">Dấu Vết đã giải mã:</span>
            <span className="clue-meter__count">
              <strong>{discoveredCount}</strong> / {clues.length}
            </span>
          </div>
          <div className="clue-meter__track">
            <div
              className="clue-meter__fill"
              style={{ width: `${(discoveredCount / clues.length) * 100}%` }}
            />
          </div>
          <div className="clue-meter__points">
            Điểm tích lũy: +{discoveredCount * scoring.cluePoints} / 40 điểm
          </div>
        </div>

        {/* Companion Mascot */}
        <div className="clue-mascot-companion">
          <AnimatedMascot
            variant="idle"
            size="small"
            message={allDiscovered ? "Bạn đã tìm đủ 4 dấu vết! Hãy tiến vào đặt giả thuyết nào!" : "Quan sát kỹ từng dấu vết trên sa bàn nhé!"}
            interactive={true}
          />
        </div>
      </div>

      {/* Main Grid: Interactive Map + Active Clue Detail Panel */}
      <div className="clue-exploration__layout">
        {/* Left Column: Interactive Strategic Map View */}
        <div className="clue-map-panel">
          <div className="clue-map-panel__header">
            <div className="clue-map-panel__tag">
              <MapPin size={16} />
              <span>Sa bàn chiến trường Bạch Đằng (Năm 938)</span>
            </div>
            <span className="clue-map-panel__hint">Nhấn vào từng Dấu Vết để mở khóa</span>
          </div>

          {/* Interactive Map Viewport */}
          <div className="historical-map">
            {/* River flow visualization overlay */}
            <div className="historical-map__river">
              <div className="historical-map__current historical-map__current--1" />
              <div className="historical-map__current historical-map__current--2" />
              <span className="historical-map__river-label">Dòng Sông Bạch Đằng</span>
            </div>

            {/* Geographical Markers */}
            <div className="historical-map__geo-tag historical-map__geo-tag--sea">
              Cửa Biển (Nam Hán tiến vào) →
            </div>
            <div className="historical-map__geo-tag historical-map__geo-tag--upstream">
              ← Thượng nguồn sông
            </div>

            {/* 4 Clue Markers placed at coordinates */}
            {clues.map((clue) => {
              const IconComponent = clueIconMap[clue.icon] || Compass;
              const isDiscovered = discoveredClues.has(clue.id);
              const isActive = activeClueId === clue.id;

              return (
                <button
                  key={clue.id}
                  type="button"
                  className={`clue-marker clue-marker--${clue.id} ${
                    isActive ? 'clue-marker--active' : ''
                  } ${isDiscovered ? 'clue-marker--discovered' : ''}`}
                  style={{
                    left: `${clue.position.x}%`,
                    top: `${clue.position.y}%`,
                  }}
                  onClick={() => handleSelectClue(clue.id)}
                  aria-label={`Dấu vết ${clue.number}: ${clue.title}`}
                >
                  <div className="clue-marker__pulse" />
                  <div className="clue-marker__bubble">
                    <span className="clue-marker__number">{clue.number}</span>
                    <IconComponent size={18} className="clue-marker__icon" />
                    {isDiscovered && (
                      <CheckCircle2 size={14} className="clue-marker__check" />
                    )}
                  </div>
                  <span className="clue-marker__title">{clue.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Clue Selector Tabs (Accessible on Mobile) */}
          <div className="clue-tabs">
            {clues.map((clue) => {
              const IconComponent = clueIconMap[clue.icon] || Compass;
              const isDiscovered = discoveredClues.has(clue.id);
              const isActive = activeClueId === clue.id;

              return (
                <button
                  key={clue.id}
                  type="button"
                  className={`clue-tab ${isActive ? 'clue-tab--active' : ''} ${
                    isDiscovered ? 'clue-tab--discovered' : ''
                  }`}
                  onClick={() => handleSelectClue(clue.id)}
                >
                  <div className="clue-tab__icon">
                    <IconComponent size={16} />
                  </div>
                  <div className="clue-tab__info">
                    <span className="clue-tab__num">Dấu Vết 0{clue.number}</span>
                    <span className="clue-tab__name">{clue.title}</span>
                  </div>
                  {isDiscovered ? (
                    <span className="clue-tab__status clue-tab__status--done">
                      <CheckCircle2 size={16} />
                    </span>
                  ) : (
                    <span className="clue-tab__status">Chưa xem</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Clue Content & Unique Interactive Module */}
        <div className={`clue-detail-panel card card--historical ${activeClue.id === 'thuy-trieu' ? 'clue-detail-panel--panoramic' : ''}`}>
          {/* Active Clue Header */}
          <div className="clue-detail-panel__header">
            <div className="clue-detail-panel__meta">
              <span className="clue-detail-panel__number">
                DẤU VẾT 0{activeClue.number} / 04
              </span>
              <h3 className="clue-detail-panel__title">{activeClue.title}</h3>
              <p className="clue-detail-panel__short-desc">
                {activeClue.shortDescription}
              </p>
            </div>

            {discoveredClues.has(activeClue.id) ? (
              <div className="clue-detail-panel__badge clue-detail-panel__badge--found">
                <CheckCircle2 size={16} />
                <span>Đã khám phá (+10 điểm)</span>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn--small btn--gold"
                onClick={() => handleSelectClue(activeClue.id)}
              >
                <Eye size={14} />
                Xác nhận đã xem
              </button>
            )}
          </div>

          {/* Historical Description Card */}
          <div className="clue-detail-panel__body">
            <div className="clue-text-box">
              <p className="clue-text-box__full">{activeClue.fullDescription}</p>
              <div className="clue-text-box__detail">
                <Info size={16} className="clue-text-box__info-icon" />
                <p>{activeClue.detail}</p>
              </div>
            </div>

            {/* Clue-Specific Unique Interaction */}
            <div className="clue-interactive-zone">
              <div className="clue-interactive-zone__header">
                <Sparkles size={16} className="clue-interactive-zone__sparkle" />
                <span>Thực hành tương tác mô phỏng</span>
              </div>

              {/* CLUE 1: THỦY TRIỀU INTERACTION */}
              {activeClue.id === 'thuy-trieu' && (
                <div className="clue-sub-interaction clue-sub-interaction--tide">
                  <TideInteraction />
                </div>
              )}

              {activeClue.interactionType === 'facts' && (
                <ClueFactExplorer key={activeClue.id} clue={activeClue} />
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar: Shows completion status and forward navigation */}
      <div className="clue-exploration__bottom-action">
        <div className="clue-exploration__bottom-status">
          {allDiscovered ? (
            <div className="clue-success-pill">
              <CheckCircle2 size={20} />
              <span>Tuyệt vời! Bạn đã mở khóa toàn bộ 4 Dấu Vết (+40 điểm). Sẵn sàng kiểm tra suy luận!</span>
            </div>
          ) : (
            <div className="clue-pending-pill">
              <Info size={18} />
              <span>
                Còn {clues.length - discoveredCount} Dấu Vết chưa khám phá. Hãy chọn trên bản đồ để tiếp tục.
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn--primary btn--large clue-exploration__next-btn"
          disabled={!allDiscovered}
          onClick={onComplete}
        >
          <span>Tiến vào Bước Đặt Giả Thuyết</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
