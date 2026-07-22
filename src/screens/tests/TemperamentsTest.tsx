import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { Compass } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    questionText: "¿Cómo sos en una reunión social?",
    options: [
      { id: 'A', text: "El alma de la fiesta, hablo con todos", temperament: "Sanguíneo" },
      { id: 'B', text: "Tomo iniciativa y lidero la conversación", temperament: "Colérico" },
      { id: 'C', text: "Observo y me quedo con las personas que me interesan", temperament: "Melancólico" },
      { id: 'D', text: "Estoy cómodo/a pero no necesito ser el centro", temperament: "Flemático" }
    ]
  },
  {
    id: 2,
    questionText: "¿Cómo reaccionás ante algo que te enoja?",
    options: [
      { id: 'A', text: "Lo digo en el momento sin pensarlo mucho", temperament: "Sanguíneo" },
      { id: 'B', text: "Reacciono fuerte y lo resuelvo directo", temperament: "Colérico" },
      { id: 'C', text: "Me lo guardo y lo proceso solo/a", temperament: "Melancólico" },
      { id: 'D', text: "Espero que enfríe antes de hablar", temperament: "Flemático" }
    ]
  },
  {
    id: 3,
    questionText: "¿Cómo encarás un proyecto nuevo?",
    options: [
      { id: 'A', text: "Con entusiasmo inmediato aunque después me cueste terminar", temperament: "Sanguíneo" },
      { id: 'B', text: "Con un plan claro y ganas de liderarlo", temperament: "Colérico" },
      { id: 'C', text: "Pensándolo mucho antes de empezar", temperament: "Melancólico" },
      { id: 'D', text: "Paso a paso, sin apuros", temperament: "Flemático" }
    ]
  },
  {
    id: 4,
    questionText: "¿Qué necesitás para estar bien?",
    options: [
      { id: 'A', text: "Gente, actividad y variedad constante", temperament: "Sanguíneo" },
      { id: 'B', text: "Control, resultados y sentir que avanzo", temperament: "Colérico" },
      { id: 'C', text: "Silencio, profundidad y tiempo para mí", temperament: "Melancólico" },
      { id: 'D', text: "Estabilidad, rutina y paz", temperament: "Flemático" }
    ]
  },
  {
    id: 5,
    questionText: "¿Cómo te ven tus amigos?",
    options: [
      { id: 'A', text: "Divertido/a, espontáneo/a, a veces impredecible", temperament: "Sanguíneo" },
      { id: 'B', text: "Decidido/a, directo/a, a veces intenso/a", temperament: "Colérico" },
      { id: 'C', text: "Sensible, profundo/a, a veces difícil de leer", temperament: "Melancólico" },
      { id: 'D', text: "Tranquilo/a, confiable, siempre estable", temperament: "Flemático" }
    ]
  },
  {
    id: 6,
    questionText: "¿Qué te agota más?",
    options: [
      { id: 'A', text: "El silencio y la soledad prolongada", temperament: "Sanguíneo" },
      { id: 'B', text: "La lentitud y la falta de acción", temperament: "Colérico" },
      { id: 'C', text: "El ruido social y la superficialidad", temperament: "Melancólico" },
      { id: 'D', text: "El caos, los cambios bruscos y la imprevisibilidad", temperament: "Flemático" }
    ]
  },
  {
    id: 7,
    questionText: "¿Cómo tomás decisiones?",
    options: [
      { id: 'A', text: "Con el corazón, en el momento", temperament: "Sanguíneo" },
      { id: 'B', text: "Rápido y con convicción", temperament: "Colérico" },
      { id: 'C', text: "Con mucho análisis y a veces demasiadas vueltas", temperament: "Melancólico" },
      { id: 'D', text: "Despacio, evaluando todas las opciones", temperament: "Flemático" }
    ]
  },
  {
    id: 8,
    questionText: "¿Qué frase te suena más a vos?",
    options: [
      { id: 'A', text: '"La vida es corta, disfrutala ahora"', temperament: "Sanguíneo" },
      { id: 'B', text: '"Si querés algo, ve y buscalo"', temperament: "Colérico" },
      { id: 'C', text: '"Prefiero pocos pero reales"', temperament: "Melancólico" },
      { id: 'D', text: '"Todo llega a quien sabe esperar"', temperament: "Flemático" }
    ]
  }
];

const RESULTS = {
  "Sanguíneo": {
    name: "Temperamento Sanguíneo",
    description: "Tu energía es contagiosa y tu capacidad de conectar con las personas, un don genuino. Vivís el presente con intensidad y traés alegría a los espacios que habitás. El desafío es canalizar esa energía en compromisos sostenidos.",
    tags: ["sociable", "espontáneo/a", "entusiasta", "presente"]
  },
  "Colérico": {
    name: "Temperamento Colérico",
    description: "Tenés una voluntad extraordinaria y una capacidad de liderazgo que pocos tienen. Cuando te proponés algo, lo lográs. El desafío es aprender a escuchar tan bien como decidís.",
    tags: ["líder", "decidido/a", "directo/a", "enfocado/a"]
  },
  "Melancólico": {
    name: "Temperamento Melancólico",
    description: "Tu profundidad es tu mayor fortaleza. Pensás, sentís y observás con una intensidad que te permite ver lo que otros pasan por alto. El desafío es no quedarte atrapado/a en el análisis.",
    tags: ["profundo/a", "analítico/a", "sensible", "detallista"]
  },
  "Flemático": {
    name: "Temperamento Flemático",
    description: "Sos el ancla que equilibra cualquier grupo. Tu calma no es indiferencia — es una fortaleza real. Las personas confían en vos porque sabés mantener la cabeza fría cuando otros la pierden.",
    tags: ["estable", "paciente", "confiable", "equilibrado/a"]
  }
};

export default function TemperamentsTest() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useVibe();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const savedResult = user?.temperament;

  const handleSelect = (temp: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentIndex].id]: temp }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const counts: Record<string, number> = { Sanguíneo: 0, Colérico: 0, Melancólico: 0, Flemático: 0 };
      Object.values(answers).forEach(temp => {
        if (counts[temp] !== undefined) counts[temp]++;
      });

      let highestTemp = "Sanguíneo";
      let maxCount = -1;
      let tie = false;

      Object.entries(counts).forEach(([temp, count]) => {
        if (count > maxCount) {
          maxCount = count;
          highestTemp = temp;
          tie = false;
        } else if (count === maxCount) {
          tie = true;
        }
      });

      if (tie) {
        highestTemp = answers[QUESTIONS[QUESTIONS.length - 1].id] || "Sanguíneo";
      }

      const result = RESULTS[highestTemp as keyof typeof RESULTS] || RESULTS.Sanguíneo;
      updateUserProfile({ temperament: result });
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      navigate('/tests');
    }
  };

  const handleRestart = () => {
    updateUserProfile({ temperament: undefined });
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleShare = () => {
    navigate('/share', { 
      state: { 
        title: savedResult?.name || "Temperamentos", 
        description: savedResult?.description || "" 
      } 
    });
  };

  if (savedResult) {
    return (
      <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
        <Header title="Resultados" showBack={true} onBack={() => navigate('/tests')} />
        <div className="flex-grow px-6 pt-8 pb-32 flex flex-col justify-between overflow-y-auto no-scrollbar text-left">
          <div className="flex flex-col gap-6 items-center text-center mt-8">
            <div className="w-20 h-20 rounded-3xl bg-vibe-card border border-vibe-border flex items-center justify-center text-vibe-volt shadow-lg">
              <Compass className="w-10 h-10 text-[#60a5fa]" />
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase">
                Temperamentos
              </span>
              <h2 className="font-heading text-4xl text-[#F5F5F0] leading-none" style={{ fontFamily: "'Paytone One', sans-serif" }}>
                {savedResult.name}
              </h2>
            </div>

            <p className="text-sm text-[#888888] leading-relaxed max-w-sm mt-2">
              {savedResult.description}
            </p>

            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {savedResult.tags.map((tag: string) => (
                <span key={tag} className="bg-[#1A1A1A] border border-[#2A2A2A] text-[#888888] text-[10px] font-semibold uppercase px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <Button variant="primary" onClick={handleShare}>
              Compartir resultado
            </Button>
            <button
              onClick={() => navigate('/tests')}
              className="w-full h-12 border border-[#2A2A2A] bg-transparent text-[#F5F5F0] rounded-xl flex items-center justify-center font-bold text-xs hover:border-vibe-volt/40 active:scale-[0.99] transition-all cursor-pointer"
            >
              Volver a Tests
            </button>
            <button
              onClick={handleRestart}
              className="text-xs text-vibe-light-gray hover:text-vibe-volt mt-2 text-center underline cursor-pointer"
            >
              Repetir test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIndex];
  const selectedOptionTemp = answers[currentQuestion.id];

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      <Header showBack={true} onBack={handleBack} />
      <div className="flex-grow px-6 pt-4 pb-8 flex flex-col justify-between overflow-y-auto no-scrollbar text-left">
        <div className="flex flex-col gap-6">
          <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} />

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vibe-volt" />
              Temperamentos
            </span>
            <h2 className="font-heading text-2xl text-vibe-offwhite leading-snug">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="w-full h-px bg-vibe-border/50 my-2" />

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              return (
                <div
                  key={option.temperament}
                  onClick={() => handleSelect(option.temperament)}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 cursor-pointer select-none transition-all ${
                    selectedOptionTemp === option.temperament
                      ? 'border-[#C8F55A] bg-[#C8F55A]/10 text-vibe-offwhite'
                      : 'border-[#2A2A2A] bg-[#1A1A1A] text-vibe-light-gray hover:border-vibe-volt/30'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-vibe-border flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                    {letter}
                  </div>
                  <span className="text-xs font-medium leading-relaxed">{option.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!selectedOptionTemp}
            className={!selectedOptionTemp ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {currentIndex === QUESTIONS.length - 1 ? 'FINALIZAR' : 'SIGUIENTE'}
          </Button>
        </div>
      </div>
    </div>
  );
}
