import { Link } from 'react-router-dom';
import {
  Users,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  Compass,
  IdCard,
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import useScrollReveal from '../hooks/useScrollReveal';
import { teamMembers } from '../data/team';
import '../styles/pages/team.css';

// Helper to compute initials from full name (e.g. "Nguyễn Văn A" -> "NA")
function getInitials(name) {
  if (!name) return 'DV';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Preset color palette for avatar circle placeholders
const avatarGradients = [
  'linear-gradient(135deg, #923E32, #6E2E25)', // Crimson — CEO
  'linear-gradient(135deg, #CDA467, #A88347)', // Gold — CMO
  'linear-gradient(135deg, #2D6EA0, #1B4F72)', // Steel Blue — CTO
  'linear-gradient(135deg, #5A8A3A, #3B6324)', // Forest — CCO
  'linear-gradient(135deg, #B85A4E, #8A3D34)', // Terracotta — CPO
  'linear-gradient(135deg, #7B5EA7, #573D7A)', // Purple — CLO
];

export default function TeamPage() {
  const [heroRef, heroRevealed] = useScrollReveal(0.1);
  const [introRef, introRevealed] = useScrollReveal(0.12);
  const [gridRef, gridRevealed] = useScrollReveal(0.08);
  const [ctaRef, ctaRevealed] = useScrollReveal(0.15);


  return (
    <div className="team-page">
      {/* 1. Hero Banner */}
      <section
        ref={heroRef}
        className={`team-hero ${heroRevealed ? 'revealed' : ''}`}
        aria-label="Đội ngũ Dấu Việt"
      >
        <div className="container team-hero__container">
          <div className="team-hero__badge">
            <Users size={16} aria-hidden="true" />
            <span>Những người kiến tạo</span>
          </div>
          <h1 className="team-hero__title">Đội ngũ Dấu Việt</h1>
          <p className="team-hero__subtitle">
            Tập hợp những người trẻ đam mê lịch sử dân tộc, công nghệ tương tác
            và khát vọng đổi mới phương pháp giáo dục thế hệ tương lai.
          </p>
        </div>
      </section>

      {/* 2. Team Intro Paragraph */}
      <section
        ref={introRef}
        className={`section team-intro ${introRevealed ? 'revealed' : ''}`}
        aria-labelledby="team-intro-title"
      >
        <div className="container container--narrow">
          <div className="team-intro__card card card--historical">
            <div className="team-intro__icon-badge" aria-hidden="true">
              <HeartHandshake size={28} />
            </div>
            <h2 id="team-intro-title" className="team-intro__headline">
              Tâm huyết vì một nền sử học sống động
            </h2>
            <p className="team-intro__text">
              Dấu Việt được sinh ra từ niềm tin chung: Lịch sử Việt Nam xứng đáng
              được kể lại bằng ngôn ngữ của thời đại số. Chúng tôi là nhóm sinh viên
              tại Đại học FPT Cần Thơ, kết nối bởi tình yêu với di sản văn hóa cha ông và mong
              muốn đem đến trải nghiệm học tập truyền cảm hứng, vượt ra khỏi những trang
              sách giáo khoa đơn thuần.
            </p>
            <p className="team-intro__subtext">
              Mỗi thành viên phụ trách một vai trò chuyên biệt – từ điều hành chiến lược,
              nghiên cứu và phát triển nội dung lịch sử, thiết kế sản phẩm UI/UX, quản lý
              công nghệ, truyền thông marketing đến hỗ trợ ngôn ngữ song ngữ.
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="divider" role="presentation">
        <span className="divider__icon">❖</span>
      </div>

      {/* 4. Team Member Cards Grid */}
      <section
        ref={gridRef}
        className={`section section--alt team-grid-section ${gridRevealed ? 'revealed' : ''}`}
        aria-labelledby="team-members-title"
      >
        <div className="container">
          <SectionHeader
            title="Thành viên dự án"
            subtitle="Gặp gỡ những cá nhân đứng sau thiết kế và phát triển nền tảng Dấu Việt"
          />

          {/* All 6 Members — Equal Grid */}
          <div className="team-grid">
            {teamMembers.map((member, idx) => {
              const bgGradient = avatarGradients[idx % avatarGradients.length];
              const initials = getInitials(member.name);

              return (
                <article
                  key={member.id}
                  className="team-card card card--historical"
                  aria-labelledby={`member-name-${member.id}`}
                >
                  <div className="team-card__top">
                    <div
                      className="team-card__avatar"
                      style={{ background: bgGradient }}
                      aria-hidden="true"
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={`Chân dung ${member.name}`}
                          className="team-card__avatar-img"
                        />
                      ) : (
                        <span className="team-card__initials">{initials}</span>
                      )}
                    </div>

                    <div className="team-card__info">
                      <h3 id={`member-name-${member.id}`} className="team-card__name">
                        {member.name}
                      </h3>
                      <div className="team-card__role-group">
                        <span className="team-card__role-abbr">{member.roleAbbr}</span>
                        <span className="team-card__role-title">{member.roleTitle}</span>
                      </div>
                      <div className="team-card__student-id">
                        <IdCard size={14} aria-hidden="true" />
                        <span>{member.studentId}</span>
                      </div>
                    </div>
                  </div>

                  <p className="team-card__bio">{member.bio}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. CTA to Contact Page */}
      <section
        ref={ctaRef}
        className={`section team-cta-section ${ctaRevealed ? 'revealed' : ''}`}
        aria-label="Liên hệ với đội ngũ"
      >
        <div className="container">
          <div className="team-cta card card--historical">
            <div className="team-cta__content">
              <span className="team-cta__badge">Hợp tác & Đóng góp</span>
              <h2 className="team-cta__title">
                Bạn muốn cùng chúng tôi phát triển Dấu Việt?
              </h2>
              <p className="team-cta__desc">
                Chúng tôi luôn chào đón các cố vấn sử học, giáo viên, nhà thiết kế
                hoặc bất kỳ ai chung đam mê số hóa di sản dân tộc. Hãy gửi lời nhắn cho chúng tôi!
              </p>
              <Link to="/contact" className="btn btn--primary btn--large team-cta__btn">
                <span>Liên hệ với đội ngũ</span>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
