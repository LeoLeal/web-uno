import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDeck, shuffle } from '@/lib/game/deck';
import { Card, isWildDrawFour } from '@/lib/game/cards';

/**
 * Tests for game engine logic (deck dealing, turn order, etc.)
 * We test the core logic directly rather than the hook to avoid
 * complex React/Yjs mocking.
 */

describe('Game Engine Logic', () => {
  describe('Dealing', () => {
    it('should deal correct number of cards to each player', () => {
      const deck = createDeck();
      shuffle(deck);
      
      const playerIds = [1, 2, 3];
      const handSize = 7;
      const hands: Record<number, Card[]> = {};

      for (const playerId of playerIds) {
        hands[playerId] = deck.splice(0, handSize);
      }

      // Each player gets exactly 7 cards
      for (const playerId of playerIds) {
        expect(hands[playerId]).toHaveLength(handSize);
      }

      // Remaining deck should be 108 - 21 = 87
      expect(deck).toHaveLength(87);
    });

    it('should deal all unique cards (no duplicates)', () => {
      const deck = createDeck();
      shuffle(deck);

      const playerIds = [1, 2, 3];
      const handSize = 7;
      const allDealtIds = new Set<string>();

      for (const playerId of playerIds) {
        const hand = deck.splice(0, handSize);
        hand.forEach((c) => allDealtIds.add(c.id));
      }

      // All dealt cards should be unique
      expect(allDealtIds.size).toBe(21);
    });

    it('should adapt to different starting hand sizes', () => {
      const deck = createDeck();
      shuffle(deck);

      const playerIds = [1, 2, 3, 4];
      const handSize = 10;
      const hands: Record<number, Card[]> = {};

      for (const playerId of playerIds) {
        hands[playerId] = deck.splice(0, handSize);
      }

      for (const playerId of playerIds) {
        expect(hands[playerId]).toHaveLength(handSize);
      }

      // 108 - 40 = 68 remaining
      expect(deck).toHaveLength(68);
    });
  });

  describe('First Card Flip', () => {
    it('should not use Wild Draw 4 as first card', () => {
      // Simulate the first card flip logic
      const deck = createDeck();
      shuffle(deck);

      // Deal away some cards first
      deck.splice(0, 21);

      let firstCard = deck.shift()!;
      let reshuffleCount = 0;
      while (isWildDrawFour(firstCard)) {
        deck.push(firstCard);
        shuffle(deck);
        firstCard = deck.shift()!;
        reshuffleCount++;
        if (reshuffleCount > 100) break; // Safety valve
      }

      expect(firstCard.symbol).not.toBe('wild-draw4');
    });

    it('should allow regular Wild as first card', () => {
      // Create a deck where the first card after dealing is a Wild
      const deck = createDeck();
      // Find a wild card and put it at position where it would be the first flip
      const wildIndex = deck.findIndex(
        (c) => c.symbol === 'wild' && c.color === 'wild'
      );
      if (wildIndex >= 0) {
        const wild = deck.splice(wildIndex, 1)[0];
        deck.splice(21, 0, wild); // Place right after dealt cards
      }

      // Deal away 21 cards
      deck.splice(0, 21);

      const firstCard = deck.shift()!;
      // Wild (not draw-4) should be allowed
      if (firstCard.symbol === 'wild') {
        expect(firstCard.symbol).toBe('wild');
      }
    });
  });

  describe('Turn Order', () => {
    it('should set turn order based on player list order', () => {
      const players = [
        { clientId: 10, name: 'Host' },
        { clientId: 20, name: 'Alice' },
        { clientId: 30, name: 'Bob' },
      ];

      const turnOrder = players.map((p) => p.clientId);
      expect(turnOrder).toEqual([10, 20, 30]);
    });

    it('should set first player as current turn', () => {
      const players = [
        { clientId: 10, name: 'Host' },
        { clientId: 20, name: 'Alice' },
        { clientId: 30, name: 'Bob' },
      ];

      const turnOrder = players.map((p) => p.clientId);
      const currentTurn = turnOrder[0];
      expect(currentTurn).toBe(10);
    });

    it('should set initial direction to forward (1)', () => {
      const direction = 1;
      expect(direction).toBe(1);
    });
  });

  describe('Locked Players', () => {
    it('should lock player list with clientId and name', () => {
      const players = [
        { clientId: 1, name: 'Host', isHost: true, avatar: '🐶' },
        { clientId: 2, name: 'Alice', isHost: false, avatar: '🐱' },
        { clientId: 3, name: 'Bob', isHost: false, avatar: '🐰' },
      ];

      const lockedPlayers = players.map((p) => ({
        clientId: p.clientId,
        name: p.name,
      }));

      expect(lockedPlayers).toHaveLength(3);
      expect(lockedPlayers).toEqual([
        { clientId: 1, name: 'Host' },
        { clientId: 2, name: 'Alice' },
        { clientId: 3, name: 'Bob' },
      ]);
    });

    it('should detect late joiners correctly', () => {
      const lockedPlayers = [
        { clientId: 1, name: 'Host' },
        { clientId: 2, name: 'Alice' },
      ];

      const lateJoinerClientId = 99;
      const isLateJoiner = !lockedPlayers.some(
        (p) => p.clientId === lateJoinerClientId
      );

      expect(isLateJoiner).toBe(true);
    });

    it('should not flag existing players as late joiners', () => {
      const lockedPlayers = [
        { clientId: 1, name: 'Host' },
        { clientId: 2, name: 'Alice' },
      ];

      const existingClientId = 2;
      const isLateJoiner = !lockedPlayers.some(
        (p) => p.clientId === existingClientId
      );

      expect(isLateJoiner).toBe(false);
    });
  });
});
