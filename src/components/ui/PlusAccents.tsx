interface PlusAccentsProps {
  className?: string;
  count?: number;
}

export default function PlusAccents({ className = '', count = 1 }: PlusAccentsProps) {
  // Render little plus sign graphic matching Figma vectors
  const renderPlus = (key: number) => (
    <svg
      key={key}
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-vibe-volt opacity-40 select-none pointer-events-none"
    >
      <path
        d="M4 0V8M0 4H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className={`flex gap-3 items-center ${className}`}>
      {Array.from({ length: count }).map((_, i) => renderPlus(i))}
    </div>
  );
}
