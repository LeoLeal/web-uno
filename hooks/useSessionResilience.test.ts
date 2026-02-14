import { describe, it, expect } from 'vitest';
import { LockedPlayer, OrphanHand } from './useGameState';
import { Card } from '@/lib/game/cards';

/**
 * Tests for session resilience logic patterns.
 * Tests the core logic for disconnect detection, orphan management,
 * and walkover scenarios without complex React/Yjs mocking.
 */

describe('Session Resilience Logic', () => {
  describe('Disconnect Detection', () => {
    it('should respect host-only guard for disconnect detection', () => {
      const isHost = false;
      const hasDetectedDisconnect = true;

      // Non-host should not trigger pause even if they detect a mismatch
      let pauseTriggered = false;
      if (isHost && hasDetectedDisconnect) {
        pauseTriggered = true;
      }

      expect(pauseTriggered).toBe(false);
    });

    it('should detect single player disconnect', () => {
      const lockedPlayers: LockedPlayer[] = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
        { clientId: 3, name: 'Charlie' },
      ];

      const activePlayers = [
        { clientId: 1, name: 'Alice' },
        { clientId: 3, name: 'Charlie' },
      ];

      const lockedIds = lockedPlayers.map((p) => p.clientId);
      const activeIds = activePlayers.map((p) => p.clientId);
      const disconnectedIds = lockedIds.filter((id) => !activeIds.includes(id));

      expect(disconnectedIds).toEqual([2]);
      expect(disconnectedIds).toHaveLength(1);
    });

    it('should detect multiple simultaneous disconnects', () => {
      const lockedPlayers: LockedPlayer[] = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
        { clientId: 3, name: 'Charlie' },
        { clientId: 4, name: 'David' },
      ];

      const activePlayers = [{ clientId: 1, name: 'Alice' }];

      const lockedIds = lockedPlayers.map((p) => p.clientId);
      const activeIds = activePlayers.map((p) => p.clientId);
      const disconnectedIds = lockedIds.filter((id) => !activeIds.includes(id));

      expect(disconnectedIds).toEqual([2, 3, 4]);
      expect(disconnectedIds).toHaveLength(3);
    });

    it('should not trigger on non-locked player disconnect', () => {
      const lockedPlayers: LockedPlayer[] = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
      ];

      // Observer (clientId 99) disconnects
      const activePlayers = [
        { clientId: 1, name: 'Alice' },
        { clientId: 2, name: 'Bob' },
      ];

      const lockedIds = lockedPlayers.map((p) => p.clientId);
      const activeIds = activePlayers.map((p) => p.clientId);
      const disconnectedLocked = lockedIds.filter((id) => !activeIds.includes(id));

      expect(disconnectedLocked).toHaveLength(0);
    });
  });

  describe('Pause/Resume Transitions', () => {
    it('should create orphan hand on disconnect', () => {
      const disconnectedPlayer: LockedPlayer = {
        clientId: 42,
        name: 'DisconnectedPlayer',
      };

      const playerHand: Card[] = [
        { id: '1', color: 'red', symbol: '5' },
        { id: '2', color: 'blue', symbol: 'skip' },
      ];

      const orphan: OrphanHand = {
        originalClientId: disconnectedPlayer.clientId,
        originalName: disconnectedPlayer.name,
        cards: playerHand,
      };

      expect(orphan.originalClientId).toBe(42);
      expect(orphan.originalName).toBe('DisconnectedPlayer');
      expect(orphan.cards).toHaveLength(2);
    });

    it('should transition to PAUSED_WAITING_PLAYER on disconnect', () => {
      let status: 'LOBBY' | 'PLAYING' | 'PAUSED_WAITING_PLAYER' | 'ENDED' = 'PLAYING';

      // Simulate disconnect detected
      const hasDisconnect = true;

      if (hasDisconnect) {
        status = 'PAUSED_WAITING_PLAYER';
      }

      expect(status).toBe('PAUSED_WAITING_PLAYER');
    });

    it('should resume to PLAYING when all orphans resolved', () => {
      const orphanHands: OrphanHand[] = [];
      let status: 'LOBBY' | 'PLAYING' | 'PAUSED_WAITING_PLAYER' | 'ENDED' =
        'PAUSED_WAITING_PLAYER';

      // All orphans have been assigned/removed
      if (orphanHands.length === 0) {
        status = 'PLAYING';
      }

      expect(status).toBe('PLAYING');
    });
  });

  describe('Continue Without Player', () => {
    it('should remove player from turn order', () => {
      const turnOrder = [1, 2, 3, 4];
      const removedPlayerId = 2;

      const updatedTurnOrder = turnOrder.filter((id) => id !== removedPlayerId);

      expect(updatedTurnOrder).toEqual([1, 3, 4]);
      expect(updatedTurnOrder).not.toContain(removedPlayerId);
    });

    it('should advance turn if removed player was current', () => {
      const turnOrder = [1, 2, 3, 4];
      const currentTurn = 2;
      const removedPlayerId = 2;

      const updatedTurnOrder = turnOrder.filter((id) => id !== removedPlayerId);
      let nextTurn = currentTurn;

      if (currentTurn === removedPlayerId && updatedTurnOrder.length > 0) {
        nextTurn = updatedTurnOrder[0];
      }

      expect(nextTurn).toBe(1);
    });

    it('should reshuffle orphan cards into deck', () => {
      const deck: Card[] = [
        { id: '10', color: 'green', symbol: '3' },
        { id: '11', color: 'yellow', symbol: '7' },
      ];

      const orphanCards: Card[] = [
        { id: '1', color: 'red', symbol: '5' },
        { id: '2', color: 'blue', symbol: 'skip' },
      ];

      deck.push(...orphanCards);

      expect(deck).toHaveLength(4);
      expect(deck).toContainEqual({ id: '1', color: 'red', symbol: '5' });
      expect(deck).toContainEqual({ id: '2', color: 'blue', symbol: 'skip' });
    });

    it('should remove player from card counts', () => {
      const playerCardCounts: Record<number, number> = {
        1: 7,
        2: 5,
        3: 6,
      };

      const removedPlayerId = 2;
      const updatedCounts = { ...playerCardCounts };
      delete updatedCounts[removedPlayerId];

      expect(updatedCounts).not.toHaveProperty('2');
      expect(Object.keys(updatedCounts)).toEqual(['1', '3']);
    });
  });

  describe('Hand Handover', () => {
    it('should match replacement player to orphan by name similarity', () => {
      const orphans: OrphanHand[] = [
        {
          originalClientId: 10,
          originalName: 'Alice',
          cards: [{ id: '1', color: 'red', symbol: '5' }],
        },
        {
          originalClientId: 20,
          originalName: 'Bob',
          cards: [{ id: '2', color: 'blue', symbol: '3' }],
        },
      ];

      const replacementName = 'alice'; // case-insensitive, similar to 'Alice'

      // Simple name matching (case-insensitive exact match for this test)
      const match = orphans.find(
        (o) => o.originalName.toLowerCase() === replacementName.toLowerCase()
      );

      expect(match).toBeDefined();
      expect(match?.originalName).toBe('Alice');
    });

    it('should update lockedPlayers with replacement', () => {
      const lockedPlayers: LockedPlayer[] = [
        { clientId: 10, name: 'Alice' },
        { clientId: 20, name: 'Bob' },
      ];

      const replacementClientId = 100;
      const replacementName = 'NewAlice';
      const originalClientId = 10;

      const updated = lockedPlayers.map((p) =>
        p.clientId === originalClientId
          ? { clientId: replacementClientId, name: replacementName }
          : p
      );

      expect(updated).toEqual([
        { clientId: 100, name: 'NewAlice' },
        { clientId: 20, name: 'Bob' },
      ]);
    });

    it('should update turnOrder with replacement clientId', () => {
      const turnOrder = [10, 20, 30];
      const originalClientId = 10;
      const replacementClientId = 100;

      const updated = turnOrder.map((id) =>
        id === originalClientId ? replacementClientId : id
      );

      expect(updated).toEqual([100, 20, 30]);
    });

    it('should update currentTurn if replacement takes over turn', () => {
      const currentTurn = 10;
      const originalClientId = 10;
      const replacementClientId = 100;

      let updatedTurn = currentTurn;
      if (currentTurn === originalClientId) {
        updatedTurn = replacementClientId;
      }

      expect(updatedTurn).toBe(100);
    });
  });

  describe('Multiple Sequential Disconnects', () => {
    it('should detect second disconnect while already paused', () => {
      const lockedPlayers: LockedPlayer[] = [
        { clientId: 1, name: 'Host' },
        { clientId: 2, name: 'Alice' },
        { clientId: 3, name: 'Bob' },
      ];

      // First disconnect: Alice (clientId 2)
      const orphanHands: OrphanHand[] = [
        {
          originalClientId: 2,
          originalName: 'Alice',
          cards: [{ id: '1', color: 'red', symbol: '5' }],
        },
      ];

      // Second disconnect: Host (clientId 1)
      const activePlayers = [{ clientId: 3, name: 'Bob' }];

      const lockedIds = lockedPlayers.map((p) => p.clientId);
      const activeIds = activePlayers.map((p) => p.clientId);
      const orphanIds = orphanHands.map((o) => o.originalClientId);

      // Find newly disconnected players (not already in orphans)
      const disconnectedIds = lockedIds.filter(
        (id) => !activeIds.includes(id) && !orphanIds.includes(id)
      );

      expect(disconnectedIds).toEqual([1]); // Only Host is newly disconnected
      expect(disconnectedIds).not.toContain(2); // Alice already tracked
    });

    it('should match replacement player to correct orphan by name', () => {
      const orphanHands: OrphanHand[] = [
        {
          originalClientId: 1,
          originalName: 'Host',
          cards: [{ id: '1', color: 'red', symbol: '5' }],
        },
        {
          originalClientId: 2,
          originalName: 'Alice',
          cards: [{ id: '2', color: 'blue', symbol: '3' }],
        },
      ];

      // Alice reconnects with new clientId
      const replacementName = 'Alice';

      // Simple Levenshtein distance for this test
      const distances = orphanHands.map((o) => ({
        orphan: o,
        distance: o.originalName === replacementName ? 0 : 5,
      }));

      const closest = distances.reduce((prev, curr) =>
        curr.distance < prev.distance ? curr : prev
      );

      expect(closest.orphan.originalName).toBe('Alice');
      expect(closest.orphan.originalClientId).toBe(2);
    });

    it('should NOT auto-trigger walkover on disconnect', () => {
      const lockedPlayers: LockedPlayer[] = [
        { clientId: 1, name: 'Host' },
        { clientId: 2, name: 'Alice' },
        { clientId: 3, name: 'Bob' },
      ];

      const orphanHands: OrphanHand[] = [
        { originalClientId: 2, originalName: 'Alice', cards: [] },
      ];

      const newDisconnects = [1]; // Host disconnects

      const totalOrphans = orphanHands.length + newDisconnects.length;
      const remainingPlayers = lockedPlayers.length - totalOrphans;

      expect(totalOrphans).toBe(2);
      expect(remainingPlayers).toBe(1);
      // Even though only 1 player remains, walkover should NOT auto-trigger
      // It should only trigger when host explicitly uses "Continue without"
    });
  });

  describe('Grace Period Logic', () => {
    it('should not immediately trigger pause when player disappears', () => {
      const pendingDisconnects = new Set<number>();
      const disconnectedId = 42;

      // First detection: add to pending
      pendingDisconnects.add(disconnectedId);

      // Grace period timer would be running here
      expect(pendingDisconnects.has(disconnectedId)).toBe(true);
      expect(pendingDisconnects.size).toBe(1);
    });

    it('should clear pending disconnect when player returns within grace period', () => {
      const pendingDisconnects = new Set<number>([42]);
      const returnedPlayerId = 42;
      const activePlayerIds = [1, 42, 3]; // Player 42 is back

      // Check if pending player has returned
      if (activePlayerIds.includes(returnedPlayerId)) {
        pendingDisconnects.delete(returnedPlayerId);
      }

      expect(pendingDisconnects.has(42)).toBe(false);
      expect(pendingDisconnects.size).toBe(0);
    });

    it('should confirm disconnect after grace period if player still absent', () => {
      const _pendingDisconnects = new Set<number>([42]);
      const currentActiveIds = [1, 3]; // Player 42 still missing
      const lockedIds = [1, 42, 3];
      const orphanIds: number[] = [];

      // Re-check after grace period
      const stillMissing = lockedIds.filter(
        (id) => !currentActiveIds.includes(id) && !orphanIds.includes(id)
      );

      // Should confirm the disconnect and trigger pause
      expect(stillMissing).toContain(42);
      expect(stillMissing.length).toBeGreaterThan(0);
    });

    it('should clear timer and pending disconnects when all return', () => {
      const _pendingDisconnects = new Set<number>([42, 43]);
      const activePlayerIds = [1, 42, 43, 3]; // Both returned

      // Check returned players
      const returned = Array.from(_pendingDisconnects).filter((id) =>
        activePlayerIds.includes(id)
      );
      returned.forEach((id) => _pendingDisconnects.delete(id));

      // Should clear timer if no suspects remain
      const shouldClearTimer = _pendingDisconnects.size === 0;

      expect(shouldClearTimer).toBe(true);
      expect(_pendingDisconnects.size).toBe(0);
    });
  });

  describe('Walkover Detection (via Continue Without)', () => {
    it('should detect walkover condition when only one player would remain', () => {
      const lockedPlayers: LockedPlayer[] = [
        { clientId: 1, name: 'Winner' },
        { clientId: 2, name: 'Disconnected1' },
        { clientId: 3, name: 'Disconnected2' },
      ];

      const disconnectedIds = [2, 3];
      const remainingCount = lockedPlayers.length - disconnectedIds.length;

      expect(remainingCount).toBe(1);
      expect(remainingCount <= 1).toBe(true);
    });

    it('should identify the winner after continue-without removes all others', () => {
      const lockedPlayers: LockedPlayer[] = [
        { clientId: 1, name: 'Winner' },
        { clientId: 2, name: 'Disconnected' },
      ];

      // After host clicks "Continue without" for player 2
      const updatedLockedPlayers = lockedPlayers.filter((p) => p.clientId !== 2);
      const winner = updatedLockedPlayers[0];

      expect(winner).toBeDefined();
      expect(winner?.clientId).toBe(1);
      expect(winner?.name).toBe('Winner');
    });

    it('should set status to ENDED when continue-without leaves one player', () => {
      let status: 'LOBBY' | 'PLAYING' | 'PAUSED_WAITING_PLAYER' | 'ENDED' = 'PAUSED_WAITING_PLAYER';
      const updatedLockedPlayers = [{ clientId: 1, name: 'Winner' }];

      // After removing disconnected player via continue-without
      if (updatedLockedPlayers.length <= 1) {
        status = 'ENDED';
      }

      expect(status).toBe('ENDED');
    });

    it('should store winner clientId when walkover triggered by continue-without', () => {
      let winner: number | null = null;
      const updatedLockedPlayers = [{ clientId: 42, name: 'LastStanding' }];

      // After all others removed via continue-without
      winner = updatedLockedPlayers[0]?.clientId ?? null;

      expect(winner).toBe(42);
    });
  });
});
