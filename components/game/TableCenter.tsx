'use client';

import { Card } from '@/lib/game/cards';
import { DiscardPile } from './DiscardPile';
import { DeckPile } from './DeckPile';
import { cn } from '@/lib/utils';

interface TableCenterProps {
  discardPile: Card[];
  className?: string;
}

/**
 * Center table area containing the deck pile and discard pile side by side.
 */
export const TableCenter = ({ discardPile, className }: TableCenterProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-8 md:gap-12',
        className
      )}
    >
      {/* Deck pile */}
      <div className="flex flex-col items-center gap-2">
        <DeckPile />
        <span className="text-xs text-(--cream-dark) opacity-50 font-mono">Draw</span>
      </div>

      {/* Discard pile */}
      <div className="flex flex-col items-center gap-2">
        <DiscardPile cards={discardPile} />
        <span className="text-xs text-(--cream-dark) opacity-50 font-mono">Discard</span>
      </div>
    </div>
  );
};
