'use client';

import { Card } from '@/lib/game/cards';
import { UnoCard } from '@/components/ui/UnoCard';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface DiscardPileProps {
  cards: Card[];
  className?: string;
  /** Card dimensions - defaults to mobile size (80x120) */
  cardWidth?: number;
  cardHeight?: number;
}

const DEFAULT_WIDTH = 80;
const DEFAULT_HEIGHT = 120;

/**
 * Discard pile with stacked cards featuring random rotation/offset for organic look.
 * Shows up to the last 3 cards with the top card fully visible.
 */
export const DiscardPile = ({ cards, className, cardWidth = DEFAULT_WIDTH, cardHeight = DEFAULT_HEIGHT }: DiscardPileProps) => {
  // Pre-compute random transforms for visible cards (memoized to avoid re-rolling on render)
  const visibleCards = cards.slice(-3);
  const transforms = useMemo(
    () =>
      visibleCards.map((_card, _i) => ({
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
          'rounded-lg border-2 border-dashed border-(--copper-border)/30 flex items-center justify-center',
          className
        )}
        style={{ width: cardWidth, height: cardHeight }}
      >
        <span className="text-(--cream-dark) opacity-30 text-xs">Discard</span>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} style={{ width: cardWidth, height: cardHeight }}>
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
              color={card.color}
              symbol={card.symbol}
              style={{ width: cardWidth, height: cardHeight }}
            />
          </div>
        );
      })}
    </div>
  );
};
