import { cn } from "@/lib/utils";

interface RobotMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}

export function RobotMascot({ size = "md", className, animated = true }: RobotMascotProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  return (
    <div className={cn(sizeClasses[size], animated && "float", className)}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(270, 80%, 60%)" />
            <stop offset="100%" stopColor="hsl(190, 80%, 50%)" />
          </linearGradient>
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(190, 80%, 50%)" />
            <stop offset="100%" stopColor="hsl(270, 80%, 60%)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Antenna */}
        <circle cx="100" cy="25" r="8" fill="url(#robotGradient)" filter="url(#glow)" className="animate-pulse" />
        <rect x="97" y="30" width="6" height="20" fill="url(#robotGradient)" rx="3" />
        
        {/* Head */}
        <rect x="50" y="50" width="100" height="70" rx="15" fill="url(#robotGradient)" />
        
        {/* Screen/Face */}
        <rect x="60" y="60" width="80" height="50" rx="10" fill="hsl(250, 25%, 10%)" />
        
        {/* Eyes */}
        <ellipse cx="80" cy="85" rx="12" ry="14" fill="url(#screenGradient)" filter="url(#glow)">
          <animate attributeName="ry" values="14;2;14" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="120" cy="85" rx="12" ry="14" fill="url(#screenGradient)" filter="url(#glow)">
          <animate attributeName="ry" values="14;2;14" dur="3s" repeatCount="indefinite" />
        </ellipse>
        
        {/* Eye highlights */}
        <circle cx="76" cy="82" r="4" fill="white" opacity="0.6" />
        <circle cx="116" cy="82" r="4" fill="white" opacity="0.6" />
        
        {/* Mouth - smile */}
        <path d="M 80 100 Q 100 115 120 100" stroke="url(#screenGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
        
        {/* Ears */}
        <rect x="35" y="70" width="15" height="30" rx="5" fill="url(#robotGradient)" />
        <rect x="150" y="70" width="15" height="30" rx="5" fill="url(#robotGradient)" />
        
        {/* Body */}
        <rect x="60" y="125" width="80" height="50" rx="10" fill="url(#robotGradient)" />
        
        {/* Body screen/panel */}
        <rect x="75" y="135" width="50" height="30" rx="5" fill="hsl(250, 25%, 10%)" />
        
        {/* Body lights */}
        <circle cx="90" cy="150" r="5" fill="hsl(150, 70%, 50%)" filter="url(#glow)">
          <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="110" cy="150" r="5" fill="hsl(45, 90%, 55%)" filter="url(#glow)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
        </circle>
        
        {/* Arms */}
        <rect x="35" y="130" width="20" height="35" rx="8" fill="url(#robotGradient)" />
        <rect x="145" y="130" width="20" height="35" rx="8" fill="url(#robotGradient)" />
        
        {/* Hands */}
        <circle cx="45" cy="170" r="10" fill="url(#robotGradient)" />
        <circle cx="155" cy="170" r="10" fill="url(#robotGradient)" />
      </svg>
    </div>
  );
}
