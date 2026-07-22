import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { FeaturedHeroCard, FeatureCard } from '../../components/ui/Cards';
import PlusAccents from '../../components/ui/PlusAccents';
import { useVibe } from '../../context/VibeContext';
import { Sparkles, Heart, Zap, Compass, RefreshCw, BarChart2 } from 'lucide-react';

export default function TestsScreen() {
  const navigate = useNavigate();
  const { user } = useVibe();

  const handleStartTest = () => {
    if (user?.mbtiCompleted) {
      navigate('/mbti-result');
    } else {
      navigate('/mbti-quiz');
    }
  };

  const thisWeekTests = [
    {
      title: "Compatibilidad Astral",
      description: "Descubrí qué signos vibran en la misma frecuencia que vos.",
      icon: Sparkles,
      color: 'text-[#a78bfa]'
    },
    {
      title: "Gusto Estético",
      description: "Tu sentido visual en moda, diseño y colores analizado.",
      icon: Zap,
      color: 'text-[#fb923c]',
      badge: 'POPULAR'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header */}
      <Header
        title="Tests"
        rightAction={<PlusAccents count={1} />}
      />

      {/* Main Container */}
      <div className="flex-grow px-6 pt-4 pb-32 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        
        {/* Featured hero quiz card */}
        <div className="flex flex-col gap-2">
          <FeaturedHeroCard
            label="TEST DESTACADO"
            title="MBTI · Celeb Match"
            subtitle="Descubrí con qué celebridades compartís arquetipo de personalidad."
            type="gem"
            onAction={handleStartTest}
            actionText="EMPEZAR"
          />
        </div>

        {/* Section weekly tests */}
        <div className="flex flex-col gap-3 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Esta semana
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          <div className="flex flex-col gap-4">
            {thisWeekTests.map((test, index) => (
              <FeatureCard
                key={index}
                title={test.title}
                description={test.description}
                icon={test.icon}
                color={test.color}
                badge={test.badge}
                onClick={() => {
                  if (test.title === "Compatibilidad Astral") {
                    navigate('/astral-quiz');
                  } else if (test.title === "Gusto Estético") {
                    navigate('/aesthetic-quiz');
                  } else {
                    handleStartTest();
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Section classic tests */}
        <div className="flex flex-col gap-3 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Clásicos
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => navigate('/enneagram-quiz')}
              className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col items-start text-left cursor-pointer hover:border-vibe-volt/30 active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-vibe-bg border border-vibe-border flex items-center justify-center text-[#f472b6] mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-xs text-vibe-offwhite mb-1.5 leading-snug">
                Test Enneagram
              </h4>
            </div>

            <div
              onClick={() => navigate('/temperament-quiz')}
              className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col items-start text-left cursor-pointer hover:border-vibe-volt/30 active:scale-[0.98] transition-all relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-vibe-bg border border-vibe-border flex items-center justify-center text-[#60a5fa] mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-heading text-xs text-vibe-offwhite mb-1.5 leading-snug">
                Temperamentos
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
