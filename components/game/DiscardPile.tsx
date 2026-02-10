'use client';

import { Card } from '@/lib/game/cards';
import { UnoCard } from '@/components/ui/UnoCard';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface DiscardPileProps {
  cards: Card[];
  className?: string;
}

/**
 * Discard pile with stacked cards featuring random rotation/offset for organic look.
 * Shows up to the last 3 cards with the top card fully visible.
 */
export const DiscardPile = ({ cards, className }: DiscardPileProps) => {
  // Pre-compute random transforms for visible cards (memoized to avoid re-rolling on render)
  const visibleCards = cards.slice(-3);
  const transforms = useMemo(
    () =>
      visibleCards.map((_, i) => ({
        rotation: Math.random() * 20 - 10,
        offsetX: Math.random() * 6 - 3,
        offsetY: Math.random() * 6 - 3,
      })),
    // Re-generate when pile length changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards.length]
  );

  if (cards.length === 0) {
    return (
      <div
        className={cn(
          'w-[80px] h-[120px] rounded-lg border-2 border-dashed border-(--copper-border)/30 flex items-center justify-center',
          className
        )}
      >
        <span className="text-(--cream-dark) opacity-30 text-xs">Discard</span>
      </div>
    );
  }

  return (
    <div className={cn('relative w-[80px] h-[120px]', className)}>
      {visibleCards.map((card, i) => {
        const transform = transforms[i] || { rotation: 0, offsetX: 0, offsetY: 0 };
        const isTop = i === visibleCards.length - 1;

        return (
          <div
            key={card.id}
            className="absolute inset-0"
            style={{
              transform: `rotate(${transform.rotation}deg) translate(${transform.offsetX}px, ${transform.offsetY}px)`,
              zIndex: i,
              opacity: isTop ? 1 : 0.7,
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
  );
};
