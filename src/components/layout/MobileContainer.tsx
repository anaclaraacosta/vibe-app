import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      {/* Outer wrapper: simulates device border on desktop, full-width on mobile */}
      <div className="w-full max-w-[390px] h-[100dvh] md:h-[844px] bg-vibe-bg text-vibe-offwhite md:rounded-[40px] md:border-[8px] md:border-neutral-800 relative flex flex-col overflow-hidden shadow-2xl md:my-4 transition-all duration-300">
        
        {/* Ambient background decoration blobs matching Figma designs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Top light blob (Volt color) */}
          <div className="absolute -top-[10%] -left-[10%] w-[300px] h-[300px] rounded-full bg-vibe-volt opacity-5 blur-[75px]" />
          {/* Bottom right purple blob */}
          <div className="absolute -bottom-[10%] -right-[10%] w-[250px] h-[250px] rounded-full bg-category-cinema opacity-5 blur-[65px]" />
        </div>

        {/* Content container */}
        <div className="flex-grow flex flex-col relative z-10 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
