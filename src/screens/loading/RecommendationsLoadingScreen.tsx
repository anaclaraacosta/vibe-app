import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';

const PHRASES = [
  "Estamos leyendo tu vibe…",
  "Curándo recomendaciones para vos…",
  "Casi listo…"
];

export default function RecommendationsLoadingScreen() {
  const navigate = useNavigate();
  const { user } = useVibe();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    // Mark as shown immediately
    sessionStorage.setItem('vibe_loading_shown', 'true');

    // Cycle through phrases every 2 seconds
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        setFadeState('in');
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 15 seconds safety timeout
    const timeout = setTimeout(() => {
      console.warn("Safety timeout reached in RecommendationsLoadingScreen, proceeding to home");
      navigate('/home');
    }, 15000);

    // If pool becomes populated, navigate to home immediately
    if (user?.recommendationPool) {
      clearTimeout(timeout);
      navigate('/home');
    }

    return () => clearTimeout(timeout);
  }, [user?.recommendationPool, navigate]);

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col items-center justify-center z-[9999] overflow-hidden select-none">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#C8F55A] opacity-[0.08] blur-[80px] pointer-events-none z-0" />
      <div className="absolute top-[60%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-[#A78BFA] opacity-[0.05] blur-[70px] pointer-events-none z-0" />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center gap-8 text-center px-6">
        {/* VIBE Logo */}
        <h1 className="font-heading text-6xl text-[#F5F5F0]" style={{ fontFamily: "'Paytone One', sans-serif" }}>
          V<span className="text-[#C8F55A]">.</span>
        </h1>

        {/* Animated Loading Dots */}
        <div className="flex gap-2 items-center h-6 justify-center">
          {['#C8F55A', '#A78BFA', '#FB923C', '#F472B6', '#34D399', '#60A5FA'].map((color, i) => (
            <div
              key={color}
              className="w-3 h-3 rounded-full animate-pulse-sequential"
              style={{
                backgroundColor: color,
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>

        {/* Loading phrase with fade transition */}
        <div className="h-8 flex items-center justify-center">
          <p
            className={`text-base text-[#666666] transition-all duration-300 font-normal ${
              fadeState === 'in' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {PHRASES[phraseIndex]}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse-sequential {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
        }
        .animate-pulse-sequential {
          animation: pulse-sequential 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
