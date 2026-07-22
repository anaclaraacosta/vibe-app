import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import PlusAccents from '../../components/ui/PlusAccents';
import Header from '../../components/layout/Header';
import { Sparkles, Home, Compass, BarChart2, User, ChevronLeft } from 'lucide-react';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState<number>(0);

  const handleStart = () => {
    navigate('/login');
  };

  const handleNextSlide = () => {
    setSlideIndex(prev => prev + 1);
  };

  const handlePrevSlide = () => {
    setSlideIndex(prev => Math.max(0, prev - 1));
  };

  const tags = [
    { text: 'música', category: 'music' as const, style: 'left-[45px] top-[97px]' },
    { text: 'cine', category: 'cinema' as const, style: 'right-[39px] top-[170px]' },
    { text: 'libros', category: 'books' as const, style: 'left-[39px] bottom-[121px]' },
    { text: 'ropa', category: 'fashion' as const, style: 'left-[175px] top-[243px]' },
    { text: 'series', category: 'series' as const, style: 'right-[97px] top-[72px]' },
    { text: 'destino', category: 'destination' as const, style: 'right-[58px] bottom-[194px]' }
  ];

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite select-none">
      
      {/* Conditionally render header based on slide index */}
      {slideIndex > 0 && (
        <Header
          showBack={true}
          onBack={handlePrevSlide}
          rightAction={
            <button
              onClick={handleStart}
              className="text-xs font-bold uppercase tracking-wider text-vibe-light-gray hover:text-vibe-volt transition-colors"
            >
              Omitir
            </button>
          }
        />
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col justify-between overflow-y-auto no-scrollbar">
        
        {/* SLIDE 1: Welcome Intro */}
        {slideIndex === 0 && (
          <div className="flex flex-col h-full justify-between">
            {/* Top illustrations & floating pills */}
            <div className="h-[486px] relative shrink-0 overflow-hidden flex items-center justify-center">
              <div className="absolute w-[300px] h-[300px] rounded-full bg-vibe-volt opacity-[0.08] blur-[50px]" />
              
              <div className="absolute right-8 top-20 grid grid-cols-2 gap-1.5 opacity-60">
                <div className="w-1 h-1 rounded-full bg-vibe-volt" />
                <div className="w-1 h-1 rounded-full bg-vibe-volt" />
                <div className="w-1 h-1 rounded-full bg-vibe-volt" />
                <div className="w-1 h-1 rounded-full bg-vibe-volt" />
              </div>

              <div className="relative w-[256px] h-[256px] flex items-center justify-center">
                <div className="absolute w-40 h-40 rounded-full bg-[#c8f55a] opacity-[0.15] -translate-x-12 -translate-y-8" />
                <div className="absolute w-48 h-32 rounded-[40px] bg-[#a78bfa] opacity-[0.15] translate-x-10 translate-y-6" />
                <div className="absolute w-32 h-32 rounded-full bg-[#fb923c] opacity-[0.15] -translate-x-6 translate-y-12" />
                <div className="absolute w-36 h-36 rounded-2xl bg-[#f472b6] opacity-[0.15] rotate-12" />
                <div className="absolute w-24 h-24 rounded-full border border-vibe-border/40 backdrop-blur-md flex items-center justify-center bg-vibe-card/25 shadow-lg">
                  <PlusAccents count={1} />
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none">
                {tags.map((tag, i) => (
                  <div key={i} className={`absolute ${tag.style}`}>
                    <Badge category={tag.category}>{tag.text}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom info card */}
            <div className="flex-grow bg-vibe-card border-t border-vibe-border rounded-t-[28px] px-6 pt-10 pb-8 flex flex-col justify-between relative shadow-[0_-10px_25px_rgba(0,0,0,0.4)]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-1 bg-vibe-border rounded-full" />
              <div className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase">
                    BIENVENIDO
                  </span>
                  <h1 className="font-heading text-[38px] leading-[42px] text-vibe-offwhite tracking-[-0.8px]">
                    Conocete.<br />
                    Encontrá tu<br />
                    cultura.
                  </h1>
                </div>
                <p className="text-sm text-vibe-light-gray leading-relaxed max-w-[300px]">
                  VIBE analiza tu personalidad y te recomienda música, películas, ropa y más — actualizado cada día.
                </p>
              </div>

              <div className="flex flex-col gap-6 mt-6">
                <div className="flex gap-2.5 items-center justify-start">
                  <div onClick={() => setSlideIndex(0)} className="w-8 h-2.5 rounded-full bg-vibe-volt cursor-pointer transition-all duration-300" />
                  <div onClick={() => setSlideIndex(1)} className="w-2.5 h-2.5 rounded-full bg-vibe-border cursor-pointer hover:bg-vibe-volt/30" />
                  <div onClick={() => setSlideIndex(2)} className="w-2.5 h-2.5 rounded-full bg-vibe-border cursor-pointer hover:bg-vibe-volt/30" />
                </div>
                <Button variant="primary" onClick={handleNextSlide}>
                  EMPEZAR
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: How It Works */}
        {slideIndex === 1 && (
          <div className="flex flex-col h-full justify-between px-6 pt-4 pb-8">
            <div className="flex flex-col gap-6 text-left">
              {/* Header Info */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase">
                  CÓMO FUNCIONA
                </span>
                <h1 className="font-heading text-3xl text-vibe-offwhite leading-tight">
                  Simple. Dos minutos.
                </h1>
              </div>

              {/* Steps Cards section */}
              <div className="flex flex-col gap-4 mt-2">
                {/* Card 01 */}
                <div className="bg-vibe-card border border-vibe-border rounded-2xl flex items-stretch overflow-hidden">
                  <div className="w-20 bg-vibe-bg/40 border-r border-vibe-border flex items-center justify-center shrink-0">
                    <span className="font-heading text-2xl text-vibe-volt">01</span>
                  </div>
                  <div className="p-5 text-left flex flex-col gap-1">
                    <h3 className="font-heading text-sm text-vibe-offwhite">Perfil Vibe</h3>
                    <p className="text-[11px] text-vibe-light-gray leading-normal">
                      Contestás 7 preguntas simples sobre tus gustos analógicos y digitales.
                    </p>
                  </div>
                </div>

                {/* Card 02 */}
                <div className="bg-vibe-card border border-vibe-border rounded-2xl flex items-stretch overflow-hidden">
                  <div className="w-20 bg-vibe-bg/40 border-r border-vibe-border flex items-center justify-center shrink-0">
                    <span className="font-heading text-2xl text-category-cinema">02</span>
                  </div>
                  <div className="p-5 text-left flex flex-col gap-1">
                    <h3 className="font-heading text-sm text-vibe-offwhite">AI Match</h3>
                    <p className="text-[11px] text-vibe-light-gray leading-normal">
                      Nuestro motor procesa tus respuestas en tiempo real.
                    </p>
                  </div>
                </div>

                {/* Card 03 */}
                <div className="bg-vibe-card border border-vibe-border rounded-2xl flex items-stretch overflow-hidden">
                  <div className="w-20 bg-vibe-bg/40 border-r border-vibe-border flex items-center justify-center shrink-0">
                    <span className="font-heading text-2xl text-category-books">03</span>
                  </div>
                  <div className="p-5 text-left flex flex-col gap-1">
                    <h3 className="font-heading text-sm text-vibe-offwhite">Resultados</h3>
                    <p className="text-[11px] text-vibe-light-gray leading-normal">
                      Obtenés tu arquetipo y recomendaciones de música, cine y más.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex gap-2.5 items-center justify-start">
                <div onClick={() => setSlideIndex(0)} className="w-2.5 h-2.5 rounded-full bg-vibe-border cursor-pointer hover:bg-vibe-volt/30" />
                <div onClick={() => setSlideIndex(1)} className="w-8 h-2.5 rounded-full bg-vibe-volt cursor-pointer transition-all duration-300" />
                <div onClick={() => setSlideIndex(2)} className="w-2.5 h-2.5 rounded-full bg-vibe-border cursor-pointer hover:bg-vibe-volt/30" />
              </div>
              <Button variant="primary" onClick={handleNextSlide}>
                CONTINUAR
              </Button>
            </div>
          </div>
        )}

        {/* SLIDE 3: App Preview */}
        {slideIndex === 2 && (
          <div className="flex flex-col h-full justify-between px-6 pt-4 pb-8">
            <div className="flex flex-col gap-6 text-left">
              {/* Header Info */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase">
                  LO QUE TE ESPERA
                </span>
                <h1 className="font-heading text-3xl text-vibe-offwhite leading-tight">
                  Todo esto, para vos.
                </h1>
              </div>

              {/* Grid cards section */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col text-left gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-vibe-bg border border-vibe-border flex items-center justify-center text-vibe-volt">
                    <Home className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-sm text-vibe-offwhite">Inicio</h3>
                  <p className="text-[10px] text-vibe-light-gray leading-normal">
                    Recomendaciones diarias
                  </p>
                </div>

                <div className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col text-left gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-vibe-bg border border-vibe-border flex items-center justify-center text-category-cinema">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-sm text-vibe-offwhite">Tests</h3>
                  <p className="text-[10px] text-vibe-light-gray leading-normal">
                    MBTI · Celeb match
                  </p>
                </div>

                <div className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col text-left gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-vibe-bg border border-vibe-border flex items-center justify-center text-category-series">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-sm text-vibe-offwhite">Wrapped</h3>
                  <p className="text-[10px] text-vibe-light-gray leading-normal">
                    Tu evolución mensual
                  </p>
                </div>

                <div className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col text-left gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-vibe-bg border border-vibe-border flex items-center justify-center text-category-books">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-sm text-vibe-offwhite">Perfil</h3>
                  <p className="text-[10px] text-vibe-light-gray leading-normal">
                    Tu arquetipo · Badges
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex gap-2.5 items-center justify-start">
                <div onClick={() => setSlideIndex(0)} className="w-2.5 h-2.5 rounded-full bg-vibe-border cursor-pointer hover:bg-vibe-volt/30" />
                <div onClick={() => setSlideIndex(1)} className="w-2.5 h-2.5 rounded-full bg-vibe-border cursor-pointer hover:bg-vibe-volt/30" />
                <div onClick={() => setSlideIndex(2)} className="w-8 h-2.5 rounded-full bg-vibe-volt cursor-pointer transition-all duration-300" />
              </div>
              <Button variant="primary" onClick={handleStart}>
                EMPEZAR
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
