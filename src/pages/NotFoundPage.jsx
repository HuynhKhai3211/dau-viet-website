import { Link } from 'react-router-dom';
import { Home, Compass, Map, ArrowLeft } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/pages/notfound.css';

export default function NotFoundPage() {
  const [contentRef, contentRevealed] = useScrollReveal(0.1);

  return (
    <div className="not-found-page">
      <div className="container not-found-page__container">
        <main
          ref={contentRef}
          className={`not-found-card card card--historical ${
            contentRevealed ? 'revealed' : ''
          }`}
          aria-labelledby="not-found-title"
        >
          {/* Decorative Ancient Compass Illustration */}
          <div className="not-found-compass" aria-hidden="true">
            <div className="not-found-compass__outer-ring">
              <div className="not-found-compass__inner-ring">
                <div className="not-found-compass__dial">
                  <span className="not-found-compass__point not-found-compass__point--n">B</span>
                  <span className="not-found-compass__point not-found-compass__point--e">Đ</span>
                  <span className="not-found-compass__point not-found-compass__point--s">N</span>
                  <span className="not-found-compass__point not-found-compass__point--w">T</span>
                </div>
                <div className="not-found-compass__needle-wrap">
                  <div className="not-found-compass__needle" />
                </div>
                <div className="not-found-compass__pivot" />
              </div>
            </div>
          </div>

          {/* Large 404 styled as ancient numeral */}
          <div className="not-found-code" aria-hidden="true">
            <span className="not-found-code__digit">4</span>
            <span className="not-found-code__digit not-found-code__digit--gold">0</span>
            <span className="not-found-code__digit">4</span>
          </div>

          <h1 id="not-found-title" className="not-found-title">
            Trang bạn tìm không tồn tại
          </h1>

          <p className="not-found-subtitle">
            Có vẻ bạn đã lạc vào vùng đất chưa được khám phá...
          </p>

          <p className="not-found-description">
            Bản đồ thời gian của Dấu Việt không ghi nhận tọa độ này.
            Có thể trang đã được chuyển dời hoặc hải trình của bạn đi lệch hướng.
          </p>

          {/* Primary Action Button linking to / */}
          <div className="not-found-actions">
            <Link to="/" className="btn btn--primary btn--large not-found-home-btn">
              <Home size={20} aria-hidden="true" />
              <span>Quay về trang chủ</span>
            </Link>
          </div>

          {/* Helpful Exploration Links */}
          <nav className="not-found-links" aria-label="Lối tắt điều hướng">
            <span className="not-found-links__label">Hoặc tiếp tục hành trình:</span>
            <div className="not-found-links__group">
              <Link to="/#kham-pha" className="not-found-link">
                <Map size={15} aria-hidden="true" />
                <span>Khám phá 4 thời kỳ</span>
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/#trai-nghiem" className="not-found-link">
                <Compass size={15} aria-hidden="true" />
                <span>Trải nghiệm Bạch Đằng 938</span>
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/#gioi-thieu" className="not-found-link">
                <span>Về dự án Dấu Việt</span>
              </Link>
            </div>
          </nav>
        </main>
      </div>
    </div>
  );
}
