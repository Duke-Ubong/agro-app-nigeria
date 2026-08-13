import React from 'react';

interface AgroAppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showSubtag?: boolean;
  subtext?: string;
  onClick?: () => void;
}

export const AgroAppLogo: React.FC<AgroAppLogoProps> = ({
  className = '',
  iconSize = 38,
  textSize = 'text-2xl',
  showSubtag = false,
  subtext = 'Nigeria National Platform',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 ${onClick ? 'cursor-pointer select-none group' : ''} ${className}`}
    >
      {/* Official Emblem Icon Mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Deep Emerald Gradient */}
          <linearGradient id="agroGreenGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#012d1d" />
            <stop offset="50%" stopColor="#053221" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          {/* Harvest Gold Sunburst Gradient */}
          <linearGradient id="harvestGoldGrad" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Vibrant Leaf Gradient */}
          <linearGradient id="vibrantLeafGrad" x1="0" y1="0" x2="48" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          {/* Shield Border Gradient */}
          <linearGradient id="shieldBorderGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#053221" />
          </linearGradient>
        </defs>

        {/* Outer National Shield Crest Container */}
        <path
          d="M24 3 L42 9.5 V22 C42 33.5 24 44 24 45 C24 44 6 33.5 6 22 V9.5 L24 3 Z"
          fill="url(#agroGreenGrad)"
          stroke="url(#shieldBorderGrad)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Inner Golden Sunburst Rays (Food Security & Growth) */}
        <g opacity="0.85">
          <path d="M24 23 L24 10" stroke="url(#harvestGoldGrad)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M24 23 L14 13" stroke="url(#harvestGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 23 L34 13" stroke="url(#harvestGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 23 L9 20" stroke="url(#harvestGoldGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
          <path d="M24 23 L39 20" stroke="url(#harvestGoldGrad)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Left Leaf Sprout (Crop Fertility) */}
        <path
          d="M24 37 C15 32 13 20 23 16 C23 23 19 30 24 37 Z"
          fill="url(#vibrantLeafGrad)"
        />

        {/* Right Golden Sprout (Commercial Off-take & Harvest) */}
        <path
          d="M24 37 C33 32 35 20 25 16 C25 23 29 30 24 37 Z"
          fill="url(#harvestGoldGrad)"
        />

        {/* Central Sprout Stem / Tech Spine */}
        <path
          d="M24 39 V20"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Central Digital Connect Node (USUCO Agro-Connect Infrastructure) */}
        <circle cx="24" cy="20" r="4" fill="#ffffff" />
        <circle cx="24" cy="20" r="2.2" fill="#053221" />

        {/* Interconnected Network Ring Nodes */}
        <circle cx="16" cy="28" r="1.5" fill="#fef08a" />
        <circle cx="32" cy="28" r="1.5" fill="#fef08a" />
        <line x1="16" y1="28" x2="24" y2="20" stroke="#fef08a" strokeWidth="1" strokeDasharray="1.5 1.5" opacity="0.8" />
        <line x1="32" y1="28" x2="24" y2="20" stroke="#fef08a" strokeWidth="1" strokeDasharray="1.5 1.5" opacity="0.8" />

        {/* Federal Star / Apex Crest */}
        <polygon
          points="24,6 25.2,8.5 28,8.8 26,10.7 26.5,13.5 24,12.1 21.5,13.5 22,10.7 20,8.8 22.8,8.5"
          fill="url(#harvestGoldGrad)"
        />
      </svg>

      {/* Brand Text Block */}
      <div className="flex flex-col">
        <div className={`font-heading font-extrabold ${textSize} text-[#053221] tracking-tight leading-none flex items-center gap-1`}>
          <span>Agro</span>
          <span className="text-[#e0a000] font-black">App</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] inline-block ml-0.5 animate-pulse" />
        </div>
        {showSubtag && (
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#414844] mt-0.5">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};

