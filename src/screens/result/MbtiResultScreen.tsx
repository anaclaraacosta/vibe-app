import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import PlusAccents from '../../components/ui/PlusAccents';
import { MBTI_PROFILES } from '../../data/mbtiDetails';
import { MBTI_CELEBRITIES } from '../../data/mbtiCelebrities';

const LOCAL_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a7f3d0"><circle cx="12" cy="12" r="12" fill="%231f2937"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="%2310b981"/></svg>';

export default function MbtiResultScreen() {
  const navigate = useNavigate();
  const { mbtiPersonality, user } = useVibe();

  // Robust fallback for empty states
  const mbtiCode = MBTI_PROFILES[mbtiPersonality] ? mbtiPersonality : "INFJ";
  const profile = MBTI_PROFILES[mbtiCode];
  const celebrities = MBTI_CELEBRITIES[mbtiCode];
  const activeBadges = user?.badges || profile.strengths;

  const [celebPhotos, setCelebPhotos] = useState<Record<string, string>>({});

  // Fetch real profile photos for celebrities from TMDB API with local cache
  useEffect(() => {
    let active = true;
    const fetchPhotos = async () => {
      const cacheKey = 'vibe_celeb_photos_cache';
      const cachedData = localStorage.getItem(cacheKey);
      const cacheMap: Record<string, string> = cachedData ? JSON.parse(cachedData) : {};
      
      const photosMap = { ...cacheMap };
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;

      await Promise.all(
        celebrities.map(async (celeb) => {
          if (photosMap[celeb.fullName]) {
            return;
          }

          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(celeb.fullName)}`
            );
            if (res.ok) {
              const data = await res.json();
              if (data.results && data.results.length > 0 && data.results[0].profile_path) {
                const profilePath = data.results[0].profile_path;
                const fullUrl = `https://image.tmdb.org/t/p/w185${profilePath}`;
                photosMap[celeb.fullName] = fullUrl;
              }
            }
          } catch (e) {
            console.error("Failed to fetch TMDB photo for:", celeb.fullName, e);
          }
        })
      );

      localStorage.setItem(cacheKey, JSON.stringify(photosMap));

      if (active) {
        setCelebPhotos(photosMap);
      }
    };

    fetchPhotos();

    return () => {
      active = false;
    };
  }, [celebrities]);

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Header */}
      <Header
        title="Resultados MBTI"
        rightAction={<PlusAccents count={1} />}
      />

      {/* Main Container */}
      <div className="flex-grow px-6 pt-4 pb-8 flex flex-col justify-between overflow-y-auto no-scrollbar">
        
        {/* MBTI Reveal Section */}
        <div className="flex flex-col gap-5 text-left">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold tracking-[2.2px] text-vibe-volt uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vibe-volt animate-pulse" />
              TU PERSONALIDAD MBTI
            </span>
            <div className="flex flex-col gap-0.5">
              <h1 className="font-heading text-4xl text-vibe-offwhite leading-none">
                {profile.code}
              </h1>
              <h2 className="text-sm text-vibe-volt font-bold mt-1 tracking-wide">
                {profile.name}
              </h2>
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

          {/* Description */}
          <div className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col gap-2">
            <h3 className="font-heading text-xs text-vibe-volt tracking-wider uppercase">
              Descripción / Concepto
            </h3>
            <p className="text-xs text-vibe-light-gray leading-relaxed text-justify">
              {profile.description}
            </p>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-vibe-card border border-vibe-border rounded-2xl p-4 flex flex-col gap-2.5">
              <h3 className="font-heading text-xs text-vibe-volt tracking-wider uppercase">
                Fortalezas
              </h3>
              <ul className="flex flex-col gap-1.5">
                {profile.strengths.slice(0, 3).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-vibe-light-gray leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-vibe-volt mt-1.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-vibe-card border border-vibe-border rounded-2xl p-4 flex flex-col gap-2.5">
              <h3 className="font-heading text-xs text-red-400 tracking-wider uppercase">
                Debilidades
              </h3>
              <ul className="flex flex-col gap-1.5">
                {profile.weaknesses.slice(0, 3).map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[11px] text-vibe-light-gray leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Celebrity Matches */}
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-center w-full my-2">
              <h3 className="font-heading text-sm text-vibe-volt uppercase tracking-wider pr-4">
                Comparten tu personalidad
              </h3>
              <div className="flex-grow h-px bg-vibe-border" />
            </div>

            {/* 6 Celebrities Grid */}
            <div className="grid grid-cols-3 gap-2">
              {celebrities.map((celeb, idx) => (
                <div key={idx} className="bg-vibe-card border border-vibe-border rounded-xl p-2.5 flex flex-col items-center text-center gap-1.5 relative overflow-hidden select-none hover:border-vibe-volt/20 transition-colors">
                  {/* Profile Photo */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-vibe-bg border border-vibe-border flex items-center justify-center text-vibe-volt text-sm font-bold relative">
                    <img 
                      src={celebPhotos[celeb.fullName] || celeb.photoUrl || LOCAL_PLACEHOLDER} 
                      alt={celeb.fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = LOCAL_PLACEHOLDER;
                      }}
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col gap-0.5">
                    <h4 className="font-heading text-[10px] text-vibe-offwhite leading-tight font-semibold line-clamp-1">
                      {celeb.fullName}
                    </h4>
                    <span className="text-[8px] text-vibe-light-gray leading-none truncate w-20 block">
                      {celeb.occupation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col gap-2">
          <Button variant="primary" onClick={() => navigate('/tests')}>
            VOLVER A VIBE
          </Button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full h-12 border border-vibe-border bg-transparent text-vibe-light-gray rounded-xl flex items-center justify-center font-bold text-xs gap-2 hover:text-vibe-offwhite hover:border-vibe-volt/40 active:scale-[0.99] transition-all cursor-pointer"
          >
            VER MI PERFIL
          </button>
        </div>
      </div>
    </div>
  );
}
