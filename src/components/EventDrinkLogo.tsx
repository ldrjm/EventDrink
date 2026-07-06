import React from 'react';

interface EventDrinkLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  height?: number | string;
}

export default function EventDrinkLogo({
  className = '',
  size = 'md',
  height
}: EventDrinkLogoProps) {
  // Map preset sizes to heights
  const h = height || {
    sm: 32,
    md: 48,
    lg: 80,
    xl: 120,
    custom: 48
  }[size];

  // Calculate proportional width (aspect ratio is roughly 4.5:1)
  // Viewbox: 0 0 450 100
  return (
    <div className={`inline-flex items-center select-none ${className}`} style={{ height: h }}>
      <svg
        id="eventdrink-brand-logo"
        viewBox="0 0 450 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Subtle glowing orange gradient for the liquid and drink term */}
          <linearGradient id="liquidGrad" x1="210" y1="30" x2="239" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fe9d00" />
            <stop offset="100%" stopColor="#ff5d00" />
          </linearGradient>

          {/* Slight text shadow for modern display style */}
          <filter id="subtleGlow" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* LEFT TEXT: EVENT */}
        <text
          id="logo-text-event"
          x="184"
          y="76"
          fill="#FFFFFF"
          fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
          fontWeight="500"
          fontSize="24"
          letterSpacing="12"
          textAnchor="end"
          style={{ opacity: 0.98 }}
        >
          EVENT
        </text>

        {/* MARTINI GLASS ICON CENTERED AT (225, 45) */}
        <g id="logo-icon-glass">
          {/* Glass Base (forms flat baseline) */}
          <line
            id="glass-base"
            x1="212"
            y1="75"
            x2="238"
            y2="75"
            stroke="#fe9d00"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Glass Stem (serves as vertical separator / 'I' element) */}
          <line
            id="glass-stem"
            x1="225"
            y1="75"
            x2="225"
            y2="46"
            stroke="#fe9d00"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Translucent liquid fill in the glass cup */}
          <path
            id="glass-liquid-fill"
            d="M 210.6,30 Q 225,38 239.4,30 L 225,46 Z"
            fill="url(#liquidGrad)"
            opacity="0.8"
          />

          {/* Wavy liquid surface line */}
          <path
            id="glass-liquid-surface"
            d="M 210.6,30 Q 225,38 239.4,30"
            stroke="#fe9d00"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Glass Cup Outline (Left and Right Rim Slopes) */}
          <path
            id="glass-cup"
            d="M 198,16 L 225,46 L 252,16"
            stroke="#fe9d00"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Floating Ice Cube 1 (Left) */}
          <rect
            id="ice-cube-1"
            x="207"
            y="17"
            width="8"
            height="8"
            rx="1.8"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinejoin="round"
            transform="rotate(-15 211 21)"
          />

          {/* Floating Ice Cube 2 (Right / Higher) */}
          <rect
            id="ice-cube-2"
            x="224"
            y="9"
            width="8"
            height="8"
            rx="1.8"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinejoin="round"
            transform="rotate(22 228 13)"
          />

          {/* Green Lemon/Lime Wedge Slice (Mounted on Right Rim) */}
          <g id="lime-wedge" transform="translate(248, 19) rotate(-48)">
            {/* Background solid dark mask to clean up overlapping glass outline */}
            <path
              d="M -1,-15 A 15,15 0 0,1 -1,15 Z"
              fill="#0d0d0d"
              opacity="1"
            />
            {/* Outer main green peel rim */}
            <path
              d="M 0,-14 A 14,14 0 0,1 0,14 Z"
              fill="none"
              stroke="#a2d729"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Inner green pulp rim */}
            <path
              d="M 0,-10 A 10,10 0 0,1 0,10"
              fill="none"
              stroke="#a2d729"
              strokeWidth="1"
              opacity="0.7"
            />
            {/* Segment dividing lines */}
            <line x1="0" y1="0" x2="9.9" y2="-9.9" stroke="#a2d729" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="0" x2="14" y2="0" stroke="#a2d729" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="0" x2="9.9" y2="9.9" stroke="#a2d729" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* RIGHT TEXT: DRINK */}
        <text
          id="logo-text-drink"
          x="266"
          y="76"
          fill="#fe9d00"
          fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
          fontWeight="500"
          fontSize="24"
          letterSpacing="12"
          textAnchor="start"
          style={{ opacity: 0.98 }}
        >
          DRINK
        </text>
      </svg>
    </div>
  );
}
