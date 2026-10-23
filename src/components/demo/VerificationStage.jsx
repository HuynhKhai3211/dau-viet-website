import { CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles, BookOpen, ShieldCheck, AlertCircle } from 'lucide-react';
import { hypothesisQuestions, clues, scoring } from '../../data/bachDangDemo';
import AnimatedMascot from '../common/AnimatedMascot';

export default function VerificationStage({
  selectedAnswers = {},
  onProceed,
}) {
  // Calculate score & status
  let correctCount = 0;
  hypothesisQuestions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctId) {
      correctCount += 1;
    }
  });

  const earnedPoints = correctCount * scoring.questionPoints;
  const maxPossiblePoints = hypothesisQuestions.length * scoring.questionPoints;

  // Helper to get clue title
  const getClueTitle = (clueId) => {
    const clue = clues.find((c) => c.id === clueId);
    return clue ? clue.title : clueId;
  };

  return (
    <div className="verification-stage card card--historical">
      {/* Top Banner with Encouraging Message */}
      <div className={`verification-banner ${
        correctCount === hypothesisQuestions.length
          ? 'verification-banner--perfect'
          : correctCount > 0
          ? 'verification-banner--partial'
          : 'verification-banner--retry'
      }`}>
        <div className="verification-banner__icon">
          {correctCount === hypothesisQuestions.length ? (
            <ShieldCheck size={36} />
          ) : correctCount > 0 ? (
            <Sparkles size={36} />
          ) : (
            <AlertCircle size={36} />
          )}
        </div>
        <div className="verification-banner__text">
          <div className="verification-banner__tag">KẾT QUẢ XÁC MINH GIẢ THUYẾT</div>
          <h2 className="verification-banner__title">
            {correctCount === hypothesisQuestions.length
              ? 'Tư Duy Chiến Lược Xuất Sắc!'
              : correctCount > 0
              ? 'Suy Luận Lịch Sử Rất Tốt!'
              : 'Tiếp Nhận Thêm Tri Thức Lịch Sử'}
          </h2>
          <p className="verification-banner__desc">
            {correctCount === hypothesisQuestions.length
              ? `Bạn đã suy luận đúng cả ${hypothesisQuestions.length}/${hypothesisQuestions.length} câu hỏi then chốt. Sự kết hợp tài tình giữa quy luật thủy triều và mưu lược trận địa cọc của Ngô Quyền đã được bạn giải mã trọn vẹn!`
              : correctCount > 0
              ? `Bạn đã trả lời đúng ${correctCount}/${hypothesisQuestions.length} câu hỏi. Hãy đọc kỹ phần phân tích bên dưới để hiểu sâu hơn về mưu kế của Ngô Quyền!`
              : `Dù chưa chọn đúng, đừng nản lòng! Chiến thuật Bạch Đằng 938 là đỉnh cao nghệ thuật quân sự cổ đại. Hãy xem lời giải chi tiết dưới đây để nắm vững sự kiện.`}
          </p>
        </div>
        <div className="verification-banner__score-badge">
          <span className="verification-banner__score-num">+{earnedPoints}</span>
          <span className="verification-banner__score-max">/{maxPossiblePoints} điểm</span>
        </div>

        {/* Verification Companion Mascot */}
        <div className="verification-mascot-wrap">
          <AnimatedMascot
            variant={
              correctCount === hypothesisQuestions.length
                ? 'success'
                : correctCount > 0
                ? 'idle'
                : 'thinking'
            }
            size="small"
            message={
              correctCount === hypothesisQuestions.length
                ? 'Tuyệt vời! Bạn đã suy luận đúng toàn bộ chiến lược!'
                : correctCount > 0
                ? 'Bạn đã giải mã được phần lớn chiến thuật!'
                : 'Cùng xem phân tích chi tiết để hiểu rõ hơn nhé!'
            }
            interactive={true}
          />
        </div>
      </div>

      {/* Questions Detailed Verification Review */}
      <div className="verification-stage__cards-list">
        {hypothesisQuestions.map((q, idx) => {
          const userSelectedId = selectedAnswers[q.id];
          const isUserCorrect = userSelectedId === q.correctId;

          return (
            <div
              key={q.id}
              className={`verification-card ${
                isUserCorrect ? 'verification-card--correct' : 'verification-card--wrong'
              }`}
            >
              {/* Header with verdict badge */}
              <div className="verification-card__header">
                <div className="verification-card__title-row">
                  <span className="verification-card__num">Câu hỏi 0{idx + 1}</span>
                  <div className={`verification-verdict-tag ${
                    isUserCorrect ? 'verification-verdict-tag--correct' : 'verification-verdict-tag--wrong'
                  }`}>
                    {isUserCorrect ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Chính xác (+{scoring.questionPoints} điểm)</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} />
                        <span>Chưa chính xác (0 điểm)</span>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="verification-card__question-text">{q.question}</h3>
              </div>

              {/* Options Review List */}
              <div className="verification-card__options">
                {q.options.map((opt) => {
                  const wasChosen = userSelectedId === opt.id;
                  const isThisCorrect = opt.id === q.correctId;

                  let optionClass = 'verification-option-item';
                  let statusBadge = null;

                  if (isThisCorrect) {
                    optionClass += ' verification-option-item--correct';
                    statusBadge = (
                      <span className="verification-option-badge verification-option-badge--correct">
                        <CheckCircle2 size={15} />
                        {wasChosen ? 'Lựa chọn của bạn (Chính xác)' : 'Đáp án chính xác'}
                      </span>
                    );
                  } else if (wasChosen) {
                    optionClass += ' verification-option-item--wrong-selected';
                    statusBadge = (
                      <span className="verification-option-badge verification-option-badge--wrong">
                        <XCircle size={15} />
                        Lựa chọn của bạn (Chưa đúng)
                      </span>
                    );
                  } else {
                    optionClass += ' verification-option-item--neutral';
                  }

                  return (
                    <div key={opt.id} className={optionClass}>
                      <div className="verification-option-item__content">
                        <span className="verification-option-item__bullet" />
                        <span className="verification-option-item__text">{opt.text}</span>
                      </div>
                      {statusBadge}
                    </div>
                  );
                })}
              </div>

              {/* Historical Explanation Box */}
              <div className="verification-card__explanation-box">
                <div className="verification-card__explanation-header">
                  <BookOpen size={16} />
                  <h4>Giải mã lịch sử từ các nguồn sử liệu</h4>
                </div>
                <p className="verification-card__explanation-text">{q.explanation}</p>

                {q.relatedClues && (
                  <div className="verification-card__related-clues">
                    <Lightbulb size={14} />
                    <span>Dấu vết gắn liền:</span>
                    <div className="verification-card__clue-chips">
                      {q.relatedClues.map((cId) => (
                        <span key={cId} className="verification-card__clue-chip">
                          {getClueTitle(cId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Forward Action to Reconstruction */}
      <div className="verification-stage__footer">
        <div className="verification-stage__footer-note">
          Sau khi đã sáng tỏ giả thuyết chiến lược, bước tiếp theo là sắp xếp dòng sự kiện của trận chiến Bạch Đằng theo thứ tự thời gian.
        </div>
        <button
          type="button"
          className="btn btn--primary btn--large verification-stage__next-btn"
          onClick={onProceed}
        >
          <span>Tiến vào Tái Hiện Trận Chiến</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
