'use client';

import { UnoCard } from '@/components/ui/UnoCard';
import { cn } from '@/lib/utils';

interface DeckPileProps {
  className?: string;
  /** Card dimensions - defaults to mobile size (80x120) */
  cardWidth?: number;
  cardHeight?: number;
}

const DEFAULT_WIDTH = 80;
const DEFAULT_HEIGHT = 120;

/**
 * Deck pile shown as stacked card backs with slight offset for depth illusion.
 * Uses UnoCard with symbol='back' for consistent sizing with the discard pile.
 */
export const DeckPile = ({ className, cardWidth = DEFAULT_WIDTH, cardHeight = DEFAULT_HEIGHT }: DeckPileProps) => {
  return (
    <div className={cn('relative', className)} style={{ width: cardWidth, height: cardHeight }}>
      {/* Stack layers for depth effect */}
      {[2, 1, 0].map((offset) => (
        <div
          key={offset}
          className="absolute"
          style={{
            top: -offset * 2,
            left: -offset * 1,
            zIndex: 3 - offset,
          }}
        >
          <UnoCard symbol="back" style={{ width: cardWidth, height: cardHeight }} />
        </div>
      ))}
    </div>
  );
};
