import { Card } from './cards';

/**
 * Calculate the total point value of a hand of cards for Uno scoring.
 *
 * Point values:
 * - Number cards (0-9): face value
 * - Skip, Reverse, Draw Two: 20 points each
 * - Wild, Wild Draw Four: 50 points each
 *
 * @param cards - Array of cards in a player's hand
 * @returns Total point value of the hand
 */
export function calculateHandPoints(cards: Card[]): number {
  return cards.reduce((sum, card) => {
    const symbol = card.symbol;

    // Number cards: face value
    const numValue = parseInt(symbol, 10);
    if (!isNaN(numValue)) {
      return sum + numValue;
    }

    // Action cards: 20 points
    if (symbol === 'skip' || symbol === 'reverse' || symbol === 'draw2') {
      return sum + 20;
    }

    // Wild cards: 50 points
    if (symbol === 'wild' || symbol === 'wild-draw4') {
      return sum + 50;
    }

    return sum;
  }, 0);
}
