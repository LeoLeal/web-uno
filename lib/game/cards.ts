/**
 * Core card types for the Uno game.
 * Canonical source of truth for Card, CardColor, and CardSymbol types.
 */

export const CARD_COLORS = ['red', 'blue', 'green', 'yellow'] as const;
export type CardColor = (typeof CARD_COLORS)[number];

export const CARD_SYMBOLS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'skip', 'reverse', 'draw2',
  'wild', 'wild-draw4',
] as const;
export type CardSymbol = (typeof CARD_SYMBOLS)[number];

/** Number symbols (0-9) */
export const NUMBER_SYMBOLS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
export type NumberSymbol = (typeof NUMBER_SYMBOLS)[number];

/** Action symbols (skip, reverse, draw2) */
export const ACTION_SYMBOLS = ['skip', 'reverse', 'draw2'] as const;
export type ActionSymbol = (typeof ACTION_SYMBOLS)[number];

/** Wild symbols */
export const WILD_SYMBOLS = ['wild', 'wild-draw4'] as const;
export type WildSymbol = (typeof WILD_SYMBOLS)[number];

/**
 * A single Uno card.
 * Wild cards have no color until played (color is undefined in deck/hand).
 */
export interface Card {
  /** Unique identifier for tracking this specific card */
  id: string;
  /** Card color ('red' | 'blue' | 'green' | 'yellow'). Undefined for unplayed wild cards. */
  color?: CardColor;
  /** Card symbol ('0'-'9', 'skip', 'reverse', 'draw2', 'wild', 'wild-draw4') */
  symbol: CardSymbol;
}

/**
 * Checks if a card is a wild card (Wild or Wild Draw 4).
 */
export const isWildCard = (card: Card): boolean =>
  card.symbol === 'wild' || card.symbol === 'wild-draw4';

/**
 * Checks if a card is a Wild Draw 4 specifically.
 */
export const isWildDrawFour = (card: Card): boolean =>
  card.symbol === 'wild-draw4';

/**
 * Checks if a card is an action card (Skip, Reverse, Draw Two).
 */
export const isActionCard = (card: Card): boolean =>
  card.symbol === 'skip' || card.symbol === 'reverse' || card.symbol === 'draw2';

/**
 * Checks if a card is a number card (0-9).
 */
export const isNumberCard = (card: Card): boolean =>
  Number(card.symbol) >= 0 && Number(card.symbol) <= 9 && !isNaN(Number(card.symbol));

/**
 * Checks if a card can be played against the current top discard card.
 * Pure function shared by host validation and client pre-validation.
 */
export const isCardPlayable = (card: Card, topDiscard: Card | null): boolean => {
  if (!topDiscard) return false;

  const activeColor = topDiscard.color ?? null;

  // No active color (wild first card) — any card is playable
  if (activeColor === null) return true;

  // Wild cards are always playable
  if (isWildCard(card)) return true;

  // Color match
  if (card.color === activeColor) return true;

  // Symbol match
  if (card.symbol === topDiscard.symbol) return true;

  return false;
};

/**
 * Checks if a player's hand contains any playable card against the top discard.
 * Used by Force Play rule to determine if drawing is allowed.
 */
export const hasPlayableCard = (hand: Card[], topDiscard: Card | null): boolean =>
  hand.some((card) => isCardPlayable(card, topDiscard));

/**
 * Player action types for the action queue system.
 * Peers submit actions to the host for validation and execution.
 */
export type PlayerAction =
  | { type: 'PLAY_CARD'; cardId: string; chosenColor?: CardColor }
  | { type: 'DRAW_CARD' };
