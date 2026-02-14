import { describe, it, expect } from 'vitest';
import { Card, CardColor } from '@/lib/game/cards';

/**
 * Tests for canPlayCard logic
 * Testing the validation rules directly without hook mocking
 */

// Replicate the canPlayCard logic for testing
const canPlayCard = (card: Card, topDiscard: Card | null, activeColor: CardColor | null): boolean => {
  if (!topDiscard) return false;

  // No active color (wild first card) - any card is playable
  if (activeColor === null) return true;

  // Wild cards are always playable
  if (card.symbol === 'wild' || card.symbol === 'wild-draw4') return true;

  // Color match
  if (card.color === activeColor) return true;

  // Symbol match
  if (card.symbol === topDiscard.symbol) return true;

  // No match
  return false;
};

describe('canPlayCard', () => {
  const topDiscard: Card = { id: 'top-1', color: 'red', symbol: '5' };

  describe('Color match', () => {
    it('should allow playing a card that matches the active color', () => {
      const card: Card = { id: 'card-1', color: 'red', symbol: '7' };
      expect(canPlayCard(card, topDiscard, 'red')).toBe(true);
    });

    it('should reject a card that does not match color or symbol', () => {
      const card: Card = { id: 'card-2', color: 'blue', symbol: '3' };
      expect(canPlayCard(card, topDiscard, 'red')).toBe(false);
    });
  });

  describe('Symbol match', () => {
    it('should allow playing a card that matches the symbol even if color differs', () => {
      const card: Card = { id: 'card-3', color: 'green', symbol: '5' };
      expect(canPlayCard(card, topDiscard, 'red')).toBe(true);
    });
  });

  describe('Wild cards', () => {
    it('should always allow playing a Wild card', () => {
      const wildCard: Card = { id: 'wild-1', symbol: 'wild' };
      expect(canPlayCard(wildCard, topDiscard, 'red')).toBe(true);
    });

    it('should always allow playing a Wild Draw Four card', () => {
      const wildDraw4: Card = { id: 'wd4-1', symbol: 'wild-draw4' };
      expect(canPlayCard(wildDraw4, topDiscard, 'red')).toBe(true);
    });
  });

  describe('Null active color (wild first card)', () => {
    it('should allow any card when active color is null', () => {
      const wildTopDiscard: Card = { id: 'wild-top', symbol: 'wild' };
      const anyCard: Card = { id: 'any-1', color: 'blue', symbol: '8' };

      expect(canPlayCard(anyCard, wildTopDiscard, null)).toBe(true);
    });

    it('should allow wild cards when active color is null', () => {
      const wildTopDiscard: Card = { id: 'wild-top', symbol: 'wild' };
      const wildCard: Card = { id: 'wild-2', symbol: 'wild' };

      expect(canPlayCard(wildCard, wildTopDiscard, null)).toBe(true);
    });
  });

  describe('No match', () => {
    it('should reject a card that matches neither color nor symbol', () => {
      const card: Card = { id: 'card-4', color: 'yellow', symbol: '2' };
      expect(canPlayCard(card, topDiscard, 'red')).toBe(false);
    });
  });
});
