/**
 * Game settings types, defaults, and descriptions for the Uno game.
 */

/** Valid starting hand sizes */
export const STARTING_HAND_SIZES = [5, 7, 10] as const;
export type StartingHandSize = (typeof STARTING_HAND_SIZES)[number];

/** Valid score limits (null = single round, Infinity = endless multi-round) */
export const SCORE_LIMITS = [null, 100, 200, 300, 500, Infinity] as const;
export type ScoreLimit = (typeof SCORE_LIMITS)[number];

/**
 * Game settings interface defining all configurable options.
 */
export interface GameSettings {
  /** Number of cards each player receives at game start */
  startingHandSize: StartingHandSize;
  /** Points needed to win. null = single round; Infinity = endless multi-round */
  scoreLimit: ScoreLimit;
  /** Allow stacking +2 and +4 cards instead of drawing */
  drawStacking: boolean;
  /** Allow playing identical card out of turn */
  jumpIn: boolean;
  /** When 0 is played, all hands rotate in direction of play */
  zeroSwap: boolean;
  /** When 7 is played, player may swap hands with another player */
  sevenSwap: boolean;
  /** Player must play if they have a valid card (cannot choose to draw) */
  forcePlay: boolean;
  /** Allow playing all matching cards at once in a single turn */
  multipleCardPlay: boolean;
}

/**
 * Default game settings representing standard Uno rules.
 */
export const DEFAULT_SETTINGS: GameSettings = {
  startingHandSize: 7,
  scoreLimit: null,
  drawStacking: false,
  jumpIn: false,
  zeroSwap: false,
  sevenSwap: false,
  forcePlay: false,
  multipleCardPlay: false,
};

/**
 * Human-readable descriptions for each setting (used in tooltips).
 */
export const SETTING_DESCRIPTIONS: Record<keyof GameSettings, string> = {
  startingHandSize: 'Number of cards each player is dealt at the start of the game.',
  scoreLimit:
    'Single Round ends when a player empties their hand. Numeric values end at that score. ∞ keeps rounds and cumulative scoring with no automatic end.',
  drawStacking:
    'Stack +2 and +4 cards instead of drawing. The next player who can\'t stack must draw all accumulated cards.',
  jumpIn:
    'Play an identical card (same color AND number) out of turn, even when it\'s not your turn.',
  zeroSwap: 'When a 0 is played, all players pass their hands in the direction of play.',
  sevenSwap: 'When a 7 is played, you may swap your hand with any other player.',
  forcePlay: 'If you have a playable card, you must play it. You cannot choose to draw instead.',
  multipleCardPlay:
    'Play all matching cards at once (same number, any colors) in a single turn.',
};

/** Setting keys that are boolean toggles */
export const BOOLEAN_SETTING_KEYS = [
  'drawStacking',
  'jumpIn',
  'zeroSwap',
  'sevenSwap',
  'forcePlay',
  'multipleCardPlay',
] as const;

export type BooleanSettingKey = (typeof BOOLEAN_SETTING_KEYS)[number];

/** Human-readable labels for boolean settings */
export const BOOLEAN_SETTING_LABELS: Record<BooleanSettingKey, string> = {
  drawStacking: 'Draw Stacking',
  jumpIn: 'Jump-In',
  zeroSwap: 'Zero Swap',
  sevenSwap: 'Seven Swap',
  forcePlay: 'Force Play',
  multipleCardPlay: 'Multiple Card Play',
};

/**
 * Set of house rule keys that have been implemented in the game engine.
 * Rules NOT in this set are shown as disabled in the settings modal.
 * Add a key here when its engine-side implementation is complete.
 */
export const IMPLEMENTED_RULES: ReadonlySet<BooleanSettingKey> = new Set<BooleanSettingKey>([
  'forcePlay',
]);

/**
 * Generate a human-readable summary string for settings.
 */
export const getSettingsSummary = (settings: GameSettings): string => {
  const parts: string[] = [];

  // 1. Stacking Status (Always explicit as requested)
  parts.push(settings.drawStacking ? 'Stacking' : 'No stacking');

  // 2. Other Active Rules
  if (settings.jumpIn) parts.push('Jump-In');
  if (settings.zeroSwap) parts.push('0-Swap');
  if (settings.sevenSwap) parts.push('7-Swap');
  if (settings.forcePlay) parts.push('Force Play');
  if (settings.multipleCardPlay) parts.push('Multi-Play');

  // 3. Hand Size
  parts.push(`${settings.startingHandSize} cards`);

  // 4. Score Limit
  if (settings.scoreLimit === null) {
    parts.push('Single Round');
  } else if (settings.scoreLimit === Infinity) {
    parts.push('∞');
  } else {
    parts.push(`${settings.scoreLimit} pts`);
  }

  return parts.join(' · ');
};
