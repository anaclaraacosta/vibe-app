import React from 'react';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  border?: boolean;
}

export default function Avatar({
  name = 'Vibe User',
  src,
  size = 'md',
  className = '',
  border = true
}: AvatarProps) {
  const getInitials = (userName: string) => {
    return userName
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const sizes = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-[13px]',
    lg: 'w-16 h-16 text-[20px] font-heading'
  };

  const borderStyle = border ? 'border-2 border-vibe-volt' : 'border border-vibe-border';

  return (
    <div
      className={`rounded-full bg-vibe-card flex items-center justify-center font-bold text-vibe-offwhite overflow-hidden select-none shrink-0 ${sizes[size]} ${borderStyle} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // fallback if image fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
