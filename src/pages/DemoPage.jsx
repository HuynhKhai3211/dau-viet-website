import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Compass,
  RotateCcw,
  Trophy,
  CheckCircle2,
  Trees,
} from 'lucide-react';
import { DEMO_STAGES, hypothesisQuestions, scoring } from '../data/bachDangDemo';
import DemoIntro from '../components/demo/DemoIntro';
import ClueExploration from '../components/demo/ClueExploration';
import HypothesisStage from '../components/demo/HypothesisStage';
import VerificationStage from '../components/demo/VerificationStage';
import ReconstructionStage from '../components/demo/ReconstructionStage';
import DemoResults from '../components/demo/DemoResults';
import IslandDecor, { IslandRewardDialog } from '../components/demo/IslandDecor';
import { awardItem, readIsland, readSaved, ISLAND_STORAGE_KEY, JOURNEY_STORAGE_KEY } from '../data/islandDecor';
import '../styles/pages/demo.css';
import { playSound } from '../utils/interactionSounds';

// Initial shuffled events helper (guaranteed not in default sorted order)
const getShuffledReconstructionOrder = () => {
  return ['event-2', 'event-4', 'event-1', 'event-3'];
};

export default function DemoPage() {
  const [saved] = useState(() => {
    const value = readSaved(JOURNEY_STORAGE_KEY, {});
    if (!value || !Object.values(DEMO_STAGES).includes(value.currentStage)) return {};
    return value;
  });
  const [island, setIsland] = useState(readIsland);
  const [activeView, setActiveView] = useState('journey');
  const [selectedDecor, setSelectedDecor] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [completedQuestions, setCompletedQuestions] = useState(() => Array.isArray(saved.completedQuestions) ? saved.completedQuestions.filter(id => hypothesisQuestions.some(q => q.id === id)) : []);
  // Demo State Machine
  const [currentStage, setCurrentStage] = useState(saved.currentStage || DEMO_STAGES.INTRO);
  const [discoveredClues, setDiscoveredClues] = useState(() => new Set(
    Array.isArray(saved.discoveredClues)
      ? saved.discoveredClues.map(id => ({ 'bai-coc': 'ngo-quyen', 'chien-thuat': 'nam-han' }[id] || id))
      : [],
  ));
  const [selectedAnswers, setSelectedAnswers] = useState(saved.selectedAnswers && typeof saved.selectedAnswers === 'object' ? saved.selectedAnswers : {});
  const [answersSubmitted, setAnswersSubmitted] = useState(!!saved.answersSubmitted);
  const [answersVerified, setAnswersVerified] = useState(!!saved.answersVerified);
  const [reconstructionOrder, setReconstructionOrder] = useState(() => Array.isArray(saved.reconstructionOrder) && saved.reconstructionOrder.length === 4 && new Set(saved.reconstructionOrder).size === 4 && saved.reconstructionOrder.every(id => getShuffledReconstructionOrder().includes(id)) ? saved.reconstructionOrder : getShuffledReconstructionOrder());
  const [reconstructionSubmitted, setReconstructionSubmitted] = useState(!!saved.reconstructionSubmitted);
  const [reconstructionCorrect, setReconstructionCorrect] = useState(!!saved.reconstructionCorrect);
  const [reconstructionAttempts, setReconstructionAttempts] = useState(Number.isInteger(saved.reconstructionAttempts) ? saved.reconstructionAttempts : 0);
  const [score, setScore] = useState(Number.isFinite(saved.score) ? Math.max(0, Math.min(scoring.maxScore, saved.score)) : 0);

  useEffect(() => {
    try {
      localStorage.setItem(ISLAND_STORAGE_KEY, JSON.stringify(island));
      localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify({ currentStage, discoveredClues: [...discoveredClues], selectedAnswers, completedQuestions, answersSubmitted, answersVerified, reconstructionOrder, reconstructionSubmitted, reconstructionCorrect, reconstructionAttempts, score }));
      setSaveError('');
    } catch {
      setSaveError('Chưa lưu được trên trình duyệt. Hãy giữ trang mở để tiếp tục trải nghiệm.');
    }
  }, [island, currentStage, discoveredClues, selectedAnswers, completedQuestions, answersSubmitted, answersVerified, reconstructionOrder, reconstructionSubmitted, reconstructionCorrect, reconstructionAttempts, score]);

  const grantReward = useCallback((id) => {
    setIsland(prev => awardItem(prev, id));
    if (!island.earned.includes(id)) void playSound('reward');
  }, [island.earned]);
  const openIsland = (id = null) => { setSelectedDecor(id); setActiveView('island'); };
  const dismissReward = () => setIsland(prev => ({ ...prev, pending: prev.pending.slice(1) }));
  const handleCompleteQuestion = (questionId) => {
    const questionIndex = hypothesisQuestions.findIndex(q => q.id === questionId);
    if (questionIndex < 0 || !selectedAnswers[questionId] || completedQuestions.includes(questionId)) return;
    setCompletedQuestions(prev => [...prev, questionId]);
    grantReward(questionIndex === 0 ? 'boat' : 'flag');
  };

  // Scroll to top when stage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(max-width: 768px)').matches ? 'instant' : 'smooth' });
  }, [currentStage, activeView]);

  // Handle discovering a new clue (+10 points per unique clue)
  const handleDiscoverClue = useCallback((clueId) => {
    if (discoveredClues.has(clueId)) return;
    const next = new Set(discoveredClues);
    next.add(clueId);
    setDiscoveredClues(next);
    setScore(current => current + scoring.cluePoints);
    if (next.size === 4 && !island.earned.includes('stakes')) grantReward('stakes');
    else void playSound('discover');
  }, [discoveredClues, grantReward, island.earned]);

  // Handle selecting an answer in Hypothesis stage
  const handleSelectAnswer = useCallback((questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }, []);

  // Handle submitting Hypothesis stage answers
  const handleSubmitHypothesis = useCallback(() => {
    if (!hypothesisQuestions.every(q => completedQuestions.includes(q.id))) return;
    setAnswersSubmitted(true);
    // Evaluate answers & add points if not already verified
    if (!answersVerified) {
      let earnedHypothesisPoints = 0;
      hypothesisQuestions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctId) {
          earnedHypothesisPoints += scoring.questionPoints;
        }
      });
      setScore((prev) => prev + earnedHypothesisPoints);
      void playSound(earnedHypothesisPoints === hypothesisQuestions.length * scoring.questionPoints ? 'success' : 'error');
      setAnswersVerified(true);
    }
    setCurrentStage(DEMO_STAGES.VERIFICATION);
  }, [answersVerified, selectedAnswers, completedQuestions]);

  // Handle validating Reconstruction order
  const handleValidateReconstruction = useCallback((isCorrect) => {
    if (reconstructionCorrect) return;
    setReconstructionSubmitted(true);
    setReconstructionAttempts(prev => prev + 1);
    setReconstructionCorrect(isCorrect);
    if (isCorrect) {
      if (reconstructionAttempts === 0) setScore(s => s + scoring.reconstructionPoints);
      grantReward('tower');
      if (island.earned.includes('tower')) void playSound('success');
    } else {
      void playSound('error');
    }
  }, [reconstructionCorrect, reconstructionAttempts, grantReward, island.earned]);

  // Handle resetting the entire demo experience to starting state
  const handleRestart = useCallback(() => {
    setCurrentStage(DEMO_STAGES.INTRO);
    setDiscoveredClues(new Set());
    setSelectedAnswers({});
    setAnswersSubmitted(false);
    setAnswersVerified(false);
    setReconstructionOrder(getShuffledReconstructionOrder());
    setReconstructionSubmitted(false);
    setReconstructionCorrect(false);
    setReconstructionAttempts(0);
    setScore(0);
    setCompletedQuestions([]);
    setActiveView('journey');
  }, []);

  // Hypothesis correct count
  const hypothesisCorrectCount = useMemo(() => {
    let count = 0;
    hypothesisQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctId) {
        count += 1;
      }
    });
    return count;
  }, [selectedAnswers]);

  // Stages configuration for progress bar
  const stageList = [
    { key: DEMO_STAGES.INTRO, label: 'Giới Thiệu', step: 1 },
    { key: DEMO_STAGES.CLUE_EXPLORATION, label: 'Dấu Vết', step: 2 },
    { key: DEMO_STAGES.HYPOTHESIS, label: 'Giả Thuyết', step: 3 },
    { key: DEMO_STAGES.VERIFICATION, label: 'Xác Minh', step: 4 },
    { key: DEMO_STAGES.RECONSTRUCTION, label: 'Tái Hiện', step: 5 },
    { key: DEMO_STAGES.RESULTS, label: 'Tổng Kết', step: 6 },
  ];

  const currentStageIndex = stageList.findIndex((s) => s.key === currentStage);

  return (
    <div className="demo-page parchment-bg">
      <div className="container">
        <nav className="demo-experience-tabs" aria-label="Không gian trải nghiệm">
          <button type="button" aria-pressed={activeView === 'journey'} onClick={() => setActiveView('journey')}><Compass size={18} /> Hành trình lịch sử</button>
          <button type="button" aria-pressed={activeView === 'island'} onClick={() => openIsland()}><Trees size={18} /> Đảo của tôi <small>{island.earned.length} vật phẩm</small></button>
        </nav>
        {saveError && <p role="status">{saveError}</p>}
        {activeView === 'island' ? <IslandDecor island={island} setIsland={setIsland} initialSelected={selectedDecor} onContinue={() => setActiveView('journey')} saveError={saveError} /> : <>
        {/* Top Demo Navigation & Progress Bar */}
        <header className="demo-navbar" aria-label="Tiến trình trải nghiệm demo">
          <div className="demo-navbar__brand">
            <span className="demo-navbar__badge">
              <Compass size={18} />
              <span>Bạch Đằng 938</span>
            </span>
            <span className="demo-navbar__title">Hành Trình Tương Tác</span>
          </div>

          {/* Stepper Progress Bar */}
          <nav className="demo-stepper" aria-label="Các bước của bài học">
            <ol className="demo-stepper__list">
              {stageList.map((st, idx) => {
                const isActive = st.key === currentStage;
                const isPassed = idx < currentStageIndex;

                return (
                  <li
                    key={st.key}
                    className={`demo-stepper__item ${
                      isActive ? 'demo-stepper__item--active' : ''
                    } ${isPassed ? 'demo-stepper__item--passed' : ''}`}
                  >
                    <div className="demo-stepper__circle">
                      {isPassed ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <span>{st.step}</span>
                      )}
                    </div>
                    <span className="demo-stepper__label">{st.label}</span>
                    {idx < stageList.length - 1 && (
                      <span className="demo-stepper__line" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Live Score Display & Quick Reset */}
          <div className="demo-navbar__score-widget">
            <div className="demo-score-chip" title="Tổng điểm hiện tại">
              <Trophy size={16} className="demo-score-chip__icon" />
              <span className="demo-score-chip__label">Điểm:</span>
              <strong className="demo-score-chip__val">{score}</strong>
              <span className="demo-score-chip__max">/{scoring.maxScore}</span>
            </div>

            {currentStage !== DEMO_STAGES.INTRO && (
              <button
                type="button"
                className="demo-restart-icon-btn"
                onClick={handleRestart}
                title="Bắt đầu lại từ đầu"
                aria-label="Khởi động lại trải nghiệm"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Stage Rendering */}
        <main className="demo-stage-container">
          {currentStage === DEMO_STAGES.INTRO && (
            <DemoIntro
              onStart={() => setCurrentStage(DEMO_STAGES.CLUE_EXPLORATION)}
            />
          )}

          {currentStage === DEMO_STAGES.CLUE_EXPLORATION && (
            <ClueExploration
              discoveredClues={discoveredClues}
              onDiscoverClue={handleDiscoverClue}
              onComplete={() => setCurrentStage(DEMO_STAGES.HYPOTHESIS)}
            />
          )}

          {currentStage === DEMO_STAGES.HYPOTHESIS && (
            <HypothesisStage
              completedQuestions={completedQuestions}
              onCompleteQuestion={handleCompleteQuestion}
              selectedAnswers={selectedAnswers}
              onSelectAnswer={handleSelectAnswer}
              onSubmit={handleSubmitHypothesis}
              onReviewClues={() => setCurrentStage(DEMO_STAGES.CLUE_EXPLORATION)}
            />
          )}

          {currentStage === DEMO_STAGES.VERIFICATION && (
            <VerificationStage
              selectedAnswers={selectedAnswers}
              onProceed={() => setCurrentStage(DEMO_STAGES.RECONSTRUCTION)}
            />
          )}

          {currentStage === DEMO_STAGES.RECONSTRUCTION && (
            <ReconstructionStage
              reconstructionOrder={reconstructionOrder}
              onOrderChange={setReconstructionOrder}
              reconstructionSubmitted={reconstructionSubmitted}
              reconstructionCorrect={reconstructionCorrect}
              reconstructionAttempts={reconstructionAttempts}
              onSubmitValidation={handleValidateReconstruction}
              onProceed={() => { void playSound('complete'); setCurrentStage(DEMO_STAGES.RESULTS); }}
            />
          )}

          {currentStage === DEMO_STAGES.RESULTS && (
            <DemoResults
              island={island}
              onDecorate={() => openIsland()}
              score={score}
              discoveredCluesCount={discoveredClues.size}
              hypothesisCorrectCount={hypothesisCorrectCount}
              reconstructionCorrect={reconstructionCorrect}
              reconstructionAttempts={reconstructionAttempts}
              onRestart={handleRestart}
            />
          )}
        </main>
        </>}
        <IslandRewardDialog itemId={island.pending[0]} onContinue={dismissReward} onDecorate={id => { dismissReward(); openIsland(id); }} />
      </div>
    </div>
  );
}
