import { describe, it, expect } from 'vitest';
import { calculateHandPoints } from './scoring';
import { Card } from './cards';

describe('calculateHandPoints', () => {
  it('returns 0 for an empty hand', () => {
    expect(calculateHandPoints([])).toBe(0);
  });

  it('calculates points for number cards', () => {
    const hand: Card[] = [
      { color: 'red', symbol: '0' },
      { color: 'blue', symbol: '5' },
      { color: 'yellow', symbol: '9' },
    ];
    // 0 + 5 + 9 = 14
    expect(calculateHandPoints(hand)).toBe(14);
  });

  it('calculates points for action cards', () => {
    const hand: Card[] = [
      { color: 'red', symbol: 'skip' },
      { color: 'blue', symbol: 'reverse' },
      { color: 'green', symbol: 'draw2' },
    ];
    // 20 + 20 + 20 = 60
    expect(calculateHandPoints(hand)).toBe(60);
  });

  it('calculates points for wild cards', () => {
    const hand: Card[] = [
      { color: 'wild', symbol: 'wild' },
      { color: 'wild', symbol: 'wild-draw4' },
    ];
    // 50 + 50 = 100
    expect(calculateHandPoints(hand)).toBe(100);
  });

  it('calculates points for mixed hands', () => {
    const hand: Card[] = [
      { color: 'red', symbol: '3' },
      { color: 'blue', symbol: '7' },
      { color: 'yellow', symbol: 'skip' },
      { color: 'green', symbol: 'reverse' },
      { color: 'wild', symbol: 'wild' },
      { color: 'red', symbol: 'draw2' },
      { color: 'wild', symbol: 'wild-draw4' },
    ];
    // 3 + 7 + 20 + 20 + 50 + 20 + 50 = 170
    expect(calculateHandPoints(hand)).toBe(170);
  });

  it('handles large hands correctly', () => {
    const hand: Card[] = [
      { color: 'red', symbol: '9' },
      { color: 'red', symbol: '9' },
      { color: 'red', symbol: '9' },
      { color: 'red', symbol: '9' },
      { color: 'blue', symbol: '8' },
      { color: 'blue', symbol: '8' },
      { color: 'yellow', symbol: 'skip' },
      { color: 'green', symbol: 'draw2' },
    ];
    // 9 + 9 + 9 + 9 + 8 + 8 + 20 + 20 = 92
    expect(calculateHandPoints(hand)).toBe(92);
  });
});
