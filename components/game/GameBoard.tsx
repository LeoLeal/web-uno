'use client';

import { Card } from '@/lib/game/cards';
import { Player } from '@/hooks/useRoom';
import { OpponentRow } from './OpponentRow';
import { TableCenter } from './TableCenter';
import { PlayerHand } from './PlayerHand';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  /** All players in the game */
  players: Player[];
  /** Current player's client ID */
  myClientId: number | null;
  /** Host's client ID */
  hostId: number | null;
  /** Whose turn it is */
  currentTurn: number | null;
  /** Current player's hand */
  hand: Card[];
  /** Cards in the discard pile */
  discardPile: Card[];
  /** Map of clientId -> card count */
  playerCardCounts: Record<number, number>;
  className?: string;
}

/**
 * Main game board layout container.
 * Arranges opponents at top, table center in middle, player's hand at bottom.
 */
export const GameBoard = ({
  players,
  myClientId,
  hostId,
  currentTurn,
  hand,
  discardPile,
  playerCardCounts,
  className,
}: GameBoardProps) => {
  // Filter out self from opponents
  const opponents = players
    .filter((p) => p.clientId !== myClientId)
    .map((p) => ({
      clientId: p.clientId,
      name: p.name,
      avatar: p.avatar || '🎮',
      cardCount: playerCardCounts[p.clientId] || 0,
      isHost: hostId !== null && p.clientId === hostId,
    }));

  const isMyTurn = currentTurn === myClientId;

  return (
    <div
      className={cn(
        'flex flex-col min-h-[calc(100vh-120px)] gap-4 md:gap-6',
        className
      )}
    >
      {/* Opponents row */}
      <div className="pt-2">
        <OpponentRow opponents={opponents} currentTurn={currentTurn} />
      </div>

      {/* Table center — grows to fill available space */}
      <div className="flex-1 flex items-center justify-center">
        <TableCenter discardPile={discardPile} />
      </div>

      {/* Player's hand — anchored to bottom */}
      <div className="pb-4 md:pb-6">
        <PlayerHand cards={hand} isMyTurn={isMyTurn} />
      </div>
    </div>
  );
};
