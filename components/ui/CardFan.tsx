'use client';

import { cn } from '@/lib/utils';
import { UnoCard } from './UnoCard';

interface CardFanProps {
  className?: string;
}

// Desktop: 4 cards fanning from a common pivot point with horizontal spread
// Mobile: 3 cards (green hidden) with rebalanced angles for centered appearance
// Using cards from the extracted UNO deck SVG
const cards = [
  {
    color: 'red' as const,
    symbol: 'draw2' as const,
    rotation: -24,
    mobileRotation: -16, // Adjusted: 3-card fan centered (-16, 0, +16)
    offsetX: -45,
    offsetY: 0, // Outer cards at base
    mobileOffsetX: -30,
    delay: 0,
  },
  {
    color: 'blue' as const,
    symbol: 'skip' as const,
    rotation: -8,
    mobileRotation: 0, // Center card upright on mobile
    offsetX: -15,
    offsetY: -8, // Middle cards raised for arc effect
    mobileOffsetX: 0,
    delay: 100,
  },
  {
    color: 'yellow' as const,
    symbol: 'reverse' as const,
    rotation: 8,
    mobileRotation: 16, // Adjusted: symmetric with red card
    offsetX: 15,
    offsetY: -8, // Middle cards raised for arc effect
    mobileOffsetX: 30,
    delay: 200,
  },
  {
    color: 'green' as const,
    symbol: 'reverse' as const,
    rotation: 24,
    mobileRotation: 0, // Hidden on mobile
    offsetX: 45,
    offsetY: 0, // Outer cards at base
    mobileOffsetX: 0,
    delay: 300,
  },
];

export const CardFan = ({ className }: CardFanProps) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        className
      )}
      style={{
        // Height to accommodate the fanned cards
        height: '140px',
        width: '320px',
      }}
    >
      {cards.map((card, index) => {
        const isLastCard = index === 3;

        return (
          <div
            key={`${card.color}-${card.symbol}`}
            className={cn(
              // Position cards with horizontal offset
              'absolute',
              // Hide green card on mobile (last card)
              isLastCard && 'hidden sm:block',
              // Fan animation
              'animate-card-fan'
            )}
            style={{
              // Stack order - rightmost card on top
              zIndex: index + 1,
              // Transform origin at bottom center for fan pivot
              transformOrigin: 'center bottom',
              // Desktop: apply rotation, horizontal offset, and vertical offset for arc
              // Mobile uses CSS custom properties via media query in globals.css
              transform: `translateX(var(--card-offset-x)) translateY(var(--card-offset-y)) rotate(var(--card-rotation))`,
              // Animation delay for staggered effect
              animationDelay: `${card.delay}ms`,
              // CSS custom properties for responsive transforms
              '--card-rotation': `${card.rotation}deg`,
              '--card-offset-x': `${card.offsetX}px`,
              '--card-offset-y': `${card.offsetY}px`,
              '--mobile-rotation': `${card.mobileRotation}deg`,
              '--mobile-offset-x': `${card.mobileOffsetX}px`,
            } as React.CSSProperties}
          >
            <UnoCard
              color={card.color}
              symbol={card.symbol}
              rotation={0}
              size="md"
            />
          </div>
        );
      })}
    </div>
  );
};
