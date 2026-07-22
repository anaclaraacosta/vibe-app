import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import ProgressBar from '../../components/ui/ProgressBar';
import QuizOption from '../../components/ui/QuizOption';
import Button from '../../components/ui/Button';
import PlusAccents from '../../components/ui/PlusAccents';
import { Music, Film, Tv, Shirt, BookOpen, Compass, Sparkles } from 'lucide-react';

export default function QuizScreen() {
  const navigate = useNavigate();
  const {
    currentQuestionIndex,
    quizQuestions,
    answers,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    generateProfileResults,
    user
  } = useVibe();

  // If VIBE profile is already completed, go to results
  useEffect(() => {
    if (user?.profileCompleted) {
      navigate('/result', { replace: true });
    }
  }, [user, navigate]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const selectedOptionId = answers[currentQuestion.id];
  const totalQuestions = quizQuestions.length;

  const handleNext = async () => {
    if (!selectedOptionId) return;

    if (currentQuestionIndex < totalQuestions - 1) {
      nextQuestion();
    } else {
      // Last question - transition to loading state
      navigate('/loading');
      await generateProfileResults();
      navigate('/result');
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
      {/* Header */}
      <Header
        showBack={currentQuestionIndex > 0}
        onBack={prevQuestion}
        rightAction={<PlusAccents count={1} />}
      />

      {/* Main Container */}
      <div className="flex-grow px-6 pt-4 pb-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
        {/* Top Question block */}
        <div className="flex flex-col gap-6 text-left">
          {/* Progress bar */}
          <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />

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
                onClick={() => selectAnswer(currentQuestion.id, option.id)}
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
            {currentQuestionIndex === totalQuestions - 1 ? 'FINALIZAR' : 'SIGUIENTE'}
          </Button>
        </div>
      </div>
    </div>
  );
}
