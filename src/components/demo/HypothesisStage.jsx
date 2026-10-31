import { useEffect, useRef, useState } from 'react';
import { HelpCircle, ArrowRight, Lightbulb, Compass } from 'lucide-react';
import { hypothesisQuestions, clues } from '../../data/bachDangDemo';
import AnimatedMascot from '../common/AnimatedMascot';

export default function HypothesisStage({
  selectedAnswers = {},
  onSelectAnswer,
  onSubmit,
  onReviewClues,
  completedQuestions = [],
  onCompleteQuestion,
}) {
  const totalQuestions = hypothesisQuestions.length;
  const answeredCount = Object.keys(selectedAnswers).filter(
    (qId) => selectedAnswers[qId]
  ).length;
  const allAnswered = completedQuestions.length === totalQuestions;
  const [activeQuestion, setActiveQuestion] = useState(() => Math.max(0, hypothesisQuestions.findIndex(q => !completedQuestions.includes(q.id))));
  const questionList = useRef(null);
  useEffect(() => { questionList.current?.scrollTo({ top: 0, behavior: 'instant' }); }, [activeQuestion]);
  const canAdvance = allAnswered || completedQuestions.includes(hypothesisQuestions[activeQuestion].id);
  const advance = () => {
    if (allAnswered) onSubmit();
    else setActiveQuestion(Math.max(0, hypothesisQuestions.findIndex(q => !completedQuestions.includes(q.id))));
  };

  // Helper to get clue title from id
  const getClueTitle = (clueId) => {
    const clue = clues.find((c) => c.id === clueId);
    return clue ? clue.title : clueId;
  };

  return (
    <div className="hypothesis-stage card card--historical">
      {/* Stage Header */}
      <div className="hypothesis-stage__header">
        <div className="hypothesis-stage__title-group">
          <div className="hypothesis-stage__icon-badge">
            <HelpCircle size={24} />
          </div>
          <div>
            <span className="hypothesis-stage__step-tag">GIAI ĐOẠN 02 / 04</span>
            <h2 className="hypothesis-stage__title">Đặt Giả Thuyết Chiến Thuật</h2>
            <p className="hypothesis-stage__subtitle">
              Dựa vào các Dấu Vết vừa thu thập, hãy suy luận xem Ngô Quyền đã biến thiên nhiên và bẫy ngầm thành chiến thắng như thế nào.
            </p>
          </div>
        </div>

        <div className="hypothesis-progress">
          <span className="hypothesis-progress__label">
            Tiến độ: <strong>{answeredCount}</strong> / {totalQuestions} câu
          </span>
          <div className="hypothesis-progress__bar">
            <div
              className="hypothesis-progress__fill"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Thinking Mascot Companion */}
        <div className="hypothesis-mascot-wrap">
          <AnimatedMascot
            variant="thinking"
            thoughtBubble={true}
            size="small"
            message="Hãy kết nối những Dấu Vết bạn đã tìm được!"
            interactive={true}
          />
        </div>
      </div>

      {/* List of Multiple Choice Questions */}
      <div className="question-page-nav" role="group" aria-label="Chọn câu hỏi">
        {hypothesisQuestions.map((q, index) => <button key={q.id} type="button" aria-pressed={activeQuestion === index} onClick={() => setActiveQuestion(index)}>Câu {index + 1}{completedQuestions.includes(q.id) ? ' · Đã xác nhận' : ''}</button>)}
      </div>
      <div className="hypothesis-stage__questions-list" ref={questionList}>
        {hypothesisQuestions.map((q, index) => {
          const selectedOptionId = selectedAnswers[q.id];

          return (
            <div key={q.id} className="hypothesis-card" hidden={activeQuestion !== index}>
              <div className="hypothesis-card__header">
                <div className="hypothesis-card__number-tag">
                  Câu hỏi 0{index + 1}
                </div>
                {q.relatedClues && (
                  <div className="hypothesis-card__related">
                    <Lightbulb size={14} />
                    <span>Dựa trên dấu vết:</span>
                    <div className="hypothesis-card__clue-tags">
                      {q.relatedClues.map((cId) => (
                        <span key={cId} className="hypothesis-card__clue-tag">
                          {getClueTitle(cId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="hypothesis-card__question-text">{q.question}</h3>

              {/* Radio Options List */}
              <div className="hypothesis-options-grid" role="radiogroup" aria-label={q.question}>
                {q.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const radioInputId = `hypo-${q.id}-${option.id}`;

                  return (
                    <label
                      key={option.id}
                      htmlFor={radioInputId}
                      className={`hypothesis-option-label ${
                        isSelected ? 'hypothesis-option-label--selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        id={radioInputId}
                        name={`question-${q.id}`}
                        value={option.id}
                        checked={isSelected}
                        disabled={completedQuestions.includes(q.id)}
                        onChange={() => onSelectAnswer(q.id, option.id)}
                        className="hypothesis-option-input"
                      />
                      <div className="hypothesis-option-indicator">
                        <span className="hypothesis-option-dot" />
                      </div>
                      <span className="hypothesis-option-text">{option.text}</span>
                    </label>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      <div className="question-reward-list">
        {hypothesisQuestions.map((q, index) => {
          const selectedOptionId = selectedAnswers[q.id];
          return (
              <div className="question-reward-confirm" key={q.id} hidden={activeQuestion !== index}>
                <button type="button" className="btn btn--gold btn--small"
                  disabled={!selectedOptionId}
                  onClick={() => onCompleteQuestion(q.id)}>
                  {completedQuestions.includes(q.id) ? 'Xem lại quà' : 'Hoàn thành & nhận quà'}
                </button>
                <span>{completedQuestions.includes(q.id) ? 'Đáp án đã xác nhận. Bạn có thể mở lại quà hoặc đặt vật phẩm lên đảo.' : 'Xác nhận đáp án để nhận vật phẩm trang trí đảo.'}</span>
              </div>
          );
        })}
      </div>

      {/* Bottom Control Bar */}
      <div className="hypothesis-stage__bottom-bar">
        {onReviewClues && (
          <button
            type="button"
            className="btn btn--secondary hypothesis-stage__back-btn"
            onClick={onReviewClues}
          >
            <Compass size={18} />
            Xem lại Dấu Vết
          </button>
        )}

        <div className="hypothesis-stage__status-notice">
          {allAnswered ? (
            <span className="hypothesis-status--ready">
              Đã hoàn tất 2/2 câu hỏi. Hãy bấm kiểm tra để xem kết quả luận giải!
            </span>
          ) : (
            <span className="hypothesis-status--pending">
              Xác nhận hoàn thành từng câu để nhận quà và tiếp tục (còn {totalQuestions - completedQuestions.length} câu)
            </span>
          )}
        </div>

        <button
          type="button"
          className="btn btn--primary btn--large hypothesis-stage__submit-btn"
          disabled={!canAdvance}
          onClick={advance}
        >
          <span>{allAnswered ? 'Kiểm tra giả thuyết' : 'Câu hỏi tiếp theo'}</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
