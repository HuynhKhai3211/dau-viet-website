import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Clock,
  Award,
  Star,
  TrendingUp,
  Zap,
  Flame,
  Snowflake,
  Gift,
  Palette,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  ShieldAlert,
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import IslandShowcase from '../components/explore/IslandShowcase';
import LearningJourney from '../components/explore/LearningJourney';
import useScrollReveal from '../hooks/useScrollReveal';

import {
  historicalPeriods,
  islandLevels,
} from '../data/historicalPeriods';
import { gamificationFeatures, energySystem } from '../data/gamification';
import '../styles/pages/explore.css';

// Icon mapping for gamification features
const gamificationIconMap = {
  Star,
  TrendingUp,
  Award,
  Zap,
  Flame,
  Snowflake,
  Gift,
  Palette,
};

export default function ExplorePage() {
  const [heroRef, heroRevealed] = useScrollReveal(0.1);
  const [flowRef, flowRevealed] = useScrollReveal(0.12);
  const [timelineRef, timelineRevealed] = useScrollReveal(0.12);
  const [islandRef, islandRevealed] = useScrollReveal(0.12);
  const [gamifyRef, gamifyRevealed] = useScrollReveal(0.12);
  const [ctaRef, ctaRevealed] = useScrollReveal(0.15);

  // Selected period state (all open by default or toggleable)
  const [expandedPeriods, setExpandedPeriods] = useState({
    'au-lac': true,
    'hai-ba-trung': false,
    'ly-bi-van-xuan': false,
    'ngo-quyen-bach-dang': true,
  });

  const togglePeriod = (id) => {
    setExpandedPeriods((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  return (
    <div className="explore-page">
      {/* 1. Hero Banner */}
      <section
        ref={heroRef}
        className={`explore-hero ${heroRevealed ? 'revealed' : ''}`}
        aria-label="Giới thiệu khám phá Dấu Việt"
      >
        <div className="container explore-hero__container">
          <div className="explore-hero__badge">
            <Compass size={16} aria-hidden="true" />
            <span>Hệ thống học tập tương tác</span>
          </div>
          <h1 className="explore-hero__title">Khám phá Dấu Việt</h1>
          <p className="explore-hero__subtitle">
            Khám phá quy trình học tập 10 bước độc đáo, du hành qua 4 thời kỳ lịch sử
            hào hùng và kiến tạo vương quốc tri thức trên hòn đảo của riêng bạn.
          </p>
          <div className="explore-hero__quick-nav">
            <a href="#learning-flow" className="explore-hero__nav-link">
              Lộ trình 10 bước
            </a>
            <span aria-hidden="true">•</span>
            <a href="#historical-timeline" className="explore-hero__nav-link">
              Dòng thời gian
            </a>
            <span aria-hidden="true">•</span>
            <a href="#personal-island" className="explore-hero__nav-link">
              Hòn đảo cá nhân
            </a>
            <span aria-hidden="true">•</span>
            <a href="#gamification" className="explore-hero__nav-link">
              Hệ thống Gamification
            </a>
          </div>
        </div>
      </section>

      {/* 2. Learning Flow Section */}
      <section
        id="learning-flow"
        ref={flowRef}
        className={`section explore-flow ${flowRevealed ? 'revealed' : ''}`}
        aria-label="Quy trình học tập tương tác"
      >
        <div className="container">
          <SectionHeader
            title="Quy trình học tập tương tác"
            subtitle="Hành trình 10 bước biến mỗi sự kiện lịch sử thành một cuộc điều tra hấp dẫn"
          />

          <LearningJourney />
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="divider" role="presentation">
        <span className="divider__icon">❖</span>
      </div>

      {/* 3. Historical Timeline */}
      <section
        id="historical-timeline"
        ref={timelineRef}
        className={`section section--alt explore-timeline ${timelineRevealed ? 'revealed' : ''}`}
        aria-labelledby="timeline-heading"
      >
        <div className="container">
          <SectionHeader
            title="Dòng thời gian các thời kỳ"
            subtitle="Bốn cột mốc lịch sử hào hùng mở ra chiều dài dựng nước và giữ nước"
          />

          <div className="explore-timeline__track">
            {historicalPeriods.map((period, index) => {
              const isExpanded = !!expandedPeriods[period.id];

              return (
                <div
                  key={period.id}
                  className={`explore-timeline__item ${
                    isExpanded ? 'explore-timeline__item--expanded' : ''
                  }`}
                >
                  <div className="explore-timeline__node">
                    <span
                      className="explore-timeline__bullet"
                      style={{ backgroundColor: period.color }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="explore-timeline__card-wrap">
                    <article
                      className="card card--historical explore-timeline__card"
                      style={{ borderTopColor: period.color }}
                    >
                      <button
                        type="button"
                        className="explore-timeline__card-header"
                        onClick={() => togglePeriod(period.id)}
                        aria-expanded={isExpanded}
                      >
                        <div className="explore-timeline__heading-content">
                          <span className="explore-timeline__era-badge">
                            <Clock size={14} aria-hidden="true" style={{ color: period.color }} />
                            <span>{period.era}</span>
                          </span>
                          <div className="explore-timeline__tag" style={{ color: period.color }}>
                            {period.theme}
                          </div>
                          <h3 className="explore-timeline__title">{period.title}</h3>
                          <p className="explore-timeline__short-desc">
                            {period.shortDescription}
                          </p>
                        </div>
                        <span className="explore-timeline__chevron" aria-hidden="true">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="explore-timeline__card-content">
                          <p className="explore-timeline__full-desc">{period.description}</p>

                          <div className="explore-timeline__events">
                            <h4 className="explore-timeline__events-title">
                              Các sự kiện then chốt:
                            </h4>
                            <ul className="explore-timeline__events-list">
                              {period.events.map((evt, idx) => (
                                <li key={idx} className="explore-timeline__event-item">
                                  <span
                                    className="explore-timeline__event-dot"
                                    style={{ backgroundColor: period.color }}
                                  />
                                  <span>{evt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {period.hasDemo && (
                            <div className="explore-timeline__demo-banner">
                              <div>
                                <strong className="explore-timeline__demo-title">
                                  ★ Bản thử nghiệm có sẵn
                                </strong>
                                <p className="explore-timeline__demo-text">
                                  Bạn có thể trực tiếp trải nghiệm sự kiện Trận thủy chiến Bạch Đằng ngay hôm nay!
                                </p>
                              </div>
                              <Link to="/demo" className="btn btn--primary btn--small">
                                <span>Trải nghiệm ngay</span>
                                <ArrowRight size={16} aria-hidden="true" />
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="divider" role="presentation">
        <span className="divider__icon">❖</span>
      </div>

      {/* 4. Personal Island Section */}
      <section
        id="personal-island"
        ref={islandRef}
        className={`section explore-island ${islandRevealed ? 'revealed' : ''}`}
        aria-labelledby="island-heading"
      >
        <div className="container">
          <SectionHeader
            title="Hòn đảo cá nhân"
            subtitle="Không gian sinh động nơi thành quả học tập lịch sử của bạn được hiện thực hóa"
          />

          <IslandShowcase initialIslandId="small" />
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="divider" role="presentation">
        <span className="divider__icon">❖</span>
      </div>

      {/* 5. Gamification Section */}
      <section
        id="gamification"
        ref={gamifyRef}
        className={`section section--alt explore-gamify ${gamifyRevealed ? 'revealed' : ''}`}
        aria-labelledby="gamify-heading"
      >
        <div className="container">
          <SectionHeader
            title="Hệ thống Gamification & Năng lượng"
            subtitle="Khích lệ thói quen học tập bền bỉ mỗi ngày qua cơ chế phần thưởng trực quan"
          />

          {/* Gamification feature cards grid */}
          <div className="explore-gamify__cards-grid">
            {gamificationFeatures.map((item) => {
              const IconComp = gamificationIconMap[item.icon] || Star;
              return (
                <div key={item.id} className="card card--historical explore-gamify-card">
                  <div
                    className="explore-gamify-card__icon"
                    style={{ color: item.color }}
                    aria-hidden="true"
                  >
                    <IconComp size={24} />
                  </div>
                  <h3 className="explore-gamify-card__title">{item.title}</h3>
                  <p className="explore-gamify-card__desc">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Detailed Energy System Panel */}
          <div className="explore-energy card card--historical">
            <div className="explore-energy__header">
              <div className="explore-energy__badge">
                <Zap size={18} aria-hidden="true" />
                <span>Hệ thống năng lượng hằng ngày</span>
              </div>
              <h3 className="explore-energy__title">Quản lý thể lực học tập</h3>
              <p className="explore-energy__desc">
                Nhằm giúp người học duy trì khả năng tập trung tốt nhất và tránh học dồn
                quá tải, Dấu Việt áp dụng cơ chế năng lượng lành mạnh với{' '}
                <strong>{energySystem.dailyEnergy} điểm năng lượng/ngày</strong>.
              </p>
            </div>

            <div className="explore-energy__details-grid">
              <div className="explore-energy__stats">
                <div className="explore-energy__stat-box">
                  <span className="explore-energy__stat-val">{energySystem.dailyEnergy}</span>
                  <span className="explore-energy__stat-label">Năng lượng tối đa mỗi ngày</span>
                </div>
                <div className="explore-energy__stat-box">
                  <span className="explore-energy__stat-val">30 ph</span>
                  <span className="explore-energy__stat-label">Hồi phục 1 điểm tự động</span>
                </div>
                <div className="explore-energy__stat-box">
                  <span className="explore-energy__stat-val">3 lượt</span>
                  <span className="explore-energy__stat-label">Đóng băng chuỗi (Streak Freeze)</span>
                </div>
              </div>

              <div className="explore-energy__table-wrap">
                <h4 className="explore-energy__table-title">Mức tiêu hao theo hoạt động</h4>
                <table className="explore-energy__table">
                  <thead>
                    <tr>
                      <th scope="col">Hoạt động học tập</th>
                      <th scope="col">Mức tiêu hao</th>
                    </tr>
                  </thead>
                  <tbody>
                    {energySystem.activities.map((act, idx) => (
                      <tr key={idx}>
                        <td>{act.name}</td>
                        <td className="explore-energy__cost">
                          <span className="explore-energy__cost-badge">
                            <Zap size={13} aria-hidden="true" /> -{act.cost}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Non-commercial notice */}
            <div className="explore-energy__notice">
              <ShieldAlert size={20} className="explore-energy__notice-icon" aria-hidden="true" />
              <div>
                <strong>Chính sách phi thương mại:</strong>
                <span>
                  {' '}Toàn bộ hệ thống năng lượng, điểm Dấu Việt, XP và vật phẩm trong ứng dụng
                  đều được tích lũy hoàn toàn qua việc học. Dự án <em>không hỗ trợ</em> nạp tiền
                  hay mua bán bất kỳ vật phẩm nào bằng tiền thật.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section
        ref={ctaRef}
        className={`section explore-cta-section ${ctaRevealed ? 'revealed' : ''}`}
        aria-label="Trải nghiệm thử"
      >
        <div className="container">
          <div className="explore-cta card card--historical">
            <h2 className="explore-cta__title">Bắt đầu hành trình của bạn ngay bây giờ</h2>
            <p className="explore-cta__desc">
              Tham gia bản thử nghiệm Bạch Đằng 938 để tự mình trải nghiệm cơ chế tìm kiếm
              dấu vết, đặt giả thuyết và tái hiện trang sử hào hùng của Đại Việt.
            </p>
            <div className="explore-cta__actions">
              <Link to="/demo" className="btn btn--primary btn--large">
                <span>Vào phòng trải nghiệm Demo</span>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
