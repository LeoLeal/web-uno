import { describe, it, expect } from 'vitest';
import {
  isWildCard,
  isWildDrawFour,
  isActionCard,
  isNumberCard,
  isCardPlayable,
  hasPlayableCard,
  Card,
} from './cards';

describe('Card predicates', () => {
  describe('isWildCard', () => {
    it('should return true for wild', () => {
      const card: Card = { id: '1', symbol: 'wild' };
      expect(isWildCard(card)).toBe(true);
    });

    it('should return true for wild-draw4', () => {
      const card: Card = { id: '2', symbol: 'wild-draw4' };
      expect(isWildCard(card)).toBe(true);
    });

    it('should return false for number cards', () => {
      const card: Card = { id: '3', color: 'red', symbol: '5' };
      expect(isWildCard(card)).toBe(false);
    });

    it('should return false for action cards', () => {
      const card: Card = { id: '4', color: 'blue', symbol: 'skip' };
      expect(isWildCard(card)).toBe(false);
    });
  });

  describe('isWildDrawFour', () => {
    it('should return true for wild-draw4', () => {
      const card: Card = { id: '1', symbol: 'wild-draw4' };
      expect(isWildDrawFour(card)).toBe(true);
    });

    it('should return false for regular wild', () => {
      const card: Card = { id: '2', symbol: 'wild' };
      expect(isWildDrawFour(card)).toBe(false);
    });

    it('should return false for non-wild cards', () => {
      const card: Card = { id: '3', color: 'green', symbol: 'draw2' };
      expect(isWildDrawFour(card)).toBe(false);
    });
  });

  describe('isActionCard', () => {
    it('should return true for skip', () => {
      const card: Card = { id: '1', color: 'red', symbol: 'skip' };
      expect(isActionCard(card)).toBe(true);
    });

    it('should return true for reverse', () => {
      const card: Card = { id: '2', color: 'blue', symbol: 'reverse' };
      expect(isActionCard(card)).toBe(true);
    });

    it('should return true for draw2', () => {
      const card: Card = { id: '3', color: 'green', symbol: 'draw2' };
      expect(isActionCard(card)).toBe(true);
    });

    it('should return false for number cards', () => {
      const card: Card = { id: '4', color: 'yellow', symbol: '9' };
      expect(isActionCard(card)).toBe(false);
    });

    it('should return false for wild cards', () => {
      const card: Card = { id: '5', symbol: 'wild' };
      expect(isActionCard(card)).toBe(false);
    });
  });

  describe('isNumberCard', () => {
    it('should return true for 0', () => {
      const card: Card = { id: '1', color: 'red', symbol: '0' };
      expect(isNumberCard(card)).toBe(true);
    });

    it('should return true for 9', () => {
      const card: Card = { id: '2', color: 'blue', symbol: '9' };
      expect(isNumberCard(card)).toBe(true);
    });

    it('should return true for middle numbers', () => {
      const card: Card = { id: '3', color: 'green', symbol: '5' };
      expect(isNumberCard(card)).toBe(true);
    });

    it('should return false for skip', () => {
      const card: Card = { id: '4', color: 'red', symbol: 'skip' };
      expect(isNumberCard(card)).toBe(false);
    });

    it('should return false for reverse', () => {
      const card: Card = { id: '5', color: 'blue', symbol: 'reverse' };
      expect(isNumberCard(card)).toBe(false);
    });

    it('should return false for draw2', () => {
      const card: Card = { id: '6', color: 'green', symbol: 'draw2' };
      expect(isNumberCard(card)).toBe(false);
    });

    it('should return false for wild', () => {
      const card: Card = { id: '7', symbol: 'wild' };
      expect(isNumberCard(card)).toBe(false);
    });

    it('should return false for wild-draw4', () => {
      const card: Card = { id: '8', symbol: 'wild-draw4' };
      expect(isNumberCard(card)).toBe(false);
    });
  });
});

describe('isCardPlayable', () => {
  it('should return false when topDiscard is null', () => {
    const card: Card = { id: '1', color: 'red', symbol: '5' };
    expect(isCardPlayable(card, null)).toBe(false);
  });

  it('should return true when topDiscard has no color (wild first card)', () => {
    const card: Card = { id: '1', color: 'blue', symbol: '3' };
    const topDiscard: Card = { id: 'd', symbol: 'wild' };
    expect(isCardPlayable(card, topDiscard)).toBe(true);
  });

  it('should return true for wild cards regardless of top discard', () => {
    const wild: Card = { id: '1', symbol: 'wild' };
    const wildDraw4: Card = { id: '2', symbol: 'wild-draw4' };
    const topDiscard: Card = { id: 'd', color: 'red', symbol: '5' };
    expect(isCardPlayable(wild, topDiscard)).toBe(true);
    expect(isCardPlayable(wildDraw4, topDiscard)).toBe(true);
  });

  it('should return true when card color matches top discard', () => {
    const card: Card = { id: '1', color: 'red', symbol: '9' };
    const topDiscard: Card = { id: 'd', color: 'red', symbol: '5' };
    expect(isCardPlayable(card, topDiscard)).toBe(true);
  });

  it('should return true when card symbol matches top discard', () => {
    const card: Card = { id: '1', color: 'blue', symbol: '5' };
    const topDiscard: Card = { id: 'd', color: 'red', symbol: '5' };
    expect(isCardPlayable(card, topDiscard)).toBe(true);
  });

  it('should return false when neither color nor symbol matches', () => {
    const card: Card = { id: '1', color: 'blue', symbol: '9' };
    const topDiscard: Card = { id: 'd', color: 'red', symbol: '5' };
    expect(isCardPlayable(card, topDiscard)).toBe(false);
  });

  it('should return true for action card with matching color', () => {
    const card: Card = { id: '1', color: 'blue', symbol: 'skip' };
    const topDiscard: Card = { id: 'd', color: 'blue', symbol: '3' };
    expect(isCardPlayable(card, topDiscard)).toBe(true);
  });

  it('should return true for action card with matching symbol', () => {
    const card: Card = { id: '1', color: 'green', symbol: 'skip' };
    const topDiscard: Card = { id: 'd', color: 'red', symbol: 'skip' };
    expect(isCardPlayable(card, topDiscard)).toBe(true);
  });
});

describe('hasPlayableCard', () => {
  const topDiscard: Card = { id: 'd', color: 'red', symbol: '5' };

  it('should return false for an empty hand', () => {
    expect(hasPlayableCard([], topDiscard)).toBe(false);
  });

  it('should return false when no card in hand is playable', () => {
    const hand: Card[] = [
      { id: '1', color: 'blue', symbol: '9' },
      { id: '2', color: 'green', symbol: '3' },
    ];
    expect(hasPlayableCard(hand, topDiscard)).toBe(false);
  });

  it('should return true when at least one card is playable by color', () => {
    const hand: Card[] = [
      { id: '1', color: 'blue', symbol: '9' },
      { id: '2', color: 'red', symbol: '7' },
    ];
    expect(hasPlayableCard(hand, topDiscard)).toBe(true);
  });

  it('should return true when at least one card is playable by symbol', () => {
    const hand: Card[] = [
      { id: '1', color: 'blue', symbol: '9' },
      { id: '2', color: 'green', symbol: '5' },
    ];
    expect(hasPlayableCard(hand, topDiscard)).toBe(true);
  });

  it('should return true when a wild card is in hand', () => {
    const hand: Card[] = [
      { id: '1', color: 'blue', symbol: '9' },
      { id: '2', symbol: 'wild' },
    ];
    expect(hasPlayableCard(hand, topDiscard)).toBe(true);
  });

  it('should return false when topDiscard is null', () => {
    const hand: Card[] = [{ id: '1', color: 'red', symbol: '5' }];
    expect(hasPlayableCard(hand, null)).toBe(false);
  });
});
