import React from 'react';

interface AgroAppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  onClick?: () => void;
}

export const AgroAppLogo: React.FC<AgroAppLogoProps> = ({
  className = '',
  iconSize = 34,
  textSize = 'text-2xl',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <svg
        width={iconSize}
        height={Math.round(iconSize * 0.75)}
        viewBox="0 0 40 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-[#053221]"
      >
        {/* Rear Wheel - Large Outer & Inner */}
        <circle cx="12" cy="20" r="8" stroke="currentColor" strokeWidth="2.8" />
        <circle cx="12" cy="20" r="3" fill="currentColor" />

        {/* Front Wheel - Smaller Outer & Inner */}
        <circle cx="32" cy="22" r="5" stroke="currentColor" strokeWidth="2.8" />
        <circle cx="32" cy="22" r="2" fill="currentColor" />

        {/* Tractor Main Frame & Hood */}
        <path
          d="M12 12H26L30 16V20H12V12Z"
          fill="currentColor"
        />

        {/* Steering Bar & Seat */}
        <path
          d="M8 12V7H13"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Exhaust Pipe */}
        <path
          d="M28 12V6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-heading font-extrabold ${textSize} text-[#053221] tracking-tight`}>
        AgroApp
      </span>
    </div>
  );
};
