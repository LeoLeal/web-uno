'use client';

import { useState } from 'react';
import { Card, CardColor, isWildCard } from '@/lib/game/cards';
import { Player } from '@/hooks/useRoom';
import { OrphanHand } from '@/hooks/useGameState';
import { OpponentRow } from './OpponentRow';
import { TableCenter } from './TableCenter';
import { PlayerHand } from './PlayerHand';
import { WildColorModal } from './WildColorModal';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  /** All players in the game */
  players: Player[];
  /** Current player's client ID */
  myClientId: number | null;
  /** Host's client ID */
  hostId: number | null | undefined;
  /** Whose turn it is */
  currentTurn: number | null;
  /** Current player's hand */
  hand: Card[];
  /** Cards in the discard pile */
  discardPile: Card[];
  /** Map of clientId -> card count */
  playerCardCounts: Record<number, number>;
  /** Cumulative scores (multi-round games only) */
  scores?: Record<number, number>;
  /** Score limit for multi-round games (null = single round) */
  scoreLimit?: number | null;
  /** Orphan hands for disconnected players */
  orphanHands?: OrphanHand[];
  /** Whether interaction is frozen (e.g., during pause) */
  isFrozen?: boolean;
  /** Whether local game room audio feedback is muted */
  isMuted?: boolean;
  /** Handler for playing a card (with optional color for wilds) */
  onPlayCard?: (cardId: string, chosenColor?: CardColor) => void;
  /** Handler for drawing a card */
  onDrawCard?: () => void;
  /** Function to check if a card can be played */
  canPlayCard?: (card: Card) => boolean;
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
  scores,
  scoreLimit,
  orphanHands = [],
  isFrozen = false,
  isMuted = false,
  onPlayCard,
  onDrawCard,
  canPlayCard,
  className,
}: GameBoardProps) => {
  const [selectedWildCard, setSelectedWildCard] = useState<Card | null>(null);

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
      isHost: typeof hostId === 'number' && p.clientId === hostId,
      isDisconnected: disconnectedIds.includes(p.clientId),
    }));

  const isMyTurn = currentTurn === myClientId && !isFrozen;

  // Handle card click
  const handleCardClick = (card: Card) => {
    if (!isMyTurn || !onPlayCard || !canPlayCard) return;

    // Check if card is playable
    if (!canPlayCard(card)) return;

    // Wild cards need color selection
    if (isWildCard(card)) {
      setSelectedWildCard(card);
      return;
    }

    // Normal cards can be played immediately
    onPlayCard(card.id);
  };

  // Handle wild color selection
  const handleColorSelect = (color: CardColor) => {
    if (selectedWildCard && onPlayCard) {
      onPlayCard(selectedWildCard.id, color);
    }
    setSelectedWildCard(null);
  };

  // Handle modal cancel
  const handleColorCancel = () => {
    setSelectedWildCard(null);
  };

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
        <OpponentRow opponents={opponents} currentTurn={currentTurn} scores={scores} scoreLimit={scoreLimit} isMuted={isMuted} />
      </div>

      {/* Table center — grows to fill available space, centered */}
      <div className="flex-1 flex items-center justify-center">
        <TableCenter
          discardPile={discardPile}
          isMyTurn={isMyTurn}
          onDrawCard={onDrawCard}
        />
      </div>

      {/* Player's hand - now fixed positioned in PlayerHand component */}
      <PlayerHand
        cards={hand}
        isMyTurn={isMyTurn}
        onCardClick={handleCardClick}
        canPlayCard={canPlayCard}
        score={myClientId !== null ? scores?.[myClientId] : undefined}
        showScore={scoreLimit !== null && scoreLimit !== undefined}
      />

      {/* Wild color selection modal */}
      <WildColorModal
        isOpen={selectedWildCard !== null}
        onSelect={handleColorSelect}
        onCancel={handleColorCancel}
      />
    </div>
  );
};
