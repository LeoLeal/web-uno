import { describe, it, expect } from 'vitest';
import { calculateHandPoints } from './scoring';
import { Card } from './cards';

let cardIdCounter = 0;

const createCard = (card: Omit<Card, 'id'>): Card => ({
  id: `card-${cardIdCounter++}`,
  ...card,
});

describe('calculateHandPoints', () => {
  it('returns 0 for an empty hand', () => {
    expect(calculateHandPoints([])).toBe(0);
  });

  it('calculates points for number cards', () => {
    const hand: Card[] = [
      createCard({ color: 'red', symbol: '0' }),
      createCard({ color: 'blue', symbol: '5' }),
      createCard({ color: 'yellow', symbol: '9' }),
    ];
    // 0 + 5 + 9 = 14
    expect(calculateHandPoints(hand)).toBe(14);
  });

  it('calculates points for action cards', () => {
    const hand: Card[] = [
      createCard({ color: 'red', symbol: 'skip' }),
      createCard({ color: 'blue', symbol: 'reverse' }),
      createCard({ color: 'green', symbol: 'draw2' }),
    ];
    // 20 + 20 + 20 = 60
    expect(calculateHandPoints(hand)).toBe(60);
  });

  it('calculates points for wild cards', () => {
    const hand: Card[] = [
      createCard({ symbol: 'wild' }),
      createCard({ symbol: 'wild-draw4' }),
    ];
    // 50 + 50 = 100
    expect(calculateHandPoints(hand)).toBe(100);
  });

  it('calculates points for mixed hands', () => {
    const hand: Card[] = [
      createCard({ color: 'red', symbol: '3' }),
      createCard({ color: 'blue', symbol: '7' }),
      createCard({ color: 'yellow', symbol: 'skip' }),
      createCard({ color: 'green', symbol: 'reverse' }),
      createCard({ symbol: 'wild' }),
      createCard({ color: 'red', symbol: 'draw2' }),
      createCard({ symbol: 'wild-draw4' }),
    ];
    // 3 + 7 + 20 + 20 + 50 + 20 + 50 = 170
    expect(calculateHandPoints(hand)).toBe(170);
  });

  it('handles large hands correctly', () => {
    const hand: Card[] = [
      createCard({ color: 'red', symbol: '9' }),
      createCard({ color: 'red', symbol: '9' }),
      createCard({ color: 'red', symbol: '9' }),
      createCard({ color: 'red', symbol: '9' }),
      createCard({ color: 'blue', symbol: '8' }),
      createCard({ color: 'blue', symbol: '8' }),
      createCard({ color: 'yellow', symbol: 'skip' }),
      createCard({ color: 'green', symbol: 'draw2' }),
    ];
    // 9 + 9 + 9 + 9 + 8 + 8 + 20 + 20 = 92
    expect(calculateHandPoints(hand)).toBe(92);
  });
});
