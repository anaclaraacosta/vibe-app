import React from 'react';

export default function LoadingIndicator() {
  const dots = [
    { color: 'bg-category-music', delay: 'delay-0', transform: 'rotate-0 translate-y-[-70px]' },
    { color: 'bg-category-cinema', delay: 'delay-75', transform: 'rotate-[60deg] translate-y-[-70px]' },
    { color: 'bg-category-series', delay: 'delay-150', transform: 'rotate-[120deg] translate-y-[-70px]' },
    { color: 'bg-category-fashion', delay: 'delay-225', transform: 'rotate-[180deg] translate-y-[-70px]' },
    { color: 'bg-category-books', delay: 'delay-300', transform: 'rotate-[240deg] translate-y-[-70px]' },
    { color: 'bg-category-destination', delay: 'delay-375', transform: 'rotate-[300deg] translate-y-[-70px]' }
  ];

  return (
    <div className="relative flex items-center justify-center w-[180px] h-[180px] my-10 select-none">
      {/* Central glow */}
      <div className="absolute w-24 h-24 rounded-full bg-vibe-volt opacity-10 blur-xl animate-pulse" />
      
      {/* Outer spinning ring container */}
      <div className="absolute inset-0 animate-spin [animation-duration:8s]">
        {dots.map((dot, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6"
            style={{
              transform: `translate(-50%, -50%) rotate(${index * 60}deg) translateY(-70px)`
            }}
          >
            {/* Category dot with ping glow effect */}
            <div className={`w-3.5 h-3.5 rounded-full ${dot.color} shadow-lg relative`}>
              <span className={`absolute inset-0 rounded-full ${dot.color} opacity-40 animate-ping`} />
            </div>
          </div>
        ))}
      </div>

      {/* Internal spinner core */}
      <div className="w-12 h-12 rounded-full border-2 border-t-vibe-volt border-r-transparent border-b-transparent border-l-transparent animate-spin [animation-duration:1.5s] z-10" />
    </div>
  );
}
