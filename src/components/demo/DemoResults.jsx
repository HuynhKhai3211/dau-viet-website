import { Link } from 'react-router-dom';
import {
  Trophy,
  RotateCcw,
  Home,
  Compass,
  Sparkles,
  Award,
  BookOpen,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { scoring } from '../../data/bachDangDemo';
import AnimatedMascot from '../common/AnimatedMascot';
import DecorArtwork from './DecorArtwork';
import { decorItems } from '../../data/islandDecor';

export default function DemoResults({
  score = 0,
  discoveredCluesCount = 4,
  hypothesisCorrectCount = 2,
  reconstructionCorrect = true,
  reconstructionAttempts = 1,
  onRestart,
  island,
  onDecorate,
}) {
  const scoreMsg = scoring.getScoreMessage(score);
  const cluePoints = discoveredCluesCount * scoring.cluePoints;
  const hypothesisPoints = hypothesisCorrectCount * scoring.questionPoints;
  const reconstructionPointsEarned =
    reconstructionCorrect && reconstructionAttempts === 1
      ? scoring.reconstructionPoints
      : 0;

  return (
    <div className="demo-results card card--historical">
      {/* Decorative Historical Ribbon */}
      <div className="demo-results__ribbon" aria-hidden="true">
        <span className="demo-results__ribbon-line" />
        <Award size={28} className="demo-results__ribbon-icon" />
        <span className="demo-results__ribbon-line" />
      </div>

      {/* Main Header */}
      <div className="demo-results__header">
        <div className="demo-results__badge">
          <Sparkles size={16} />
          <span>Hành Trình Khép Lại Xuất Sắc</span>
        </div>
        <h1 className="demo-results__title">Hoàn Thành Hành Trình!</h1>
        <p className="demo-results__subtitle">
          Giải Mã Chiến Thắng Bạch Đằng Năm 938 — Vị Vua Tiền Ngô Vương
        </p>
      </div>

      {/* Big Score Medallion */}
      <div className="demo-results__medallion">
        <div className="demo-results__circle">
          <div className="demo-results__circle-inner">
            <Trophy size={42} className="demo-results__trophy-icon" />
            <div className="demo-results__score-value">{score}</div>
            <div className="demo-results__score-max">/{scoring.maxScore} ĐIỂM</div>
          </div>
        </div>

        <div className="demo-results__evaluation">
          <h2 className="demo-results__eval-title">{scoreMsg.title}</h2>
          <p className="demo-results__eval-message">{scoreMsg.message}</p>
        </div>
      </div>

      {/* Celebratory Mascot */}
      <div className="demo-results__mascot-celebrate">
        <AnimatedMascot
          variant="success"
          size="medium"
          message="Tuyệt vời! Bạn đã hoàn thành hành trình khám phá!"
          interactive={true}
        />
      </div>

      {/* 3 Pillars Score Breakdown */}
      <div className="demo-results__breakdown-grid">
        {/* Pillar 1: Clues */}
        <div className="demo-breakdown-card">
          <div className="demo-breakdown-card__header">
            <span className="demo-breakdown-card__num">01</span>
            <span className="demo-breakdown-card__tag">Dấu Vết Lịch Sử</span>
          </div>
          <h4 className="demo-breakdown-card__title">Khám Phá Sa Bàn</h4>
          <div className="demo-breakdown-card__stats">
            <strong>{discoveredCluesCount} / 4</strong> dấu vết đã mở khóa
          </div>
          <div className="demo-breakdown-card__points">
            +{cluePoints} / 40 điểm
          </div>
        </div>

        {/* Pillar 2: Hypothesis */}
        <div className="demo-breakdown-card">
          <div className="demo-breakdown-card__header">
            <span className="demo-breakdown-card__num">02</span>
            <span className="demo-breakdown-card__tag">Giả Thuyết Quân Sự</span>
          </div>
          <h4 className="demo-breakdown-card__title">Suy Luận Chiến Thuật</h4>
          <div className="demo-breakdown-card__stats">
            <strong>{hypothesisCorrectCount} / 2</strong> câu trả lời chuẩn xác
          </div>
          <div className="demo-breakdown-card__points">
            +{hypothesisPoints} / 30 điểm
          </div>
        </div>

        {/* Pillar 3: Reconstruction */}
        <div className="demo-breakdown-card">
          <div className="demo-breakdown-card__header">
            <span className="demo-breakdown-card__num">03</span>
            <span className="demo-breakdown-card__tag">Tiến Trình Thời Gian</span>
          </div>
          <h4 className="demo-breakdown-card__title">Tái Hiện Trận Đánh</h4>
          <div className="demo-breakdown-card__stats">
            {reconstructionCorrect ? (
              reconstructionAttempts === 1 ? (
                <span className="demo-status--perfect">Chuẩn xác ngay lần đầu</span>
              ) : (
                <span>Đúng sau {reconstructionAttempts} lần thử</span>
              )
            ) : (
              <span>Chưa hoàn thành</span>
            )}
          </div>
          <div className="demo-breakdown-card__points">
            +{reconstructionPointsEarned} / 30 điểm
          </div>
        </div>
      </div>

      {/* Historical Synthesis Card */}
      <div className="demo-results__summary-box">
        <div className="demo-results__summary-header">
          <BookOpen size={20} />
          <h3>Ý Nghĩa Lịch Sử: Khúc Ca Khải Hoàn Trên Sông Bạch Đằng</h3>
        </div>
        <p className="demo-results__summary-text">
          Chiến thắng Bạch Đằng năm 938 là mốc son chói lọi trong lịch sử dựng nước và giữ nước của dân tộc Việt Nam. Bằng việc kết hợp tài tình giữa quy luật tự nhiên (chu kỳ thủy triều lên xuống), địa hình hiểm trở của vùng cửa sông và trí tuệ quân sự độc đáo (bãi cọc gỗ ngầm bịt sắt, kế khiêu chiến giả vờ thua), Ngô Quyền đã đập tan cuộc xâm lược của quân Nam Hán, chém chết tướng giặc Lưu Hoằng Thao.
        </p>
        <p className="demo-results__summary-text">
          Chiến thắng vang dội này đã chính thức chấm dứt hơn 1.000 năm Bắc thuộc tối tăm, mở ra kỷ nguyên độc lập tự chủ lâu dài và vẻ vang cho non sông đất Việt.
        </p>
      </div>

      {/* Future App / AR Invitation Banner */}
      <div className="demo-results__invitation-card">
        <div className="demo-results__invitation-icon">
          <Smartphone size={32} />
        </div>
        <div className="demo-results__invitation-content">
          <h4>Sắp ra mắt: Phiên bản ứng dụng di động Dấu Việt với Công nghệ AR</h4>
          <p>
            Trải nghiệm sa bàn lịch sử thực tế ảo tăng cường 3D tương tác đa điểm, tái hiện chân thực hơn 20 chiến trường vang danh như Chi Lăng, Rạch Gầm - Xoài Mút, Điện Biên Phủ ngay trong phòng khách của bạn!
          </p>
        </div>
        <Link to="/explore" className="btn btn--gold demo-results__invitation-btn">
          <span>Tìm hiểu thêm</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Action Buttons */}
      {island && <section className="island-results-rewards" aria-label="Phần thưởng trang trí đảo">
        <span className="island-eyebrow">TRI THỨC HÓA THÀNH NHỮNG MÓN QUÀ</span>
        <h3>Mang dấu ấn Bạch Đằng về đảo của bạn</h3>
        <p>Bạn đang sở hữu {island.earned.length} vật phẩm. Phần thưởng vẫn được giữ khi chơi lại hành trình.</p>
        <div className="island-results-rewards__items">
          {decorItems.filter(item => island.earned.includes(item.id)).map(item => <span key={item.id}><DecorArtwork kind={item.kind} />{item.name}</span>)}
        </div>
        <button type="button" className="btn btn--primary" onClick={onDecorate}>Trang trí đảo ngay <ArrowRight size={18} /></button>
      </section>}
      <div className="demo-results__actions">
        <button
          type="button"
          className="btn btn--secondary btn--large demo-results__restart-btn"
          onClick={onRestart}
        >
          <RotateCcw size={18} />
          <span>Chơi lại hành trình</span>
        </button>

        <Link to="/" className="btn btn--primary btn--large demo-results__home-btn">
          <Home size={18} />
          <span>Về trang chủ</span>
        </Link>

        <Link to="/explore" className="btn btn--gold btn--large demo-results__explore-btn">
          <Compass size={18} />
          <span>Khám phá di tích khác</span>
        </Link>
      </div>
    </div>
  );
}
