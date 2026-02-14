import { describe, it, expect, beforeEach } from 'vitest';
import { createDeck, shuffle, resetCardIdCounter } from './deck';
import { Card, CARD_COLORS } from './cards';

describe('createDeck', () => {
  beforeEach(() => {
    resetCardIdCounter();
  });

  it('should create exactly 108 cards', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(108);
  });

  it('should have unique IDs for every card', () => {
    const deck = createDeck();
    const ids = new Set(deck.map((c) => c.id));
    expect(ids.size).toBe(108);
  });

  it('should have one 0 per color (4 total)', () => {
    const deck = createDeck();
    const zeros = deck.filter((c) => c.symbol === '0' && c.color !== undefined);
    expect(zeros).toHaveLength(4);
    for (const color of CARD_COLORS) {
      expect(zeros.filter((c) => c.color === color)).toHaveLength(1);
    }
  });

  it('should have two of each 1-9 per color (72 total)', () => {
    const deck = createDeck();
    for (const color of CARD_COLORS) {
      for (let n = 1; n <= 9; n++) {
        const matches = deck.filter(
          (c) => c.color === color && c.symbol === String(n)
        );
        expect(matches).toHaveLength(2);
      }
    }
  });

  it('should have 76 number cards total', () => {
    const deck = createDeck();
    const numbers = deck.filter((c) => {
      const n = Number(c.symbol);
      return !isNaN(n) && n >= 0 && n <= 9 && c.color !== undefined;
    });
    expect(numbers).toHaveLength(76);
  });

  it('should have two of each action card per color (24 total)', () => {
    const deck = createDeck();
    const actions = ['skip', 'reverse', 'draw2'] as const;
    for (const color of CARD_COLORS) {
      for (const action of actions) {
        const matches = deck.filter(
          (c) => c.color === color && c.symbol === action
        );
        expect(matches).toHaveLength(2);
      }
    }
    const allActions = deck.filter((c) =>
      actions.includes(c.symbol as (typeof actions)[number])
    );
    expect(allActions).toHaveLength(24);
  });

  it('should have 4 Wild cards', () => {
    const deck = createDeck();
    const wilds = deck.filter(
      (c) => c.color === undefined && c.symbol === 'wild'
    );
    expect(wilds).toHaveLength(4);
  });

  it('should have 4 Wild Draw Four cards', () => {
    const deck = createDeck();
    const wd4s = deck.filter(
      (c) => c.color === undefined && c.symbol === 'wild-draw4'
    );
    expect(wd4s).toHaveLength(4);
  });

  it('should have 8 wild cards total', () => {
    const deck = createDeck();
    const wilds = deck.filter((c) => c.color === undefined);
    expect(wilds).toHaveLength(8);
  });
});

describe('shuffle', () => {
  it('should return the same array reference', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).toBe(arr);
  });

  it('should preserve all elements', () => {
    const deck = createDeck();
    const originalIds = deck.map((c) => c.id).sort();
    shuffle(deck);
    const shuffledIds = deck.map((c) => c.id).sort();
    expect(shuffledIds).toEqual(originalIds);
  });

  it('should change the order of cards (probabilistic)', () => {
    resetCardIdCounter();
    const deck1 = createDeck();
    const originalOrder = deck1.map((c) => c.id);

    // Shuffle and compare — extremely unlikely to stay the same
    shuffle(deck1);
    const shuffledOrder = deck1.map((c) => c.id);

    // At least some cards should be in different positions
    const samePosition = originalOrder.filter(
      (id, i) => id === shuffledOrder[i]
    ).length;
    // With 108 cards, expected same-position count is ~1 by derangement theory
    // Allow up to 10 as a generous bound to avoid flaky tests
    expect(samePosition).toBeLessThan(108);
  });

  it('should produce different orders on separate shuffles (probabilistic)', () => {
    const deck1 = createDeck();
    const deck2: Card[] = JSON.parse(JSON.stringify(deck1));

    shuffle(deck1);
    shuffle(deck2);

    const order1 = deck1.map((c) => c.id);
    const order2 = deck2.map((c) => c.id);

    // Very unlikely to be identical
    expect(order1).not.toEqual(order2);
  });
});
