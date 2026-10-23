import { useState } from 'react';
import {
  Waves,
  TreePine,
  Mountain,
  Swords,
  CheckCircle2,
  Compass,
  ArrowRight,
  ChevronRight,
  Eye,
  Info,
  MapPin,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react';
import { clues, scoring } from '../../data/bachDangDemo';
import TideInteraction from './TideInteraction';
import AnimatedMascot from '../common/AnimatedMascot';

// Icon map for clues
const clueIconMap = {
  Waves,
  TreePine,
  Mountain,
  Swords,
};

export default function ClueExploration({
  discoveredClues = new Set(),
  onDiscoverClue,
  onComplete,
}) {
  const [activeClueId, setActiveClueId] = useState('thuy-trieu');
  const [activeExamineHotspot, setActiveExamineHotspot] = useState(1);
  const [activeTerrainZone, setActiveTerrainZone] = useState('zone-stakes');
  const [tacticalStep, setTacticalStep] = useState(1);

  const activeClue = clues.find((c) => c.id === activeClueId) || clues[0];
  const discoveredCount = discoveredClues.size;
  const allDiscovered = discoveredCount === clues.length;

  const handleSelectClue = (clueId) => {
    setActiveClueId(clueId);
    if (!discoveredClues.has(clueId) && onDiscoverClue) {
      onDiscoverClue(clueId);
    }
  };

  // Hotspots for Clue 2: Bãi cọc gỗ
  const stakeHotspots = [
    {
      id: 1,
      title: 'Đầu cọc vạt nhọn bọc sắt',
      badge: 'Vũ khí xuyên phá',
      detail:
        'Cọc gỗ được đẽo vát chéo thật sắc bén, bịt đầu bằng mũi sắt nhọn hoắt. Khi thuyền chiến Nam Hán lao tới hoặc bị nước rút hạ xuống, mũi sắt này sẽ xé toạc đáy ván thuyền làm nước tràn vào dữ dội.',
    },
    {
      id: 2,
      title: 'Thân cọc cắm xiên 45° - 60°',
      badge: 'Góc nghiêng hiểm ác',
      detail:
        'Tất cả các cọc gỗ đều được đóng xiên xuôi theo chiều nước chảy ra biển. Khi thuyền địch rút lui theo con nước, thân cọc đóng vai trò như những chiếc nêm chĩa thẳng vào mũi và lườn thuyền, cản phá hoàn toàn khả năng di chuyển.',
    },
    {
      id: 3,
      title: 'Gỗ Lim & Táu ngâm ngập bùn',
      badge: 'Độ bền vĩnh cửu',
      detail:
        'Quân dân Ngô Quyền đã đốn hạ hàng nghìn cây gỗ lim, táu từ rừng thượng nguồn đưa về. Đây là loại thiết mộc nặng, ngâm trong bùn lầy không hề mục nát, cắm sâu 1.5 - 2m xuống lòng sông chịu được lực va đập hàng chục tấn.',
    },
  ];

  // Zones for Clue 3: Địa hình sông Bạch Đằng
  const terrainZones = [
    {
      id: 'zone-sea',
      name: 'Vùng Cửa Biển (Cửa Nam Triệu)',
      tag: 'Nơi quân giặc tiến vào',
      desc: 'Cửa biển rộng mênh mông, thông thoáng. Hoàng tử Hoằng Thao chủ quan nghĩ đây là tuyến thủy đạo an toàn để tiến thẳng vào nội địa Giao Châu.',
    },
    {
      id: 'zone-forest',
      name: 'Các Rạch Lạc & Rừng Sú Vẹt Ven Sông',
      tag: 'Cứ điểm mai phục',
      desc: 'Hai bên bờ sông Bạch Đằng thời bấy giờ rậm rạp cây ngập mặn với nhiều nhánh sông con uốn khúc. Ngô Quyền đã bí mật giấu hàng trăm chiến thuyền nhẹ và binh sĩ dũng cảm tại đây.',
    },
    {
      id: 'zone-stakes',
      name: 'Eo Sông Lòng Chảo (Trận Địa Cọc)',
      tag: 'Tọa độ phục kích tử huyệt',
      desc: 'Đoạn sông thắt hẹp lại trước khi đổ ra biển, nơi có bãi cọc ngầm ngự trị. Dòng nước tại eo sông chảy xiết nhất khi triều rút, đẩy thuyền địch đâm thẳng vào bẫy cọc.',
    },
  ];

  // Steps for Clue 4: Chiến thuật của Ngô Quyền
  const battleStrategySteps = [
    {
      step: 1,
      name: 'Nắm Bắt Thiên Thời',
      time: 'Trước trận đánh',
      action: 'Nghiên cứu chu kỳ con nước sông Bạch Đằng để chọn đúng thời khắc triều lên - triều xuống trong ngày.',
    },
    {
      step: 2,
      name: 'Xây Dựng Trận Địa Cọc Ngầm',
      time: 'Chuẩn bị bí mật',
      action: 'Đóng cọc nhọn bọc sắt tại khúc sông hiểm trở lúc triều kiệt; khi triều dâng ngập, toàn bộ bãi cọc được ngụy trang hoàn hảo.',
    },
    {
      step: 3,
      name: 'Khiêu Chiến & Giả Thua',
      time: 'Lúc triều lên cao',
      action: 'Dùng thuyền nhẹ ra cửa biển khiêu chiến, nhử hạm đội Nam Hán hăng máu vượt qua bãi cọc ngầm mà không hề hay biết.',
    },
    {
      step: 4,
      name: 'Tổng Phản Công Khi Nước Rút',
      time: 'Lúc triều rút xiết',
      action: 'Ngô Quyền hạ lệnh quay đầu phản công kịch liệt; thuyền địch quay đầu tháo chạy thì mắc cạn trên bãi cọc nhô lên và tan vỡ hoàn toàn.',
    },
  ];

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

              {/* CLUE 2: BÃI CỌC GỖ EXAMINE INTERACTION */}
              {activeClue.id === 'bai-coc' && (
                <div className="clue-sub-interaction clue-sub-interaction--examine">
                  <div className="stake-visualizer">
                    <div className="stake-visualizer__diagram">
                      <div className="stake-schematic">
                        {/* Iron Head */}
                        <button
                          type="button"
                          className={`stake-schematic__part stake-schematic__part--head ${
                            activeExamineHotspot === 1 ? 'stake-schematic__part--selected' : ''
                          }`}
                          onClick={() => setActiveExamineHotspot(1)}
                        >
                          <span className="stake-schematic__label">1. Mũi sắt nhọn hoắt</span>
                        </button>
                        {/* Wooden Body */}
                        <button
                          type="button"
                          className={`stake-schematic__part stake-schematic__part--body ${
                            activeExamineHotspot === 2 ? 'stake-schematic__part--selected' : ''
                          }`}
                          onClick={() => setActiveExamineHotspot(2)}
                        >
                          <span className="stake-schematic__label">2. Góc cắm nghiêng 45°-60°</span>
                        </button>
                        {/* Mud Root */}
                        <button
                          type="button"
                          className={`stake-schematic__part stake-schematic__part--base ${
                            activeExamineHotspot === 3 ? 'stake-schematic__part--selected' : ''
                          }`}
                          onClick={() => setActiveExamineHotspot(3)}
                        >
                          <span className="stake-schematic__label">3. Gốc chôn sâu 2m trong bùn</span>
                        </button>
                      </div>
                    </div>

                    {/* Hotspot details selector */}
                    <div className="stake-visualizer__details">
                      <div className="stake-hotspot-nav">
                        {stakeHotspots.map((h) => (
                          <button
                            key={h.id}
                            type="button"
                            className={`stake-hotspot-btn ${
                              activeExamineHotspot === h.id ? 'stake-hotspot-btn--active' : ''
                            }`}
                            onClick={() => setActiveExamineHotspot(h.id)}
                          >
                            <span>Điểm {h.id}</span>
                            <small>{h.badge}</small>
                          </button>
                        ))}
                      </div>

                      {(() => {
                        const currentHotspot =
                          stakeHotspots.find((h) => h.id === activeExamineHotspot) ||
                          stakeHotspots[0];
                        return (
                          <div className="stake-hotspot-card">
                            <h4 className="stake-hotspot-card__title">
                              {currentHotspot.title}
                            </h4>
                            <p className="stake-hotspot-card__text">
                              {currentHotspot.detail}
                            </p>
                            <div className="stake-hotspot-card__spec">
                              <span>Số đo thực tế khai quật tại Yên Hưng:</span> Dài 2.6m - 3.2m, đường kính 20 - 30cm.
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* CLUE 3: ĐỊA HÌNH SÔNG BẠCH ĐẰNG MAP INTERACTION */}
              {activeClue.id === 'dia-hinh' && (
                <div className="clue-sub-interaction clue-sub-interaction--terrain">
                  <div className="terrain-explorer">
                    <div className="terrain-zone-nav">
                      {terrainZones.map((z) => (
                        <button
                          key={z.id}
                          type="button"
                          className={`terrain-zone-btn ${
                            activeTerrainZone === z.id ? 'terrain-zone-btn--active' : ''
                          }`}
                          onClick={() => setActiveTerrainZone(z.id)}
                        >
                          <Mountain size={16} />
                          <div>
                            <strong>{z.name}</strong>
                            <small>{z.tag}</small>
                          </div>
                        </button>
                      ))}
                    </div>

                    {(() => {
                      const curZone =
                        terrainZones.find((z) => z.id === activeTerrainZone) ||
                        terrainZones[0];
                      return (
                        <div className="terrain-zone-card">
                          <div className="terrain-zone-card__header">
                            <Layers size={18} />
                            <h4>Phân tích chiến sự: {curZone.name}</h4>
                          </div>
                          <p>{curZone.desc}</p>
                          <div className="terrain-zone-card__advantage">
                            <strong>Lợi thế chiến lược của Đại Việt:</strong> Địa hình hiểm trở cho phép phân tán lực lượng mai phục sát nách địch mà không bị phát giác trước giờ nổ súng.
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* CLUE 4: CHIẾN THUẬT TỔNG LỰC SEQUENCE INTERACTION */}
              {activeClue.id === 'chien-thuat' && (
                <div className="clue-sub-interaction clue-sub-interaction--strategy">
                  <div className="strategy-stepper">
                    <div className="strategy-stepper__tabs">
                      {battleStrategySteps.map((s) => (
                        <button
                          key={s.step}
                          type="button"
                          className={`strategy-tab ${
                            tacticalStep === s.step ? 'strategy-tab--active' : ''
                          }`}
                          onClick={() => setTacticalStep(s.step)}
                        >
                          <span className="strategy-tab__step">Bước {s.step}</span>
                          <span className="strategy-tab__name">{s.name}</span>
                        </button>
                      ))}
                    </div>

                    {(() => {
                      const curStep =
                        battleStrategySteps.find((s) => s.step === tacticalStep) ||
                        battleStrategySteps[0];
                      return (
                        <div className="strategy-content-card">
                          <div className="strategy-content-card__meta">
                            <span className="strategy-content-card__time">
                              <Clock size={15} /> {curStep.time}
                            </span>
                            <span className="strategy-content-card__phase">
                              Giai đoạn {curStep.step}/4
                            </span>
                          </div>
                          <h4 className="strategy-content-card__title">
                            {curStep.name}
                          </h4>
                          <p className="strategy-content-card__action">
                            {curStep.action}
                          </p>

                          <div className="strategy-content-card__controls">
                            <button
                              type="button"
                              className="btn btn--secondary btn--small"
                              disabled={tacticalStep === 1}
                              onClick={() => setTacticalStep((prev) => Math.max(1, prev - 1))}
                            >
                              Bước trước
                            </button>
                            <button
                              type="button"
                              className="btn btn--primary btn--small"
                              disabled={tacticalStep === 4}
                              onClick={() => setTacticalStep((prev) => Math.min(4, prev + 1))}
                            >
                              Bước tiếp theo
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
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
