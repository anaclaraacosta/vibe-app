import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import ProgressBar from '../../components/ui/ProgressBar';
import QuizOption from '../../components/ui/QuizOption';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Music, Film, Tv, Shirt, BookOpen, Compass, Sparkles, X } from 'lucide-react';

export default function MbtiQuizScreen() {
  const navigate = useNavigate();
  const {
    mbtiCurrentQuestionIndex,
    mbtiQuestions,
    mbtiAnswers,
    mbtiSelectAnswer,
    mbtiNextQuestion,
    mbtiPrevQuestion,
    generateMbtiResults,
    mbtiResetQuiz,
    user
  } = useVibe();

  const [showExitDialog, setShowExitDialog] = useState<boolean>(false);

  // If already completed the MBTI, redirect directly to MBTI Results
  useEffect(() => {
    if (user?.mbtiCompleted) {
      navigate('/mbti-result', { replace: true });
    }
  }, [user, navigate]);

  const currentQuestion = mbtiQuestions[mbtiCurrentQuestionIndex];
  const selectedOptionId = mbtiAnswers[currentQuestion.id];
  const totalQuestions = mbtiQuestions.length;

  const handleNext = async () => {
    if (!selectedOptionId) return;

    if (mbtiCurrentQuestionIndex < totalQuestions - 1) {
      mbtiNextQuestion();
    } else {
      // Last question - transition to loading state
      navigate('/loading?type=mbti');
      await generateMbtiResults();
      navigate('/mbti-result');
    }
  };

  // Map category strings to Lucide Icons
  const categoryIcons: Record<string, any> = {
    "Música": Music,
    "Cine": Film,
    "Series": Tv,
    "Ropa": Shirt,
    "Libros": BookOpen,
    "Destino": Compass,
    "General": Sparkles
  };

  const currentIcon = categoryIcons[currentQuestion.category] || Sparkles;

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header with Close X Button */}
      <Header
        showBack={mbtiCurrentQuestionIndex > 0}
        onBack={mbtiPrevQuestion}
        rightAction={
          <button
            onClick={() => setShowExitDialog(true)}
            className="w-10 h-10 -mr-3 flex items-center justify-center rounded-full hover:bg-vibe-card/50 active:bg-vibe-card text-vibe-offwhite transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        }
      />

      {/* Main Container */}
      <div className="flex-grow px-6 pt-4 pb-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
        {/* Top Question block */}
        <div className="flex flex-col gap-6 text-left">
          {/* Progress bar */}
          <ProgressBar current={mbtiCurrentQuestionIndex + 1} total={totalQuestions} />

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vibe-volt" />
              {currentQuestion.category}
            </span>
            <h2 className="font-heading text-2xl text-vibe-offwhite leading-snug">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="w-full h-px bg-vibe-border/50 my-2" />

          {/* Options Grid */}
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => (
              <QuizOption
                key={option.id}
                text={option.text}
                subtext={option.subtext}
                icon={currentIcon}
                selected={selectedOptionId === option.id}
                onClick={() => mbtiSelectAnswer(currentQuestion.id, option.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8">
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!selectedOptionId}
            className={!selectedOptionId ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {mbtiCurrentQuestionIndex === totalQuestions - 1 ? 'FINALIZAR' : 'SIGUIENTE'}
          </Button>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      <Modal 
        isOpen={showExitDialog} 
        onClose={() => setShowExitDialog(false)} 
        title="Salir del Test"
      >
        <div className="flex flex-col gap-4 text-left">
          <p className="text-sm text-vibe-offwhite font-medium">
            ¿Estás seguro de que querés salir del test de personalidad?
          </p>
          <p className="text-xs text-vibe-light-gray">
            Tu progreso no se guardará.
          </p>
          
          <div className="flex flex-col gap-3 mt-4">
            <Button 
              variant="primary" 
              onClick={() => {
                setShowExitDialog(false);
                mbtiResetQuiz();
                navigate(-1);
              }}
            >
              Salir del Test
            </Button>
            <button
              onClick={() => setShowExitDialog(false)}
              className="w-full h-12 border border-vibe-border bg-transparent text-vibe-light-gray rounded-xl flex items-center justify-center font-bold text-xs hover:text-vibe-offwhite hover:border-vibe-volt/40 active:scale-[0.99] transition-all cursor-pointer"
            >
              Continuar Test
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
