import {
  Hammer,
  Flag,
  ArrowDown,
  Trophy,
  ArrowUp,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
} from 'lucide-react';
import { reconstructionEvents } from '../../data/bachDangDemo';

// Map icon strings to Lucide components
const iconMap = {
  Hammer,
  Flag,
  ArrowDown,
  Trophy,
};

export default function ReconstructionStage({
  reconstructionOrder = [],
  onOrderChange,
  reconstructionSubmitted = false,
  reconstructionCorrect = false,
  reconstructionAttempts = 0,
  onSubmitValidation,
  onProceed,
}) {

  // Map order IDs to event objects
  const eventMap = new Map(reconstructionEvents.map((e) => [e.id, e]));
  const currentEvents = reconstructionOrder.map((id) => eventMap.get(id)).filter(Boolean);

  // Swap handler
  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentEvents.length) return;

    const newOrder = [...reconstructionOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    if (onOrderChange) {
      onOrderChange(newOrder);
    }
  };

  // Validate handler
  const handleCheckOrder = () => {
    // Check if current order matches the required event orders (1, 2, 3, 4)
    const isCorrect = currentEvents.every((event, idx) => event.order === idx + 1);
    if (onSubmitValidation) {
      onSubmitValidation(isCorrect);
    }
  };

  return (
    <div className="reconstruction-stage card card--historical">
      {/* Header */}
      <div className="reconstruction-stage__header">
        <div className="reconstruction-stage__title-group">
          <div className="reconstruction-stage__icon-badge">
            <Trophy size={24} />
          </div>
          <div>
            <span className="reconstruction-stage__step-tag">GIAI ĐOẠN 03 / 04</span>
            <h2 className="reconstruction-stage__title">Tái Hiện Trận Chiến Bạch Đằng</h2>
            <p className="reconstruction-stage__subtitle">
              Sắp xếp 4 sự kiện lịch sử dưới đây theo đúng trình tự thời gian diễn biến của trận đánh bằng cách dùng nút Lên / Xuống.
            </p>
          </div>
        </div>

        <div className="reconstruction-stage__meta-pill">
          <span>Lần thử: <strong>{reconstructionAttempts}</strong></span>
          <span className="reconstruction-stage__meta-dot">•</span>
          <span>
            {reconstructionCorrect
              ? reconstructionAttempts === 1
                ? 'Đạt +30 điểm (Lần đầu)'
                : 'Hoàn thành (+0 điểm)'
              : 'Tối đa +30 điểm'}
          </span>
        </div>
      </div>

      {/* Validation Result Notice Banner */}
      {reconstructionSubmitted && (
        <div
          className={`reconstruction-notice ${
            reconstructionCorrect
              ? 'reconstruction-notice--success'
              : 'reconstruction-notice--error'
          }`}
        >
          <div className="reconstruction-notice__icon">
            {reconstructionCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          </div>
          <div className="reconstruction-notice__content">
            <h4>
              {reconstructionCorrect
                ? reconstructionAttempts === 1
                  ? 'Tuyệt vời! Thứ tự thời gian hoàn toàn chính xác (+30 điểm)!'
                  : 'Chính xác! Bạn đã xếp đúng tiến trình lịch sử!'
                : 'Thứ tự chưa chuẩn xác! Hãy suy nghĩ lại diễn biến trận địa.'}
            </h4>
            <p>
              {reconstructionCorrect
                ? 'Từ khâu chuẩn bị bí mật, nhử địch, chờ nước rút cạn đến đòn tổng phản công quy mô lớn - bạn đã nắm trọn mạch chảy lịch sử Bạch Đằng 938.'
                : 'Gợi ý: Quân ta phải chuẩn bị trận địa ngầm trước, sau đó chờ triều lên mới phái thuyền nhẹ ra nhử giặc vào lòng sông! Hãy đổi lại vị trí các sự kiện rồi kiểm tra lại.'}
            </p>
          </div>
        </div>
      )}

      {/* Reorderable Events List */}
      <div className="reconstruction-list" role="list" aria-label="Danh sách các sự kiện trận đánh">
        {currentEvents.map((event, index) => {
          const IconComp = iconMap[event.icon] || Flag;
          const isAtCorrectPosition = event.order === index + 1;
          const showItemStatus = reconstructionSubmitted;

          return (
            <div
              key={event.id}
              className={`reconstruction-item ${
                showItemStatus
                  ? isAtCorrectPosition
                    ? 'reconstruction-item--correct'
                    : 'reconstruction-item--incorrect'
                  : ''
              }`}
            >
              {/* Position Number & Step Label */}
              <div className="reconstruction-item__pos">
                <span className="reconstruction-item__pos-num">{index + 1}</span>
                <span className="reconstruction-item__pos-label">Bước {index + 1}</span>
              </div>

              {/* Event Icon Wrap */}
              <div className="reconstruction-item__icon-wrap">
                <IconComp size={24} />
              </div>

              {/* Event Content Info */}
              <div className="reconstruction-item__content">
                <div className="reconstruction-item__title-row">
                  <h4 className="reconstruction-item__title">{event.title}</h4>
                  {showItemStatus && (
                    <span
                      className={`reconstruction-item__badge ${
                        isAtCorrectPosition
                          ? 'reconstruction-item__badge--correct'
                          : 'reconstruction-item__badge--incorrect'
                      }`}
                    >
                      {isAtCorrectPosition ? (
                        <>
                          <CheckCircle2 size={14} /> Đúng vị trí
                        </>
                      ) : (
                        <>
                          <XCircle size={14} /> Chưa đúng vị trí
                        </>
                      )}
                    </span>
                  )}
                </div>
                <p className="reconstruction-item__desc">{event.description}</p>
              </div>

              {/* Reordering Controls (UP / DOWN) */}
              <div className="reconstruction-item__actions">
                <button
                  type="button"
                  className="reconstruction-btn reconstruction-btn--up"
                  disabled={index === 0 || reconstructionCorrect}
                  onClick={() => handleMove(index, -1)}
                  aria-label={`Di chuyển sự kiện "${event.title}" lên trên`}
                  title="Di chuyển lên"
                >
                  <ArrowUp size={20} />
                </button>
                <button
                  type="button"
                  className="reconstruction-btn reconstruction-btn--down"
                  disabled={index === currentEvents.length - 1 || reconstructionCorrect}
                  onClick={() => handleMove(index, 1)}
                  aria-label={`Di chuyển sự kiện "${event.title}" xuống dưới`}
                  title="Di chuyển xuống"
                >
                  <ArrowDown size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="reconstruction-stage__footer">
        {!reconstructionCorrect ? (
          <div className="reconstruction-stage__footer-actions">
            <button
              type="button"
              className="btn btn--primary btn--large reconstruction-stage__check-btn"
              onClick={handleCheckOrder}
            >
              <CheckCircle2 size={20} />
              <span>Kiểm tra thứ tự</span>
            </button>
            <span className="reconstruction-stage__tip">
              Mẹo: Sử dụng nút mũi tên Lên/Xuống trên từng thẻ để hoán đổi vị trí
            </span>
          </div>
        ) : (
          <div className="reconstruction-stage__success-action">
            <div className="reconstruction-stage__congrats">
              <Award size={22} />
              <span>Hoàn thành xuất sắc nhiệm vụ Tái Hiện Lịch Sử!</span>
            </div>
            <button
              type="button"
              className="btn btn--gold btn--large reconstruction-stage__finish-btn"
              onClick={onProceed}
            >
              <span>Xem Tổng Kết & Điểm Số</span>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
