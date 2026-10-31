import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpRight, Search, Lightbulb, Puzzle, Waves, UserRound, MapPin, Swords, Gift, Palette, Save, Volume2, Sparkles, Mail } from 'lucide-react';
import { historicalPeriods } from '../../data/historicalPeriods';
import { personalIslands } from '../../data/islands';
import DemoPage from '../../pages/DemoPage';
import battlefield from '../../assets/bach-dang/team-background.png';
import '../../styles/components/landingSections.css';

function Heading({ eyebrow, title, children }) {
  return <header className="landing-heading"><span>{eyebrow}</span><h2>{title}</h2>{children && <p>{children}</p>}</header>;
}

export function LandingAbout() {
  return <section id="about" className="section one-page-section landing-section"><div className="container">
    <Heading eyebrow="Về Dấu Việt" title="Lịch sử gần hơn khi bạn tự mình khám phá">Dấu Việt đưa bạn vào vai người khám phá: tìm dấu vết, kết nối manh mối và dựng lại những câu chuyện lịch sử Việt Nam.</Heading>
    <div className="landing-pillars">{[[Search, 'Quan sát dấu vết', 'Bắt đầu từ nhân vật, địa điểm và những điều còn ẩn giấu.'], [Lightbulb, 'Tự mình suy luận', 'Đặt câu hỏi và tìm lời giải từ những bằng chứng đã thấy.'], [Puzzle, 'Ghi nhớ qua trải nghiệm', 'Tái hiện sự kiện để hiểu diễn biến và nguyên nhân.']].map(([Icon, title, text]) => <div key={title}><Icon size={23} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></div>)}</div>
    <blockquote className="landing-quote">“Lịch sử nước mình hào hùng và đầy chất điện ảnh, nhưng cách chúng ta tiếp cận nó bấy lâu nay dường như đang làm mất đi vẻ đẹp kỳ vĩ ấy.”</blockquote>
  </div></section>;
}

function PeriodArt({ index }) {
  return <svg viewBox="0 0 320 180" fill="none" aria-hidden="true">
    <circle cx="258" cy="48" r="30" fill="#f0d69d" opacity=".55" /><path d="M0 133Q80 72 160 130T320 109V180H0Z" fill="#f4dbab" opacity=".13" />
    <g stroke="#f3dfb0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {index < 2 ? <>
        <path d="M42 143Q45 105 95 105L130 120L143 141L134 148L122 136L107 133L106 164H94L90 139H65L55 163H44L51 131M47 123L35 153" fill="#584b3d" fillOpacity=".7" />
        <path d="M82 105V86L91 75L101 86V108M91 75V41L124 51L91 64" fill="#d7b475" />
        {index === 0 ? <><path d="M168 143Q173 104 219 105L258 120L271 141L262 148L250 136L235 133L234 164H222L218 139H193L183 163H172L179 131M175 123L163 153" fill="#584b3d" fillOpacity=".7" /><path d="M210 105V86L219 75L229 86V108M219 75V41L252 51L219 64" fill="#d7b475" /></> : <><path d="M179 149Q192 83 241 104L265 130L257 151H246V130L225 120L219 164H205L205 134L194 164H181M266 128Q284 151 274 161" fill="#584b3d" fillOpacity=".7" /><path d="M224 105V78L234 66L244 78V107M234 66V30L269 43L234 55" fill="#d7b475" /></>}
      </> : index === 2 ? <>
        <path d="M44 148H276M54 156H286M73 145V93H249V145M118 145V111H148V145M177 145V111H207V145" fill="#354f42" /><path d="M42 94Q112 82 161 45Q208 82 279 94ZM97 66Q136 54 161 24Q185 55 225 66Z" fill="#afac75" /><path d="M161 24V13" />
      </> : <>
        <path d="M59 116H266L243 141H84ZM153 111V32L109 111ZM159 111V43L205 111Z" fill="#d6c894" /><path d="M159 43V18M0 149Q40 132 80 149T160 149T240 149T320 149M0 170Q40 153 80 170T160 170T240 170T320 170M36 163L43 130L50 165M279 164L286 130L293 165" />
      </>}
    </g>
  </svg>;
}

export function LandingPeriods() {
  const locations = ['Mê Linh · Hát Môn', 'Núi Nưa · Thanh Hóa', 'Nhà nước Vạn Xuân', 'Sông Bạch Đằng'];
  return <section id="periods" className="section one-page-section landing-section"><div className="container">
    <Heading eyebrow="Bốn thời kỳ chính" title="Bốn chương lịch sử, bốn hành trình khám phá">Hai Bà Trưng, Bà Triệu, Lý Bí và Ngô Quyền — những câu chuyện về ý chí độc lập và tự chủ.</Heading>
    <div className="landing-periods">{historicalPeriods.map((period, index) => <article className={`landing-period landing-period--${index + 1}`} key={period.id}>
      <div className="landing-period__era">{period.era}</div><div className="landing-period__art"><span>Chương 0{index + 1}</span><PeriodArt index={index} /></div>
      <div className="landing-period__copy"><span className="landing-period__place"><MapPin size={13} aria-hidden="true" />{locations[index]}</span><h3>{period.title}</h3><p>{period.shortDescription}</p>
        <details><summary>Mở hồ sơ lịch sử <ArrowUpRight size={16} aria-hidden="true" /></summary><p>{period.description}</p></details>
        {period.hasDemo && <a href="/#trai-nghiem" className="landing-text-link">Trải nghiệm Bạch Đằng <ArrowUpRight size={15} aria-hidden="true" /></a>}
      </div>
    </article>)}</div>
  </div></section>;
}

export function LandingInvestigation() {
  const { hash, key } = useLocation();
  const isDemoLink = hash === '#trai-nghiem' || hash === '#demo';
  const [opened, setOpened] = useState(isDemoLink);
  const [visited, setVisited] = useState(isDemoLink);
  const panel = useRef(null);
  useEffect(() => { if (isDemoLink) { setOpened(true); setVisited(true); } }, [hash, key]);
  const open = () => { setVisited(true); setOpened(true); requestAnimationFrame(() => panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' })); };
  return <section id="investigation" className="section one-page-section landing-section">
    <div className="container landing-investigation">
      <div className="landing-battle-preview"><img src={battlefield} alt="Minh họa sông nước và chiến trường Bạch Đằng" loading="lazy" /><span>Bạch Đằng · Năm 938</span></div>
      <div className="landing-investigation__copy"><Heading eyebrow="Khám phá" title="Đi tìm lời giải trên sông Bạch Đằng">Kéo mực nước để phát hiện bãi cọc, tìm hiểu người chỉ huy, chiến trường và đối thủ. Từ bốn dấu vết, tự mình giải mã chiến thắng.</Heading>
        <div className="landing-clues">{[[Waves, 'Thủy triều'], [UserRound, 'Ngô Quyền'], [MapPin, 'Sông Bạch Đằng'], [Swords, 'Quân Nam Hán']].map(([Icon, title]) => <span key={title}><Icon size={16} aria-hidden="true" />{title}</span>)}</div>
        <button type="button" className="btn btn--primary landing-open-demo" onClick={open} aria-expanded={opened} aria-controls="trai-nghiem">Mở trải nghiệm tương tác <ArrowUpRight size={17} aria-hidden="true" /></button>
      </div>
    </div>
    <div id="trai-nghiem" ref={panel} className="landing-demo-panel" hidden={!opened}>
      <div className="container landing-demo-toolbar"><span>Trải nghiệm Bạch Đằng 938</span><button type="button" className="btn btn--secondary btn--small landing-close-demo" onClick={() => { setOpened(false); document.getElementById('investigation').scrollIntoView({ block: 'start', behavior: 'instant' }); }}>Thu gọn trải nghiệm</button></div>
      {visited && <DemoPage embedded />}
    </div>
  </section>;
}

export function LandingIslands() {
  const [active, setActive] = useState(0);
  const island = personalIslands[active];
  return <section id="islands" className="section one-page-section landing-section"><div className="container">
    <Heading eyebrow="Đảo di sản" title="Mang một phần lịch sử về thế giới của bạn">Nhận vật phẩm qua hành trình khám phá và dùng chúng để trang trí hòn đảo của riêng mình.</Heading>
    <div className="landing-islands"><div className="landing-islands__image"><img src={island.image} alt={island.alt} loading="lazy" /></div>
      <div className="landing-islands__copy"><div className="landing-island-options" role="group" aria-label="Xem trước quy mô đảo">{personalIslands.map((item, index) => <button type="button" key={item.id} aria-pressed={active === index} onClick={() => setActive(index)}>{item.title}</button>)}</div>
        <div aria-live="polite"><h3>{island.title}</h3><p>{island.description.split('. ')[0]}.</p></div>
        <ul><li>Thu thập vật phẩm qua thử thách</li><li>Tự chọn vị trí và xoay hướng khi bài trí</li><li>Tiến trình được lưu trên trình duyệt</li></ul>
        <a className="landing-text-link" href="/#trai-nghiem">Mở trải nghiệm và khám phá đảo của tôi <ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </div>
  </div></section>;
}

export function LandingFeatures() {
  const features = [[Waves, 'Tương tác trực quan', 'Quan sát thủy triều và tự phát hiện điều ẩn dưới mặt nước.'], [Gift, 'Điểm & vật phẩm', 'Hoàn thành thử thách để ghi nhận tiến độ và nhận phần thưởng.'], [Palette, 'Tự do sáng tạo', 'Đặt, di chuyển và xoay vật phẩm trên đảo di sản.'], [Save, 'Lưu hành trình', 'Tiếp tục trải nghiệm trên trình duyệt bạn đang sử dụng.'], [Volume2, 'Âm thanh tùy chọn', 'Bật hoặc tắt âm thanh theo cách bạn muốn trải nghiệm.'], [Sparkles, 'Không gian di sản', 'Nền giấy ấm, lá bay nhẹ và chế độ giảm chuyển động.']];
  return <section id="gamification" className="section one-page-section landing-section"><div className="container"><Heading eyebrow="Tính năng" title="Mỗi lần khám phá, thêm một dấu ấn">Những chi tiết nhỏ giúp hành trình học lịch sử trở nên gần gũi và có cảm hứng hơn.</Heading>
    <div className="landing-features">{features.map(([Icon, title, text]) => <article key={title}><Icon size={22} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
  </div></section>;
}

export function LandingContact() {
  return <section id="contact" className="section one-page-section landing-section"><div className="container landing-contact">
    <Heading eyebrow="Liên hệ" title="Cùng đánh thức những câu chuyện di sản">Bạn muốn góp ý, hợp tác hoặc đồng hành cùng Dấu Việt? Hãy gửi lời nhắn cho chúng mình.</Heading>
    <div className="landing-contact__links"><a href="mailto:contact@historydauviet.id.vn"><Mail size={20} aria-hidden="true" /><span><small>Email Dấu Việt</small>contact@historydauviet.id.vn</span><ArrowUpRight size={17} aria-hidden="true" /></a><a href="https://www.facebook.com/dauviet05" target="_blank" rel="noopener noreferrer"><UserRound size={20} aria-hidden="true" /><span><small>Kết nối với dự án</small>Facebook Dấu Việt</span><ArrowUpRight size={17} aria-hidden="true" /></a></div>
    <p className="landing-contact__address"><MapPin size={16} aria-hidden="true" />Trường Đại học FPT Cần Thơ · 600 Nguyễn Văn Cừ nối dài, Cần Thơ</p>
  </div></section>;
}
