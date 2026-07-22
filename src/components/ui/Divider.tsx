import React from 'react';

interface DividerProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Divider({ children, className = '' }: DividerProps) {
  if (children) {
    return (
      <div className={`flex items-center w-full my-6 ${className}`}>
        <div className="flex-grow h-px bg-vibe-border" />
        <span className="px-3 text-xs text-vibe-gray uppercase tracking-widest font-semibold select-none">
          {children}
        </span>
        <div className="flex-grow h-px bg-vibe-border" />
      </div>
    );
  }

  return <div className={`w-full h-px bg-vibe-border my-6 ${className}`} />;
}
