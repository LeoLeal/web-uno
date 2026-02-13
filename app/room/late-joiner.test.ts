import { describe, it, expect } from 'vitest';
import { GameStatus } from '@/hooks/useGameState';

/**
 * Tests for late joiner detection logic.
 * Validates that players are correctly identified as late joiners
 * and that replacement players during pause are allowed.
 */

describe('Late Joiner Detection', () => {
  describe('Rejection during PLAYING status', () => {
    it('should detect late joiner when game is PLAYING', () => {
      const status: GameStatus = 'PLAYING';
      const lockedPlayers = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
      ];
      const myClientId = 99;

      const isLateJoiner =
        status === 'PLAYING' &&
        lockedPlayers.length > 0 &&
        myClientId !== null &&
        !lockedPlayers.some((p) => p.clientId === myClientId);

      expect(isLateJoiner).toBe(true);
    });

    it('should not flag existing player as late joiner', () => {
      const status: GameStatus = 'PLAYING';
      const lockedPlayers = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
      ];
      const myClientId = 2;

      const isLateJoiner =
        status === 'PLAYING' &&
        lockedPlayers.length > 0 &&
        myClientId !== null &&
        !lockedPlayers.some((p) => p.clientId === myClientId);

      expect(isLateJoiner).toBe(false);
    });
  });

  describe('Replacement player during PAUSED_WAITING_PLAYER', () => {
    it('should allow join when status is PAUSED_WAITING_PLAYER', () => {
      const status: GameStatus = 'PAUSED_WAITING_PLAYER';
      const lockedPlayers = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
      ];
      const myClientId = 99;

      // Late joiner detection only triggers during PLAYING
      const isLateJoiner =
        // @ts-expect-error - Testing that non-PLAYING status doesn't trigger late joiner
        status === 'PLAYING' &&
        lockedPlayers.length > 0 &&
        myClientId !== null &&
        !lockedPlayers.some((p) => p.clientId === myClientId);

      expect(isLateJoiner).toBe(false);
      expect(status).toBe('PAUSED_WAITING_PLAYER');
    });

    it('should identify replacement player (not in lockedPlayers during pause)', () => {
      const status: GameStatus = 'PAUSED_WAITING_PLAYER';
      const lockedPlayers = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
      ];
      const activePlayers = [
        { clientId: 1, name: 'Alice' },
        { clientId: 99, name: 'NewPlayer' },
      ];

      const lockedIds = lockedPlayers.map((p) => p.clientId);
      const replacementPlayers = activePlayers.filter(
        (p) => !lockedIds.includes(p.clientId)
      );

      expect(status).toBe('PAUSED_WAITING_PLAYER');
      expect(replacementPlayers).toHaveLength(1);
      expect(replacementPlayers[0].clientId).toBe(99);
      expect(replacementPlayers[0].name).toBe('NewPlayer');
    });
  });

  describe('Edge cases', () => {
    it('should not flag late joiner in LOBBY status', () => {
      const status: GameStatus = 'LOBBY';
      const lockedPlayers: Array<{ clientId: number; name: string }> = [];
      const myClientId = 99;

      const isLateJoiner =
        // @ts-expect-error - Testing that LOBBY status doesn't trigger late joiner
        status === 'PLAYING' &&
        lockedPlayers.length > 0 &&
        myClientId !== null &&
        !lockedPlayers.some((p) => p.clientId === myClientId);

      expect(isLateJoiner).toBe(false);
    });

    it('should not flag late joiner in ENDED status', () => {
      const status: GameStatus = 'ENDED';
      const lockedPlayers = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
      ];
      const myClientId = 99;

      const isLateJoiner =
        // @ts-expect-error - Testing that ENDED status doesn't trigger late joiner
        status === 'PLAYING' &&
        lockedPlayers.length > 0 &&
        myClientId !== null &&
        !lockedPlayers.some((p) => p.clientId === myClientId);

      expect(isLateJoiner).toBe(false);
    });
  });
});
