'use client';

import { Card } from '@/lib/game/cards';
import { DiscardPile } from './DiscardPile';
import { DeckPile } from './DeckPile';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface TableCenterProps {
  discardPile: Card[];
  className?: string;
  /** Whether it's the current player's turn */
  isMyTurn?: boolean;
  /** Called when the deck is clicked to draw a card */
  onDrawCard?: () => void;
  /** Client ID of the player who last played a card */
  lastPlayedBy?: number | null;
  /** Current player's client ID */
  myClientId?: number | null;
}

// Mobile: 80x120, Desktop: ~130x195 (~60% larger = ~20% less than 2x)
const MOBILE_WIDTH = 80;
const MOBILE_HEIGHT = 120;
const DESKTOP_WIDTH = 130;
const DESKTOP_HEIGHT = 195;

/**
 * Center table area containing the deck pile and discard pile side by side.
 */
export const TableCenter = ({ 
  discardPile, 
  className, 
  isMyTurn, 
  onDrawCard,
  lastPlayedBy = null,
  myClientId = null,
}: TableCenterProps) => {
  const breakpoint = useBreakpoint();
  const isDesktop = breakpoint === 'desktop';
  const cardWidth = isDesktop ? DESKTOP_WIDTH : MOBILE_WIDTH;
  const cardHeight = isDesktop ? DESKTOP_HEIGHT : MOBILE_HEIGHT;

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-12 md:gap-16 pb-0 md:pb-[200px]',
        className
      )}
    >
      {/* Deck pile */}
      <div className="flex flex-col items-center gap-2">
        <DeckPile
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          isMyTurn={isMyTurn}
          onClick={onDrawCard}
        />
        <span className="text-xs text-(--cream-dark) opacity-50 font-mono">Draw</span>
      </div>

      {/* Discard pile */}
      <div className="flex flex-col items-center gap-2">
        <DiscardPile 
          cards={discardPile} 
          cardWidth={cardWidth} 
          cardHeight={cardHeight}
          lastPlayedBy={lastPlayedBy}
          myClientId={myClientId}
        />
        <span className="text-xs text-(--cream-dark) opacity-50 font-mono">Discard</span>
      </div>
    </div>
  );
};
