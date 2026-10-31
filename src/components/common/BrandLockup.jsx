import { Link } from 'react-router-dom';

export default function BrandLockup({ className = '', onClick, showSlogan = false }) {
  return (
    <Link to="/#trang-chu" className={`brand-lockup ${className}`} aria-label="Dấu Việt - Trang chủ" onClick={onClick}>
      <span className="brand-lockup__seal" aria-hidden="true">
        <img src="/favicon.png" alt="" width="56" height="56" />
      </span>
      <span className="brand-lockup__copy">
        <span className="brand-lockup__name">DẤU VIỆT <span aria-hidden="true">◆</span></span>
        {showSlogan && <span className="brand-lockup__slogan">Chạm vào quá khứ<br />Hiểu Việt Nam hôm nay</span>}
      </span>
    </Link>
  );
}
