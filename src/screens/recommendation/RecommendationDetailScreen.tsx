import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVibe, RECOMMENDATIONS_DB } from '../../context/VibeContext';
import { RecommendationItem } from '../../types';
import Header from '../../components/layout/Header';
import LoadingIndicator from '../../components/ui/LoadingIndicator';
import { getTMDBDetail, TMDBDetail } from '../../api/tmdb';
import { getDeezerDetail, DeezerDetail } from '../../api/deezer';
import { getBookDetail, BookDetail } from '../../api/books';
import { getWikipediaDetail, WikipediaDetail } from '../../api/wikipedia';
import { 
  Music, Film, BookOpen, Compass, Shirt, 
  Play, Pause, ExternalLink, Star, Calendar, 
  Clock, Info, Volume2 
} from 'lucide-react';

interface OutfitDetail {
  description: string;
  pieces: string[];
}

const OUTFIT_DETAILS: Record<string, OutfitDetail> = {
  "rec5": {
    description: "Un look sofisticado y sumamente acogedor ideal para los días fríos. Este outfit prioriza la superposición limpia de texturas (lana, cachemira y cuero) y mantiene una paleta de colores neutra y elegante, alineada con un gusto introspectivo y analógico.",
    pieces: [
      "Abrigo: Tapado de lana oversize de paño pesado (color gris carbón o negro)",
      "Top: Suéter tejido de cuello alto en cachemira suave (color crema o crudo)",
      "Bottom: Pantalón sastrero de corte recto o pinzado negro",
      "Calzado: Botas chelsea o botines de cuero negro con suela de goma",
      "Accesorios: Bufanda larga de alpaca color beige y anteojos clásicos"
    ]
  },
  "rec15": {
    description: "Un look fresco, ligero y cargado de expresión artística, perfecto para pasear por ferias de libros o cafés históricos. Su estética vintage combina fibras naturales como lino y algodón para una caída fluida y relajada.",
    pieces: [
      "Top: Camisa de lino de manga corta con estampado botánico o retro sutil",
      "Bottom: Bermuda de gabardina ligera en color arena, habano o tostado",
      "Calzado: Sandalias de tiras de cuero marrón o alpargatas tradicionales",
      "Accesorios: Anteojos de sol de marco de carey y bolso de lona para libros"
    ]
  },
  "rec25": {
    description: "Un look técnico y funcional que refleja dinamismo y sofisticación en el asfalto. Combina materiales repelentes al agua, cortes de silueta cargo y zapatillas de última generación para una presencia urbana impecable.",
    pieces: [
      "Abrigo: Campera impermeable técnica (windbreaker) con cierres sellados",
      "Top: Remera oversized de algodón pesado en color negro lavado",
      "Bottom: Pantalón cargo técnico negro con bolsillos tridimensionales y correas",
      "Calzado: Zapatillas retro techwear de diseño futurista",
      "Accesorios: Gorro beanie negro y mochila utilitaria impermeable"
    ]
  }
};

function FeedbackRow({ 
  id, 
  category, 
  title 
}: { 
  id: string; 
  category: string; 
  title: string; 
}) {
  const { user, toggleLikeRecommendation, toggleDislikeRecommendation } = useVibe();
  
  const isLiked = user?.feedbackHistory?.liked?.some(item => item.id === id) || false;
  const isDisliked = user?.feedbackHistory?.disliked?.some(item => item.id === id) || false;

  const [likeScale, setLikeScale] = useState(1);
  const [dislikeScale, setDislikeScale] = useState(1);
  const [likeBgOpacity, setLikeBgOpacity] = useState(isLiked ? 0.12 : 0);
  const [dislikeBgOpacity, setDislikeBgOpacity] = useState(isDisliked ? 0.15 : 0);

  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    setLikeBgOpacity(isLiked ? 0.12 : 0);
    setDislikeBgOpacity(isDisliked ? 0.15 : 0);
  }, [isLiked, isDisliked]);

  const handleLike = () => {
    const nextState = !isLiked;
    
    if (import.meta.env.DEV) {
      console.log(`FEEDBACK — ${nextState ? 'like' : 'removed'}: ${title} (${category})`);
    }

    if (nextState) {
      setLikeScale(1.4);
      setLikeBgOpacity(0.12);
      setTimeout(() => {
        setLikeScale(1.0);
      }, 80);

      const burstParticles = Array.from({ length: 6 }).map((_, idx) => {
        const angle = (idx * 60 * Math.PI) / 180;
        const distance = 24 + Math.random() * 12;
        return {
          id: Date.now() + idx,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        };
      });
      setParticles(burstParticles);
      setTimeout(() => setParticles([]), 300);
    } else {
      setLikeBgOpacity(0);
    }

    toggleLikeRecommendation(id, category, title);
  };

  const handleDislike = () => {
    const nextState = !isDisliked;

    if (import.meta.env.DEV) {
      console.log(`FEEDBACK — ${nextState ? 'dislike' : 'removed'}: ${title} (${category})`);
    }

    if (nextState) {
      setDislikeScale(1.2);
      setDislikeBgOpacity(0.15);
      setTimeout(() => {
        setDislikeScale(1.0);
      }, 80);
    } else {
      setDislikeBgOpacity(0);
    }

    toggleDislikeRecommendation(id, category, title);
  };

  return (
    <div className="flex items-center justify-center gap-12 my-6 shrink-0 z-30 select-none" style={{ minHeight: '56px' }}>
      <style>{`
        @keyframes particle-burst {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* BUTTON 1 - LIKE */}
      <div className="flex flex-col items-center gap-2 relative" style={{ minWidth: '80px' }}>
        <button
          onClick={handleLike}
          style={{ 
            width: '48px', 
            height: '48px', 
            padding: '10px', 
            borderRadius: '50%',
            backgroundColor: isLiked ? `rgba(229, 62, 62, ${likeBgOpacity})` : 'transparent',
            border: isLiked ? '1px solid #E53E3E' : '1px solid #888888',
            color: isLiked ? '#E53E3E' : '#888888',
            transform: `scale(${likeScale})`,
            transition: 'background-color 200ms ease, border-color 200ms ease, color 200ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          className="relative focus:outline-none"
          aria-label="Me gusta"
        >
          <svg 
            className="w-6 h-6 transition-all duration-150" 
            viewBox="0 0 24 24" 
            fill={isLiked ? "#E53E3E" : "none"} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>

          {particles.map(p => (
            <span
              key={p.id}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#E53E3E] pointer-events-none"
              style={{
                left: `calc(50% + ${p.x}px - 3px)`,
                top: `calc(50% + ${p.y}px - 3px)`,
                transform: 'scale(1)',
                animation: 'particle-burst 300ms ease-out forwards'
              }}
            />
          ))}
        </button>
        <span 
          className="text-xs font-normal" 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            color: isLiked ? '#E53E3E' : '#888888',
            transition: 'color 200ms'
          }}
        >
          Me gusta
        </span>
      </div>

      {/* BUTTON 2 - DISLIKE */}
      <div className="flex flex-col items-center gap-2" style={{ minWidth: '80px' }}>
        <button
          onClick={handleDislike}
          style={{ 
            width: '48px', 
            height: '48px', 
            padding: '10px', 
            borderRadius: '50%',
            backgroundColor: isDisliked ? `rgba(170, 170, 170, ${dislikeBgOpacity})` : 'transparent',
            border: isDisliked ? '1px solid #AAAAAA' : '1px solid #888888',
            color: isDisliked ? '#AAAAAA' : '#888888',
            transform: `scale(${dislikeScale})`,
            transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          className="relative focus:outline-none"
          aria-label="No es para mí"
        >
          <svg 
            className="w-6 h-6 transition-all duration-150" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </button>
        <span 
          className="text-xs font-normal" 
          style={{ 
            fontFamily: 'Inter, sans-serif',
            color: isDisliked ? '#AAAAAA' : '#888888',
            transition: 'color 150ms'
          }}
        >
          No es para mí
        </span>
      </div>
    </div>
  );
}

export default function RecommendationDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recommendations, personality } = useVibe();

  // Find the recommendation in the context list, or search the static DB as fallback
  const mockItem = recommendations.find((item: RecommendationItem) => item.id === id) || (() => {
    // Look up in static DB
    for (const archetype of Object.keys(RECOMMENDATIONS_DB)) {
      const found = RECOMMENDATIONS_DB[archetype].find((item: RecommendationItem) => item.id === id);
      if (found) return found;
    }
    return null;
  })();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // States for API details
  const [movieDetail, setMovieDetail] = useState<TMDBDetail | null>(null);
  const [musicDetail, setMusicDetail] = useState<DeezerDetail | null>(null);
  const [bookDetail, setBookDetail] = useState<BookDetail | null>(null);
  const [wikipediaDetail, setWikipediaDetail] = useState<WikipediaDetail | null>(null);

  // Audio Player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!mockItem) {
      setError('Recomendación no encontrada');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Reset previous states
    setMovieDetail(null);
    setMusicDetail(null);
    setBookDetail(null);
    setWikipediaDetail(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const fetchData = async () => {
      try {
        switch (mockItem.category) {
          case 'cinema':
          case 'series': {
            const data = await getTMDBDetail(mockItem.category, mockItem.title);
            if (data) {
              setMovieDetail(data);
            } else {
              setError('No se encontraron detalles para esta película o serie.');
            }
            break;
          }
          case 'music': {
            // Title is artist, subtitle is track · genre (e.g. Motion Sickness · Folk)
            const artist = mockItem.title;
            const track = mockItem.subtitle.split('·')[0].trim();
            const data = await getDeezerDetail(artist, track);
            if (data) {
              setMusicDetail(data);
              if (data.duration) setDuration(data.duration);
            } else {
              setError('No se pudo encontrar la canción en Deezer.');
            }
            break;
          }
          case 'books': {
            // Title is book title, subtitle is author · genre
            const title = mockItem.title;
            const author = mockItem.subtitle.split('·')[0].trim();
            const data = await getBookDetail(title, author);
            if (data) {
              setBookDetail(data);
            } else {
              setError('No se encontraron detalles para este libro.');
            }
            break;
          }
          case 'destination': {
            const destinationName = mockItem.title;
            const data = await getWikipediaDetail(destinationName);
            if (data) {
              setWikipediaDetail(data);
            } else {
              setError('No se pudo obtener información sobre este destino.');
            }
            break;
          }
          case 'fashion':
            // Fashion is static/custom
            break;
          default:
            setError('Categoría de recomendación no soportada.');
        }
      } catch (err) {
        console.error('Error in detail screen data load:', err);
        setError('Ocurrió un error al cargar la información.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, mockItem]);

  // Clean up audio on unmount
  useEffect(() => {
    const currentAudio = audioRef.current;
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, []);

  if (!mockItem) {
    return (
      <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite">
        <Header title="Detalles" showBack={true} />
        <div className="flex-grow flex flex-col items-center justify-center px-6 text-center gap-4">
          <Info className="w-12 h-12 text-vibe-volt" />
          <h2 className="font-heading text-lg">Recomendación no encontrada</h2>
          <p className="text-xs text-vibe-light-gray">
            El enlace que intentas abrir no existe o ha sido modificado.
          </p>
          <button 
            onClick={() => navigate('/home')}
            className="px-4 py-2 border border-vibe-border bg-vibe-card text-vibe-offwhite rounded-xl text-xs font-semibold"
          >
            Volver a Inicio
          </button>
        </div>
      </div>
    );
  }

  // Audio helper handlers
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Audio playback error:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleAudioLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const categoryLabels: Record<string, string> = {
    music: 'Música',
    cinema: 'Cine',
    series: 'Series',
    books: 'Libros',
    fashion: 'Ropa',
    destination: 'Destino'
  };

  const categoryColors: Record<string, string> = {
    music: 'text-category-music border-category-music/30 bg-category-music/10',
    cinema: 'text-category-cinema border-category-cinema/30 bg-category-cinema/10',
    series: 'text-category-series border-category-series/30 bg-category-series/10',
    books: 'text-category-books border-category-books/30 bg-category-books/10',
    fashion: 'text-category-fashion border-category-fashion/30 bg-category-fashion/10',
    destination: 'text-category-destination border-category-destination/30 bg-category-destination/10'
  };

  return (
    <div className="flex flex-col h-full bg-vibe-bg text-vibe-offwhite relative overflow-hidden select-none">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-vibe-volt/5 blur-[80px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-category-cinema/5 blur-[80px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <Header 
        title={categoryLabels[mockItem.category] || 'Detalle'} 
        showBack={true} 
      />

      {/* Content wrapper */}
      <div className="flex-grow overflow-y-auto no-scrollbar px-6 pb-24 relative z-10 flex flex-col justify-between">
        
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <LoadingIndicator />
          </div>
        ) : error ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center gap-4 py-8">
            <Info className="w-12 h-12 text-vibe-volt" />
            <h2 className="font-heading text-lg">No pudimos obtener todos los detalles</h2>
            <p className="text-xs text-vibe-light-gray leading-relaxed max-w-[280px]">
              {error}
            </p>
            {/* Fallback card layout showing basic data */}
            <div className="w-full bg-vibe-card border border-vibe-border rounded-2xl p-5 text-left flex flex-col gap-3 mt-4">
              <span className={`text-[9px] font-bold tracking-widest uppercase self-start px-2 py-0.5 border rounded-full ${categoryColors[mockItem.category]}`}>
                {categoryLabels[mockItem.category]}
              </span>
              <div>
                <h3 className="font-heading text-lg text-vibe-offwhite leading-tight mb-1">
                  {mockItem.title}
                </h3>
                <p className="text-xs text-vibe-light-gray leading-relaxed">
                  {mockItem.subtitle}
                </p>
              </div>
            </div>

            <button 
              onClick={() => navigate(-1)}
              className="px-5 py-2 border border-vibe-border bg-vibe-card hover:border-vibe-volt/40 text-vibe-offwhite rounded-xl text-xs font-semibold mt-4 transition-all"
            >
              Volver Atrás
            </button>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-between text-left gap-6 mt-2">
            
            {/* 1. CINEMA & SERIES VIEW */}
            {(mockItem.category === 'cinema' || mockItem.category === 'series') && movieDetail && (
              <div className="flex flex-col gap-5 flex-grow">
                {/* Backdrop Area with mask */}
                {movieDetail.backdrop && (
                  <div className="w-full h-44 rounded-2xl overflow-hidden relative border border-vibe-border shadow-md">
                    <img 
                      src={movieDetail.backdrop} 
                      alt="Backdrop" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vibe-bg via-transparent to-transparent" />
                  </div>
                )}

                {/* Main Details row */}
                <div className="flex gap-4 items-start">
                  {movieDetail.poster ? (
                    <img 
                      src={movieDetail.poster} 
                      alt={movieDetail.title} 
                      className="w-[95px] h-[142px] rounded-xl border border-vibe-border shadow-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-[95px] h-[142px] rounded-xl border border-vibe-border bg-vibe-card flex items-center justify-center text-vibe-gray flex-shrink-0">
                      <Film className="w-8 h-8" />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="bg-vibe-volt/10 text-vibe-volt text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-vibe-volt/20 uppercase self-start">
                      {categoryLabels[mockItem.category]}
                    </span>
                    <h2 className="font-heading text-lg text-vibe-offwhite leading-tight line-clamp-2">
                      {movieDetail.title}
                    </h2>
                    
                    <div className="flex items-center gap-3 text-[11px] text-vibe-light-gray font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-vibe-volt" />
                        {movieDetail.releaseYear}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-vibe-volt" />
                        {movieDetail.runtimeOrSeasons}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-vibe-volt font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{movieDetail.rating.toFixed(1)} / 10</span>
                    </div>
                  </div>
                </div>

                {/* Genres Pills */}
                {movieDetail.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {movieDetail.genres.map(genre => (
                      <span key={genre} className="bg-vibe-card border border-vibe-border text-[9px] font-bold text-vibe-light-gray uppercase px-2.5 py-1 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-xs text-vibe-volt tracking-wider uppercase">
                    Sinopsis
                  </h3>
                  <p className="text-xs text-vibe-light-gray leading-relaxed text-justify">
                    {movieDetail.overview}
                  </p>
                </div>

                <FeedbackRow id={mockItem.id} category={mockItem.category} title={mockItem.title} />

                {/* CTA Action */}
                <div className="mt-auto pt-6">
                  <a 
                    href={movieDetail.tmdbUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full h-12 bg-vibe-volt text-[#0d0f0c] rounded-xl flex items-center justify-center font-bold text-xs gap-2 active:scale-[0.98] transition-transform shadow-lg cursor-pointer"
                  >
                    <span>Abrir en TMDB</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* 2. MUSIC VIEW */}
            {mockItem.category === 'music' && musicDetail && (
              <div className="flex flex-col gap-5 flex-grow">
                {/* Vinyl record rotation animation */}
                <div className="relative w-48 h-48 mx-auto my-3 flex items-center justify-center select-none">
                  {/* Vinyl background disc */}
                  <div className={`absolute w-[180px] h-[180px] rounded-full border-[6px] border-[#222] bg-[#121212] opacity-90 shadow-2xl flex items-center justify-center transition-transform duration-1000 ${isPlaying ? 'animate-spin [animation-duration:8s]' : ''}`}>
                    <div className="w-[70px] h-[70px] rounded-full border-[3px] border-[#333] flex items-center justify-center">
                      <div className="w-[20px] h-[20px] rounded-full bg-vibe-volt/80" />
                    </div>
                  </div>
                  
                  {/* Album art cover */}
                  {musicDetail.cover ? (
                    <img
                      src={musicDetail.cover}
                      alt={musicDetail.album}
                      className={`w-[115px] h-[115px] rounded-lg shadow-xl relative z-10 border border-vibe-border transition-all duration-300 ${isPlaying ? 'rotate-180 animate-pulse [animation-duration:5s]' : ''}`}
                    />
                  ) : (
                    <div className="w-[115px] h-[115px] rounded-lg shadow-xl relative z-10 border border-vibe-border bg-vibe-card flex items-center justify-center text-vibe-gray">
                      <Music className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="text-center flex flex-col gap-1 px-4 mt-2">
                  <span className="bg-category-music/10 text-category-music text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-category-music/20 uppercase self-center mb-1">
                    {categoryLabels[mockItem.category]}
                  </span>
                  <h2 className="font-heading text-xl text-vibe-offwhite leading-tight truncate">
                    {musicDetail.title}
                  </h2>
                  <p className="text-xs text-vibe-volt font-bold truncate">
                    {musicDetail.artist}
                  </p>
                  <p className="text-[11px] text-vibe-light-gray font-medium truncate italic mt-0.5">
                    Álbum: {musicDetail.album}
                  </p>
                </div>

                {/* Audio Preview Controls */}
                <div className="bg-vibe-card border border-vibe-border rounded-2xl p-4 flex flex-col gap-3 mt-2 shadow-inner">
                  {musicDetail.previewUrl ? (
                    <>
                      <audio
                        ref={audioRef}
                        src={musicDetail.previewUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleAudioLoadedMetadata}
                        onEnded={handleAudioEnded}
                        preload="metadata"
                      />

                      <div className="flex items-center justify-between gap-4">
                        <button
                          onClick={togglePlay}
                          className="w-11 h-11 bg-vibe-volt text-[#0d0f0c] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0 cursor-pointer"
                          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                        >
                          {isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>
                        
                        <div className="flex-grow flex flex-col gap-1">
                          <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleProgressChange}
                            className="w-full accent-vibe-volt bg-vibe-bg rounded-lg appearance-none h-1.5 cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] text-vibe-light-gray font-bold tracking-wider">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center gap-2 py-2">
                      <Volume2 className="w-8 h-8 text-vibe-gray opacity-40 animate-pulse" />
                      <p className="text-[11px] text-vibe-light-gray leading-normal">
                        Vista previa de audio no disponible para este tema.
                      </p>
                    </div>
                  )}
                </div>

                <FeedbackRow id={mockItem.id} category={mockItem.category} title={mockItem.title} />

                {/* CTA Action */}
                <div className="mt-auto pt-6">
                  <a 
                    href={musicDetail.deezerUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full h-12 bg-vibe-volt text-[#0d0f0c] rounded-xl flex items-center justify-center font-bold text-xs gap-2 active:scale-[0.98] transition-transform shadow-lg cursor-pointer"
                  >
                    <span>Escuchar en Deezer</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* 3. BOOKS VIEW */}
            {mockItem.category === 'books' && bookDetail && (
              <div className="flex flex-col gap-5 flex-grow">
                {/* Book Cover row */}
                <div className="flex gap-4 items-start mt-2">
                  {bookDetail.cover ? (
                    <img 
                      src={bookDetail.cover} 
                      alt={bookDetail.title} 
                      className="w-[95px] h-[142px] rounded-lg border border-vibe-border shadow-lg flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div className="w-[95px] h-[142px] rounded-lg border border-vibe-border bg-vibe-card flex items-center justify-center text-vibe-gray flex-shrink-0">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="bg-vibe-volt/10 text-vibe-volt text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-vibe-volt/20 uppercase self-start">
                      {categoryLabels[mockItem.category]}
                    </span>
                    <h2 className="font-heading text-lg text-vibe-offwhite leading-tight line-clamp-2">
                      {bookDetail.title}
                    </h2>
                    <p className="text-xs text-vibe-volt font-bold truncate">
                      por {bookDetail.author}
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-[10px] text-vibe-light-gray font-medium mt-1">
                      <Calendar className="w-3.5 h-3.5 text-vibe-volt" />
                      <span>Primera publicación: <strong className="text-vibe-offwhite font-bold">{bookDetail.firstPublishYear}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2 flex-grow">
                  <h3 className="font-heading text-xs text-vibe-volt tracking-wider uppercase">
                    Sinopsis / Descripción
                  </h3>
                  <div className="text-xs text-vibe-light-gray leading-relaxed text-justify max-h-48 overflow-y-auto pr-1">
                    {bookDetail.description ? (
                      <p>{bookDetail.description}</p>
                    ) : (
                      <p className="italic text-vibe-gray">Descripción no disponible en Open Library para esta edición.</p>
                    )}
                  </div>
                </div>

                <FeedbackRow id={mockItem.id} category={mockItem.category} title={mockItem.title} />

                {/* CTA Action */}
                <div className="mt-auto pt-6">
                  <a 
                    href={bookDetail.openLibraryUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full h-12 bg-vibe-volt text-[#0d0f0c] rounded-xl flex items-center justify-center font-bold text-xs gap-2 active:scale-[0.98] transition-transform shadow-lg cursor-pointer"
                  >
                    <span>Ver en Open Library</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* 4. DESTINATION VIEW */}
            {mockItem.category === 'destination' && wikipediaDetail && (
              <div className="flex flex-col gap-5 flex-grow">
                {/* Main Destination image */}
                {wikipediaDetail.image ? (
                  <div className="w-full h-44 rounded-2xl overflow-hidden relative border border-vibe-border shadow-md">
                    <img 
                      src={wikipediaDetail.image} 
                      alt={wikipediaDetail.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-vibe-bg via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-2xl border border-vibe-border bg-vibe-card flex items-center justify-center text-vibe-gray">
                    <Compass className="w-12 h-12" />
                  </div>
                )}

                {/* Place details info */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="bg-vibe-volt/10 text-vibe-volt text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-vibe-volt/20 uppercase">
                      {categoryLabels[mockItem.category]}
                    </span>
                  </div>
                  <h2 className="font-heading text-xl text-vibe-offwhite mt-1.5">
                    {wikipediaDetail.title}
                  </h2>
                  {wikipediaDetail.shortDescription && (
                    <p className="text-xs text-vibe-volt font-bold italic mt-0.5 leading-snug">
                      {wikipediaDetail.shortDescription}
                    </p>
                  )}
                </div>

                {/* Summary section */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-xs text-vibe-volt tracking-wider uppercase">
                    Resumen del lugar
                  </h3>
                  <p className="text-xs text-vibe-light-gray leading-relaxed text-justify">
                    {wikipediaDetail.summary || 'Resumen no disponible para este destino.'}
                  </p>
                </div>

                <FeedbackRow id={mockItem.id} category={mockItem.category} title={mockItem.title} />

                {/* CTA Action */}
                <div className="mt-auto pt-6">
                  <a 
                    href={wikipediaDetail.wikipediaUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full h-12 bg-vibe-volt text-[#0d0f0c] rounded-xl flex items-center justify-center font-bold text-xs gap-2 active:scale-[0.98] transition-transform shadow-lg cursor-pointer"
                  >
                    <span>Leer en Wikipedia</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* 5. FASHION VIEW (Fallback stylized layout for fashion recommendation) */}
            {mockItem.category === 'fashion' && (() => {
              const outfit = OUTFIT_DETAILS[mockItem.id];
              const hasOutfitImage = !!mockItem.image;

              if (hasOutfitImage && outfit) {
                return (
                  <div className="flex flex-col gap-5 flex-grow py-2">
                    {/* Large outfit image */}
                    <div className="w-full h-56 rounded-2xl overflow-hidden relative border border-vibe-border shadow-md">
                      <img 
                        src={mockItem.image} 
                        alt={mockItem.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-vibe-bg via-transparent to-transparent" />
                    </div>

                    {/* Title and Style Category */}
                    <div className="flex flex-col gap-1">
                      <span className="bg-category-fashion/10 text-category-fashion text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-category-fashion/20 uppercase self-start">
                        {categoryLabels[mockItem.category]}
                      </span>
                      <h2 className="font-heading text-xl text-vibe-offwhite mt-1.5">
                        {mockItem.title}
                      </h2>
                      <p className="text-xs text-vibe-volt font-bold italic">
                        Estilo: {mockItem.subtitle}
                      </p>
                    </div>

                    {/* Brief description of the look */}
                    <div className="flex flex-col gap-2">
                      <h3 className="font-heading text-xs text-vibe-volt tracking-wider uppercase">
                        El Look / Concepto
                      </h3>
                      <p className="text-xs text-vibe-light-gray leading-relaxed text-justify">
                        {outfit.description}
                      </p>
                    </div>

                    {/* Suggested pieces list */}
                    <div className="flex flex-col gap-2.5 bg-vibe-card border border-vibe-border rounded-2xl p-4">
                      <h3 className="font-heading text-xs text-vibe-volt tracking-wider uppercase">
                        Prendas sugeridas para este look
                      </h3>
                      <div className="flex flex-col gap-2">
                        {outfit.pieces.map((piece, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-vibe-light-gray">
                            <span className="w-1.5 h-1.5 rounded-full bg-vibe-volt mt-1.5 flex-shrink-0" />
                            <span>{piece}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <FeedbackRow id={mockItem.id} category={mockItem.category} title={mockItem.title} />

                    {/* Return CTA */}
                    <div className="mt-auto pt-4">
                      <button 
                        onClick={() => navigate(-1)}
                        className="w-full h-12 bg-vibe-volt text-[#0d0f0c] rounded-xl flex items-center justify-center font-bold text-xs gap-2 active:scale-[0.98] transition-transform shadow-lg cursor-pointer"
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                );
              }

              // Graceful Fallback to existing clothing representation if no image/details found
              return (
                <div className="flex flex-col gap-6 flex-grow py-4">
                  <div className="flex flex-col items-center justify-center gap-4 text-center my-6 flex-shrink-0">
                    <div className="w-20 h-20 rounded-3xl bg-category-fashion/10 text-category-fashion flex items-center justify-center border border-category-fashion/20 shadow-md">
                      <Shirt className="w-10 h-10" />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <span className="bg-category-fashion/10 text-category-fashion text-[8px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-category-fashion/20 uppercase self-center">
                        {categoryLabels[mockItem.category]}
                      </span>
                      <h2 className="font-heading text-xl text-vibe-offwhite mt-2 px-4">
                        {mockItem.title}
                      </h2>
                      <p className="text-xs text-vibe-volt font-bold">
                        Estilo: {mockItem.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col gap-3">
                    <h3 className="font-heading text-xs text-vibe-volt tracking-wider uppercase">
                      Concepto de Estilo ({personality})
                    </h3>
                    <p className="text-xs text-vibe-light-gray leading-relaxed text-justify">
                      Esta sugerencia de indumentaria ha sido seleccionada de forma curada en base a tu arquetipo cultural de <strong>{personality}</strong>. Combina de manera balanceada una estética moderna y funcional con el confort necesario para tu rutina diaria.
                    </p>
                    <p className="text-xs text-vibe-light-gray leading-relaxed text-justify mt-1">
                      Ideal para complementar con tonos minimalistas y texturas cálidas, permitiéndote expresar tu vibra personal con naturalidad.
                    </p>
                  </div>

                  <FeedbackRow id={mockItem.id} category={mockItem.category} title={mockItem.title} />

                  <div className="mt-auto pt-6">
                    <button 
                      onClick={() => navigate(-1)}
                      className="w-full h-12 bg-vibe-volt text-[#0d0f0c] rounded-xl flex items-center justify-center font-bold text-xs gap-2 active:scale-[0.98] transition-transform shadow-lg cursor-pointer"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

      </div>
    </div>
  );
}
