import { useState } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  AlertCircle,
  Info,
  Compass,
  MessageSquare,
  Share2,
  ExternalLink,
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import useScrollReveal from '../hooks/useScrollReveal';
import '../styles/pages/contact.css';

export default function ContactPage() {
  const [heroRef, heroRevealed] = useScrollReveal(0.1);
  const [contentRef, contentRevealed] = useScrollReveal(0.12);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [notice, setNotice] = useState(null);

  // Validate form fields
  const validateField = (name, value) => {
    let error = '';
    const trimmed = value ? value.trim() : '';

    if (name === 'fullName') {
      if (!trimmed) {
        error = 'Vui lòng nhập họ và tên của bạn.';
      } else if (trimmed.length < 2) {
        error = 'Họ và tên cần có ít nhất 2 ký tự.';
      }
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmed) {
        error = 'Vui lòng nhập địa chỉ email.';
      } else if (!emailRegex.test(trimmed)) {
        error = 'Địa chỉ email không hợp lệ (ví dụ: ban@example.com).';
      }
    }

    if (name === 'message') {
      if (!trimmed) {
        error = 'Vui lòng nhập nội dung góp ý hoặc lời nhắn.';
      } else if (trimmed.length < 10) {
        error = 'Nội dung góp ý cần có ít nhất 10 ký tự để chúng tôi hiểu rõ hơn.';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    const newTouched = {
      fullName: true,
      email: true,
      subject: true,
      message: true,
    };
    setTouched(newTouched);

    // Validate all required fields
    const formErrors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      message: validateField('message', formData.message),
    };

    setErrors(formErrors);

    const hasError = Object.values(formErrors).some((err) => Boolean(err));

    if (!hasError) {
      // NOTE: Per instructions, do NOT display fake success.
      // Show informational notice that form is not connected to email backend in demo.
      setNotice({
        type: 'info',
        message:
          'Đây là phiên bản demo. Biểu mẫu chưa được kết nối với dịch vụ gửi email. Vui lòng liên hệ qua email trực tiếp.',
      });
    } else {
      setNotice(null);
    }
  };

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/dauviet05',
      handle: 'facebook.com/dauviet05',
      icon: (
        <svg viewBox="0 0 24 24" className="contact-social-svg" fill="currentColor">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      handle: 'youtube.com/@dauviet',
      icon: (
        <svg viewBox="0 0 24 24" className="contact-social-svg" fill="currentColor">
          <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com',
      handle: '@dauviet.official',
      icon: (
        <svg viewBox="0 0 24 24" className="contact-social-svg" fill="currentColor">
          <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.58 2.6 2.592 2.592 0 0 1-2.59-2.6 2.592 2.592 0 0 1 2.59-2.6c.28 0 .54.04.79.11V9.74a5.674 5.674 0 0 0-.79-.06A5.684 5.684 0 0 0 4.18 15.4 5.684 5.684 0 0 0 9.87 21a5.684 5.684 0 0 0 5.68-5.6V9.16a7.404 7.404 0 0 0 4.27 1.34V7.41a4.34 4.34 0 0 1-3.22-1.59z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      handle: 'github.com/dauviet',
      icon: (
        <svg viewBox="0 0 24 24" className="contact-social-svg" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="contact-page">
      {/* 1. Hero Banner */}
      <section
        ref={heroRef}
        className={`contact-hero ${heroRevealed ? 'revealed' : ''}`}
        aria-label="Liên hệ với dự án Dấu Việt"
      >
        <div className="container contact-hero__container">
          <div className="contact-hero__badge">
            <MessageSquare size={16} aria-hidden="true" />
            <span>Kênh thông tin & Đóng góp</span>
          </div>
          <h1 className="contact-hero__title">Liên hệ</h1>
          <p className="contact-hero__subtitle">
            Chúng tôi luôn lắng nghe mọi phản hồi, ý kiến đóng góp về nội dung lịch sử
            và cơ hội hợp tác phát triển dự án giáo dục Dấu Việt.
          </p>
        </div>
      </section>

      {/* 2. Split Layout: Contact Info & Form */}
      <section
        ref={contentRef}
        className={`section contact-content ${contentRevealed ? 'revealed' : ''}`}
        aria-label="Nội dung liên hệ"
      >
        <div className="container">
          <div className="contact-layout">
            {/* Left Column: Contact info cards */}
            <aside className="contact-info" aria-label="Thông tin liên hệ trực tiếp">
              {/* Primary Email Card */}
              <div className="contact-card card card--historical">
                <div className="contact-card__icon-wrap">
                  <Mail size={24} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="contact-card__title">Hộp thư điện tử</h2>
                  <p className="contact-card__text">
                    Liên hệ trực tiếp với ban quản trị dự án:
                  </p>
                  <a
                    href="mailto:contact@historydauviet.id.vn"
                    className="contact-card__link"
                  >
                    contact@historydauviet.id.vn
                  </a>
                </div>
              </div>

              {/* Location & Office Hours */}
              <div className="contact-card card card--historical">
                <div className="contact-card__icon-wrap">
                  <MapPin size={24} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="contact-card__title">Địa điểm làm việc</h2>
                  <p className="contact-card__text">
                    Trường Đại học FPT Cần Thơ, số 600, đường Nguyễn Văn Cừ nối dài, phường An Bình, thành phố Cần Thơ, Việt Nam, 900000.
                  </p>
                  <div className="contact-card__meta">
                    <Clock size={15} aria-hidden="true" />
                    <span>08:00 – 17:30 (Thứ Hai – Thứ Sáu)</span>
                  </div>
                </div>
              </div>

              {/* Social Media Placeholders */}
              <div className="contact-card card card--historical">
                <div className="contact-card__icon-wrap">
                  <Share2 size={24} aria-hidden="true" />
                </div>
                <div className="contact-social-block">
                  <h2 className="contact-card__title">Mạng xã hội & Cộng đồng</h2>
                  <p className="contact-card__text">
                    Theo dõi các tin tức và tư liệu lịch sử mới nhất của Dấu Việt:
                  </p>
                  <ul className="contact-social-list">
                    {socialLinks.map((item) => (
                      <li key={item.name} className="contact-social-item">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contact-social-link"
                          aria-label={`Theo dõi trên ${item.name}`}
                        >
                          <span className="contact-social-icon-wrapper" aria-hidden="true">
                            {item.icon}
                          </span>
                          <span className="contact-social-name">{item.name}</span>
                          <ExternalLink size={13} className="contact-social-ext" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 5. Map Placeholder / Decorative Element */}
              <div className="contact-map-card card card--historical" aria-label="Bản đồ vị trí">
                <div className="contact-map-graphic">
                  <div className="contact-map-contours" aria-hidden="true" />
                  <div className="contact-map-compass" aria-hidden="true">
                    <Compass size={44} />
                  </div>
                  <div className="contact-map-pin">
                    <MapPin size={28} className="contact-map-pin-icon" />
                    <span className="contact-map-label">Đại học FPT Cần Thơ</span>
                  </div>
                  <div className="contact-map-coords">
                    An Bình · Cần Thơ · 900000
                  </div>
                </div>
                <p className="contact-map-caption">
                  Trung tâm sáng tạo và ươm mầm các ý tưởng công nghệ số hóa văn hóa.
                </p>
              </div>
            </aside>

            {/* Right Column: Contact Form */}
            <main className="contact-form-section">
              <div className="contact-form-card card card--historical">
                <div className="contact-form-header">
                  <h2 className="contact-form-title">Gửi thông tin góp ý</h2>
                  <p className="contact-form-subtitle">
                    Điền biểu mẫu dưới đây để gửi phản hồi, câu hỏi hoặc ý kiến đóng góp cho đội ngũ Dấu Việt.
                  </p>
                </div>

                {/* Demo Notification Banner (Per Requirements) */}
                {notice && (
                  <div
                    className="contact-notice"
                    role="status"
                    aria-live="polite"
                  >
                    <Info size={22} className="contact-notice__icon" aria-hidden="true" />
                    <div className="contact-notice__content">
                      <p className="contact-notice__text">{notice.message}</p>
                      <a
                        href="mailto:contact@historydauviet.id.vn"
                        className="btn btn--small btn--primary contact-notice__btn"
                      >
                        <Mail size={14} aria-hidden="true" />
                        <span>Mở ứng dụng Email</span>
                      </a>
                    </div>
                  </div>
                )}

                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Biểu mẫu góp ý"
                >
                  {/* Họ và tên */}
                  <div className="contact-field">
                    <label htmlFor="contact-fullName" className="contact-label">
                      Họ và tên <span className="contact-required">*</span>
                    </label>
                    <input
                      id="contact-fullName"
                      name="fullName"
                      type="text"
                      className={`contact-input ${
                        touched.fullName && errors.fullName ? 'contact-input--error' : ''
                      }`}
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-required="true"
                      aria-invalid={touched.fullName && Boolean(errors.fullName)}
                      aria-describedby={
                        touched.fullName && errors.fullName ? 'error-fullName' : undefined
                      }
                    />
                    {touched.fullName && errors.fullName && (
                      <p id="error-fullName" className="contact-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="contact-field">
                    <label htmlFor="contact-email" className="contact-label">
                      Địa chỉ Email <span className="contact-required">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={`contact-input ${
                        touched.email && errors.email ? 'contact-input--error' : ''
                      }`}
                      placeholder="tenban@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-required="true"
                      aria-invalid={touched.email && Boolean(errors.email)}
                      aria-describedby={
                        touched.email && errors.email ? 'error-email' : undefined
                      }
                    />
                    {touched.email && errors.email && (
                      <p id="error-email" className="contact-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Chủ đề */}
                  <div className="contact-field">
                    <label htmlFor="contact-subject" className="contact-label">
                      Chủ đề <span className="contact-optional">(Tùy chọn)</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      className="contact-input"
                      placeholder="Ví dụ: Góp ý sự kiện Bạch Đằng 938, Hợp tác cố vấn"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Nội dung góp ý */}
                  <div className="contact-field">
                    <label htmlFor="contact-message" className="contact-label">
                      Nội dung góp ý <span className="contact-required">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      className={`contact-textarea ${
                        touched.message && errors.message ? 'contact-input--error' : ''
                      }`}
                      placeholder="Nhập nội dung góp ý, nhận xét hoặc thắc mắc của bạn..."
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-required="true"
                      aria-invalid={touched.message && Boolean(errors.message)}
                      aria-describedby={
                        touched.message && errors.message ? 'error-message' : undefined
                      }
                    />
                    {touched.message && errors.message && (
                      <p id="error-message" className="contact-error" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="contact-form-actions">
                    <button
                      type="submit"
                      className="btn btn--primary btn--large contact-submit-btn"
                    >
                      <Send size={18} aria-hidden="true" />
                      <span>Gửi góp ý</span>
                    </button>
                    <span className="contact-disclaimer">
                      Các trường có dấu <span className="contact-required">*</span> là bắt buộc.
                    </span>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
