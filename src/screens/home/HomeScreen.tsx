import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibe } from '../../context/VibeContext';
import Header from '../../components/layout/Header';
import Avatar from '../../components/ui/Avatar';
import PlusAccents from '../../components/ui/PlusAccents';
import { FeaturedHeroCard, MiniCard } from '../../components/ui/Cards';
import { Film, Tv, BookOpen, Music, Shirt, Compass, ChevronRight, Bell, Sparkles } from 'lucide-react';
import { getDeezerDetail, DeezerDetail } from '../../api/deezer';
import { RecommendationItem } from '../../types';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user, personality, recommendations } = useVibe();

  const handleAvatarClick = () => {
    navigate('/profile');
  };

  const currentMusicItem = recommendations.find(r => r.category === 'music') || {
    id: "rec1",
    title: "Phoebe Bridgers",
    subtitle: "Motion Sickness · Folk",
    category: "music"
  };

  // Include all recommendation categories (Movies, TV Series, Music, Books, Places, Fashion)
  const feedItems = recommendations;

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

  // Music playback states
  const [deezerInfo, setDeezerInfo] = useState<DeezerDetail | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch Deezer details for Home widget
  useEffect(() => {
    let active = true;
    const fetchMusicDetails = async () => {
      const artist = currentMusicItem.title;
      const track = currentMusicItem.subtitle.split('·')[0].trim();
      const details = await getDeezerDetail(artist, track);
      if (details && active) {
        setDeezerInfo(details);
      }
    };
    fetchMusicDetails();
    return () => {
      active = false;
    };
  }, [currentMusicItem.title, currentMusicItem.subtitle]);

  // Audio coordination
  useEffect(() => {
    const handleOtherPlay = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (deezerInfo && customEvent.detail?.src !== deezerInfo.previewUrl) {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    };
    window.addEventListener('vibe-audio-play', handleOtherPlay);
    return () => {
      window.removeEventListener('vibe-audio-play', handleOtherPlay);
    };
  }, [deezerInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!deezerInfo) return;

    if (!deezerInfo.previewUrl) {
      // No preview available, open in Deezer directly
      window.open(deezerInfo.deezerUrl, '_blank');
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(deezerInfo.previewUrl);
      audio.preload = "metadata";
      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Notify other active players to stop
      window.dispatchEvent(new CustomEvent('vibe-audio-play', { detail: { src: deezerInfo.previewUrl } }));
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Home music playback failed:", err));
    }
  };

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
      {/* Top Header */}
      <Header
        title="VIBE"
        rightAction={
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full flex items-center justify-center border border-vibe-border bg-vibe-card text-vibe-light-gray hover:text-vibe-offwhite relative">
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-vibe-volt" />
              <Bell className="w-4 h-4" />
            </button>
            <button onClick={handleAvatarClick} aria-label="Ver Perfil">
              <Avatar name={user?.name || 'Vibe User'} size="sm" src={user?.photoUrl || undefined} />
            </button>
          </div>
        }
      />

      {/* Main Feed Container */}
      <div className="flex-grow px-6 pt-4 pb-32 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        
        {/* Greetings Section */}
        <div className="flex flex-col gap-1.5 text-left relative shrink-0">
          <span className="text-xs text-vibe-light-gray font-medium">Buenos días,</span>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl text-vibe-offwhite leading-none">
              {user?.name || 'Matias'}.
            </h2>
            <PlusAccents count={1} />
          </div>

          <div className="inline-flex mt-2">
            <span className="bg-vibe-volt/10 text-vibe-volt text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-vibe-volt/20 uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {personality}
            </span>
          </div>
        </div>

        {/* Daily Indicator Badge */}
        <div className="bg-vibe-card border border-vibe-border rounded-xl p-4 flex items-center gap-3 text-left">
          <div className="w-2 h-2 rounded-full bg-vibe-volt animate-pulse flex-shrink-0" />
          <p className="text-xs text-vibe-light-gray font-medium leading-normal">
            Estás al día con tus recomendaciones de hoy.
          </p>
        </div>

        {/* Hero featured music player card */}
        <div className="flex flex-col gap-2">
          <FeaturedHeroCard
            label="Música sugerida"
            title={deezerInfo ? deezerInfo.title : currentMusicItem.subtitle.split('·')[0].trim()}
            subtitle={deezerInfo ? deezerInfo.artist : currentMusicItem.title}
            type="vinyl"
            albumCover={deezerInfo?.cover || undefined}
            isPlaying={isPlaying}
            progressPercent={progress}
            previewUrl={deezerInfo ? deezerInfo.previewUrl : "loading-placeholder"}
            spotifyUrl={deezerInfo ? `https://open.spotify.com/search/${encodeURIComponent(`${deezerInfo.title} ${deezerInfo.artist}`)}` : undefined}
            onAction={handlePlayPause}
          />
        </div>

        {/* Horizontal Mini Cards Scroll Section */}
        <div className="flex flex-col gap-3 text-left min-w-0 w-full">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-sm text-vibe-offwhite tracking-wide uppercase">
              Descubrimientos diarios
            </h3>
            <div className="flex-grow h-px bg-vibe-border/50 ml-4" />
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory scroll-smooth touch-pan-x overscroll-x-contain">
            {feedItems.map((item: RecommendationItem) => (
              <MiniCard
                key={item.id}
                category={categoryLabels[item.category] || item.category}
                title={item.title}
                icon={categoryIcons[item.category] || BookOpen}
                categoryColor={categoryColors[item.category] || 'text-vibe-volt'}
                onClick={item.category === 'music' ? handlePlayPause : () => navigate(`/recommendation/${item.id}`)}
              />
            ))}
          </div>
        </div>

        <div
          onClick={() => {
            if (user?.mbtiCompleted) {
              navigate('/mbti-result');
            } else {
              navigate('/mbti-quiz');
            }
          }}
          className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex items-center justify-between text-left cursor-pointer hover:border-vibe-volt/30 active:scale-[0.99] transition-all relative overflow-hidden shrink-0"
        >
          {/* Accent left border indicator */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-vibe-volt" />

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold tracking-widest text-vibe-volt uppercase">
              NUEVO TEST DISPONIBLE
            </span>
            <h3 className="font-heading text-sm text-vibe-offwhite">
              MBTI & Celeb Match
            </h3>
          </div>
          
          <div className="w-10 h-10 rounded-xl bg-vibe-bg border border-vibe-border flex items-center justify-center text-vibe-light-gray">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
