import React from 'react';
import { useLocation } from 'react-router-dom';
import LoadingIndicator from '../../components/ui/LoadingIndicator';
import PlusAccents from '../../components/ui/PlusAccents';

export default function LoadingScreen() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const isMbti = query.get('type') === 'mbti';

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite justify-between px-6 py-12 items-center select-none">
      {/* Top Header Placeholder spacing */}
      <div className="w-full flex justify-end">
        <PlusAccents count={1} />
      </div>

      {/* Main loading indicator block */}
      <div className="flex flex-col items-center justify-center gap-6 my-auto">
        <LoadingIndicator />
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="font-heading text-lg text-vibe-offwhite tracking-wide">
            {isMbti ? "Calculando tu personalidad MBTI" : "Analizando tu perfil cultural..."}
          </h2>
          <p className="text-xs text-vibe-light-gray animate-pulse font-medium tracking-wide">
            {isMbti ? "Analizando dimensiones de comportamiento..." : "Generando recomendaciones personalizadas..."}
          </p>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="text-[10px] text-vibe-gray tracking-widest font-semibold uppercase">
        VIBE AI ENGINE
      </div>
    </div>
  );
}
