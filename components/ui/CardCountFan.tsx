'use client';

import { UnoCard } from '@/components/ui/UnoCard';

interface CardCountFanProps {
  /** Number of cards to display */
  cardCount: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays a fan of card backs to represent the number of cards a player holds.
 * Shows ALL cards in a very tight fan to fit the small space.
 * Uses the same arc logic as PlayerHand component.
 */
export const CardCountFan = ({
  cardCount,
  className,
}: CardCountFanProps) => {
  /**
   * Calculate fan angle and vertical offset for each card.
   * Uses the same arc logic as PlayerHand component.
   */
  const getCardTransform = (index: number): { rotation: number; translateY: number } => {
    if (cardCount <= 1) return { rotation: 0, translateY: 0 };

    // Max total fan angle scales with card count but caps out at 90 degrees
    const maxFanAngle = Math.min(cardCount * 5, 90);
    const angleStep = maxFanAngle / (cardCount - 1);
    const startAngle = -maxFanAngle / 2;
    const rotation = startAngle + index * angleStep;

    // Parabolic vertical offset: center cards are highest (reduced from 10 to 6)
    const normalizedPos = (index / (cardCount - 1)) * 2 - 1; // -1 to 1
    const translateY = normalizedPos * normalizedPos * 6; // Reduced parabolic curve

    return { rotation, translateY };
  };

  // Calculate margin - fixed -10px for all cards after the first
  const getMarginLeft = (index: number): number => {
    if (cardCount <= 1) return 0;
    return index === 0 ? 0 : -10;
  };

  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: cardCount }).map((_, index) => {
        const { rotation, translateY } = getCardTransform(index);
        return (
          <UnoCard
            key={index}
            symbol="back"
            size="sm"
            style={{
              width: 16,
              height: 24,
              marginLeft: getMarginLeft(index),
              transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
              transformOrigin: 'center bottom',
              filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3))',
              zIndex: index,
            }}
          />
        );
      })}
    </div>
  );
};
