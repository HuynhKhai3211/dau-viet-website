import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, Mail, Facebook } from 'lucide-react';
import BrandLockup from '../common/BrandLockup';
import '../../styles/components/footer.css';

const exploreLinks = [
  { label: 'Thành viên dự án', path: '/team' },
  { label: 'Giới thiệu Dấu Việt', path: '/about' },
  { label: 'Cách hoạt động', path: '/explore#learning-flow' },
  { label: 'Bốn thời kỳ lịch sử', path: '/explore#historical-timeline' },
  { label: 'Khám phá lịch sử', path: '/explore' },
  { label: 'Đảo di sản cá nhân', path: '/explore#personal-island' },
  { label: 'Tính năng & phần thưởng', path: '/#tinh-nang' },
];

export default function Footer() {
  return (
    <footer className="footer heritage-surface">
      <span className="heritage-surface__shine" aria-hidden="true" />
      <div className="footer__container">
        <div className="footer__invitation">
          <div>
            <p className="footer__eyebrow">HÀNH TRÌNH CỦA BẠN CHỈ VỪA BẮT ĐẦU</p>
            <h2 className="footer__invitation-title">Một bước khám phá.<br /><em>Ngàn điều để nhớ.</em></h2>
          </div>
          <div className="footer__invitation-actions">
            <Link to="/demo" className="heritage-ticket footer__ticket">
              <Compass size={19} aria-hidden="true" /><span>Nhận vé trải nghiệm</span><ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link to="/explore#learning-flow" className="footer__how-link">Tìm hiểu cách hoạt động <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="footer__grid">
          <div className="footer__col footer__col--brand">
            <BrandLockup className="footer__logo" />
            <p className="footer__description">Kết nối những dấu vết, khám phá câu chuyện và mang một phần di sản Việt về hành trình của riêng bạn.</p>
            <p className="footer__brand-motto">GÌN GIỮ CỘI NGUỒN <span aria-hidden="true">◆</span> ĐÁNH THỨC DI SẢN</p>
          </div>
          <nav className="footer__col" aria-label="Khám phá Dấu Việt">
            <h3 className="footer__title">Khám phá Dấu Việt</h3>
            <ul className="footer__links">
              {exploreLinks.map(item => (
                <li key={item.path}>
                  <Link to={item.path} className="footer__link"><span>{item.label}</span><ArrowUpRight size={14} aria-hidden="true" /></Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__col footer__col--contact">
            <h3 className="footer__title">Đồng hành cùng bạn</h3>
            <a href="mailto:contact@historydauviet.id.vn" className="footer__contact-card footer__contact-card--email">
              <Mail size={20} aria-hidden="true" />
              <span><span className="footer__contact-label">Liên hệ với Dấu Việt</span><strong className="footer__contact-email">contact@historydauviet.id.vn</strong></span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="https://www.facebook.com/dauviet05" target="_blank" rel="noopener noreferrer" className="footer__contact-card">
              <Facebook size={19} aria-hidden="true" /><span>Facebook Dấu Việt</span><ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <details id="faq" className="footer__faq">
              <summary>Câu hỏi thường gặp <ArrowUpRight size={17} aria-hidden="true" /></summary>
              <div className="footer__faq-answers">
                <h4>Dấu Việt là gì?</h4>
                <p>Dấu Việt là nền tảng khám phá lịch sử Việt Nam qua tìm kiếm dấu vết, suy luận và tái hiện các sự kiện lịch sử.</p>
                <h4>Tôi bắt đầu trải nghiệm ở đâu?</h4>
                <p>Chọn “Nhận vé trải nghiệm” để bắt đầu bản demo Bạch Đằng 938. Bạn có thể khám phá dấu vết và thử sức với các thử thách tương tác.</p>
                <h4>Tôi có thể trải nghiệm trên điện thoại không?</h4>
                <p>Có. Website hỗ trợ máy tính và điện thoại. Bạn có thể tắt âm thanh hoặc nền động bằng các nút điều khiển trên trang.</p>
                <Link to="/contact" className="footer__faq-contact">Gửi câu hỏi cho Dấu Việt <ArrowUpRight size={14} aria-hidden="true" /></Link>
              </div>
            </details>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">© 2025 Dấu Việt. Tất cả quyền được bảo lưu.</p>
          <div className="footer__legal-links">
            <Link to="/contact" className="footer__legal-link">Liên hệ & đóng góp</Link>
            <a href="#root" className="footer__legal-link">Lên đầu trang ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
