/**
 * Host-only game engine hook.
 * Manages deck creation, shuffling, dealing, and Yjs shared state updates.
 * Only the host should call initializeGame(); guests observe state via useGameState.
 *
 * Hands are distributed via a Yjs Y.Map ('dealtHands') keyed by clientId.
 * Each player reads only their own entry from this map.
 */

import { useCallback, useRef, useEffect } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import { Card, isWildDrawFour, CardSymbol, PlayerAction, isWildCard } from '@/lib/game/cards';
import { createDeck, shuffle } from '@/lib/game/deck';
import { Player } from '@/hooks/useRoom';
import type * as Y from 'yjs';

interface UseGameEngineOptions {
  /** Current player list from the room */
  players: Player[];
  /** My own client ID */
  myClientId: number | null;
  /** Starting hand size from game settings */
  startingHandSize: number;
  /** Whether this client is the host */
  isHost: boolean;
}

interface UseGameEngineReturn {
  /** Initialize the game: create deck, deal hands, set first card, update Yjs state */
  initializeGame: () => void;
  /** Reference to the deck (host-only, used for reshuffling orphan cards) */
  deckRef: React.RefObject<Card[]>;
}

export const useGameEngine = ({
  players,
  myClientId,
  startingHandSize,
  isHost,
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

    // 5. Apply first card effects
    let initialTurn = turnOrder[0];
    let initialDirection = 1;
    const initialHands = { ...hands };
    const initialCardCounts = { ...playerCardCounts };

    switch (firstCard.symbol as CardSymbol) {
      case 'skip':
        // Skip first player, start with second
        initialTurn = turnOrder[1 % turnOrder.length];
        break;

      case 'reverse':
        // Reverse direction, start with last player
        initialDirection = -1;
        initialTurn = turnOrder[turnOrder.length - 1];
        break;

      case 'draw2': {
        // First player draws 2 and is skipped
        const firstPlayerId = turnOrder[0];
        const drawnCards = deckRef.current.splice(0, 2);
        initialHands[String(firstPlayerId)].push(...drawnCards);
        initialCardCounts[firstPlayerId] += drawnCards.length;
        initialTurn = turnOrder[1 % turnOrder.length];
        break;
      }

      case 'wild':
      case 'wild-draw4':
        // Wild stays colorless (already has no color)
        // Wild Draw Four would have been reshuffled, but handled here for clarity
        break;

      default:
        // Number cards, no effect
        break;
    }

    // Update hands and counts after first card effects
    Object.assign(hands, initialHands);
    Object.assign(playerCardCounts, initialCardCounts);

    // 6. Build locked players list
    const lockedPlayers = players.map((p) => ({
      clientId: p.clientId,
      name: p.name,
    }));

    // 7. Update Yjs shared state in a single transaction
    const gameStateMap = doc.getMap('gameState');
    const dealtHandsMap = doc.getMap('dealtHands');
    const actionsMap = doc.getMap('actions');

    doc.transact(() => {
      gameStateMap.set('status', 'PLAYING');
      gameStateMap.set('currentTurn', initialTurn);
      gameStateMap.set('direction', initialDirection);
      gameStateMap.set('discardPile', [firstCard]);
      gameStateMap.set('playerCardCounts', playerCardCounts);
      gameStateMap.set('turnOrder', turnOrder);
      gameStateMap.set('lockedPlayers', lockedPlayers);

      // Distribute hands via Yjs (each player reads only their own key)
      for (const [clientId, hand] of Object.entries(hands)) {
        dealtHandsMap.set(clientId, hand);
      }

      // Initialize actions map (clear any stale actions)
      actionsMap.clear();
    });
  }, [doc, myClientId, players, startingHandSize]);

  // Action processing loop (host only)
  useEffect(() => {
    if (!doc || !myClientId || !isHost) return;

    const actionsMap = doc.getMap('actions');
    const gameStateMap = doc.getMap('gameState');
    const dealtHandsMap = doc.getMap('dealtHands');

    // Helper: Reshuffle deck from discard pile
    const reshuffleDeck = (): void => {
      const discardPile = (gameStateMap.get('discardPile') as Card[]) || [];
      if (discardPile.length <= 1) return; // Keep top card

      const topCard = discardPile[discardPile.length - 1];
      const cardsToReshuffle = discardPile.slice(0, -1).map((card) => {
        // Strip color from wild cards before reshuffling
        if (isWildCard(card)) {
          const { color: _color, ...cardWithoutColor } = card;
          return cardWithoutColor as Card;
        }
        return card;
      });
      shuffle(cardsToReshuffle);
      deckRef.current.push(...cardsToReshuffle);

      // Update discard pile to just the top card
      gameStateMap.set('discardPile', [topCard]);
    };

    // Helper: Deal cards (with reshuffle if needed)
    const dealCards = (count: number): Card[] => {
      const dealt: Card[] = [];
      for (let i = 0; i < count; i++) {
        if (deckRef.current.length === 0) {
          reshuffleDeck();
          if (deckRef.current.length === 0) break; // Deck exhausted
        }
        const card = deckRef.current.shift();
        if (card) dealt.push(card);
      }
      return dealt;
    };

    // Helper: Compute next turn
    const computeNextTurn = (turnOrder: number[], currentTurn: number, direction: number, skipCount: number): number => {
      const currentIndex = turnOrder.indexOf(currentTurn);
      if (currentIndex === -1) return turnOrder[0];

      let nextIndex = currentIndex;
      for (let i = 0; i < skipCount; i++) {
        nextIndex = (nextIndex + direction + turnOrder.length) % turnOrder.length;
      }
      return turnOrder[nextIndex];
    };

    // Action observer
    const observer = (event: Y.YMapEvent<unknown>) => {
      const status = gameStateMap.get('status') as string;
      if (status !== 'PLAYING') return;

      event.keysChanged.forEach((clientIdStr) => {
        const action = actionsMap.get(clientIdStr) as PlayerAction | null;
        if (!action) return; // Null means already processed

        const clientId = Number(clientIdStr);
        const currentTurn = gameStateMap.get('currentTurn') as number;
        const turnOrder = (gameStateMap.get('turnOrder') as number[]) || [];
        const direction = (gameStateMap.get('direction') as number) || 1;
        const discardPile = (gameStateMap.get('discardPile') as Card[]) || [];
        const playerCardCounts = (gameStateMap.get('playerCardCounts') as Record<number, number>) || {};

        // Validation: Turn check
        if (clientId !== currentTurn) {
          actionsMap.set(clientIdStr, null);
          return;
        }

        const playerHand = (dealtHandsMap.get(clientIdStr) as Card[]) || [];

        if (action.type === 'PLAY_CARD') {
          // Validation: Card ownership
          const card = playerHand.find((c) => c.id === action.cardId);
          if (!card) {
            actionsMap.set(clientIdStr, null);
            return;
          }

          // Validation: Playability
          const topDiscard = discardPile[discardPile.length - 1];
          const activeColor = topDiscard?.color ?? null;
          const isPlayable =
            activeColor === null ||
            isWildCard(card) ||
            card.color === activeColor ||
            card.symbol === topDiscard?.symbol;

          if (!isPlayable) {
            actionsMap.set(clientIdStr, null);
            return;
          }

          // Validation: Wild card needs chosenColor
          if (isWildCard(card) && !action.chosenColor) {
            actionsMap.set(clientIdStr, null);
            return;
          }

          // Execute PLAY_CARD
          doc.transact(() => {
            // Remove card from hand
            const newHand = playerHand.filter((c) => c.id !== card.id);
            dealtHandsMap.set(clientIdStr, newHand);

            // Mutate wild card color if chosen
            const playedCard: Card = { ...card };
            if (isWildCard(card) && action.chosenColor) {
              playedCard.color = action.chosenColor;
            }

            // Add to discard pile
            const newDiscardPile = [...discardPile, playedCard];
            gameStateMap.set('discardPile', newDiscardPile);

            // Update card count
            const newCounts = { ...playerCardCounts };
            newCounts[clientId] = newHand.length;
            gameStateMap.set('playerCardCounts', newCounts);

            // Check for win
            if (newHand.length === 0) {
              gameStateMap.set('status', 'ENDED');
              gameStateMap.set('winner', clientId);
              gameStateMap.set('winType', 'LEGITIMATE');
              actionsMap.set(clientIdStr, null);
              return; // Don't advance turn
            }

            // Apply card effects and advance turn
            let skipCount = 1;
            let newDirection = direction;

            switch (playedCard.symbol) {
              case 'skip':
                skipCount = 2;
                break;

              case 'reverse':
                newDirection = direction * -1;
                gameStateMap.set('direction', newDirection);
                // Two-player special case: Reverse acts as Skip
                if (turnOrder.length === 2) {
                  skipCount = 2;
                } else {
                  skipCount = 1;
                }
                break;

              case 'draw2': {
                const nextPlayerId = computeNextTurn(turnOrder, currentTurn, direction, 1);
                const drawnCards = dealCards(2);
                const nextPlayerHand = (dealtHandsMap.get(String(nextPlayerId)) as Card[]) || [];
                dealtHandsMap.set(String(nextPlayerId), [...nextPlayerHand, ...drawnCards]);
                newCounts[nextPlayerId] = nextPlayerHand.length + drawnCards.length;
                gameStateMap.set('playerCardCounts', newCounts);
                skipCount = 2;
                break;
              }

              case 'wild-draw4': {
                const nextPlayerId = computeNextTurn(turnOrder, currentTurn, direction, 1);
                const drawnCards = dealCards(4);
                const nextPlayerHand = (dealtHandsMap.get(String(nextPlayerId)) as Card[]) || [];
                dealtHandsMap.set(String(nextPlayerId), [...nextPlayerHand, ...drawnCards]);
                newCounts[nextPlayerId] = nextPlayerHand.length + drawnCards.length;
                gameStateMap.set('playerCardCounts', newCounts);
                skipCount = 2;
                break;
              }

              default:
                skipCount = 1;
            }

            // Advance turn
            const nextTurn = computeNextTurn(turnOrder, currentTurn, newDirection, skipCount);
            gameStateMap.set('currentTurn', nextTurn);

            // Clear action
            actionsMap.set(clientIdStr, null);
          });
        } else if (action.type === 'DRAW_CARD') {
          // Execute DRAW_CARD
          doc.transact(() => {
            const drawnCards = dealCards(1);
            const newHand = [...playerHand, ...drawnCards];
            dealtHandsMap.set(clientIdStr, newHand);

            // Update card count
            const newCounts = { ...playerCardCounts };
            newCounts[clientId] = newHand.length;
            gameStateMap.set('playerCardCounts', newCounts);

            // Advance turn
            const nextTurn = computeNextTurn(turnOrder, currentTurn, direction, 1);
            gameStateMap.set('currentTurn', nextTurn);

            // Clear action
            actionsMap.set(clientIdStr, null);
          });
        }
      });
    };

    actionsMap.observe(observer);
    return () => actionsMap.unobserve(observer);
  }, [doc, myClientId, isHost]);

  return { initializeGame, deckRef };
};
