import HomePage from './HomePage';
import DiscoveryJourney from '../components/explore/DiscoveryJourney';
import { LandingAbout, LandingPeriods, LandingInvestigation, LandingIslands, LandingFeatures, LandingContact } from '../components/landing/LandingSections';
import TeamPage from './TeamPage';
import '../styles/pages/onePage.css';

export default function OnePage() {
  return (
    <div className="one-page compact-landing">
      <section id="trang-chu" className="one-page-section" aria-label="Trang chủ">
        <HomePage landingOnly />
      </section>
      <LandingAbout />
      <DiscoveryJourney id="how-it-works" className="one-page-section" />
      <LandingPeriods />
      <LandingInvestigation />
      <LandingIslands />
      <LandingFeatures />
      <section id="team" className="one-page-section" aria-label="Đội ngũ Dấu Việt">
        <TeamPage compact />
      </section>
      <LandingContact />
    </div>
  );
}
