import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { Heart } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    questionText: "¿Qué te motiva más profundamente?",
    options: [
      { id: 'A', text: "Hacer las cosas bien y de forma correcta", type: 1 },
      { id: 'B', text: "Ser necesario/a y ayudar a los demás", type: 2 },
      { id: 'C', text: "Lograr metas y que los demás lo vean", type: 3 },
      { id: 'D', text: "Ser auténtico/a y diferente", type: 4 }
    ]
  },
  {
    id: 2,
    questionText: "¿Qué te genera más ansiedad?",
    options: [
      { id: 'A', text: "Cometer errores o actuar de forma incorrecta", type: 1 },
      { id: 'B', text: "No ser querido/a o sentirme innecesario/a", type: 2 },
      { id: 'C', text: "Fracasar o quedar expuesto/a como mediocre", type: 3 },
      { id: 'D', text: "Ser común, igual a todos", type: 4 }
    ]
  },
  {
    id: 3,
    questionText: "¿Cómo reaccionás bajo presión?",
    options: [
      { id: 'A', text: "Me vuelvo más crítico/a y exigente", type: 1 },
      { id: 'B', text: "Me sobreentrego a los demás", type: 2 },
      { id: 'C', text: "Me enfoco más en los resultados", type: 3 },
      { id: 'D', text: "Me retraigo y proceso emocionalmente", type: 4 }
    ]
  },
  {
    id: 4,
    questionText: "¿Qué buscás en el trabajo o proyectos?",
    options: [
      { id: 'A', text: "Orden, calidad y hacer las cosas como corresponde", type: 1 },
      { id: 'B', text: "Colaborar y que mi aporte sea valorado", type: 2 },
      { id: 'C', text: "Destacarme y alcanzar el éxito", type: 3 },
      { id: 'D', text: "Expresarme y dejar algo con mi sello", type: 4 }
    ]
  },
  {
    id: 5,
    questionText: "¿Qué frase te representa más?",
    options: [
      { id: 'A', text: '"Si vale la pena hacerlo, vale la pena hacerlo bien"', type: 1 },
      { id: 'B', text: '"La gente primero"', type: 2 },
      { id: 'C', text: '"El éxito no es suerte, es trabajo"', type: 3 },
      { id: 'D', text: '"Prefiero ser real antes que popular"', type: 4 }
    ]
  },
  {
    id: 6,
    questionText: "¿Qué necesitás para sentirte bien?",
    options: [
      { id: 'A', text: "Que todo esté en orden y bajo control", type: 1 },
      { id: 'B', text: "Saber que importo en la vida de otros", type: 2 },
      { id: 'C', text: "Reconocimiento por lo que logro", type: 3 },
      { id: 'D', text: "Espacio para sentir y crear", type: 4 }
    ]
  },
  {
    id: 7,
    questionText: "¿Cómo te ven los demás generalmente?",
    options: [
      { id: 'A', text: "Responsable, detallista, un poco rígido/a", type: 1 },
      { id: 'B', text: "Cálido/a, generoso/a, pendiente de todos", type: 2 },
      { id: 'C', text: "Ambicioso/a, carismático/a, enfocado/a", type: 3 },
      { id: 'D', text: "Sensible, creativo/a, algo intenso/a", type: 4 }
    ]
  },
  {
    id: 8,
    questionText: "¿Qué te cuesta más?",
    options: [
      { id: 'A', text: "Aceptar la imperfección", type: 1 },
      { id: 'B', text: "Pedir ayuda para mí mismo/a", type: 2 },
      { id: 'C', text: "Mostrar vulnerabilidad", type: 3 },
      { id: 'D', text: "No compararme con los demás", type: 4 }
    ]
  },
  {
    id: 9,
    questionText: "¿Cuál es tu mayor miedo?",
    options: [
      { id: 'A', text: "Ser corrupto/a o actuar mal", type: 1 },
      { id: 'B', text: "No ser amado/a", type: 2 },
      { id: 'C', text: "Ser un fracaso", type: 3 },
      { id: 'D', text: "No tener identidad propia", type: 4 }
    ]
  }
];

const RESULTS = {
  1: {
    name: "El Perfeccionista",
    description: "Tenés estándares altos para vos y para el mundo. Tu brújula interna es fuerte y tu sentido de la responsabilidad, inquebrantable. El desafío es aprender a soltar el control y aceptar que lo bueno también es suficiente.",
    tags: ["ordenado/a", "ético/a", "exigente", "responsable"]
  },
  2: {
    name: "El Ayudador",
    description: "Tu mayor fortaleza es tu capacidad de hacer sentir a los demás vistos y queridos. Das con generosidad genuina, aunque a veces te olvidás de incluirte en esa lista. Aprender a recibir es tu camino.",
    tags: ["empático/a", "generoso/a", "cálido/a", "relacional"]
  },
  3: {
    name: "El Triunfador",
    description: "Estás orientado/a al logro con una energía que pocos tienen. Sabés cómo presentarte y adaptarte para alcanzar tus metas. El desafío es conectar con quién sos más allá de lo que lográs.",
    tags: ["ambicioso/a", "carismático/a", "adaptable", "enfocado/a"]
  },
  4: {
    name: "El Individualista",
    description: "Tu mundo interior es rico, complejo y único. Tenés una sensibilidad que convierte lo cotidiano en arte. El desafío es no quedarte atrapado/a en la búsqueda de lo que falta.",
    tags: ["creativo/a", "auténtico/a", "sensible", "profundo/a"]
  }
};

export default function EnneagramTest() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useVibe();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const savedResult = user?.enneagram;

  const handleSelect = (type: number) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentIndex].id]: type }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
      Object.values(answers).forEach(type => {
        if (counts[type] !== undefined) counts[type]++;
      });

      let highestType = 1;
      let maxCount = -1;
      let tie = false;

      Object.entries(counts).forEach(([typeStr, count]) => {
        const type = parseInt(typeStr);
        if (count > maxCount) {
          maxCount = count;
          highestType = type;
          tie = false;
        } else if (count === maxCount) {
          tie = true;
        }
      });

      if (tie) {
        highestType = answers[QUESTIONS[QUESTIONS.length - 1].id] || 1;
      }

      const result = RESULTS[highestType as keyof typeof RESULTS] || RESULTS[1];
      updateUserProfile({ enneagram: result });
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
    updateUserProfile({ enneagram: undefined });
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleShare = () => {
    navigate('/share', { 
      state: { 
        title: savedResult?.name || "Enneagram", 
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
              <Heart className="w-10 h-10 text-[#f472b6]" />
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase">
                Test Eneagrama
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
  const selectedOptionType = answers[currentQuestion.id];

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      <Header showBack={true} onBack={handleBack} />
      <div className="flex-grow px-6 pt-4 pb-8 flex flex-col justify-between overflow-y-auto no-scrollbar text-left">
        <div className="flex flex-col gap-6">
          <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} />

          <div className="flex flex-col gap-2 mt-2">
            <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vibe-volt" />
              Eneagrama
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
                  key={option.type}
                  onClick={() => handleSelect(option.type)}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 cursor-pointer select-none transition-all ${
                    selectedOptionType === option.type
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
            disabled={!selectedOptionType}
            className={!selectedOptionType ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {currentIndex === QUESTIONS.length - 1 ? 'FINALIZAR' : 'SIGUIENTE'}
          </Button>
        </div>
      </div>
    </div>
  );
}
