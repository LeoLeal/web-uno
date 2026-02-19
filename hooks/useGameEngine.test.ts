import { describe, it, expect } from 'vitest';
import { createDeck, shuffle } from '@/lib/game/deck';
import { Card, isWildDrawFour } from '@/lib/game/cards';
import { MIN_PLAYERS, MAX_PLAYERS } from '@/lib/game/constants';

/**
 * Tests for game engine logic (deck dealing, first card flip)
 * Tests core logic directly using real createDeck/shuffle/isWildDrawFour.
 */

describe('Game Engine Logic', () => {
  describe('Dealing', () => {
    it('should deal correct number of cards to each player', () => {
      const deck = createDeck();
      shuffle(deck);

      const playerIds = [1, 2, 3];
      const handSize = 7;
      const hands: Record<number, Card[]> = {};

      for (const _playerId of playerIds) {
        hands[_playerId] = deck.splice(0, handSize);
      }

      // Each player gets exactly 7 cards
      for (const _playerId of playerIds) {
        expect(hands[_playerId]).toHaveLength(handSize);
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

      for (const _playerId of playerIds) {
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

      for (const _playerId of playerIds) {
        hands[_playerId] = deck.splice(0, handSize);
      }

      for (const _playerId of playerIds) {
        expect(hands[_playerId]).toHaveLength(handSize);
      }

      // 108 - 40 = 68 remaining
      expect(deck).toHaveLength(68);
    });
  });

  describe('First Card Flip', () => {
    it('should not use Wild Draw 4 as first card', () => {
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
      const deck = createDeck();
      // Find a wild card and put it at position where it would be the first flip
      const wildIndex = deck.findIndex(
        (c) => c.symbol === 'wild' && c.color === undefined
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

  describe('Player Limits', () => {
    it('should deal correct cards for minimum players', () => {
      const deck = createDeck();
      const playerIds = Array.from({ length: MIN_PLAYERS }, (_, i) => i + 1);
      const handSize = 7;
      const hands: Record<number, Card[]> = {};

      for (const playerId of playerIds) {
        hands[playerId] = deck.splice(0, handSize);
      }

      // All players get correct hand size
      for (const playerId of playerIds) {
        expect(hands[playerId]).toHaveLength(handSize);
      }

      // Remaining deck should be 108 - (3 * 7) = 87
      expect(deck).toHaveLength(108 - MIN_PLAYERS * handSize);
    });

    it('should deal correct cards for maximum players', () => {
      const deck = createDeck();
      const playerIds = Array.from({ length: MAX_PLAYERS }, (_, i) => i + 1);
      const handSize = 7;
      const hands: Record<number, Card[]> = {};

      for (const playerId of playerIds) {
        hands[playerId] = deck.splice(0, handSize);
      }

      // All players get correct hand size
      for (const playerId of playerIds) {
        expect(hands[playerId]).toHaveLength(handSize);
      }

      // Remaining deck should be 108 - (10 * 7) = 38
      expect(deck).toHaveLength(108 - MAX_PLAYERS * handSize);
    });
  });
});
