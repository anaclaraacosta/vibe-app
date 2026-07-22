import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { Sparkles } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    questionText: "¿Cómo reaccionás ante los conflictos?",
    options: [
      { id: 'A', text: "Los enfrento directamente y sin rodeos" },
      { id: 'B', text: "Los proceso internamente antes de hablar" },
      { id: 'C', text: "Busco mediación y acuerdo entre las partes" },
      { id: 'D', text: "Prefiero evitarlos y dar tiempo al tiempo" }
    ]
  },
  {
    id: 2,
    questionText: "¿Con qué energía te identificás más?",
    options: [
      { id: 'A', text: "Fuego — intensa, apasionada, impulsiva" },
      { id: 'B', text: "Tierra — estable, práctica, constante" },
      { id: 'C', text: "Aire — curiosa, social, cambiante" },
      { id: 'D', text: "Agua — emocional, intuitiva, profunda" }
    ]
  },
  {
    id: 3,
    questionText: "¿Cómo tomás decisiones importantes?",
    options: [
      { id: 'A', text: "Rápido, con el instinto" },
      { id: 'B', text: "Analizando pros y contras con calma" },
      { id: 'C', text: "Consultando con personas de confianza" },
      { id: 'D', text: "Esperando que las cosas se acomoden solas" }
    ]
  },
  {
    id: 4,
    questionText: "¿Qué valorás más en una relación?",
    options: [
      { id: 'A', text: "Pasión e intensidad" },
      { id: 'B', text: "Estabilidad y lealtad" },
      { id: 'C', text: "Comunicación y libertad" },
      { id: 'D', text: "Conexión emocional profunda" }
    ]
  },
  {
    id: 5,
    questionText: "¿Cómo sos en un grupo de personas nuevas?",
    options: [
      { id: 'A', text: "Tomás el centro naturalmente" },
      { id: 'B', text: "Observás antes de participar" },
      { id: 'C', text: "Te adaptás fácilmente a cualquier dinámica" },
      { id: 'D', text: "Conectás profundo con una o dos personas" }
    ]
  },
  {
    id: 6,
    questionText: "¿Qué te agota más?",
    options: [
      { id: 'A', text: "La monotonía y la falta de acción" },
      { id: 'B', text: "El caos y la imprevisibilidad" },
      { id: 'C', text: "El silencio social prolongado" },
      { id: 'D', text: "Las interacciones superficiales" }
    ]
  },
  {
    id: 7,
    questionText: "¿Cómo expresás el afecto?",
    options: [
      { id: 'A', text: "Con gestos grandes y directos" },
      { id: 'B', text: "Con actos de servicio y presencia constante" },
      { id: 'C', text: "Con palabras y tiempo de calidad" },
      { id: 'D', text: "Con detalles sutiles y escucha profunda" }
    ]
  },
  {
    id: 8,
    questionText: "¿Qué frase te representa más?",
    options: [
      { id: 'A', text: "La vida es corta, disfrutala ahora" },
      { id: 'B', text: "Despacio se llega lejos" },
      { id: 'C', text: "La vida es mejor compartida" },
      { id: 'D', text: "Todo pasa por algo" }
    ]
  }
];

const RESULTS = {
  A: {
    name: "Alma de Fuego",
    description: "Tu energía es magnética e irrefrenable. Atraés a quienes buscan intensidad y vivís las relaciones con todo o nada. Tu compatibilidad más alta es con quienes pueden seguirte el ritmo sin apagarte.",
    tags: ["intenso/a", "apasionado/a", "líder natural", "todo o nada"]
  },
  B: {
    name: "Espíritu de Tierra",
    description: "Sos el ancla que todos necesitan. Tu presencia transmite calma y tu lealtad es inquebrantable. Compatibilidad alta con quienes valoran la profundidad por sobre la velocidad.",
    tags: ["leal", "estable", "paciente", "confiable"]
  },
  C: {
    name: "Mente de Aire",
    description: "Tu curiosidad y adaptabilidad hacen que conectes con casi cualquier persona. Necesitás libertad y variedad para florecer. Compatibilidad alta con quienes no te quieren encasillar.",
    tags: ["versátil", "social", "curioso/a", "libre"]
  },
  D: {
    name: "Corazón de Agua",
    description: "Tu mundo interior es vasto y tu empatía, extraordinaria. Sentís todo con una profundidad que pocos comprenden. Compatibilidad alta con quienes valoran la sensibilidad como fortaleza.",
    tags: ["empático/a", "intuitivo/a", "profundo/a", "sensible"]
  }
};

export default function AstralCompatibilityTest() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useVibe();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const savedResult = user?.astralCompatibility;

  const handleSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentIndex].id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Calculate majority
      const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
      Object.values(answers).forEach(val => {
        if (counts[val] !== undefined) counts[val]++;
      });

      let majorityKey = 'A';
      let maxCount = -1;
      let tie = false;

      Object.entries(counts).forEach(([key, count]) => {
        if (count > maxCount) {
          maxCount = count;
          majorityKey = key;
          tie = false;
        } else if (count === maxCount) {
          tie = true;
        }
      });

      if (tie) {
        // tie-breaker: pick last question's answer
        majorityKey = answers[QUESTIONS[QUESTIONS.length - 1].id] || 'A';
      }

      const result = RESULTS[majorityKey as keyof typeof RESULTS] || RESULTS.A;
      updateUserProfile({ astralCompatibility: result });
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
    updateUserProfile({ astralCompatibility: undefined });
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleShare = () => {
    navigate('/share', { 
      state: { 
        title: savedResult?.name || "Compatibilidad Astral", 
        description: savedResult?.description || "" 
      } 
    });
  };

  // If completed, show result view
  if (savedResult) {
    return (
      <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
        <Header title="Resultados" showBack={true} onBack={() => navigate('/tests')} />
        <div className="flex-grow px-6 pt-8 pb-32 flex flex-col justify-between overflow-y-auto no-scrollbar text-left">
          <div className="flex flex-col gap-6 items-center text-center mt-8">
            <div className="w-20 h-20 rounded-3xl bg-vibe-card border border-vibe-border flex items-center justify-center text-vibe-volt shadow-lg">
              <Sparkles className="w-10 h-10" />
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase">
                Compatibilidad Astral
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
  const selectedOptionId = answers[currentQuestion.id];

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      <Header showBack={true} onBack={handleBack} />
      <div className="flex-grow px-6 pt-4 pb-8 flex flex-col justify-between overflow-y-auto no-scrollbar text-left">
        <div className="flex flex-col gap-6">
          <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} />

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vibe-volt" />
              Astral
            </span>
            <h2 className="font-heading text-2xl text-vibe-offwhite leading-snug">
              {currentQuestion.questionText}
            </h2>
          </div>

          <div className="w-full h-px bg-vibe-border/50 my-2" />

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map(option => (
              <div
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 cursor-pointer select-none transition-all ${
                  selectedOptionId === option.id
                    ? 'border-[#C8F55A] bg-[#C8F55A]/10 text-vibe-offwhite'
                    : 'border-[#2A2A2A] bg-[#1A1A1A] text-vibe-light-gray hover:border-vibe-volt/30'
                }`}
              >
                <div className="w-5 h-5 rounded-full border border-vibe-border flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                  {option.id}
                </div>
                <span className="text-xs font-medium leading-relaxed">{option.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!selectedOptionId}
            className={!selectedOptionId ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {currentIndex === QUESTIONS.length - 1 ? 'FINALIZAR' : 'SIGUIENTE'}
          </Button>
        </div>
      </div>
    </div>
  );
}
