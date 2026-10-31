import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, Map, Search, Lightbulb, GitBranch, Palmtree, Check, ArrowUpRight } from 'lucide-react';
import '../../styles/components/discoveryJourney.css';

const stages = [
  {
    title: 'Chọn thời kỳ', icon: Clock, label: 'Giao diện Timeline',
    heading: 'Bắt đầu từ một thời kỳ bạn tò mò',
    description: 'Đi qua bốn cột mốc từ Âu Lạc đến chiến thắng Bạch Đằng năm 938. Mỗi thời kỳ mở ra một bối cảnh, những nhân vật và câu chuyện để bạn khám phá.',
    insight: 'Bạn có thể bắt đầu với Bạch Đằng 938 — hành trình đang có bản demo tương tác.',
    features: ['Bốn thời kỳ lịch sử', 'Bối cảnh và sự kiện tiêu biểu', 'Chọn hành trình phù hợp'],
    link: 'periods', action: 'Xem các thời kỳ',
  },
  {
    title: 'Mở bản đồ', icon: Map, label: 'Bước vào bối cảnh',
    heading: 'Đặt câu chuyện lên bản đồ',
    description: 'Quan sát sa bàn sông Bạch Đằng để biết trận đánh diễn ra ở đâu. Từ cửa biển đến các nhánh sông, mỗi vị trí giúp bạn hình dung rõ hơn về chiến trường.',
    insight: 'Bản đồ là điểm xuất phát để tìm manh mối, thay vì ghi nhớ những sự kiện rời rạc.',
    features: ['Nhận diện địa điểm', 'Quan sát không gian trận đánh', 'Chọn dấu vết trên sa bàn'],
    link: 'demo', action: 'Mở trải nghiệm Bạch Đằng',
  },
  {
    title: 'Tìm dấu vết', icon: Search, label: 'Quan sát và khám phá',
    heading: 'Tự tay tìm ra điều còn ẩn giấu',
    description: 'Khám phá bốn dấu vết: thủy triều, Ngô Quyền, sông Bạch Đằng và quân Nam Hán. Kéo thanh mực nước để quan sát sự thay đổi của dòng sông và phát hiện bãi cọc.',
    insight: 'Bạn trực tiếp quan sát bằng chứng trước khi tìm lời giải cho chiến thắng.',
    features: ['Bốn dấu vết kết nối', 'Tương tác thủy triều', 'Thu thập bằng chứng'],
    link: 'demo', action: 'Thử tìm dấu vết',
  },
  {
    title: 'Đặt giả thuyết', icon: Lightbulb, label: 'Kết nối manh mối',
    heading: 'Từ điều quan sát đến lời giải của bạn',
    description: 'Vì sao phải chờ con nước? Địa hình và đối thủ có vai trò gì? Liên kết các dấu vết, chọn cách giải thích của bạn rồi đối chiếu với phần phân tích.',
    insight: 'Mỗi lựa chọn là cơ hội kiểm chứng suy nghĩ và hiểu lý do đằng sau sự kiện.',
    features: ['Câu hỏi gợi suy luận', 'Đối chiếu dấu vết', 'Giải thích sau mỗi lựa chọn'],
    link: 'demo', action: 'Bắt đầu hành trình suy luận',
  },
  {
    title: 'Dựng câu chuyện', icon: GitBranch, label: 'Tái hiện sự kiện',
    heading: 'Nối các sự kiện thành một câu chuyện',
    description: 'Sắp xếp các mốc từ chuẩn bị trận địa, nhử địch, triều rút đến phản công. Khi hiểu trình tự, bạn sẽ thấy các quyết định của Ngô Quyền kết nối với nhau như thế nào.',
    insight: 'Dựng lại trận đánh bằng những gì vừa khám phá giúp bạn nhớ cả diễn biến lẫn nguyên nhân.',
    features: ['Sắp xếp trình tự', 'Kiểm tra kết quả', 'Hiểu mối liên hệ nhân quả'],
    link: 'demo', action: 'Trải nghiệm dựng lại trận đánh',
  },
  {
    title: 'Tạo đảo di sản', icon: Palmtree, label: 'Lưu dấu hành trình',
    heading: 'Mang điều đã học về hòn đảo của bạn',
    description: 'Hoàn thành các chặng để nhận vật phẩm và trang trí đảo di sản. Hòn đảo dần thay đổi cùng những khám phá bạn đã thực hiện trong hành trình.',
    insight: 'Phần thưởng là dấu nhắc về từng bước bạn đã đi qua, từ tìm dấu vết đến tái hiện lịch sử.',
    features: ['Nhận vật phẩm qua nhiệm vụ', 'Trang trí hòn đảo', 'Lưu tiến trình trên trình duyệt'],
    link: 'island', action: 'Tìm hiểu đảo di sản',
  },
];

// Code-native illustrations keep all six scenes crisp and lightweight.
function JourneyArt({ step }) {
  const ink = '#efe2b9';
  return (
    <svg className="discovery-art" viewBox="0 0 480 300" fill="none" aria-hidden="true">
      <circle cx="379" cy="71" r="38" fill={ink} opacity=".3" />
      <path d="M0 184Q91 85 190 170T480 139V300H0Z" fill="#d5c48b" opacity=".19" />
      <path d="M0 248Q115 168 232 215T480 199V300H0Z" fill="#384333" opacity=".28" />
      <g stroke={ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {step === 0 && <>
          <path d="M65 119Q71 104 85 113H395Q411 102 416 119V235Q409 245 395 235H85Q69 246 65 234Z" fill="#e7d79e" fillOpacity=".2" />
          <path d="M111 177H373M249 113V91L267 76L288 91V113M244 91H292L267 68Z" />
          <path d="M267 68V49L289 57L267 64" />
          {[116, 199, 282, 365].map((x, i) => <g key={x}><circle cx={x} cy="177" r={i === 2 ? 10 : 6} fill={i === 2 ? '#606345' : ink} /><path d={`M${x - 15} 151h30M${x - 15} 204h30`} opacity=".45" /></g>)}
          <circle cx="282" cy="177" r="17" opacity=".6" />
        </>}
        {step === 1 && <>
          <path d="M74 74L175 49L290 78L406 51V224L290 250L175 221L74 248ZM175 49V221M290 78V250" fill="#f0e1b5" fillOpacity=".12" />
          <path d="M106 207C252 189 140 105 328 111S311 193 377 213" stroke="#b8d1c0" strokeWidth="15" opacity=".7" />
          <path d="M238 105C211 70 197 115 238 145C281 114 265 72 238 105Z" fill="#a8824c" /><circle cx="238" cy="111" r="7" />
          <path d="M106 100l13-21 13 21M337 76l13-21 13 21" opacity=".7" />
        </>}
        {step === 2 && <>
          <path d="M54 163Q98 147 143 163T232 163T321 163T426 163M54 185Q98 169 143 185T232 185T321 185T426 185" stroke="#b8d1c0" strokeWidth="3" />
          {[149, 194, 239, 284].map(x => <path key={x} d={`M${x} 251L${x + 15} 189L${x + 22} 182L${x + 24} 193L${x + 8} 253Z`} fill="#7a603f" />)}
          <circle cx="280" cy="117" r="44" fill="#d9cca0" fillOpacity=".16" /><path d="M312 150L352 190" strokeWidth="9" />
          <path d="M102 116h41l-8 16h-25ZM123 116V82L146 108H123" />
          <path d="M68 216H107M87 198v37" opacity=".5" />
        </>}
        {step === 3 && <>
          <path d="M145 105L241 75L344 132L264 222L145 105L113 213L264 222M241 75L264 222" strokeDasharray="5 7" opacity=".65" />
          {[[145,105],[241,75],[344,132],[113,213],[264,222]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="16" fill="#9e9162" />)}
          <circle cx="241" cy="151" r="36" fill="#d5c187" fillOpacity=".35" />
          <path d="M224 149c-9-29 42-29 34-2l-8 11v10h-18v-10ZM232 179h18M236 187h10" />
        </>}
        {step === 4 && <>
          <path d="M71 228H410M95 208L164 162L247 184L341 85" strokeDasharray="5 6" />
          {[[95,208],[164,162],[247,184],[341,85]].map(([x,y],i) => <g key={x}><rect x={x-24} y={y-29} width="48" height="43" rx="7" fill="#8b865b" /><text x={x} y={y-1} textAnchor="middle" stroke="none" fill={ink} fontSize="20">0{i+1}</text></g>)}
          <path d="M328 47l12-7 12 7v27h-24Z" fill="#d1b778" /><path d="M340 40V27L366 33L340 40" />
        </>}
        {step === 5 && <>
          <ellipse cx="238" cy="230" rx="156" ry="35" stroke="#bdd0ba" opacity=".45" /><path d="M101 205Q121 166 182 169L256 145Q322 144 365 200Q349 238 240 241Q132 242 101 205Z" fill="#bcb783" fillOpacity=".45" />
          <path d="M177 200L179 108M179 120Q136 88 123 125Q150 112 179 131M179 120Q215 86 241 123Q204 109 179 131M179 120Q172 69 144 83Q167 95 179 120" strokeWidth="4" />
          <path d="M255 191V144L281 124L307 144V191ZM247 144H314L281 116ZM271 191V166H289V191" fill="#8d875b" />
          <path d="M315 221L370 247M328 215L382 240M337 227L342 218M349 233L354 224M361 239L366 230" />
        </>}
      </g>
      <path d="M25 61V39H47M432 259H454V237" stroke={ink} opacity=".35" />
    </svg>
  );
}

export default function DiscoveryJourney({ id = 'how-it-works', periodsHref = '#historical-timeline', islandHref = '#personal-island' }) {
  const root = useRef(null);
  const { hash } = useLocation();
  const stepFromHash = () => {
    const prefix = `#${id}-step-`;
    const step = hash.startsWith(prefix) ? Number(hash.slice(prefix.length)) - 1 : -1;
    return Number.isInteger(step) && step >= 0 && step < stages.length ? step : null;
  };
  const [active, setActive] = useState(() => stepFromHash() ?? 0);

  useEffect(() => {
    const step = stepFromHash();
    if (step !== null) setActive(step);
  }, [hash, id]);

  const handleTabKey = (event, index) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % stages.length
      : event.key === 'ArrowLeft' ? (index + stages.length - 1) % stages.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? stages.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    root.current.querySelectorAll('[role="tab"]')[next].focus({ preventScroll: true });
  };

  useEffect(() => {
    const nav = root.current.querySelector('.discovery-nav');
    const link = nav.children[active];
    if (nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: 'instant' });
    }
  }, [active]);

  return (
    <section className="section discovery-journey" id={id} ref={root} aria-labelledby={`${id}-title`}>
      <div className="container">
        <header className="discovery-heading">
          <span className="discovery-eyebrow">Cách hoạt động</span>
          <h2 id={`${id}-title`}>Một hành trình, sáu bước khám phá</h2>
          <p>Từ chọn thời kỳ đến tạo đảo di sản. Chọn một chặng bên dưới để xem minh họa và tìm hiểu cách trải nghiệm.</p>
        </header>
        <div className="discovery-nav" role="tablist" aria-label="Sáu chặng khám phá">
          {stages.map(({ title, icon: Icon }, index) => (
            <button key={title} type="button" role="tab" id={`${id}-tab-${index + 1}`} aria-controls={`${id}-step-${index + 1}`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} className={active === index ? 'is-current' : ''} onClick={() => setActive(index)} onKeyDown={event => handleTabKey(event, index)}>
              <span className="discovery-nav__top"><span>0{index + 1}</span><Icon size={17} aria-hidden="true" /></span>
              <span>{title}</span>
            </button>
          ))}
        </div>
        <div className="discovery-stages">
          {stages.map((stage, index) => (
            <article className="discovery-step" id={`${id}-step-${index + 1}`} data-step={index} key={stage.title} role="tabpanel" aria-labelledby={`${id}-tab-${index + 1}`} hidden={active !== index} tabIndex={0}>
              <div className={`discovery-scene discovery-scene--${index + 1}`}>
                <span className="discovery-scene__label">Sổ tay nhà khám phá</span>
                <JourneyArt step={index} />
                <div className="discovery-scene__caption"><span>Chặng 0{index + 1} / 06</span><h3>{stage.title}</h3><small>Minh họa hành trình Dấu Việt</small></div>
              </div>
              <div className="discovery-copy">
                <div className="discovery-copy__label"><span>0{index + 1}</span>{stage.label}</div>
                <h3 id={`${id}-heading-${index}`}>{stage.heading}</h3>
                <p>{stage.description}</p>
                <aside className="discovery-insight"><span>Một góc nhìn gợi mở</span><p>{stage.insight}</p></aside>
                <ul>{stage.features.map(feature => <li key={feature}><Check size={15} aria-hidden="true" />{feature}</li>)}</ul>
                <a className="discovery-link" href={stage.link === 'periods' ? periodsHref : stage.link === 'island' ? islandHref : '/#trai-nghiem'}>{stage.action}<ArrowUpRight size={16} aria-hidden="true" /></a>
                {index < 5 && <button type="button" className="discovery-next" onClick={() => setActive(index + 1)}>Tiếp theo: {stages[index + 1].title}<ArrowUpRight size={14} aria-hidden="true" /></button>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
