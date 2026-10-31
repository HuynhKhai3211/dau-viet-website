import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  Brain,
  History,
  Sparkles,
  Shield,
  Heart,
  ArrowRight,
  CheckCircle2,
  Layers,
  Lightbulb,
  BookOpen,
  Award,
  Clock,
} from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import useScrollReveal from '../hooks/useScrollReveal';
import AnimatedMascot from '../components/common/AnimatedMascot';
import '../styles/pages/about.css';

export default function AboutPage() {
  const [heroRef, heroRevealed] = useScrollReveal(0.1);
  const [introRef, introRevealed] = useScrollReveal(0.15);
  const [problemRef, problemRevealed] = useScrollReveal(0.15);
  const [missionRef, missionRevealed] = useScrollReveal(0.15);
  const [visionRef, visionRevealed] = useScrollReveal(0.15);
  const [ctaRef, ctaRevealed] = useScrollReveal(0.15);

  const learningPillars = [
    {
      icon: Search,
      title: 'Thu thập Dấu Vết',
      desc: 'Truy tìm các mảnh ghép chứng cứ, cổ vật và tư liệu rải rác trong từng bối cảnh lịch sử.',
    },
    {
      icon: Brain,
      title: 'Suy luận & Đối chiếu',
      desc: 'Đặt giả thuyết logic, xâu chuỗi mối quan hệ nhân quả thay vì học vẹt ngày tháng.',
    },
    {
      icon: History,
      title: 'Tái hiện Sự kiện',
      desc: 'Sắp xếp diễn biến trận đánh và các mốc thời gian then chốt để khôi phục toàn cảnh quá khứ.',
    },
    {
      icon: Award,
      title: 'Khắc ghi & Phần thưởng',
      desc: 'Được vinh danh qua hệ sinh thái điểm thưởng, mở rộng đảo cá nhân và huân chương lịch sử.',
    },
  ];

  const missionItems = [
    {
      icon: Lightbulb,
      title: 'Dễ dàng tiếp cận',
      desc: 'Chuyển hóa những trang sử dày đặc và phức tạp thành giao diện tương tác 2.5D trực quan, giúp người học ở mọi lứa tuổi dễ dàng tiếp thu kiến thức mà không cảm thấy nặng nề.',
    },
    {
      icon: Heart,
      title: 'Khơi gợi cảm xúc',
      desc: 'Không dừng lại ở việc truyền đạt thông tin, Dấu Việt đánh thức niềm tự hào dân tộc thông qua câu chuyện anh hùng, những quyết sách mang tính bước ngoặt và tinh thần bất khuất của tiền nhân.',
    },
    {
      icon: Shield,
      title: 'Ý nghĩa dài lâu',
      desc: 'Rèn luyện năng lực tư duy phản biện, kỹ năng phân tích chứng cứ lịch sử và hình thành thái độ tôn trọng, gìn giữ bản sắc văn hóa ngàn năm của dân tộc Việt Nam.',
    },
  ];

  const comparisonPoints = [
    {
      traditional: 'Học vẹt mốc thời gian và số liệu khô khan',
      dauviet: 'Nhập vai nhà thám hiểm, chủ động khám phá bối cảnh',
    },
    {
      traditional: 'Tiếp nhận thông tin một chiều từ sách vở',
      dauviet: 'Tương tác đa chiều qua bản đồ 2.5D và mô hình diorama',
    },
    {
      traditional: 'Mau quên sau các kỳ kiểm tra học kỳ',
      dauviet: 'Khắc sâu kiến thức qua chuỗi thử thách suy luận logic',
    },
    {
      traditional: 'Cảm giác xa cách với các nhân vật quá khứ',
      dauviet: 'Đồng cảm cùng bối cảnh, thấu hiểu quyết định lịch sử',
    },
  ];

  return (
    <div className="about-page">
      {/* 1. Hero Banner */}
      <section
        ref={heroRef}
        className={`about-hero ${heroRevealed ? 'revealed' : ''}`}
        aria-label="Giới thiệu về Dấu Việt"
      >
        <div className="container about-hero__container">
          <div className="about-hero__badge">
            <Compass size={16} aria-hidden="true" />
            <span>Hành trình số hóa di sản</span>
          </div>
          <h2 className="about-hero__title">Về Dấu Việt</h2>
          <p className="about-hero__subtitle">
            Dự án giáo dục lịch sử Việt Nam tương tác – nơi quá khứ không còn là
            những trang giấy cũ, mà trở thành cuộc phiêu lưu tri thức sống động,
            đầy cảm hứng và tự hào.
          </p>
          <div className="about-hero__meta">
            <span className="about-hero__tag">
              <Clock size={15} aria-hidden="true" /> Khám phá đa thời kỳ
            </span>
            <span className="about-hero__tag">
              <Layers size={15} aria-hidden="true" /> Mô hình diorama 2.5D
            </span>
            <span className="about-hero__tag">
              <Sparkles size={15} aria-hidden="true" /> Học qua Gamification
            </span>
          </div>

          {/* Friendly Mascot Companion */}
          <div className="about-hero__mascot">
            <AnimatedMascot
              size="medium"
              variant="greeting"
              message="Chào bạn! Cùng mình khám phá sứ mệnh giáo dục lịch sử nhé!"
              interactive={true}
            />
          </div>
        </div>
      </section>

      {/* 2. Dấu Việt là gì? */}
      <section
        ref={introRef}
        className={`section about-intro ${introRevealed ? 'revealed' : ''}`}
        aria-labelledby="about-intro-title"
      >
        <div className="container">
          <SectionHeader
            title="Dấu Việt là gì?"
            subtitle="Một phương thức tiếp cận lịch sử hoàn toàn mới dành cho người học hiện đại"
          />

          <div className="about-intro__grid">
            <div className="about-intro__content">
              <p className="about-intro__lead">
                <strong>Dấu Việt</strong> là ứng dụng học tập lịch sử tương tác,
                kết hợp hài hòa giữa công nghệ đồ họa diorama 2.5D và phương pháp
                sư phạm giải quyết vấn đề (Inquiry-based Learning).
              </p>
              <p>
                Thay vì đọc những trang văn bản dài và ghi nhớ mốc thời gian một cách
                máy móc, người học sẽ trở thành những <em>“Nhà thám tử lịch sử”</em>.
                Bạn sẽ di chuyển qua các thời kỳ hào hùng của dân tộc, tự mình
                tìm kiếm chứng tích, phân tích nguồn sử liệu và lắp ghép bức
                tranh toàn cảnh của từng sự kiện trọng đại.
              </p>

              <div className="about-pillars">
                {learningPillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div key={idx} className="about-pillar-item">
                      <div className="about-pillar-item__icon" aria-hidden="true">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="about-pillar-item__title">{pillar.title}</h3>
                        <p className="about-pillar-item__desc">{pillar.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="about-intro__media">
              <figure className="about-diorama-card card card--historical">
                <div className="about-diorama-card__image-wrapper">
                  <img
                    src="/images/historical/historical-diorama.png"
                    alt="Mô hình diorama 2.5D lịch sử Việt Nam với Tượng Bà Triệu, Căn cứ Núi Nưa và Bến xuất quân"
                    className="about-diorama-card__img"
                    loading="lazy"
                  />
                  <div className="about-diorama-card__overlay">
                    <span className="about-diorama-card__tag">
                      Góc nhìn Diorama 2.5D
                    </span>
                  </div>
                </div>
                <figcaption className="about-diorama-card__caption">
                  <p className="about-diorama-card__headline">
                    Bối cảnh khởi nghĩa Bà Triệu (Năm 248)
                  </p>
                  <p className="about-diorama-card__text">
                    Mô hình trực quan tái hiện không gian căn cứ Núi Nưa, bến thuyền xuất quân
                    và tượng đài tưởng niệm anh hùng dân tộc Triệu Thị Trinh.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="divider" role="presentation">
        <span className="divider__icon">❖</span>
      </div>

      {/* 3. Vì sao chúng tôi tạo ra Dấu Việt? */}
      <section
        ref={problemRef}
        className={`section section--alt about-problem ${problemRevealed ? 'revealed' : ''}`}
        aria-labelledby="about-problem-title"
      >
        <div className="container">
          <SectionHeader
            title="Vì sao chúng tôi tạo ra Dấu Việt?"
            subtitle="Từ nỗi trăn trở của những người trẻ yêu lịch sử Việt Nam"
          />

          <div className="about-story">
            <div className="about-story__quote">
              <blockquote>
                “Lịch sử nước mình hào hùng và đầy chất điện ảnh, nhưng cách chúng ta tiếp cận
                nó bấy lâu nay dường như đang làm mất đi vẻ đẹp kỳ vĩ ấy.”
              </blockquote>
            </div>

            <div className="about-story__body">
              <p>
                Qua nhiều thế hệ học sinh, môn Lịch sử thường gắn liền với định kiến:
                nhiều số liệu cần thuộc lòng, bài giảng khô cứng và thi cử nặng nề.
                Nhiều người Việt trưởng thành nhận ra mình nhớ rõ các triều đại ngoại quốc
                hơn cả những cột mốc chói lọi của cha ông tại Bạch Đằng, Chi Lăng hay Điện Biên.
              </p>
              <p>
                Chúng tôi đặt câu hỏi: <strong>Nếu người học không phải học thuộc, mà được sống trong lịch sử thì sao?</strong>
                Đó chính là khởi nguồn của Dấu Việt. Chúng tôi muốn trao cho người học
                lăng kính mới – nơi mỗi sự kiện là một câu chuyện trinh thám trí tuệ,
                và mỗi nhân vật lịch sử là một tấm gương sống động bước ra từ ký ức non sông.
              </p>
            </div>
          </div>

          {/* Comparison Table / Cards */}
          <div className="about-comparison">
            <h3 className="about-comparison__title">Sự khác biệt trong phương pháp tiếp cận</h3>
            <div className="about-comparison__grid">
              <div className="about-comparison__col about-comparison__col--trad">
                <div className="about-comparison__col-header">
                  <span className="about-comparison__badge about-comparison__badge--trad">
                    Cách học truyền thống
                  </span>
                  <h4>Ghi nhớ thụ động</h4>
                </div>
                <ul className="about-comparison__list">
                  {comparisonPoints.map((item, idx) => (
                    <li key={idx} className="about-comparison__item">
                      <span className="about-comparison__mark about-comparison__mark--trad">✕</span>
                      <span>{item.traditional}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="about-comparison__col about-comparison__col--dv card--historical">
                <div className="about-comparison__col-header">
                  <span className="about-comparison__badge about-comparison__badge--dv">
                    Phương pháp Dấu Việt
                  </span>
                  <h4>Chủ động suy luận & Khám phá</h4>
                </div>
                <ul className="about-comparison__list">
                  {comparisonPoints.map((item, idx) => (
                    <li key={idx} className="about-comparison__item">
                      <span className="about-comparison__mark about-comparison__mark--dv">✓</span>
                      <span>{item.dauviet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="divider" role="presentation">
        <span className="divider__icon">❖</span>
      </div>

      {/* 4. Sứ mệnh giáo dục */}
      <section
        ref={missionRef}
        className={`section about-mission ${missionRevealed ? 'revealed' : ''}`}
        aria-labelledby="about-mission-title"
      >
        <div className="container">
          <SectionHeader
            title="Sứ mệnh giáo dục"
            subtitle="Đưa lịch sử trở thành nguồn cảm hứng bất tận cho thế hệ trẻ Việt Nam"
          />

          <div className="about-mission__grid">
            {missionItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <article key={idx} className="about-mission__card card card--historical">
                  <div className="about-mission__icon-wrap" aria-hidden="true">
                    <Icon size={28} />
                  </div>
                  <h3 className="about-mission__card-title">{item.title}</h3>
                  <p className="about-mission__card-desc">{item.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="divider" role="presentation">
        <span className="divider__icon">❖</span>
      </div>

      {/* 5. Tầm nhìn */}
      <section
        ref={visionRef}
        className={`section section--alt about-vision ${visionRevealed ? 'revealed' : ''}`}
        aria-labelledby="about-vision-title"
      >
        <div className="container">
          <SectionHeader
            title="Tầm nhìn tương lai"
            subtitle="Kiến tạo nhịp cầu số nối liền quá khứ ngàn năm và kỷ nguyên công nghệ"
          />

          <div className="about-vision__content card card--historical">
            <div className="about-vision__inner">
              <div className="about-vision__badge">
                <Sparkles size={18} aria-hidden="true" />
                <span>Định hướng chiến lược</span>
              </div>
              <h3 className="about-vision__headline">
                Trở thành hệ sinh thái học sử tương tác hàng đầu dành cho người Việt
              </h3>
              <p className="about-vision__lead">
                Chúng tôi hướng tới việc hoàn thiện bản đồ số hóa toàn bộ các thời kỳ
                lịch sử Việt Nam – từ thuở các Vua Hùng dựng nước đến thời đại Hồ Chí Minh.
                Mỗi giai đoạn sẽ là một không gian khám phá phong phú, với các sự kiện,
                trận chiến và danh nhân được tái dựng cẩn trọng dưới sự cố vấn chuyên môn.
              </p>

              <div className="about-vision__goals">
                <div className="about-vision__goal-item">
                  <CheckCircle2 className="about-vision__check" size={20} aria-hidden="true" />
                  <div>
                    <strong>Chuẩn hóa dữ liệu lịch sử:</strong>
                    <span> Nội dung được tham vấn từ các tư liệu sử học uy tín của Viện Sử học và các nhà nghiên cứu chuyên sâu.</span>
                  </div>
                </div>
                <div className="about-vision__goal-item">
                  <CheckCircle2 className="about-vision__check" size={20} aria-hidden="true" />
                  <div>
                    <strong>Mở rộng nền tảng trải nghiệm:</strong>
                    <span> Phát triển ứng dụng trên đa nền tảng (Web, Mobile, Tablet) đồng bộ hóa liền mạch quá trình học tập.</span>
                  </div>
                </div>
                <div className="about-vision__goal-item">
                  <CheckCircle2 className="about-vision__check" size={20} aria-hidden="true" />
                  <div>
                    <strong>Lan tỏa văn hóa ra thế giới:</strong>
                    <span> Hỗ trợ đa ngôn ngữ trong tương lai nhằm giới thiệu bản sắc lịch sử Việt Nam tới bạn bè quốc tế và kiều bào.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section
        ref={ctaRef}
        className={`section about-cta-section ${ctaRevealed ? 'revealed' : ''}`}
        aria-label="Kêu gọi hành động"
      >
        <div className="container">
          <div className="about-cta card card--historical">
            <div className="about-cta__content">
              <span className="about-cta__badge">Trải nghiệm Dấu Việt</span>
              <h2 className="about-cta__title">
                Sẵn sàng bước vào hành trình khám phá quá khứ?
              </h2>
              <p className="about-cta__desc">
                Cùng hòa mình vào trận chiến Bạch Đằng lịch sử năm 938, tìm kiếm dấu tích
                cọc gỗ và tái hiện chiến công hiển hách của Ngô Quyền ngay trên bản demo tương tác.
              </p>
              <div className="about-cta__buttons">
                <Link to="/#trai-nghiem" className="btn btn--primary btn--large">
                  <span>Trải nghiệm bản thử nghiệm</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </Link>
                <Link to="/#kham-pha" className="btn btn--secondary btn--large">
                  <span>Xem lộ trình khám phá</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
