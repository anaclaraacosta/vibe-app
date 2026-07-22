import React from 'react';
import { LucideIcon, CheckCircle2 } from 'lucide-react';

interface QuizOptionProps {
  text: string;
  subtext?: string;
  icon?: LucideIcon;
  selected?: boolean;
  onClick: () => void;
}

export default function QuizOption({
  text,
  subtext,
  icon: Icon,
  selected = false,
  onClick
}: QuizOptionProps) {
  return (
    <div
      onClick={onClick}
      className={`relative w-full border rounded-2xl p-5 flex items-center justify-between text-left cursor-pointer select-none transition-all duration-200 ${
        selected
          ? 'bg-vibe-card border-vibe-volt shadow-lg shadow-vibe-volt/5 scale-[1.01]'
          : 'bg-vibe-card border-vibe-border hover:border-vibe-volt/25'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Left Option Icon (optional) */}
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-vibe-bg flex items-center justify-center border border-vibe-border ${
            selected ? 'text-vibe-volt' : 'text-vibe-light-gray'
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Text descriptions */}
        <div className="flex flex-col gap-0.5">
          <h3 className="font-heading text-sm text-vibe-offwhite leading-snug">
            {text}
          </h3>
          {subtext && (
            <p className="text-[10px] text-vibe-light-gray tracking-wide font-medium uppercase">
              {subtext}
            </p>
          )}
        </div>
      </div>

      {/* Selected Indicator */}
      {selected && (
        <CheckCircle2 className="w-5 h-5 text-vibe-volt flex-shrink-0 ml-4 animate-scale-in" />
      )}
    </div>
  );
}
