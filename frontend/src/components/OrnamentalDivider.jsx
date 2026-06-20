import React from 'react';

export default function OrnamentalDivider() {
  return (
    <div className="ornamental-divider-container">
      <svg 
        className="ornamental-divider" 
        viewBox="0 0 1200 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left and Right connecting lines with gradient strokes */}
        <path d="M 0 20 L 520 20 M 1200 20 L 680 20" stroke="url(#divider-grad)" strokeWidth="1.5" />
        
        {/* Intricate center architectural arch motif */}
        <path 
          d="M 520 20 Q 550 5 570 20 Q 585 10 600 20 Q 615 10 630 20 Q 650 5 680 20" 
          stroke="url(#divider-grad)" 
          strokeWidth="1.5" 
          fill="none" 
        />
        
        {/* Double layered center circles */}
        <circle cx="600" cy="20" r="10" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
        <circle cx="600" cy="20" r="6" stroke="var(--gold)" strokeWidth="1" fill="none" />
        <circle cx="600" cy="20" r="2" fill="var(--gold)" />
        
        {/* Outer mini accent dots/diamonds */}
        <circle cx="560" cy="20" r="2.5" fill="var(--gold)" opacity="0.8" />
        <circle cx="640" cy="20" r="2.5" fill="var(--gold)" opacity="0.8" />
        
        {/* Diamond accents along the line */}
        <path d="M 300 17 L 303 20 L 300 23 L 297 20 Z" fill="var(--gold)" opacity="0.6" />
        <path d="M 900 17 L 903 20 L 900 23 L 897 20 Z" fill="var(--gold)" opacity="0.6" />

        <defs>
          <linearGradient id="divider-grad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0" />
            <stop offset="35%" stopColor="var(--gold)" stopOpacity="0.75" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="1" />
            <stop offset="65%" stopColor="var(--gold)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
