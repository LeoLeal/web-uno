/**
 * Game constants for player limits and related configuration.
 * Centralized source of truth for player count constraints.
 */

/** Minimum number of players required to start a game */
export const MIN_PLAYERS = 3;

/** Maximum number of players allowed in a game */
export const MAX_PLAYERS = 10;

/** Human-readable messages for player limit scenarios */
export const PLAYER_LIMIT_MESSAGES = {
  /** Message shown when waiting for more players to reach minimum */
  waitingForPlayers: (current: number): string =>
    `Waiting for players (${current}/${MIN_PLAYERS})`,
  
  /** Message shown when game is at maximum capacity */
  tooManyPlayers: (current: number): string =>
    `Too many players (${current}/${MAX_PLAYERS} max)`,
  
  /** Message shown when game is full and new players cannot join */
  gameFull: `This game is full (${MAX_PLAYERS}/${MAX_PLAYERS} players)`,
  
  /** Suggestion shown when game is full */
  tryNewGame: 'Try creating a new game',
  
  /** Message shown when game ends due to insufficient players */
  insufficientPlayers: 'Not enough players to continue',
} as const;

/** Valid end types for game completion */
export type EndType = 'WIN' | 'INSUFFICIENT_PLAYERS';
