'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div 
      className={cn(
        'flex items-center justify-center gap-0 animate-logo-fade-in',
        className
      )}
    >
      {/* P2P UN text */}
      <span 
        className="font-body text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide"
        style={{ 
          color: 'var(--cream)',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}
      >
        P2P UN
      </span>
      
      {/* Card as "O" - Uses extracted SVG from UNO deck */}
      <div 
        className="relative ml-1 sm:ml-2"
        style={{ 
          transform: 'rotate(15deg) translateY(4px)',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
        }}
      >
        <img
          src="/cards/wild.svg"
          alt="wild card"
          width={36}
          height={54}
          className="w-9 h-[54px] sm:w-11 sm:h-[66px] md:w-13 md:h-[78px]"
          loading="eager"
        />
      </div>
    </div>
  );
};
