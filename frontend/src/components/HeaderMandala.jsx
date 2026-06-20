import React from 'react';

export default function HeaderMandala({ size = 300, className = '' }) {
  return (
    <div 
      className={`header-mandala-wrapper ${className}`} 
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg 
        className="header-mandala-svg" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Concentric helper and boundary circles */}
        <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" />
        <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
        <circle cx="100" cy="100" r="58" stroke="currentColor" strokeWidth="1" />
        <circle cx="100" cy="100" r="46" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="32" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3,1" />
        <circle cx="100" cy="100" r="18" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="6" fill="currentColor" />

        {/* 16 Major Petals & Ray details */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`petal-${i}`} transform={`rotate(${angle} 100 100)`}>
              {/* Pointy outer petal shape */}
              <path 
                d="M 100 15 C 92 35 92 65 100 82 C 108 65 108 35 100 15 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.75" 
              />
              {/* Inner accent diamond shape */}
              <path 
                d="M 100 35 L 96 50 L 100 65 L 104 50 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5" 
              />
              {/* Accent dot above petal */}
              <circle cx="100" cy="9" r="1.5" fill="currentColor" />
              {/* Radial line from center area to petal base */}
              <line x1="100" y1="18" x2="100" y2="32" stroke="currentColor" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* 32 Secondary ray dividers */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i * 360) / 32 + 5.625;
          return (
            <line 
              key={`ray-${i}`}
              x1="100" 
              y1="70" 
              x2="100" 
              y2="85" 
              transform={`rotate(${angle} 100 100)`}
              stroke="currentColor" 
              strokeWidth="0.5" 
              opacity="0.8"
            />
          );
        })}

        {/* Traditional jali-inspired outer arch loop decorations */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          return (
            <path
              key={`arch-${i}`}
              d="M 97 85 A 3 3 0 0 1 103 85"
              transform={`rotate(${angle} 100 100)`}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
          );
        })}
      </svg>
    </div>
  );
}
