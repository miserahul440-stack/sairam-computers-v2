import React from "react";

interface RealisticSaffronFlagProps {
  className?: string;
  size?: number;
}

export default function RealisticSaffronFlag({ className = "", size = 24 }: RealisticSaffronFlagProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      style={{ verticalAlign: "middle" }}
    >
      {/* Flag Pole (Metallic brass/gold traditional pole) */}
      <rect x="10" y="6" width="3" height="52" rx="1.5" fill="url(#brassPoleGradient)" />
      
      {/* Decorative Traditional Golden Kalash/Sharp Spear Top Knob */}
      <path
        d="M 11.5 1 C 12.5 1, 14 3, 11.5 6 C 9 3, 10.5 1, 11.5 1 Z"
        fill="url(#goldGradient)"
      />
      
      {/* Traditional Maratha Bhagava Dhwaj - Classic double-pointed split saffron flag shape */}
      <path
        d="M 13 10 
           C 25 8, 32 14, 56 7 
           L 42 22 
           L 56 36 
           C 32 32, 25 38, 13 34 
           Z"
        fill="url(#saffronGradient)"
        filter="url(#dropShadow)"
      />

      {/* Gradients and Filters definition */}
      <defs>
        {/* Pole Metallic Brass/Gold Gradient */}
        <linearGradient id="brassPoleGradient" x1="10" y1="6" x2="13" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="40%" stopColor="#D97706" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Gold Ornament Gradient */}
        <linearGradient id="goldGradient" x1="9" y1="1" x2="14" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#854D0E" />
        </linearGradient>

        {/* Traditional Pure Vibrant Saffron Gradient */}
        <linearGradient id="saffronGradient" x1="13" y1="10" x2="56" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7700" /> {/* Vibrant Traditional Saffron */}
          <stop offset="50%" stopColor="#FF5500" />
          <stop offset="100%" stopColor="#E03300" /> {/* Deep auspicious red-orange highlight */}
        </linearGradient>

        {/* Drop shadow for depth */}
        <filter id="dropShadow" x="8" y="4" width="56" height="42" filterUnits="userSpaceOnUse">
          <feDropShadow dx="1" dy="1.5" stdDeviation="1" floodColor="#7C2D12" floodOpacity="0.3" />
        </filter>
      </defs>
    </svg>
  );
}
