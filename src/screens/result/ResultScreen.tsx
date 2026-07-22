import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe, ARCHETYPE_DETAILS } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import { CategoryCard } from '../../components/ui/Cards';
import PlusAccents from '../../components/ui/PlusAccents';
import { Music, Film, Tv, BookOpen, Shirt, Compass, Star } from 'lucide-react';

export default function ResultScreen() {
  const navigate = useNavigate();
  const { personality, recommendations, user } = useVibe();

  const categoryIcons: Record<string, any> = {
    music: Music,
    cinema: Film,
    series: Tv,
    books: BookOpen,
    fashion: Shirt,
    destination: Compass
  };

  const categoryColors: Record<string, string> = {
    music: 'text-category-music',
    cinema: 'text-category-cinema',
    series: 'text-category-series',
    books: 'text-category-books',
    fashion: 'text-category-fashion',
    destination: 'text-category-destination'
  };

  const categoryLabels: Record<string, string> = {
    music: 'Música',
    cinema: 'Cine',
    series: 'Series',
    books: 'Libros',
    fashion: 'Ropa',
    destination: 'Destino'
  };

  const archetypeInfo = ARCHETYPE_DETAILS[personality] || {
    description: "Tu arquetipo cultural personalizado en base a tus respuestas.",
    badges: ["Indie", "Cozy"]
  };

  const activeBadges = user?.badges && user.badges.length > 0 ? user.badges : archetypeInfo.badges;

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header */}
      <Header
        title="Resultados"
        rightAction={<PlusAccents count={1} />}
      />

      {/* Main Container */}
      <div className="flex-grow px-6 pt-4 pb-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
        
        {/* VIBE Reveal Section */}
        <div className="flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vibe-volt animate-pulse" />
              TU VIBE ACTUAL
            </span>
            <div className="flex flex-col gap-0.5">
              <h1 className="font-heading text-4xl text-vibe-offwhite leading-none">
                {personality}
              </h1>
            </div>
            
            {/* Badges/Tags list */}
            <div className="flex flex-wrap gap-2 mt-2">
              {activeBadges.map((badge) => (
                <span key={badge} className="bg-vibe-card border border-vibe-border px-3 py-1 rounded-full text-[10px] font-medium tracking-wider text-vibe-light-gray uppercase">
                  #{badge}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-vibe-light-gray leading-relaxed">
            {archetypeInfo.description}
          </p>

          {/* Divider */}
          <div className="flex items-center w-full my-2">
            <h3 className="font-heading text-sm text-vibe-volt uppercase tracking-wider pr-4">
              RECOMENDACIONES
            </h3>
            <div className="flex-grow h-px bg-vibe-border" />
          </div>

          {/* Grid of Recommendation Cards */}
          <div className="grid grid-cols-2 gap-4">
            {recommendations.map((item) => (
              <CategoryCard
                key={item.id}
                category={categoryLabels[item.category] || item.category}
                title={item.title}
                description={item.subtitle}
                categoryColor={categoryColors[item.category] || 'text-vibe-volt'}
                icon={categoryIcons[item.category] || Star}
                progressPercent={item.category === 'music' ? 85 : item.category === 'cinema' ? 65 : undefined}
                onClick={() => navigate(`/recommendation/${item.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 flex flex-col gap-2">
          <Button variant="primary" onClick={() => navigate('/home')}>
            ENTRAR A VIBE
          </Button>
        </div>
      </div>
    </div>
  );
}
