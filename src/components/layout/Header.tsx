import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({ title, showBack = false, onBack, rightAction }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-vibe-bg/85 backdrop-blur-md sticky top-0 z-40 border-b border-transparent">
      {/* Left Area (Back Button / Empty spacer) */}
      <div className="w-10 flex items-center justify-start">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-10 h-10 -ml-3 flex items-center justify-center rounded-full hover:bg-vibe-card/50 active:bg-vibe-card text-vibe-offwhite transition-colors"
            aria-label="Volver"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Title */}
      {title && (
        <h1 className="font-heading text-lg text-vibe-offwhite tracking-wide text-center truncate max-w-[200px]">
          {title}
        </h1>
      )}

      {/* Right Area (Notification, Close, etc.) */}
      <div className="w-10 flex items-center justify-end">
        {rightAction || null}
      </div>
    </header>
  );
}
