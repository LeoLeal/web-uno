/**
 * Host-only game engine hook.
 * Manages deck creation, shuffling, dealing, and Yjs shared state updates.
 * Only the host should call initializeGame(); guests observe state via useGameState.
 *
 * Hands are distributed via a Yjs Y.Map ('dealtHands') keyed by clientId.
 * Each player reads only their own entry from this map.
 */

import { useCallback, useRef } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import { Card, isWildDrawFour } from '@/lib/game/cards';
import { createDeck, shuffle } from '@/lib/game/deck';
import { Player } from '@/hooks/useRoom';

interface UseGameEngineOptions {
  /** Current player list from the room */
  players: Player[];
  /** My own client ID */
  myClientId: number | null;
  /** Starting hand size from game settings */
  startingHandSize: number;
}

interface UseGameEngineReturn {
  /** Initialize the game: create deck, deal hands, set first card, update Yjs state */
  initializeGame: () => void;
}

export const useGameEngine = ({
  players,
  myClientId,
  startingHandSize,
}: UseGameEngineOptions): UseGameEngineReturn => {
  const { doc } = useGame();
  // Host keeps the deck in memory only — never in shared state
  const deckRef = useRef<Card[]>([]);

  const initializeGame = useCallback(() => {
    if (!doc || !myClientId || players.length < 2) return;

    // 1. Create and shuffle deck
    const deck = createDeck();
    shuffle(deck);

    // 2. Determine turn order from current player list order
    const turnOrder = players.map((p) => p.clientId);

    // 3. Deal cards to each player
    const playerCardCounts: Record<number, number> = {};
    const hands: Record<string, Card[]> = {};

    for (const player of players) {
      const hand = deck.splice(0, startingHandSize);
      playerCardCounts[player.clientId] = hand.length;
      hands[String(player.clientId)] = hand;
    }

    // 4. Flip first card for discard pile (with Wild Draw 4 reshuffle rule)
    let firstCard = deck.shift()!;
    while (isWildDrawFour(firstCard)) {
      // Return Wild Draw 4 to deck and reshuffle
      deck.push(firstCard);
      shuffle(deck);
      firstCard = deck.shift()!;
    }

    // Store remaining deck in host memory only
    deckRef.current = deck;

    // 5. Build locked players list
    const lockedPlayers = players.map((p) => ({
      clientId: p.clientId,
      name: p.name,
    }));

    // 6. Update Yjs shared state in a single transaction
    const gameStateMap = doc.getMap('gameState');
    const dealtHandsMap = doc.getMap('dealtHands');

    doc.transact(() => {
      gameStateMap.set('status', 'PLAYING');
      gameStateMap.set('currentTurn', turnOrder[0]);
      gameStateMap.set('direction', 1);
      gameStateMap.set('discardPile', [firstCard]);
      gameStateMap.set('playerCardCounts', playerCardCounts);
      gameStateMap.set('turnOrder', turnOrder);
      gameStateMap.set('lockedPlayers', lockedPlayers);

      // Distribute hands via Yjs (each player reads only their own key)
      for (const [clientId, hand] of Object.entries(hands)) {
        dealtHandsMap.set(clientId, hand);
      }
    });
  }, [doc, myClientId, players, startingHandSize]);

  return { initializeGame };
};
