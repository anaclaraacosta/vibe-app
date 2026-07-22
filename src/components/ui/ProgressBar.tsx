import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between items-center text-[10px] tracking-widest text-vibe-light-gray uppercase font-semibold">
        <span>Progreso</span>
        <span className="text-vibe-volt font-bold">{current} / {total}</span>
      </div>
      <div className="w-full h-1 bg-vibe-border rounded-full overflow-hidden">
        <div
          className="h-full bg-vibe-volt transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
