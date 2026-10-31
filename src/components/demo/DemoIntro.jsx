import { Compass, BookOpen, Target, AlertCircle, ArrowRight, Sparkles, Shield, Award } from 'lucide-react';
import { demoIntro, scoring } from '../../data/bachDangDemo';
import AnimatedMascot from '../common/AnimatedMascot';

export default function DemoIntro({ onStart }) {
  return (
    <div className="demo-intro card card--historical">
      {/* Historical Seal / Motif Top Accent */}
      <div className="demo-intro__motif" aria-hidden="true">
        <span className="demo-intro__motif-line" />
        <span className="demo-intro__motif-emblem">❖</span>
        <span className="demo-intro__motif-line" />
      </div>

      {/* Mascot Welcome Banner */}
      <div className="demo-mascot-welcome">
        <div className="demo-mascot-welcome__img-wrap">
          <AnimatedMascot
            variant="greeting"
            size="medium"
            interactive={true}
          />
        </div>
        <div className="demo-mascot-welcome__bubble">
          <span className="demo-mascot-welcome__greeting">Xin chào nhà thám hiểm!</span>
          <p className="demo-mascot-welcome__text">
            Chào mừng bạn đến với trải nghiệm Trận Bạch Đằng 938. Hãy thu thập <strong>4 manh mối lịch sử</strong>, đặt giả thuyết và tái hiện chiến thắng oanh liệt của Ngô Quyền!
          </p>
        </div>
      </div>

      {/* Hero Header */}
      <div className="demo-intro__hero">
        <div className="demo-intro__badge">
          <Sparkles size={16} />
          <span>Trải nghiệm Tương Tác Lịch Sử 360°</span>
        </div>
        <h2 className="demo-intro__title">{demoIntro.title}</h2>
        <p className="demo-intro__subtitle">{demoIntro.subtitle}</p>
      </div>

      {/* Main Historical Context */}
      <div className="demo-intro__body">
        <div className="demo-intro__lead-box">
          <p className="demo-intro__desc">{demoIntro.description}</p>
        </div>

        {/* 3 Step Features */}
        <div className="demo-intro__steps-grid">
          <div className="demo-step-card">
            <div className="demo-step-card__icon-wrap">
              <Compass size={24} />
              <span className="demo-step-card__num">01</span>
            </div>
            <h4 className="demo-step-card__title">Khám Phá Dấu Vết</h4>
            <p className="demo-step-card__text">
              Khám phá 4 dấu vết trên sa bàn: Thủy triều, Ngô Quyền, sông Bạch Đằng và quân Nam Hán.
            </p>
            <span className="demo-step-card__points">+40 điểm tối đa</span>
          </div>

          <div className="demo-step-card">
            <div className="demo-step-card__icon-wrap">
              <Shield size={24} />
              <span className="demo-step-card__num">02</span>
            </div>
            <h4 className="demo-step-card__title">Đặt Giả Thuyết</h4>
            <p className="demo-step-card__text">
              Vận dụng tư duy suy luận lịch sử để giải mã lý do tại sao quân Nam Hán lại mắc bẫy chết người trên dòng sông Bạch Đằng.
            </p>
            <span className="demo-step-card__points">+30 điểm tối đa</span>
          </div>

          <div className="demo-step-card">
            <div className="demo-step-card__icon-wrap">
              <Award size={24} />
              <span className="demo-step-card__num">03</span>
            </div>
            <h4 className="demo-step-card__title">Tái Hiện Trận Chiến</h4>
            <p className="demo-step-card__text">
              Sắp xếp theo thứ tự thời gian các sự kiện quyết định từ chuẩn bị trận địa, nhử giặc đến đòn tổng phản công đại thắng.
            </p>
            <span className="demo-step-card__points">+30 điểm tối đa</span>
          </div>
        </div>

        {/* Instructions & Learning Objective */}
        <div className="demo-intro__info-grid">
          <div className="demo-info-box">
            <div className="demo-info-box__title">
              <BookOpen size={18} />
              <h4>Hướng Dẫn Tham Gia</h4>
            </div>
            <p>{demoIntro.instruction}</p>
          </div>

          <div className="demo-info-box demo-info-box--gold">
            <div className="demo-info-box__title">
              <Target size={18} />
              <h4>Mục Tiêu Nhận Thức</h4>
            </div>
            <p>{demoIntro.learningObjective}</p>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="demo-intro__disclaimer">
          <AlertCircle size={18} className="demo-intro__disclaimer-icon" />
          <p>{demoIntro.disclaimer}</p>
        </div>

        {/* CTA Launch Button */}
        <div className="demo-intro__actions">
          <button
            type="button"
            className="btn btn--primary btn--large demo-intro__start-btn"
            onClick={onStart}
          >
            <span>Bắt đầu khám phá</span>
            <ArrowRight size={20} />
          </button>
          <span className="demo-intro__total-badge">
            Thang điểm hoàn hảo: <strong>{scoring.maxScore} điểm</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
