import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Clock, Map, BookOpen, Search, Brain, CheckCircle, Puzzle,
  Award, Palmtree, ArrowLeft, ArrowRight, ChevronRight, Sparkles,
} from 'lucide-react';
import { learningJourney } from '../../data/historicalPeriods';
import battlefield from '../../assets/bach-dang/team-background.png';
import '../../styles/components/learningJourney.css';

const icons = { MapPin, Clock, Map, BookOpen, Search, Brain, CheckCircle, Puzzle, Award, Palmtree };
const details = [
  'Bắt đầu tại không gian hòn đảo bình yên của bạn. Đây là trung tâm chỉ huy, nơi hiển thị huy hiệu, tiến độ các triều đại và cổng dịch chuyển tới các màn chơi.',
  'Chọn niên đại muốn khám phá thông qua trục thời gian trực quan. Mỗi cột mốc mở ra một bối cảnh, những nhân vật và câu chuyện lịch sử riêng.',
  'Mỗi thời kỳ sở hữu một bản đồ địa lý 2.5D riêng biệt, phản ánh địa hình, sông núi và các thành trì cổ kính thời bấy giờ.',
  'Chọn một sự kiện cụ thể, như trận Bạch Đằng năm 938, để bắt đầu tìm hiểu bối cảnh lịch sử và mưu lược quân sự.',
  'Khám phá sa bàn và tương tác với từng điểm đánh dấu để tìm đủ 4 Dấu Vết: thủy triều, bãi cọc gỗ, địa hình sông Bạch Đằng và chiến thuật của Ngô Quyền.',
  'Kết nối các dữ kiện thu được và đặt giả thuyết: tại sao thời điểm cùng bãi cọc lại quyết định sự thành bại của trận đánh?',
  'Đối chiếu suy luận với lời giải và tư liệu lịch sử. Nhận phản hồi để củng cố kiến thức hoặc điều chỉnh giả thuyết của mình.',
  'Kéo thả các mảnh ghép thời gian để tái hiện trình tự diễn biến: nhử địch vào bãi cọc khi nước lớn, phản công khi thủy triều rút.',
  'Nhận điểm Dấu Việt, điểm kinh nghiệm XP và vật phẩm trang trí sau những thử thách. Mỗi phần thưởng lưu lại một dấu ấn trong hành trình khám phá.',
  'Trở về đảo riêng, chọn vật phẩm đã mở khóa và đặt vào vị trí yêu thích. Trồng cây, dựng nhà, trang trí bến thuyền để tạo nên hòn đảo tri thức của bạn.',
];
const notes = [
  'Một hòn đảo riêng để lưu lại từng dấu ấn học tập.',
  'Bắt đầu từ thời kỳ khiến bạn tò mò nhất.',
  'Quan sát địa hình để hiểu bối cảnh của câu chuyện.',
  'Bạch Đằng 938 là hành trình bạn có thể trải nghiệm ngay.',
  'Quan sát kỹ từng Dấu Vết trước khi đưa ra kết luận.',
  'Dùng chứng cứ để giải thích lựa chọn của bạn.',
  'Mỗi lần điều chỉnh là một lần hiểu lịch sử sâu hơn.',
  'Xâu chuỗi diễn biến để thấy rõ bước ngoặt của trận đánh.',
  'Vật phẩm mới sẽ xuất hiện trong kho Đảo của tôi.',
  'Thuyền và cọc được đặt dưới nước; cây và nhà nằm trên đảo.',
];

function getIllustration(step) {
  if (step === 1 || step >= 9) return {
    src: '/images/islands/island-medium.jpg',
    alt: 'Hòn đảo xanh giữa biển với bãi cát và cầu gỗ',
    caption: step >= 9 ? 'Mang những điều học được về hòn đảo của bạn' : 'Hòn đảo tri thức · Điểm bắt đầu của hành trình',
  };
  if (step <= 3) return {
    src: '/images/historical/historical-diorama.png',
    alt: 'Sa bàn minh họa các công trình và dấu tích lịch sử',
    caption: 'Khám phá từng thời kỳ qua những sa bàn lịch sử',
  };
  return {
    src: battlefield,
    alt: 'Núi rừng và dòng sông trong mô phỏng trận địa Bạch Đằng',
    caption: 'Bạch Đằng 938 · Theo con nước, giải mã thế trận',
  };
}

export default function LearningJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const hoverTimer = useRef(null);
  const tabRefs = useRef([]);
  const id = useId();
  const activeStep = learningJourney[activeIndex];
  const ActiveIcon = icons[activeStep.icon] || MapPin;
  const illustration = getIllustration(activeStep.step);
  const stage = activeIndex < 4 ? 'Khám phá' : activeIndex < 8 ? 'Giải mã lịch sử' : 'Kiến tạo hòn đảo';

  const cancelHover = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const selectStep = index => {
    cancelHover();
    setActiveIndex(index);
  };
  const previewStep = (event, index) => {
    if (event.pointerType !== 'mouse') return;
    cancelHover();
    hoverTimer.current = setTimeout(() => setActiveIndex(index), 200);
  };
  const handleKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % learningJourney.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + learningJourney.length) % learningJourney.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = learningJourney.length - 1;
    else return;
    event.preventDefault();
    selectStep(nextIndex);
    tabRefs.current[nextIndex]?.focus({ preventScroll: true });
  };

  return <div className="learning-journey">
    <div className="learning-journey__navigation">
      <div className="learning-journey__intro">
        <span className="learning-journey__eyebrow">LỘ TRÌNH KHÁM PHÁ</span>
        <p><span className="learning-journey__desktop-hint">Rê chuột hoặc chọn một bước để tìm hiểu.</span><span className="learning-journey__mobile-hint">Chạm vào một bước để tìm hiểu.</span></p>
      </div>
      <div className="learning-journey__steps" role="tablist" aria-label="Hành trình học tập 10 bước">
        {learningJourney.map((step, index) => {
          const Icon = icons[step.icon] || MapPin;
          return <button
            key={step.step}
            ref={node => { tabRefs.current[index] = node; }}
            id={`${id}-step-${step.step}`}
            type="button"
            role="tab"
            className="learning-journey__step"
            aria-selected={index === activeIndex}
            aria-controls={`${id}-panel`}
            tabIndex={index === activeIndex ? 0 : -1}
            onPointerEnter={event => previewStep(event, index)}
            onPointerLeave={cancelHover}
            onPointerCancel={cancelHover}
            onFocus={() => selectStep(index)}
            onClick={() => selectStep(index)}
            onKeyDown={event => handleKeyDown(event, index)}
            data-sound="select"
          >
            <span className="learning-journey__number" aria-hidden="true">{String(step.step).padStart(2, '0')}</span>
            <span className="learning-journey__icon" aria-hidden="true"><Icon size={19} /></span>
            <span className="learning-journey__step-title">{step.title}</span>
            <ChevronRight className="learning-journey__chevron" size={16} aria-hidden="true" />
          </button>;
        })}
      </div>
    </div>

    <div className="learning-journey__panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-step-${activeStep.step}`} tabIndex={0}>
      <div className="learning-journey__panel-top">
        <span className="learning-journey__eyebrow">{stage}</span>
        <span className="learning-journey__counter">Bước <strong>{String(activeStep.step).padStart(2, '0')}</strong> / 10</span>
      </div>
      <div className="learning-journey__content" key={activeStep.step}>
        <div className="learning-journey__copy">
          <h3><span aria-hidden="true"><ActiveIcon size={23} /></span>{activeStep.title}</h3>
          <p>{details[activeIndex]}</p>
        </div>
        <figure className="learning-journey__illustration">
          <img src={illustration.src} alt={illustration.alt} loading="lazy" />
          <figcaption>{illustration.caption}</figcaption>
        </figure>
        <p className="learning-journey__note"><Sparkles size={18} aria-hidden="true" /><span>{notes[activeIndex]}</span></p>
      </div>
      <div className="learning-journey__footer">
        <div className="learning-journey__controls" role="group" aria-label="Chuyển bước tìm hiểu">
          <button type="button" className="learning-journey__previous" disabled={activeIndex === 0} onClick={() => selectStep(activeIndex - 1)} data-sound="select"><ArrowLeft size={17} aria-hidden="true" /> Bước trước</button>
          <button type="button" className="learning-journey__next" disabled={activeIndex === learningJourney.length - 1} onClick={() => selectStep(activeIndex + 1)} data-sound="select">Bước tiếp theo <ArrowRight size={17} aria-hidden="true" /></button>
        </div>
        <Link to="/#trai-nghiem" className="learning-journey__demo">Tự mình trải nghiệm <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
    </div>
  </div>;
}
