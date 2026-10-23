import React, { useState, useEffect } from 'react';
import { Palmtree, Sparkles, CheckCircle, ShieldCheck, Layers } from 'lucide-react';
import { personalIslands } from '../../data/islands';
import '../../styles/components/islandShowcase.css';

/**
 * IslandShowcase Component
 * Trưng bày hệ thống 3 Hòn đảo cá nhân chính thức của Dấu Việt:
 * 1. Đảo Nhỏ (island-small.jpg) - Có sẵn từ ban đầu
 * 2. Đảo Vừa (island-medium.jpg) - Mở khóa khi hoàn thành các sự kiện lịch sử theo yêu cầu
 * 3. Đảo Lớn (island-large.png) - Mở khóa khi hoàn thành thêm các sự kiện lịch sử tiếp theo
 *
 * @param {Object} props
 * @param {string} [props.initialIslandId='small'] - ID đảo mặc định khi tải ('small' | 'medium' | 'large')
 * @param {string} [props.className=''] - Lớp CSS tùy biến bổ sung
 * @param {boolean} [props.showCaption=true] - Hiển thị dòng chú thích bên dưới hình ảnh
 */
export default function IslandShowcase({
  initialIslandId = 'small',
  className = '',
  showCaption = true,
}) {
  const [selectedId, setSelectedId] = useState(initialIslandId);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIsland, setDisplayIsland] = useState(() => {
    return personalIslands.find((isl) => isl.id === initialIslandId) || personalIslands[0];
  });

  // Xử lý chuyển đổi mượt mà giữa các hòn đảo (fade & subtle scale)
  const handleSelectIsland = (id) => {
    if (id === selectedId) return;
    setIsTransitioning(true);
    setSelectedId(id);

    const nextIsland = personalIslands.find((isl) => isl.id === id) || personalIslands[0];
    setTimeout(() => {
      setDisplayIsland(nextIsland);
      setIsTransitioning(false);
    }, 180);
  };

  // Cập nhật khi prop initialIslandId thay đổi
  useEffect(() => {
    if (initialIslandId && initialIslandId !== selectedId) {
      setSelectedId(initialIslandId);
      const target = personalIslands.find((isl) => isl.id === initialIslandId) || personalIslands[0];
      setDisplayIsland(target);
    }
  }, [initialIslandId]);

  return (
    <div className={`island-showcase-container ${className}`}>
      <div className="island-showcase-grid">
        {/* ===================================================================
            CỘT HÌNH ẢNH: Trưng bày đảo lớn với tỉ lệ chuẩn, không crop/méo
            =================================================================== */}
        <div className="island-showcase__visual">
          <div className="island-showcase__card">
            <div className="island-showcase__water-glow" aria-hidden="true" />

            {/* Badge thông tin cấp độ trên ảnh */}
            <div className="island-showcase__badge-top">
              <Palmtree size={15} aria-hidden="true" />
              <span>{displayIsland.title}</span>
            </div>

            {/* Badge trạng thái tiến độ mở khóa */}
            <div className="island-showcase__badge-bottom">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>{displayIsland.progression}</span>
            </div>

            {/* Khung hiển thị ảnh với object-fit: contain và tỉ lệ cố định ngăn giật layout */}
            <div className="island-showcase__image-stage">
              <img
                key={displayIsland.id}
                src={displayIsland.image}
                alt={displayIsland.alt}
                className={`island-showcase__image ${isTransitioning ? 'transitioning' : 'loaded'}`}
                loading="eager"
              />
            </div>
          </div>

          {showCaption && (
            <p className="island-showcase__caption">
              Hòn đảo cá nhân của bạn sẽ mở rộng diện tích tương ứng với hành trình khám phá và giải mã lịch sử.
            </p>
          )}
        </div>

        {/* ===================================================================
            CỘT ĐIỀU KHIỂN & THÔNG TIN: 3 Tabs đảo và chi tiết tiến độ
            =================================================================== */}
        <div className="island-showcase__info">
          {/* Header chọn 3 hòn đảo */}
          <div className="island-showcase__tabs-header">
            <span className="island-showcase__tabs-label">Chọn quy mô hòn đảo để xem trước:</span>
            <div
              className="island-showcase__tabs-group"
              role="tablist"
              aria-label="Chọn cấp độ hòn đảo cá nhân"
            >
              {personalIslands.map((island) => {
                const isActive = island.id === selectedId;
                return (
                  <button
                    key={island.id}
                    type="button"
                    role="tab"
                    id={`island-tab-${island.id}`}
                    aria-selected={isActive}
                    aria-controls={`island-panel-${island.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className={`island-showcase__tab-btn ${
                      isActive ? 'island-showcase__tab-btn--active' : ''
                    }`}
                    onClick={() => handleSelectIsland(island.id)}
                  >
                    <span className="island-showcase__tab-name">{island.title}</span>
                    <span className="island-showcase__tab-sub">{island.subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel thông tin chi tiết */}
          <div
            id={`island-panel-${displayIsland.id}`}
            role="tabpanel"
            aria-labelledby={`island-tab-${displayIsland.id}`}
            className="island-showcase__panel"
          >
            <div className="island-showcase__panel-top">
              <div className="island-showcase__title-wrap">
                <h3 className="island-showcase__title">{displayIsland.title}</h3>
                <span className="island-showcase__subtitle">{displayIsland.subtitle}</span>
              </div>
              <div className="island-showcase__requirement-badge">
                <Sparkles size={14} aria-hidden="true" />
                <span>{displayIsland.requirement}</span>
              </div>
            </div>

            <p className="island-showcase__description">{displayIsland.description}</p>

            <div className="island-showcase__features-wrap">
              <h4 className="island-showcase__features-title">
                <Layers size={16} aria-hidden="true" />
                <span>Đặc quyền và tiềm năng trang trí:</span>
              </h4>
              <ul className="island-showcase__features-list">
                {displayIsland.features.map((feature, idx) => (
                  <li key={idx} className="island-showcase__feature-item">
                    <CheckCircle size={15} className="island-showcase__feature-icon" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="island-showcase__tip-box">
              <Sparkles size={16} className="island-showcase__tip-icon" aria-hidden="true" />
              <p className="island-showcase__tip-text">
                {displayIsland.highlight} Cổ vật giải mã được như Trống đồng Đông Sơn, Cọc Bạch Đằng đều có thể tự do bài trí trên đảo!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
