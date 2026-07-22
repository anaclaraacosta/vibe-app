import React from 'react';
import { LucideIcon, Play, Pause, ExternalLink, ChevronRight, Lock } from 'lucide-react';

// ==========================================
// 1. FEATURE CARD (App Preview / Quiz Items)
// ==========================================
interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color?: string;
  badge?: string;
  onClick?: () => void;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  color = 'text-vibe-volt',
  badge,
  onClick
}: FeatureCardProps) {
  const isInteractive = !!onClick;
  
  return (
    <div
      onClick={onClick}
      className={`bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col items-start text-left relative transition-all duration-200 select-none ${
        isInteractive ? 'cursor-pointer hover:border-vibe-volt/50 active:scale-[0.98]' : ''
      }`}
    >
      {badge && (
        <span className="absolute top-4 right-4 bg-vibe-volt/10 text-vibe-volt text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-vibe-volt/20">
          {badge}
        </span>
      )}
      
      <div className={`w-10 h-10 rounded-xl bg-vibe-bg flex items-center justify-center ${color} mb-4 border border-vibe-border/50`}>
        <Icon className="w-5 h-5" />
      </div>

      <h3 className="font-heading text-sm text-vibe-offwhite mb-1.5 truncate w-full">
        {title}
      </h3>
      <p className="text-[11px] text-vibe-light-gray leading-relaxed font-medium">
        {description}
      </p>
    </div>
  );
}

// ==========================================
// 2. MINI CARD (Horizontal Scroll / Items)
// ==========================================
interface MiniCardProps {
  category: string;
  title: string;
  icon: LucideIcon;
  categoryColor: string;
  onClick?: () => void;
}

export function MiniCard({
  category,
  title,
  icon: Icon,
  categoryColor,
  onClick
}: MiniCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-[140px] h-[160px] snap-start bg-vibe-card border border-vibe-border rounded-2xl p-4 flex flex-col justify-between text-left cursor-pointer hover:border-vibe-volt/30 active:scale-[0.98] transition-all relative select-none"
    >
      {/* Category icon circle */}
      <div className="w-8 h-8 rounded-full bg-vibe-bg flex items-center justify-center text-vibe-offwhite border border-vibe-border">
        <Icon className="w-4 h-4" />
      </div>

      {/* Info labels */}
      <div className="flex flex-col gap-0.5">
        <span className={`text-[9px] font-bold tracking-widest uppercase ${categoryColor}`}>
          {category}
        </span>
        <h4 className="font-heading text-xs text-vibe-offwhite leading-snug line-clamp-2">
          {title}
        </h4>
      </div>
    </div>
  );
}

// ==========================================
// 3. FEATURED HERO CARD (Home & Library Highlight)
// ==========================================
interface FeaturedHeroCardProps {
  label: string;
  title: string;
  subtitle: string;
  onAction?: () => void;
  actionText?: string;
  type?: 'vinyl' | 'gem';
  albumCover?: string;
  isPlaying?: boolean;
  progressPercent?: number;
  previewUrl?: string | null;
  spotifyUrl?: string;
}

export function FeaturedHeroCard({
  label,
  title,
  subtitle,
  onAction,
  actionText = 'Ver más',
  type = 'vinyl',
  albumCover,
  isPlaying = false,
  progressPercent = 0,
  previewUrl,
  spotifyUrl
}: FeaturedHeroCardProps) {
  // If previewUrl is empty or null, we treat it as no-preview available
  const hasPreview = previewUrl !== null && previewUrl !== undefined && previewUrl !== '';

  return (
    <div className="bg-vibe-card border border-vibe-border rounded-3xl p-5 flex flex-col justify-between text-left relative overflow-hidden h-[253px] w-full">
      {/* Volt Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-vibe-volt" />

      {/* Decorative details depending on card type */}
      {type === 'vinyl' ? (
        <div 
          className={`absolute -right-10 top-[60px] w-36 h-36 rounded-full border-[6px] border-[#222] bg-[#151515] flex items-center justify-center shadow-lg transition-transform ${
            isPlaying ? 'animate-spin [animation-duration:10s]' : 'animate-spin [animation-duration:10s]'
          }`}
          style={{ 
            animationPlayState: isPlaying ? 'running' : 'paused',
            opacity: albumCover ? 0.95 : 0.3
          }}
        >
          <div className="w-16 h-16 rounded-full border-[3px] border-[#333] flex items-center justify-center overflow-hidden bg-vibe-card">
            {albumCover ? (
              <img src={albumCover} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-vibe-volt" />
            )}
          </div>
        </div>
      ) : (
        <div className="absolute -right-4 top-[60px] w-28 h-28 border-[3px] border-vibe-volt/20 rounded-2xl rotate-45 flex items-center justify-center opacity-40">
          <div className="w-16 h-16 border-[2px] border-vibe-volt/40 rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 bg-vibe-volt/20 rounded-lg" />
          </div>
        </div>
      )}

      {/* Top Labels */}
      <div className="z-10 flex flex-col gap-1">
        <div className="inline-flex">
          <span className="bg-vibe-volt/10 text-vibe-volt text-[8px] font-bold tracking-widest px-2 py-0.5 rounded-full border border-vibe-volt/20 uppercase">
            {label}
          </span>
        </div>
      </div>

      {/* Mid Heading */}
      <div className="z-10">
        <h2 className="font-heading text-xl text-vibe-offwhite leading-tight mb-1 pr-16">
          {title}
        </h2>
        <p className="text-xs text-vibe-light-gray leading-normal">
          {subtitle}
        </p>
      </div>

      {/* Bottom Button Action */}
      {onAction && (
        <div className={`z-10 mt-4 w-full ${type === 'vinyl' ? 'flex flex-col gap-2' : 'flex items-center justify-between'}`}>
          {type === 'vinyl' ? (
            <>
              <div className="flex items-center justify-between w-full">
                {hasPreview ? (
                  <button
                    onClick={onAction}
                    className="w-12 h-12 bg-vibe-volt text-[#0d0f0c] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>
                ) : (
                  <button
                    onClick={onAction}
                    className="px-4 py-2 border border-vibe-border bg-vibe-bg text-vibe-offwhite rounded-xl text-xs font-semibold hover:border-vibe-volt/40 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer animate-fade-in"
                  >
                    <span>Abrir en Deezer</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <a
                href={spotifyUrl || `https://open.spotify.com/search/${encodeURIComponent(`${title} ${subtitle}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full h-10 border border-vibe-border bg-vibe-bg hover:border-vibe-volt/40 text-vibe-offwhite rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] mt-1 select-none z-20"
              >
                <span>Abrir en Spotify</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </>
          ) : (
            <button
              onClick={onAction}
              className="px-4 py-2 border border-vibe-border bg-vibe-bg text-vibe-offwhite rounded-xl text-xs font-semibold hover:border-vibe-volt/40 active:scale-95 transition-all cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}

      {/* Bottom sleek progress bar */}
      {type === 'vinyl' && hasPreview && progressPercent > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-vibe-bg">
          <div 
            className="h-full bg-vibe-volt transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. CATEGORY CARD (Results / Profile Stats)
// ==========================================
interface CategoryCardProps {
  category: string;
  title: string;
  description: string;
  categoryColor: string;
  progressPercent?: number; // displays a progress percentage
  icon: LucideIcon;
  onClick?: () => void;
}

export function CategoryCard({
  category,
  title,
  description,
  categoryColor,
  progressPercent,
  icon: Icon,
  onClick
}: CategoryCardProps) {
  const isInteractive = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`bg-vibe-card border border-vibe-border rounded-2xl p-5 flex flex-col justify-between text-left h-[181px] w-full transition-all duration-200 select-none ${
        isInteractive ? 'cursor-pointer hover:border-vibe-volt/50 active:scale-[0.98]' : ''
      }`}
    >
      {/* Top Tag Header */}
      <div className="flex justify-between items-center w-full">
        <span className={`text-[9px] font-bold tracking-widest uppercase ${categoryColor}`}>
          {category}
        </span>
        <Icon className="w-4 h-4 text-vibe-light-gray" />
      </div>

      {/* Center Details */}
      <div className="mt-2 flex-grow">
        <h3 className="font-heading text-lg text-vibe-offwhite leading-tight mb-1 truncate">
          {title}
        </h3>
        <p className="text-[11px] text-vibe-light-gray leading-normal line-clamp-2 font-medium">
          {description}
        </p>
      </div>

      {/* Bottom Meter Visual */}
      {progressPercent !== undefined && (
        <div className="mt-4 flex flex-col gap-1 w-full">
          <div className="w-full h-1.5 bg-vibe-bg rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500`}
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'currentColor',
                color: progressPercent > 40 ? '#c8f55a' : '#a78bfa'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
