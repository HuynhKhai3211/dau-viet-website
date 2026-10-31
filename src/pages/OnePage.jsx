import HomePage, { CoreFeaturesSection, AppDownloadSection } from './HomePage';
import AboutPage from './AboutPage';
import ExplorePage from './ExplorePage';
import DemoPage from './DemoPage';
import TeamPage from './TeamPage';
import ContactPage from './ContactPage';
import '../styles/pages/onePage.css';

export default function OnePage() {
  return (
    <div className="one-page">
      <section id="trang-chu" className="one-page-section" aria-label="Trang chủ">
        <HomePage landingOnly />
      </section>
      <section id="gioi-thieu" className="one-page-section" aria-label="Giới thiệu Dấu Việt">
        <AboutPage />
        <CoreFeaturesSection />
      </section>
      <section id="kham-pha" className="one-page-section" aria-label="Khám phá Dấu Việt">
        <ExplorePage />
      </section>
      <section id="trai-nghiem" className="one-page-section" aria-labelledby="experience-heading">
        <header className="one-page-experience-heading container">
          <span>Thử làm nhà khám phá</span>
          <h2 id="experience-heading">Trải nghiệm Bạch Đằng 938</h2>
          <p>Tìm dấu vết, suy luận và tái hiện trận đánh ngay bên dưới.</p>
        </header>
        <DemoPage embedded />
        <AppDownloadSection />
      </section>
      <section id="doi-ngu" className="one-page-section" aria-label="Đội ngũ Dấu Việt">
        <TeamPage />
      </section>
      <section id="lien-he" className="one-page-section" aria-label="Liên hệ Dấu Việt">
        <ContactPage />
      </section>
    </div>
  );
}
