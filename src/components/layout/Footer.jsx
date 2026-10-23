import { Link } from 'react-router-dom';
import '../../styles/components/footer.css';

export default function Footer() {
  const currentYear = 2025;

  const quickLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Giới thiệu dự án', path: '/about' },
    { label: 'Khám phá thời kỳ', path: '/explore' },
    { label: 'Trải nghiệm tương tác', path: '/demo' },
    { label: 'Đội ngũ phát triển', path: '/team' },
    { label: 'Liên hệ đóng góp', path: '/contact' },
  ];

  const exploreFeatures = [
    { label: 'Phòng suy luận lịch sử', path: '/explore' },
    { label: 'Bản đồ di sản tương tác', path: '/explore' },
    { label: 'Tái hiện các trận chiến hào hùng', path: '/demo' },
    { label: 'Hệ thống thu thập dấu vết', path: '/demo' },
    { label: 'Kho tư liệu thời đại', path: '/about' },
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Column 1: Brand & Description & Socials */}
          <div className="footer__col footer__col--brand">
            <Link to="/" className="footer__logo" aria-label="Dấu Việt - Trang chủ">
              <div className="footer__logo-img-wrap">
                <img
                  src="/images/branding/logo-dau-viet.jpg"
                  alt="Logo Dấu Việt"
                  className="footer__logo-img"
                />
              </div>
            </Link>

            <p className="footer__description">
              Dấu Việt là nền tảng số hóa và giáo dục lịch sử Việt Nam tương tác. 
              Chúng tôi đưa người học vào hành trình khám phá quá khứ qua thu thập chứng cứ, 
              suy luận bối cảnh và tái hiện những thời khắc vẻ vang của dân tộc.
            </p>

            <div className="footer__socials" aria-label="Mạng xã hội">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Theo dõi Dấu Việt trên Facebook"
              >
                <svg className="footer__social-svg" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Kênh YouTube Dấu Việt"
              >
                <svg className="footer__social-svg" viewBox="0 0 24 24">
                  <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
                </svg>
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Kênh TikTok Dấu Việt"
              >
                <svg className="footer__social-svg" viewBox="0 0 24 24">
                  <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.58 2.6 2.592 2.592 0 0 1-2.59-2.6 2.592 2.592 0 0 1 2.59-2.6c.28 0 .54.04.79.11V9.74a5.674 5.674 0 0 0-.79-.06A5.684 5.684 0 0 0 4.18 15.4 5.684 5.684 0 0 0 9.87 21a5.684 5.684 0 0 0 5.68-5.6V9.16a7.404 7.404 0 0 0 4.27 1.34V7.41a4.34 4.34 0 0 1-3.22-1.59z" />
                </svg>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Kho mã nguồn Dấu Việt trên GitHub"
              >
                <svg className="footer__social-svg" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation links */}
          <div className="footer__col">
            <h3 className="footer__title">Điều hướng</h3>
            <ul className="footer__links">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="footer__col">
            <h3 className="footer__title">Trải nghiệm</h3>
            <ul className="footer__links">
              {exploreFeatures.map((item, index) => (
                <li key={index}>
                  <Link to={item.path} className="footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="footer__col">
            <h3 className="footer__title">Liên hệ</h3>
            <ul className="footer__contact-list">
              <li className="footer__contact-item">
                <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div>
                  <strong>Hộp thư điện tử:</strong><br />
                  <a href="mailto:contact@historydauviet.id.vn" className="footer__contact-link">
                    contact@historydauviet.id.vn
                  </a>
                </div>
              </li>
              <li className="footer__contact-item">
                <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <strong>Địa điểm phát triển:</strong><br />
                  <span>Trường Đại học FPT, Khu CNC Hòa Lạc, Hà Nội</span>
                </div>
              </li>
              <li className="footer__contact-item">
                <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <div>
                  <strong>Thời gian hỗ trợ:</strong><br />
                  <span>08:00 – 17:30 (Thứ 2 đến Thứ 6)</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} Dấu Việt. Tất cả quyền được bảo lưu.
          </p>
          <div className="footer__legal-links">
            <Link to="/about" className="footer__legal-link">Về chúng tôi</Link>
            <span aria-hidden="true">•</span>
            <Link to="/contact" className="footer__legal-link">Hỗ trợ kỹ thuật</Link>
            <span aria-hidden="true">•</span>
            <a href="#root" className="footer__legal-link">Lên đầu trang ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
