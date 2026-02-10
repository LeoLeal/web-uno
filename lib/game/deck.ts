/**
 * Deck creation and shuffling utilities for Uno.
 * Produces a standard 108-card Uno deck.
 */

import {
  Card,
  CARD_COLORS,
  NUMBER_SYMBOLS,
  ACTION_SYMBOLS,
  NumberSymbol,
  ActionSymbol,
} from './cards';

let nextCardId = 0;

/** Generate a unique card ID */
const generateId = (): string => `card-${nextCardId++}`;

/** Reset the ID counter (useful for tests) */
export const resetCardIdCounter = (): void => {
  nextCardId = 0;
};

/**
 * Create a standard 108-card Uno deck.
 *
 * Composition:
 * - 76 number cards: one 0 per color, two of 1-9 per color
 * - 24 action cards: two each of Skip, Reverse, Draw Two per color
 * - 4 Wild cards
 * - 4 Wild Draw Four cards
 */
export const createDeck = (): Card[] => {
  const deck: Card[] = [];

  // Number cards: one 0 per color, two of 1-9 per color
  for (const color of CARD_COLORS) {
    // One 0 per color
    deck.push({ id: generateId(), color, symbol: '0' });

    // Two of each 1-9 per color
    for (const symbol of NUMBER_SYMBOLS.filter((s): s is NumberSymbol => s !== '0')) {
      deck.push({ id: generateId(), color, symbol });
      deck.push({ id: generateId(), color, symbol });
    }

    // Two of each action card per color
    for (const symbol of ACTION_SYMBOLS) {
      deck.push({ id: generateId(), color, symbol: symbol as ActionSymbol });
      deck.push({ id: generateId(), color, symbol: symbol as ActionSymbol });
    }
  }

  // 4 Wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({ id: generateId(), color: 'wild', symbol: 'wild' });
  }

  // 4 Wild Draw Four cards
  for (let i = 0; i < 4; i++) {
    deck.push({ id: generateId(), color: 'wild', symbol: 'wild-draw4' });
  }

  return deck;
};

/**
 * Fisher-Yates shuffle (in-place, mutates the array).
 * Returns the same array reference.
 */
export const shuffle = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Create a shuffled deck ready for play.
 */
export const createShuffledDeck = (): Card[] => shuffle(createDeck());
