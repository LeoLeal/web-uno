/**
 * useGamePlay hook - provides action submission and local pre-validation
 * Used by all players (host and peers) to interact with the gameplay system.
 */

import { useCallback, useMemo } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import { Card, CardColor, PlayerAction, isCardPlayable, hasPlayableCard } from '@/lib/game/cards';
import { useGameState } from '@/hooks/useGameState';

interface UseGamePlayOptions {
  /** Whether the Force Play house rule is enabled */
  forcePlay?: boolean;
  /** Current player's hand (needed for Force Play canDraw check) */
  hand?: Card[];
}

interface UseGamePlayReturn {
  /** Submit a player action to the action queue */
  submitAction: (action: PlayerAction) => void;
  /** Check if a card can be played against the current game state */
  canPlayCard: (card: Card) => boolean;
  /** True if it's the current player's turn and game is not frozen */
  isMyTurn: boolean;
  /** Active color derived from top discard card (null if no color) */
  activeColor: CardColor | null;
  /** Top card of the discard pile */
  topDiscard: Card | null;
  /** Whether the current player is allowed to draw a card */
  canDraw: boolean;
}

export const useGamePlay = (
  myClientId: number | null,
  options: UseGamePlayOptions = {},
): UseGamePlayReturn => {
  const { forcePlay = false, hand = [] } = options;
  const { doc } = useGame();
  const { currentTurn, discardPile, status } = useGameState();

  // Derive active color from top discard card
  const topDiscard = useMemo(() => {
    return discardPile && discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;
  }, [discardPile]);

  const activeColor = useMemo(() => {
    return topDiscard?.color ?? null;
  }, [topDiscard]);

  // Check if it's my turn
  const isMyTurn = useMemo(() => {
    if (!myClientId || status !== 'PLAYING') return false;
    return currentTurn === myClientId;
  }, [myClientId, currentTurn, status]);

  // Submit action to the actions map
  const submitAction = useCallback(
    (action: PlayerAction) => {
      if (!doc || !myClientId) return;

      const actionsMap = doc.getMap('actions');
      actionsMap.set(String(myClientId), action);
    },
    [doc, myClientId]
  );

  // Local pre-validation for card playability (using shared utility)
  const canPlayCard = useCallback(
    (card: Card): boolean => isCardPlayable(card, topDiscard),
    [topDiscard]
  );

  // Force Play: disable draw when player has a playable card
  const canDraw = useMemo(() => {
    if (!forcePlay) return true;
    return !hasPlayableCard(hand, topDiscard);
  }, [forcePlay, hand, topDiscard]);

  return {
    submitAction,
    canPlayCard,
    isMyTurn,
    activeColor,
    topDiscard,
    canDraw,
  };
};
