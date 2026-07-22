import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { Zap } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    questionText: "¿Qué espacio te hace sentir más cómodo/a?",
    options: [
      { id: 'A', text: "Una galería de arte contemporáneo, blanca y minimalista" },
      { id: 'B', text: "Un café vintage con libros apilados y luz cálida" },
      { id: 'C', text: "Un estudio lleno de colores, materiales y caos creativo" },
      { id: 'D', text: "Un espacio industrial con neones y música electrónica" }
    ]
  },
  {
    id: 2,
    questionText: "¿Qué paleta de colores te atrae más?",
    options: [
      { id: 'A', text: "Blanco, beige y negro — neutros puros" },
      { id: 'B', text: "Tierras, ocres y verdes de la naturaleza — cálidos" },
      { id: 'C', text: "Colores vibrantes y contrastantes — energía" },
      { id: 'D', text: "Grises, azules profundos y neón — urbano nocturno" }
    ]
  },
  {
    id: 3,
    questionText: "¿Cómo preferís que sea una película visualmente?",
    options: [
      { id: 'A', text: "Encuadres precisos, composición geométrica, sin efectos" },
      { id: 'B', text: "Fotografía cálida, granulada, con luz natural" },
      { id: 'C', text: "Visual caótico, expresivo, que rompa reglas" },
      { id: 'D', text: "Estética oscura, cinematográfica, muy producida" }
    ]
  },
  {
    id: 4,
    questionText: "¿Qué tipografía te parece más atractiva?",
    options: [
      { id: 'A', text: "Sans-serif limpia y geométrica" },
      { id: 'B', text: "Serif clásica con mucho espacio en blanco" },
      { id: 'C', text: "Display experimental, irregular, con personalidad propia" },
      { id: 'D', text: "Bold condensada, toda caps, con impacto visual" }
    ]
  },
  {
    id: 5,
    questionText: "¿Qué moda te representa más?",
    options: [
      { id: 'A', text: "Minimal — pocas prendas, mucha calidad, sin logos" },
      { id: 'B', text: "Vintage — prendas con historia, mezcla de épocas" },
      { id: 'C', text: "Artsy — prendas que son casi obras de arte" },
      { id: 'D', text: "Streetwear — urbano, funcional, con actitud" }
    ]
  },
  {
    id: 6,
    questionText: "¿Qué tipo de música escuchás mientras trabajás o creás?",
    options: [
      { id: 'A', text: "Silencio o sonidos ambientales" },
      { id: 'B', text: "Vinilo de jazz, soul o folk" },
      { id: 'C', text: "Cualquier cosa según el estado de ánimo" },
      { id: 'D', text: "Electronic, techno o hip-hop instrumental" }
    ]
  },
  {
    id: 7,
    questionText: "¿Cómo decorarías tu cuarto idealmente?",
    options: [
      { id: 'A', text: "Lo mínimo indispensable, cada objeto con propósito" },
      { id: 'B', text: "Plantas, libros, objetos con historia personal" },
      { id: 'C', text: "Arte en las paredes, texturas mezcladas, sin reglas" },
      { id: 'D', text: "Luces led, tecnología visible, estética gamer/dark" }
    ]
  },
  {
    id: 8,
    questionText: "¿Qué red social refleja mejor tu gusto visual?",
    options: [
      { id: 'A', text: "Pinterest curado al máximo" },
      { id: 'B', text: "Instagram con fotos de film y cafés" },
      { id: 'C', text: "Tumblr o Behance — arte sin filtro" },
      { id: 'D', text: "Twitter/X — todo texto, nada de estética" }
    ]
  },
  {
    id: 9,
    questionText: "¿Qué palabra describe mejor tu ideal estético?",
    options: [
      { id: 'A', text: "Pureza" },
      { id: 'B', text: "Calidez" },
      { id: 'C', text: "Expresión" },
      { id: 'D', text: "Intensidad" }
    ]
  }
];

const RESULTS = {
  A: {
    name: "Minimalista Radical",
    description: "Tu estética es la depuración total. Creés que menos es más y que la belleza está en lo que se elimina, no en lo que se agrega. Cada elección visual tuya es intencional y deliberada.",
    tags: ["minimal", "preciso/a", "curado/a", "esencialista"]
  },
  B: {
    name: "Romántico Analógico",
    description: "Te atraen las cosas con historia y las texturas que el tiempo dejó. Tu gusto tiene nostalgia pero no es retro por moda — es genuino. Valorás la calidez por sobre el impacto.",
    tags: ["vintage", "cálido/a", "auténtico/a", "analógico/a"]
  },
  C: {
    name: "Expresionista Libre",
    description: "Para vos el arte no tiene reglas y la estética es un campo de experimentación. Tu gusto es difícil de categorizar y eso es exactamente lo que lo hace único.",
    tags: ["experimental", "ecléctico/a", "sin reglas", "creativo/a"]
  },
  D: {
    name: "Urbano Nocturno",
    description: "Tu estética vive de noche. Te atraen los contrastes fuertes, las luces artificiales y la energía de la ciudad cuando duerme. Hay algo oscuro y magnético en todo lo que elegís.",
    tags: ["oscuro/a", "urbano/a", "intenso/a", "nocturno/a"]
  }
};

export default function AestheticTasteTest() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useVibe();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const savedResult = user?.aestheticTaste;

  const handleSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentIndex].id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
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
        majorityKey = answers[QUESTIONS[QUESTIONS.length - 1].id] || 'A';
      }

      const result = RESULTS[majorityKey as keyof typeof RESULTS] || RESULTS.A;
      updateUserProfile({ aestheticTaste: result });
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
    updateUserProfile({ aestheticTaste: undefined });
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleShare = () => {
    navigate('/share', { 
      state: { 
        title: savedResult?.name || "Gusto Estético", 
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
              <Zap className="w-10 h-10" />
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase">
                Gusto Estético
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
              Estética
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
