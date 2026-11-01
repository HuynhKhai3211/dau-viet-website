import { useState } from 'react';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

const activities = {
  'ngo-quyen': {
    type: 'Quiz · Người chỉ huy', title: 'Bạn hiểu cách Ngô Quyền tạo lợi thế như thế nào?',
    context: 'Sau khi quan sát thủy triều, hãy nối hiện tượng tự nhiên với quyết định của người chỉ huy.',
    question: 'Việc chuẩn bị nào thể hiện rõ nhất khả năng tận dụng chiến trường của Ngô Quyền?',
    options: [
      { text: 'Kết hợp trận địa cọc, con nước và lực lượng mai phục.', correct: true, feedback: 'Chính xác! Ngô Quyền tổ chức các yếu tố thành một kế hoạch phối hợp, thay vì chỉ dựa vào sức mạnh của từng yếu tố.' },
      { text: 'Đưa toàn bộ thuyền ra biển để giao chiến ngay.', feedback: 'Thử nghĩ lại: ra biển ngay sẽ bỏ qua lợi thế của trận địa và quy luật con nước mà quân ta đã chuẩn bị.' },
      { text: 'Chờ quân Nam Hán tự rút lui mà không chuẩn bị trận địa.', feedback: 'Chưa phù hợp. Quân ta chủ động chuẩn bị và dẫn đối thủ vào chiến trường đã chọn.' },
    ],
    takeaway: 'Dấu vết rút ra: tài chỉ huy nằm ở việc kết nối địa hình, thời điểm và cách bố trí lực lượng.',
  },
  'dia-hinh': {
    type: 'Câu hỏi góc nhìn · Chiến trường', title: 'Cùng một dòng sông, mỗi người nhìn thấy điều gì?',
    context: 'Chọn một góc nhìn để giải thích vì sao sông Bạch Đằng có thể trở thành lợi thế. Hoạt động này có nhiều cách lập luận hợp lý.',
    question: 'Nếu quan sát chiến trường, bạn sẽ chú ý điều gì trước tiên?',
    options: [
      { text: 'Người dân ven sông: nhịp lên xuống của con nước.', feedback: 'Góc nhìn địa phương giúp nhận ra thời điểm mực nước thay đổi. Hiểu nhịp con nước là cơ sở để dự tính lúc trận địa được che giấu hoặc lộ ra.' },
      { text: 'Người chỉ huy: các nhánh sông và nơi có thể mai phục.', feedback: 'Góc nhìn tổ chức lực lượng chú ý đến đường di chuyển và vị trí ẩn quân. Địa hình tạo cơ hội phối hợp các hướng tiến công.' },
      { text: 'Người đi thuyền từ biển vào: đường tiến sâu và đường quay ra.', feedback: 'Góc nhìn từ phía tiến quân đặt ra câu hỏi về khả năng quan sát và rút lui. Một đường vào thuận lợi chưa chắc là một đường ra an toàn khi điều kiện thay đổi.' },
    ],
    takeaway: 'Dấu vết rút ra: giá trị của địa hình thay đổi theo kiến thức, vị trí và mục tiêu của người quan sát.',
  },
  'nam-han': {
    type: 'Đóng vai · Tình huống mô phỏng', title: 'Bạn là người chỉ huy đội thuyền nhẹ của quân ta',
    context: 'Thủy quân Nam Hán đang tiến vào. Nhiệm vụ của bạn là khiêu chiến và dẫn đối thủ theo con nước vào trận địa. Các lựa chọn dưới đây là tình huống học tập, không phải lời nói hay mệnh lệnh được ghi chép nguyên văn.',
    question: 'Triều đang lên, trận địa còn ẩn. Bạn ra quyết định nào?',
    options: [
      { text: 'Khiêu chiến rồi rút có tổ chức, dẫn đối thủ vào khu vực đã chuẩn bị.', correct: true, feedback: 'Bạn giữ đúng vai trò nghi binh. Đội thuyền nhẹ tạo sức hút để đối thủ tiến sâu, trong khi lực lượng chủ lực chờ thời điểm phối hợp.' },
      { text: 'Dừng lại giao chiến quyết liệt với đoàn chiến thuyền ngay ngoài trận địa.', feedback: 'Đội thuyền nhẹ có nguy cơ phải giao chiến bất lợi và không hoàn thành nhiệm vụ dẫn đối thủ. Hãy thử một quyết định gắn với kế hoạch chung.' },
      { text: 'Rút thẳng ra biển, tách khỏi trận địa đã chuẩn bị.', feedback: 'Hướng rút này khiến đối thủ rời xa khu vực mai phục. Bạn cần chọn đường di chuyển phục vụ kế hoạch chung.' },
    ],
    takeaway: 'Dấu vết rút ra: phản ứng truy đuổi của đối thủ chỉ có thể được khai thác khi quân ta giữ đúng nhiệm vụ và thời điểm.',
  },
};

export default function ClueActivity({ clueId, onComplete, completed }) {
  const activity = activities[clueId];
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const viewpoint = clueId === 'dia-hinh';
  const success = submitted && (viewpoint || activity.options[selected]?.correct);
  const confirm = () => {
    if (selected === null) return;
    setSubmitted(true);
    if (viewpoint || activity.options[selected].correct) onComplete(clueId);
  };
  return <section className="clue-activity" aria-labelledby={`activity-${clueId}`}>
    <span className="clue-activity__type">{activity.type}</span>
    <h4 id={`activity-${clueId}`}>{activity.title}</h4>
    <p className="clue-activity__context">{activity.context}</p>
    <fieldset>
      <legend>{activity.question}</legend>
      {activity.options.map((option, index) => <label key={option.text} className={`clue-activity__option ${selected === index ? 'is-selected' : ''}`}>
        <input type="radio" name={`activity-${clueId}`} value={index} checked={selected === index} onChange={() => { setSelected(index); setSubmitted(false); }} />
        <span>{option.text}</span>
      </label>)}
    </fieldset>
    <div className="clue-activity__actions"><button type="button" className="btn btn--primary" onClick={confirm} disabled={selected === null}>{viewpoint ? 'Khám phá góc nhìn' : 'Xác nhận lựa chọn'}<ArrowRight size={16} aria-hidden="true" /></button>
      {submitted && !success && <button type="button" className="btn btn--secondary" onClick={() => { setSelected(null); setSubmitted(false); }}><RotateCcw size={15} aria-hidden="true" />Thử lại</button>}
    </div>
    {submitted && <div className={`clue-activity__feedback ${success ? 'is-success' : ''}`} role="status">
      <strong>{success ? (viewpoint ? 'Một góc nhìn đáng suy ngẫm' : 'Lựa chọn phù hợp!') : 'Hãy cân nhắc thêm'}</strong>
      <p>{activity.options[selected].feedback}</p>
      {success && <p className="clue-activity__takeaway"><CheckCircle2 size={18} aria-hidden="true" />{activity.takeaway}</p>}
      {viewpoint && <p>Bạn có thể chọn tiếp các góc nhìn khác để so sánh.</p>}
    </div>}
    {completed && !success && <p className="clue-activity__saved">Dấu vết này đã được lưu trong tiến độ. Bạn có thể thực hành lại mà không cộng trùng điểm.</p>}
    <a className="clue-activity__source" href="https://baotanglichsu.vn/vi/Articles/3098/13934/ngo-quyen-va-chien-thang-bach-djang-nam-938.html" target="_blank" rel="noopener noreferrer">Tham khảo lịch sử: Bảo tàng Lịch sử quốc gia ↗</a>
  </section>;
}
