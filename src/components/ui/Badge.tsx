import React from 'react';

type CategoryType = 'music' | 'cinema' | 'books' | 'fashion' | 'series' | 'destination' | 'general';

interface BadgeProps {
  category?: CategoryType;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export default function Badge({ category = 'general', children, active = false, onClick }: BadgeProps) {
  const categoryDots = {
    music: 'bg-category-music',
    cinema: 'bg-category-cinema',
    books: 'bg-category-books',
    fashion: 'bg-category-fashion',
    series: 'bg-category-series',
    destination: 'bg-category-destination',
    general: 'bg-vibe-volt'
  };

  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:bg-[#222] active:scale-95 transition-transform' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-[17px] py-[9px] bg-vibe-card border ${
        active ? 'border-vibe-volt' : 'border-vibe-border'
      } rounded-full select-none ${interactiveClasses}`}
    >
      {/* Category color indicator dot */}
      <span className={`w-2 h-2 rounded-full ${categoryDots[category]}`} />
      
      <span className="text-[11px] font-medium tracking-[1.32px] text-vibe-offwhite uppercase">
        {children}
      </span>
    </div>
  );
}
