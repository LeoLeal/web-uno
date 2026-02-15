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
import { calculateHandPoints } from '@/lib/game/scoring';
import { MIN_PLAYERS, MAX_PLAYERS } from '@/lib/game/constants';
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
  /** Score limit for multi-round games (null = single round) */
  scoreLimit: number | null;
}

interface UseGameEngineReturn {
  /** Initialize the game: create deck, deal hands, set first card, update Yjs state */
  initializeGame: () => void;
  /** Initialize a new round in a multi-round game */
  initializeRound: () => void;
  /** Reference to the deck (host-only, used for reshuffling orphan cards) */
  deckRef: React.RefObject<Card[]>;
}

export const useGameEngine = ({
  players,
  myClientId,
  startingHandSize,
  isHost,
  scoreLimit,
}: UseGameEngineOptions): UseGameEngineReturn => {
  const { doc } = useGame();
  // Host keeps the deck in memory only — never in shared state
  const deckRef = useRef<Card[]>([]);

  /**
   * Helper: Prepare a new deck, deal cards, and select first card.
   * Returns deck, hands, card counts, and first card.
   */
  const prepareDeckAndDeal = useCallback((playerList: Array<{ clientId: number; name: string }>) => {
    const deck = createDeck();
    shuffle(deck);

    const playerCardCounts: Record<number, number> = {};
    const hands: Record<string, Card[]> = {};

    for (const player of playerList) {
      const hand = deck.splice(0, startingHandSize);
      playerCardCounts[player.clientId] = hand.length;
      hands[String(player.clientId)] = hand;
    }

    // Flip first card (reshuffle Wild Draw 4)
    let firstCard = deck.shift()!;
    while (isWildDrawFour(firstCard)) {
      deck.push(firstCard);
      shuffle(deck);
      firstCard = deck.shift()!;
    }

    return { deck, hands, playerCardCounts, firstCard };
  }, [startingHandSize]);

  /**
   * Helper: Apply first card effects to determine initial turn and direction.
   * Modifies hands and card counts in place based on first card effects.
   */
  const applyFirstCardEffects = useCallback((
    firstCard: Card,
    baseStartingPlayer: number,
    turnOrder: number[],
    hands: Record<string, Card[]>,
    playerCardCounts: Record<number, number>
  ): { initialTurn: number; initialDirection: 1 | -1 } => {
    let initialTurn = baseStartingPlayer;
    let initialDirection: 1 | -1 = 1;

    const baseIndex = turnOrder.indexOf(baseStartingPlayer);

    switch (firstCard.symbol as CardSymbol) {
      case 'skip':
        // Skip starting player, advance to next
        const skipIndex = (baseIndex + 1) % turnOrder.length;
        initialTurn = turnOrder[skipIndex];
        break;

      case 'reverse':
        // Reverse direction, start with previous player
        initialDirection = -1;
        const reverseIndex = (baseIndex - 1 + turnOrder.length) % turnOrder.length;
        initialTurn = turnOrder[reverseIndex];
        break;

      case 'draw2': {
        // Starting player draws 2 and is skipped
        const drawnCards = deckRef.current.splice(0, 2);
        hands[String(baseStartingPlayer)].push(...drawnCards);
        playerCardCounts[baseStartingPlayer] += drawnCards.length;
        const draw2Index = (baseIndex + 1) % turnOrder.length;
        initialTurn = turnOrder[draw2Index];
        break;
      }

      case 'wild':
      case 'wild-draw4':
        // Wild stays colorless
        break;

      default:
        // Number cards, no effect
        break;
    }

    return { initialTurn, initialDirection };
  }, []);

  const initializeGame = useCallback(() => {
    if (!doc || !myClientId || players.length < MIN_PLAYERS) return;
    
    // Defensive check: log warning if MAX_PLAYERS exceeded
    if (players.length > MAX_PLAYERS) {
      console.warn(`Game has ${players.length} players, exceeding MAX_PLAYERS (${MAX_PLAYERS})`);
    }

    // 1. Determine turn order from current player list order
    const turnOrder = players.map((p) => p.clientId);

    // 2. Build locked players list
    const lockedPlayers = players.map((p) => ({
      clientId: p.clientId,
      name: p.name,
    }));

    // 3. Prepare deck and deal cards
    const { deck, hands, playerCardCounts, firstCard } = prepareDeckAndDeal(lockedPlayers);
    deckRef.current = deck;

    // 4. Apply first card effects
    const { initialTurn, initialDirection } = applyFirstCardEffects(
      firstCard,
      turnOrder[0], // Start with first player in order
      turnOrder,
      hands,
      playerCardCounts
    );

    // 5. Update Yjs shared state in a single transaction
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

      // Initialize multi-round game state
      if (scoreLimit !== null) {
        const initialScores: Record<number, number> = {};
        for (const player of players) {
          initialScores[player.clientId] = 0;
        }
        gameStateMap.set('scores', initialScores);
        gameStateMap.set('currentRound', 1);
      }

      // Distribute hands via Yjs (each player reads only their own key)
      for (const [clientId, hand] of Object.entries(hands)) {
        dealtHandsMap.set(clientId, hand);
      }

      // Initialize actions map (clear any stale actions)
      actionsMap.clear();
    });
  }, [doc, myClientId, players, scoreLimit, prepareDeckAndDeal, applyFirstCardEffects]);

  const initializeRound = useCallback(() => {
    if (!doc || !myClientId) return;

    const gameStateMap = doc.getMap('gameState');
    const dealtHandsMap = doc.getMap('dealtHands');
    const actionsMap = doc.getMap('actions');

    // 1. Read preserved multi-round state
    const turnOrder = (gameStateMap.get('turnOrder') as number[]) || [];
    const lockedPlayers = (gameStateMap.get('lockedPlayers') as Array<{ clientId: number; name: string }>) || [];
    const currentRound = (gameStateMap.get('currentRound') as number) || 1;

    if (turnOrder.length < MIN_PLAYERS || lockedPlayers.length < MIN_PLAYERS) return;

    // 2. Prepare deck and deal cards
    const { deck, hands, playerCardCounts, firstCard } = prepareDeckAndDeal(lockedPlayers);
    deckRef.current = deck;

    // 3. Calculate starting player with rotation
    const newRound = currentRound + 1;
    const startingPlayerIndex = currentRound % turnOrder.length;
    const baseStartingPlayer = turnOrder[startingPlayerIndex];

    // 4. Apply first card effects
    const { initialTurn, initialDirection } = applyFirstCardEffects(
      firstCard,
      baseStartingPlayer,
      turnOrder,
      hands,
      playerCardCounts
    );

    // 5. Update Yjs shared state in a single transaction
    doc.transact(() => {
      gameStateMap.set('status', 'PLAYING');
      gameStateMap.set('currentTurn', initialTurn);
      gameStateMap.set('direction', initialDirection);
      gameStateMap.set('discardPile', [firstCard]);
      gameStateMap.set('playerCardCounts', playerCardCounts);
      gameStateMap.set('currentRound', newRound);
      gameStateMap.set('orphanHands', []); // Clear orphan hands
      // turnOrder and lockedPlayers are preserved (not modified)
      // scores are preserved (not modified)

      // Distribute hands via Yjs
      for (const [clientId, hand] of Object.entries(hands)) {
        dealtHandsMap.set(clientId, hand);
      }

      // Clear actions map
      actionsMap.clear();
    });
  }, [doc, myClientId, prepareDeckAndDeal, applyFirstCardEffects]);

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
      if (status !== 'PLAYING') return; // Don't process actions during LOBBY, PAUSED_WAITING_PLAYER, ROUND_ENDED, or ENDED

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
              if (scoreLimit === null) {
                // Single-round game: end immediately
                gameStateMap.set('status', 'ENDED');
                gameStateMap.set('winner', clientId);
                gameStateMap.set('endType', 'WIN');
              } else {
                // Multi-round game: calculate round score
                let roundPoints = 0;

                // Sum points from all opponents' hands
                for (const playerId of turnOrder) {
                  if (playerId === clientId) continue; // Skip winner
                  const opponentHand = (dealtHandsMap.get(String(playerId)) as Card[]) || [];
                  roundPoints += calculateHandPoints(opponentHand);
                }

                // Include orphan hands in scoring
                const orphanHands = (gameStateMap.get('orphanHands') as Array<{ originalClientId: number; originalName: string; cards: Card[] }>) || [];
                for (const orphan of orphanHands) {
                  roundPoints += calculateHandPoints(orphan.cards);
                }

                // Update winner's cumulative score
                const scores = (gameStateMap.get('scores') as Record<number, number>) || {};
                const newScore = (scores[clientId] || 0) + roundPoints;
                scores[clientId] = newScore;
                gameStateMap.set('scores', { ...scores });
                gameStateMap.set('lastRoundPoints', roundPoints);

                // Check if score limit reached
                if (newScore >= scoreLimit) {
                  gameStateMap.set('status', 'ENDED');
                  gameStateMap.set('winner', clientId);
                gameStateMap.set('endType', 'WIN');
                } else {
                  gameStateMap.set('status', 'ROUND_ENDED');
                  gameStateMap.set('winner', clientId);
                }
              }

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
  }, [doc, myClientId, isHost, scoreLimit]);

  return { initializeGame, initializeRound, deckRef };
};
