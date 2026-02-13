'use client';

import { Card } from '@/lib/game/cards';
import { Player } from '@/hooks/useRoom';
import { OrphanHand } from '@/hooks/useGameState';
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
  /** Orphan hands for disconnected players */
  orphanHands?: OrphanHand[];
  /** Whether interaction is frozen (e.g., during pause) */
  isFrozen?: boolean;
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
  orphanHands = [],
  isFrozen = false,
  className,
}: GameBoardProps) => {
  // Get disconnected player IDs from orphan hands
  const disconnectedIds = orphanHands.map((o) => o.originalClientId);

  // Filter out self from opponents
  const opponents = players
    .filter((p) => p.clientId !== myClientId)
    .map((p) => ({
      clientId: p.clientId,
      name: p.name,
      avatar: p.avatar || '🎮',
      cardCount: playerCardCounts[p.clientId] || 0,
      isHost: hostId !== null && p.clientId === hostId,
      isDisconnected: disconnectedIds.includes(p.clientId),
    }));

  const isMyTurn = currentTurn === myClientId && !isFrozen;

  return (
    <div
      className={cn(
        'flex flex-col flex-1 min-h-0',
        isFrozen && 'pointer-events-none opacity-75',
        className
      )}
    >
      {/* Opponents row */}
      <div className="pt-2 mt-4 flex-shrink-0">
        <OpponentRow opponents={opponents} currentTurn={currentTurn} />
      </div>

      {/* Table center — grows to fill available space, centered */}
      <div className="flex-1 flex items-center justify-center">
        <TableCenter discardPile={discardPile} />
      </div>

      {/* Player's hand - now fixed positioned in PlayerHand component */}
      <PlayerHand cards={hand} isMyTurn={isMyTurn} />
    </div>
  );
};
