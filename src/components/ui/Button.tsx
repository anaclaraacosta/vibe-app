import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'google';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  fullWidth = true,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'h-14 px-6 rounded-xl font-bold tracking-wider uppercase text-sm flex items-center justify-center transition-all duration-200 select-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-vibe-volt text-[#0d0f0c] hover:bg-opacity-95 shadow-md active:bg-opacity-90',
    secondary: 'bg-vibe-card text-vibe-offwhite border border-vibe-border hover:bg-[#222] active:bg-[#1a1a1a]',
    outline: 'bg-transparent text-vibe-offwhite border border-vibe-border hover:bg-vibe-card/50 active:bg-vibe-card',
    google: 'bg-white text-neutral-900 normal-case font-medium hover:bg-neutral-100 flex gap-3 shadow-md'
  };

  const widthStyle = fullWidth ? 'w-full' : 'w-auto';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
