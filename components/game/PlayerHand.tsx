'use client';

import { Card } from '@/lib/game/cards';
import { UnoCard } from '@/components/ui/UnoCard';
import { cn } from '@/lib/utils';

interface PlayerHandProps {
  cards: Card[];
  isMyTurn?: boolean;
  className?: string;
}

/**
 * Displays the player's hand as a fanned arc of cards at the bottom of the screen.
 * Cards are rotated to follow an arc curve with the center card highest.
 */
export const PlayerHand = ({ cards, isMyTurn = false, className }: PlayerHandProps) => {
  const cardCount = cards.length;

  /**
   * Calculate fan angle and vertical offset for each card.
   * More cards = tighter spacing, fewer = wider fan.
   */
  const getCardTransform = (index: number): { rotation: number; translateY: number } => {
    if (cardCount <= 1) return { rotation: 0, translateY: 0 };

    // Max total fan angle scales with card count but caps out
    const maxFanAngle = Math.min(cardCount * 5, 60);
    const angleStep = maxFanAngle / (cardCount - 1);
    const startAngle = -maxFanAngle / 2;
    const rotation = startAngle + index * angleStep;

    // Parabolic vertical offset: center cards are highest
    const normalizedPos = (index / (cardCount - 1)) * 2 - 1; // -1 to 1
    const translateY = normalizedPos * normalizedPos * 20; // Parabolic curve

    return { rotation, translateY };
  };

  return (
    <div className={cn('relative flex items-end justify-center', className)}>
      {/* Turn indicator glow */}
      {isMyTurn && (
        <div className="absolute -inset-4 rounded-3xl bg-yellow-400/10 border border-yellow-400/30 animate-pulse pointer-events-none" />
      )}

      <div className="flex items-end justify-center" style={{ minHeight: 140 }}>
        {cards.map((card, index) => {
          const { rotation, translateY } = getCardTransform(index);
          // Hover margin: give enough overlap
          const marginLeft = index === 0 ? 0 : cardCount > 10 ? -28 : cardCount > 6 ? -20 : -12;

          return (
            <div
              key={card.id}
              className="transition-transform duration-200 ease-out hover:-translate-y-6 hover:z-50 cursor-pointer"
              style={{
                marginLeft,
                transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
                zIndex: index,
              }}
            >
              <UnoCard
                color={card.color === 'wild' ? 'red' : card.color}
                symbol={card.symbol}
                size="md"
              />
            </div>
          );
        })}
      </div>

      {/* "Your turn" label */}
      {isMyTurn && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-400 text-sm font-bold uppercase tracking-widest animate-bounce">
          Your Turn!
        </div>
      )}
    </div>
  );
};
