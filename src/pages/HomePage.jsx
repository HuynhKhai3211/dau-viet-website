import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Map, Search, Brain, Puzzle, Palmtree, MapPin, BookOpen, CheckCircle,
  Award, Star, TrendingUp, Zap, Flame, Snowflake, Gift, Palette, Smartphone,
  ArrowRight, ChevronRight, Play, Sparkles, Compass, Shield, Check, Bell,
  Anchor, Waves, Info, Trophy
} from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import SectionHeader from '../components/common/SectionHeader';
import { features, featureIconMap } from '../data/features';
import { historicalPeriods, learningJourney, islandLevels } from '../data/historicalPeriods';
import { gamificationFeatures, energySystem } from '../data/gamification';
import AnimatedMascot from '../components/common/AnimatedMascot';
import IslandShowcase from '../components/explore/IslandShowcase';
import '../styles/pages/home.css';

// Vite watches this optional asset, including when it is first added.
const homeBackground = Object.values(import.meta.glob(
  '/public/images/backgrounds/heritage-background.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
))[0];

// Icon dictionary for data-driven icons
const iconDictionary = {
  Clock, Map, Search, Brain, Puzzle, Palmtree, MapPin, BookOpen,
  CheckCircle, Award, Star, TrendingUp, Zap, Flame, Snowflake, Gift, Palette, Smartphone
};

function DynamicIcon({ name, size = 24, className = '', color }) {
  const IconComponent = iconDictionary[name] || featureIconMap[name] || Sparkles;
  return <IconComponent size={size} className={className} style={color ? { color } : undefined} />;
}

/* =========================================================================
   1. HERO SECTION
   ========================================================================= */
function HeroSection() {
  const [heroRef, isHeroRevealed] = useScrollReveal(0.1);

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-decorations" aria-hidden="true">
        <span className="hero-ornament hero-ornament--1 float-animation"><Sparkles size={24} /></span>
        <span className="hero-ornament hero-ornament--2 float-animation--slow"><Compass size={28} /></span>
        <span className="hero-ornament hero-ornament--3 float-animation"><Anchor size={22} /></span>
        <span className="hero-ornament hero-ornament--4 float-animation--slow"><Trophy size={26} /></span>
        <div className="hero-bg-ring hero-bg-ring--outer" /><div className="hero-bg-ring hero-bg-ring--inner" />
      </div>

      <div className="container hero-container">
        <div className={`hero-content ${isHeroRevealed ? 'revealed' : ''}`}>
          <div className="hero-badge">
            <Sparkles size={16} className="hero-badge__icon" />
            <span>Nền tảng học lịch sử nhập vai thế hệ mới</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title__sub">DỰ ÁN GIÁO DỤC LỊCH SỬ</span>
            <span className="hero-title__main">DẤU VIỆT</span>
          </h1>

          <p className="hero-subtitle">Khám phá lịch sử Việt Nam theo cách của bạn</p>
          <p className="hero-description">
            Không còn học thuộc lòng khô khan. Dấu Việt mở ra cánh cổng lịch sử nơi bạn hóa thân
            thành nhà thám hiểm: lần theo các manh mối, giải mã câu đố, suy luận logic và tự tay
            tái hiện những trang sử hào hùng của dân tộc Việt Nam.
          </p>

          <div className="hero-actions">
            <Link to="/explore" className="btn btn--primary btn--large hero-btn-primary"><span>Khám phá Dấu Việt</span><ArrowRight size={20} /></Link>
            <Link to="/demo" className="btn btn--secondary btn--large hero-btn-secondary"><Play size={18} /><span>Trải nghiệm demo</span></Link>
          </div>

          <div className="hero-stats">
            {[
              { num: '4+', label: 'Thời kỳ lịch sử' },
              { num: '10', label: 'Bước khám phá' },
              { num: '3D', label: 'Sa bàn tương tác' }
            ].map((st, idx) => (
              <div key={idx} className="hero-stat-wrap">
                <div className="hero-stat-item"><span className="hero-stat-number">{st.num}</span><span className="hero-stat-label">{st.label}</span></div>
                {idx < 2 && <div className="hero-stat-divider" />}
              </div>
            ))}
          </div>
        </div>

        <div className={`hero-visual ${isHeroRevealed ? 'revealed' : ''}`}>
          <div className="hero-visual__frame">
            <div className="hero-visual__glow" />
            <img
              src="/images/historical/historical-diorama.png"
              alt="Mô hình sa bàn 3D Khởi nghĩa Bà Triệu năm 248 - Dấu Việt"
              className="hero-visual__image"
              loading="eager"
            />
            <div className="hero-visual__overlay">
              <div className="hero-visual__tag hero-visual__tag--top"><Shield size={16} /><span>Mô hình sa bàn 3D tương tác</span></div>
              <div className="hero-visual__tag hero-visual__tag--bottom"><Compass size={16} /><span>Khởi nghĩa Bà Triệu – Năm 248</span></div>
            </div>
          </div>

          {/* Official animated mascot — companion */}
          <div className="hero-mascot">
            <AnimatedMascot
              size="large"
              variant="idle"
              interactive={true}
              message="Xin chào! Mình là bé Sử. Cùng mình giải mã lịch sử Việt Nam nhé!"
            />
            <p className="hero-mascot__greeting">Xin chào mình là bé Sử !</p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* =========================================================================
   2. ABOUT PREVIEW SECTION
   ========================================================================= */
function AboutPreviewSection() {
  const [revealRef, isRevealed] = useScrollReveal(0.15);

  return (
    <section className="section section--alt about-preview-section" ref={revealRef}>
      <div className="container">
        <div className={`about-preview-grid ${isRevealed ? 'revealed' : ''}`}>
          <div className="about-preview-text">
            <div className="section-eyebrow"><Compass size={16} /><span>Phương pháp tiếp cận mới</span></div>
            <h2 className="about-preview-title">Lịch sử không chỉ là những mốc thời gian khô khan</h2>
            <p className="about-preview-lead">
              Tại Dấu Việt, chúng tôi tin rằng lịch sử không phải là việc ghi nhớ thụ động các sự
              kiện và năm tháng. Đó là cuộc hành trình thám hiểm sống động của tư duy và lòng tự hào dân tộc.
            </p>
            <p className="about-preview-desc">
              Thay vì học thuộc lòng từng trang sách giáo khoa, người học sẽ vào vai những nhà
              khảo cứu lịch sử: đối chiếu các nguồn tư liệu cổ, tìm kiếm hiện vật, phân tích bối cảnh
              địa lý và đưa ra lập luận của riêng mình. Từng trang sử trở nên gần gũi và sâu sắc.
            </p>

            <div className="about-preview-pillars">
              {[
                { num: '01', title: 'Chủ động khám phá', desc: 'Tự mình truy tìm manh mối trong bối cảnh không gian và thời gian chân thực.' },
                { num: '02', title: 'Rèn luyện tư duy phản biện', desc: 'Đặt giả thuyết, đối chiếu dữ kiện lịch sử để tìm ra sự thật khách quan.' },
                { num: '03', title: 'Khắc sâu tri thức', desc: 'Tự tay tái hiện diễn biến trận đánh và nhận phần thưởng phát triển hòn đảo.' },
              ].map((pillar) => (
                <div key={pillar.num} className="about-pillar-item">
                  <div className="about-pillar-number">{pillar.num}</div>
                  <div className="about-pillar-content">
                    <h4>{pillar.title}</h4>
                    <p>{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-preview-cta">
              <Link to="/about" className="btn btn--primary">
                <span>Tìm hiểu thêm về Dấu Việt</span><ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="about-preview-visual">
            <div className="about-scroll-card">
              <div className="about-scroll-card__inner">
                <div className="about-scroll-seal"><div className="about-scroll-seal__ring"><span>ẤN</span></div></div>
                <div className="about-scroll-header">
                  <span className="about-scroll-subtitle">TRIẾT LÝ HỌC TẬP</span>
                  <h3 className="about-scroll-motto">Dấu Vết Xưa – Tri Thức Mới</h3>
                </div>
                <div className="about-quote-box">
                  <p className="about-quote-text">&ldquo;Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam.&rdquo;</p>
                  <span className="about-quote-author">— Hồ Chí Minh</span>
                </div>
                <div className="about-scroll-badges">
                  {[
                    { icon: Search, label: 'Thu thập Dấu Vết' },
                    { icon: Brain, label: 'Suy luận logic' },
                    { icon: Puzzle, label: 'Tái hiện sử tích' },
                    { icon: Palmtree, label: 'Xây dựng đảo' }
                  ].map((b, idx) => {
                    const BIcon = b.icon;
                    return <div key={idx} className="about-scroll-badge"><BIcon size={18} /><span>{b.label}</span></div>;
                  })}
                </div>

                {/* Friendly Mascot Guide in About Card */}
                <div className="about-scroll-mascot">
                  <AnimatedMascot
                    size="medium"
                    variant="greeting"
                    message="Dấu Việt đồng hành cùng bạn trên từng trang sử!"
                    interactive={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   3. CORE FEATURES SECTION
   ========================================================================= */
function CoreFeaturesSection() {
  const [featuresRef, isRevealed] = useScrollReveal(0.1);

  return (
    <section id="tinh-nang" className="section features-section" ref={featuresRef}>
      <div className="container">
        <SectionHeader
          title="Tính năng cốt lõi"
          subtitle="Bộ công cụ học tập toàn diện kết hợp giữa nghiên cứu lịch sử chính xác và trải nghiệm tương tác trực quan"
        />

        <div className={`features-grid ${isRevealed ? 'revealed' : ''}`}>
          {features.map((feature, index) => {
            const IconComponent = featureIconMap[feature.icon] || Sparkles;
            return (
              <div
                key={feature.id}
                className={`card card--historical feature-card stagger-${(index % 6) + 1}`}
                style={{ '--feature-accent': feature.color }}
              >
                <div className="feature-card__icon-wrapper" style={{ backgroundColor: `${feature.color}18`, borderColor: feature.color }}>
                  <IconComponent size={28} style={{ color: feature.color }} />
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.description}</p>
                <div className="feature-card__footer">
                  <span className="feature-card__indicator" style={{ backgroundColor: feature.color }} />
                  <span className="feature-card__more">Khám phá chi tiết</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   4. LEARNING JOURNEY SECTION
   ========================================================================= */
function LearningJourneySection() {
  const [journeyRef, isRevealed] = useScrollReveal(0.1);

  return (
    <section className="section section--alt journey-section" ref={journeyRef}>
      <div className="container">
        <SectionHeader
          title="Hành trình khám phá lịch sử"
          subtitle="Chuỗi 10 chặng đường khép kín giúp bạn từ người mới bắt đầu trở thành nhà giải mã lịch sử tài ba"
        />

        <div className={`journey-path ${isRevealed ? 'revealed' : ''}`}>
          <div className="journey-line" aria-hidden="true" />
          {learningJourney.map((stepItem, index) => {
            const isEven = index % 2 === 1;
            return (
              <div key={stepItem.step} className={`journey-step ${isEven ? 'journey-step--right' : 'journey-step--left'}`}>
                <div className="journey-step__node">
                  <span className="journey-step__number">{stepItem.step < 10 ? `0${stepItem.step}` : stepItem.step}</span>
                </div>
                <div className="journey-step__card">
                  <div className="journey-step__card-header">
                    <div className="journey-step__icon-box"><DynamicIcon name={stepItem.icon} size={22} /></div>
                    <div>
                      <span className="journey-step__badge">Chặng {stepItem.step}</span>
                      <h4 className="journey-step__title">{stepItem.title}</h4>
                    </div>
                  </div>
                  <p className="journey-step__description">{stepItem.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   5. HISTORICAL PERIOD PREVIEW SECTION
   ========================================================================= */
function HistoricalPeriodSection() {
  const [periodRef, isRevealed] = useScrollReveal(0.1);

  return (
    <section className="section periods-section" ref={periodRef}>
      <div className="container">
        <SectionHeader
          title="Các thời kỳ lịch sử tiêu biểu"
          subtitle="Dấu Việt khởi đầu với 4 thời kỳ vàng son trong lịch sử dựng nước và giữ nước oanh liệt của dân tộc"
        />

        <div className={`periods-grid ${isRevealed ? 'revealed' : ''}`}>
          {historicalPeriods.map((period, index) => (
            <div key={period.id} className={`period-scroll-card stagger-${index + 1}`} style={{ '--period-color': period.color }}>
              <div className="period-scroll-card__header" style={{ background: period.bgGradient }}>
                <div className="period-scroll-card__badge-row">
                  <span className="period-scroll-card__era">{period.era}</span>
                  {period.hasDemo && (
                    <span className="period-scroll-card__demo-badge"><Sparkles size={12} /><span>Có bản demo</span></span>
                  )}
                </div>
                <h3 className="period-scroll-card__title">{period.title}</h3>
                <span className="period-scroll-card__theme">{period.theme}</span>
              </div>

              <div className="period-scroll-card__body">
                <p className="period-scroll-card__description">{period.shortDescription}</p>
                <div className="period-scroll-card__events">
                  <span className="period-events-title">Sự kiện tiêu biểu:</span>
                  <ul className="period-events-list">
                    {period.events.map((event, idx) => (
                      <li key={idx} className="period-event-pill"><Check size={14} className="period-event-check" /><span>{event}</span></li>
                    ))}
                  </ul>
                </div>

                <div className="period-scroll-card__action">
                  {period.hasDemo ? (
                    <Link to="/demo" className="btn btn--primary btn--small period-btn"><span>Chơi thử trận đánh</span><Play size={14} /></Link>
                  ) : (
                    <Link to="/explore" className="btn btn--secondary btn--small period-btn"><span>Khám phá thời kỳ</span><ChevronRight size={14} /></Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   6. PERSONAL ISLAND PREVIEW SECTION
   ========================================================================= */
function PersonalIslandSection() {
  const [islandRef, isRevealed] = useScrollReveal(0.1);

  return (
    <section className="section section--alt island-section" ref={islandRef}>
      <div className="container">
        <SectionHeader
          title="Hòn đảo cá nhân của riêng bạn"
          subtitle="Mỗi câu đố lịch sử giải mã được sẽ hóa thành phần thưởng xây dựng và mở rộng không gian hòn đảo tri thức"
        />

        <div className={`island-showcase-wrapper ${isRevealed ? 'revealed' : ''}`}>
          <IslandShowcase initialIslandId="small" />
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   7. GAMIFICATION PREVIEW SECTION
   ========================================================================= */
function GamificationSection() {
  const [gamifyRef, isRevealed] = useScrollReveal(0.1);

  return (
    <section className="section gamification-section" ref={gamifyRef}>
      <div className="container">
        <SectionHeader
          title="Học mà chơi – Hứng khởi từng ngày"
          subtitle="Hệ thống động lực phong phú biến mỗi phút học lịch sử thành một trải nghiệm thành tựu đáng nhớ"
        />

        <div className={`gamification-grid ${isRevealed ? 'revealed' : ''}`}>
          {gamificationFeatures.map((item, index) => (
            <div key={item.id} className={`game-card stagger-${(index % 4) + 1}`} style={{ '--game-color': item.color }}>
              <div className="game-card__icon" style={{ color: item.color }}><DynamicIcon name={item.icon} size={28} /></div>
              <h4 className="game-card__title">{item.title}</h4>
              <p className="game-card__description">{item.description}</p>
            </div>
          ))}
        </div>

        <div className={`energy-system-card ${isRevealed ? 'revealed' : ''}`}>
          <div className="energy-system-header">
            <div className="energy-icon-wrap"><Zap size={28} /></div>
            <div>
              <h3 className="energy-system-title">Hệ thống Năng lượng học tập (Energy)</h3>
              <p className="energy-system-subtitle">
                Mỗi ngày bạn được cấp <strong>{energySystem.dailyEnergy} năng lượng</strong>. Hồi phục: <strong>{energySystem.recoveryRate}</strong>.
              </p>
            </div>
          </div>

          <div className="energy-activities-grid">
            {energySystem.activities.map((act, idx) => (
              <div key={idx} className="energy-act-card">
                <span className="energy-act-name">{act.name}</span>
                <span className="energy-act-cost"><Zap size={14} /><span>-{act.cost}</span></span>
              </div>
            ))}
          </div>

          <div className="energy-system-note">
            <Info size={16} />
            <span>Cơ chế năng lượng khuyến khích học tập đều đặn mỗi ngày, tránh nhồi nhét quá tải và bảo đảm ghi nhớ lâu dài.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   8. DEMO CTA SECTION
   ========================================================================= */
function DemoCtaSection() {
  const [ctaRef, isRevealed] = useScrollReveal(0.15);

  return (
    <section className="section section--dark demo-cta-section" ref={ctaRef}>
      <div className="demo-cta-backdrop" aria-hidden="true" />
      <div className="container demo-cta-container">
        <div className={`demo-cta-content ${isRevealed ? 'revealed' : ''}`}>
          <div className="demo-cta-badge"><Waves size={16} /><span>Trận Bạch Đằng 938 – Bản Chơi Thử Trực Tuyến</span></div>
          <h2 className="demo-cta-title">Bạn đã sẵn sàng giải mã lịch sử?</h2>
          <p className="demo-cta-description">
            Cùng Ngô Quyền bài binh bố trận trên dòng sông Bạch Đằng năm 938. Khảo sát chu kỳ
            thủy triều, tính toán thời điểm cắm bãi cọc nhọn ngầm dưới nước, điều động chiến thuyền
            nghi binh dụ địch vào thế trận tử địa và làm nên chiến thắng oanh liệt chấm dứt hơn
            1000 năm Bắc thuộc.
          </p>

          <div className="demo-cta-highlights">
            {[
              'Sa bàn chiến thuật thủy chiến 3D',
              'Tính toán thủy triều thời gian thực',
              'Hoàn toàn miễn phí, chơi ngay trên trình duyệt'
            ].map((text, idx) => (
              <div key={idx} className="demo-highlight-item"><CheckCircle size={18} /><span>{text}</span></div>
            ))}
          </div>

          <div className="demo-cta-actions">
            <Link to="/demo" className="btn btn--gold btn--large demo-cta-btn"><Play size={20} /><span>Trải nghiệm miễn phí</span></Link>
            <Link to="/explore" className="btn btn--secondary btn--large demo-cta-btn-alt"><span>Tìm hiểu các thời kỳ khác</span><ArrowRight size={20} /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   9. APP DOWNLOAD PREVIEW SECTION
   ========================================================================= */
function AppDownloadSection() {
  const [appRef, isRevealed] = useScrollReveal(0.15);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="section app-download-section" ref={appRef}>
      <div className="container">
        <SectionHeader
          title="Dấu Việt trên thiết bị di động"
          subtitle="Mang theo dòng chảy lịch sử Việt Nam trong túi bạn – học tập, suy luận và chăm sóc hòn đảo mọi lúc, mọi nơi"
        />

        <div className={`app-download-grid ${isRevealed ? 'revealed' : ''}`}>
          {[
            { platform: 'Android', desc: 'Tối ưu cho điện thoại và máy tính bảng Android. Đồ họa mượt mà cùng chế độ ngoại tuyến tiện lợi.', feats: ['Google Play Store', 'Hỗ trợ Android 9.0 trở lên', 'Đồng bộ tiến trình đám mây'] },
            { platform: 'iOS', desc: 'Tương thích hoàn hảo với iPhone và iPad. Đồ họa sắc nét, hỗ trợ âm thanh sống động và cảm ứng haptic.', feats: ['Apple App Store', 'Hỗ trợ iOS 15.0 trở lên', 'Tương thích Apple Game Center'] }
          ].map((app) => (
            <div key={app.platform} className={`app-card app-card--${app.platform.toLowerCase()}`}>
              <div className="app-card__header">
                <div className="app-card__icon-box"><Smartphone size={32} /></div>
                <div>
                  <span className="app-card__status-tag">Sắp ra mắt</span>
                  <h3 className="app-card__title">{app.platform}</h3>
                </div>
              </div>
              <p className="app-card__desc">{app.desc}</p>
              <ul className="app-card__features">
                {app.feats.map((feat, idx) => (
                  <li key={idx}><Check size={16} /><span>{feat}</span></li>
                ))}
              </ul>
              <div className="app-card__btn disabled"><span>Đang hoàn thiện ứng dụng</span></div>
            </div>
          ))}
        </div>

        {/* Mascot App Promo */}
        <div className={`app-mascot-promo ${isRevealed ? 'revealed' : ''}`}>
          <div className="app-mascot-promo__img-wrap">
            <AnimatedMascot
              size="medium"
              variant="excited"
              message="Đăng ký nhận quà tân thủ độc quyền nhé!"
              interactive={true}
            />
          </div>
          <div className="app-mascot-promo__text">
            <span className="app-mascot-promo__label">Bé Sử thông báo</span>
            <p className="app-mascot-promo__message">
              Ứng dụng di động đang trong giai đoạn hoàn thiện — đăng ký ngay để nhận thông báo sớm nhất và nhận quà tân thủ độc quyền!
            </p>
          </div>
        </div>

        <div className={`app-notify-box ${isRevealed ? 'revealed' : ''}`}>
          <div className="app-notify-content">
            <div className="app-notify-icon"><Bell size={26} /></div>
            <div>
              <h4 className="app-notify-title">Đăng ký nhận thông báo ngày phát hành</h4>
              <p className="app-notify-desc">
                Nhận thông báo ngay khi ứng dụng có mặt trên Store và nhận ngay gói quà tặng
                tân thủ độc quyền (50 Năng lượng + Vật phẩm Trống Đồng trang trí đảo).
              </p>
            </div>
          </div>

          {isSubscribed ? (
            <div className="app-notify-success">
              <CheckCircle size={20} />
              <span>Cảm ơn bạn! Chúng tôi sẽ gửi thông báo đến bạn ngay khi ứng dụng mở cửa.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="app-notify-form">
              <input
                type="email"
                required
                placeholder="Nhập địa chỉ email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="app-notify-input"
              />
              <button type="submit" className="btn btn--primary app-notify-btn">
                <span>Nhận thông báo</span><ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   MAIN HOME PAGE COMPONENT
   ========================================================================= */
export default function HomePage() {
  return (
    <div className="home-page">
      <div
        className="home-backdrop"
        aria-hidden="true"
        style={{ '--heritage-landscape': homeBackground ? `url("${homeBackground}")` : 'none' }}
      />
      <HeroSection />
      <AboutPreviewSection />
      <CoreFeaturesSection />
      <LearningJourneySection />
      <HistoricalPeriodSection />
      <PersonalIslandSection />
      <GamificationSection />
      <DemoCtaSection />
      <AppDownloadSection />
    </div>
  );
}
