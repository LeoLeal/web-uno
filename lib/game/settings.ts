/**
 * Game settings types, defaults, and descriptions for the Uno game.
 */

/** Valid starting hand sizes */
export const STARTING_HAND_SIZES = [5, 7, 10] as const;
export type StartingHandSize = (typeof STARTING_HAND_SIZES)[number];

/** Valid score limits (null = single round / no limit) */
export const SCORE_LIMITS = [100, 200, 300, 500, null] as const;
export type ScoreLimit = (typeof SCORE_LIMITS)[number];

/**
 * Game settings interface defining all configurable options.
 */
export interface GameSettings {
  /** Number of cards each player receives at game start */
  startingHandSize: StartingHandSize;
  /** Points needed to win. null = single round (first to empty hand wins) */
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
    'First player to reach this score wins. ∞ means single round—first to empty their hand wins.',
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
 * Generate a human-readable summary string for settings.
 */
export const getSettingsSummary = (settings: GameSettings): string => {
  const parts: string[] = [];

  // Check if using standard rules (all booleans off)
  const hasCustomRules = BOOLEAN_SETTING_KEYS.some((key) => settings[key]);

  if (hasCustomRules) {
    // List active rules
    const activeRules: string[] = [];
    if (settings.drawStacking) activeRules.push('Stacking');
    if (settings.jumpIn) activeRules.push('Jump-In');
    if (settings.zeroSwap) activeRules.push('0-Swap');
    if (settings.sevenSwap) activeRules.push('7-Swap');
    if (settings.forcePlay) activeRules.push('Force Play');
    if (settings.multipleCardPlay) activeRules.push('Multi-Play');

    if (activeRules.length <= 2) {
      parts.push(activeRules.join(', '));
    } else {
      parts.push(`${activeRules.length} rules enabled`);
    }
  } else {
    parts.push('Standard rules');
  }

  // Add hand size
  parts.push(`${settings.startingHandSize} cards`);

  // Add score limit if not default
  if (settings.scoreLimit !== null) {
    parts.push(`${settings.scoreLimit} pts`);
  }

  return parts.join(' · ');
};
