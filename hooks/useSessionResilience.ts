/**
 * Host-only session resilience hook.
 * Detects player disconnections, manages pause/resume flow,
 * handles orphan hand assignment to replacement players,
 * and manages "continue without" player removal.
 */

import { useEffect, useCallback, useRef } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import { Card } from '@/lib/game/cards';
import { GameStatus, LockedPlayer, OrphanHand } from '@/hooks/useGameState';

interface UseSessionResilienceOptions {
  /** Current game status */
  status: GameStatus;
  /** Locked players list */
  lockedPlayers: LockedPlayer[];
  /** Current orphan hands */
  orphanHands: OrphanHand[];
  /** Current turn */
  currentTurn: number | null;
  /** Turn order */
  turnOrder: number[];
  /** Player card counts */
  playerCardCounts: Record<number, number>;
  /** Active players from awareness */
  activePlayers: Array<{ clientId: number; name: string }>;
  /** Host's deck reference for reshuffling */
  deckRef: React.RefObject<Card[]>;
  /** Whether this peer is the host */
  isHost: boolean;
}

interface UseSessionResilienceReturn {
  /** Remove an orphan hand and continue without that player */
  continueWithout: (orphanClientId: number) => void;
}

/** Grace period before confirming a disconnect (milliseconds) */
const DISCONNECT_GRACE_PERIOD_MS = 5000;

/**
 * Levenshtein distance for string similarity matching.
 * Used to match replacement players to orphaned hands by name.
 */
const levenshtein = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

export const useSessionResilience = ({
  status,
  lockedPlayers,
  orphanHands,
  currentTurn,
  turnOrder,
  playerCardCounts,
  activePlayers,
  deckRef,
  isHost,
}: UseSessionResilienceOptions): UseSessionResilienceReturn => {
  const { doc } = useGame();
  const lastActivePlayerCount = useRef<number>(0);
  const pendingDisconnectsRef = useRef<Set<number>>(new Set());
  const activePlayersRef = useRef(activePlayers);
  const gracePeriodTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync activePlayersRef with latest activePlayers
  useEffect(() => {
    activePlayersRef.current = activePlayers;
  }, [activePlayers]);

  /**
   * Start a grace period timer that reads current state from Yjs when it fires,
   * avoiding stale closure issues.
   */
  const startGracePeriodTimer = useCallback((yDoc: NonNullable<typeof doc>) => {
    gracePeriodTimerRef.current = setTimeout(() => {
      // Read ALL state from Yjs directly to avoid stale closures
      const gameStateMap = yDoc.getMap('gameState');
      const dealtHandsMap = yDoc.getMap('dealtHands');
      const currentActiveIds = activePlayersRef.current.map((p) => p.clientId);
      const currentLockedPlayers = (gameStateMap.get('lockedPlayers') as LockedPlayer[]) || [];
      const currentOrphanHands = (gameStateMap.get('orphanHands') as OrphanHand[]) || [];
      const currentOrphanIds = currentOrphanHands.map((o) => o.originalClientId);
      const currentLockedIds = currentLockedPlayers.map((p) => p.clientId);

      const stillMissing = currentLockedIds.filter(
        (id) => !currentActiveIds.includes(id) && !currentOrphanIds.includes(id)
      );

      if (stillMissing.length === 0) {
        console.log('All suspected disconnects returned — no pause needed');
        pendingDisconnectsRef.current.clear();
        gracePeriodTimerRef.current = null;
        return;
      }

      console.log('Confirmed disconnect after grace period:', stillMissing);

      // Read their hands from dealtHands and create orphan entries
      const newOrphans: OrphanHand[] = [];

      for (const disconnectedId of stillMissing) {
        const lockedPlayer = currentLockedPlayers.find((p) => p.clientId === disconnectedId);
        const hand = dealtHandsMap.get(String(disconnectedId)) as Card[] | undefined;

        if (lockedPlayer && hand) {
          newOrphans.push({
            originalClientId: disconnectedId,
            originalName: lockedPlayer.name,
            cards: hand,
          });
        }
      }

      // Transition to pause or add to existing pause
      const currentStatus = gameStateMap.get('status') as GameStatus;
      yDoc.transact(() => {
        if (currentStatus === 'PLAYING' || currentStatus === 'ROUND_ENDED') {
          gameStateMap.set('statusBeforePause', currentStatus);
          gameStateMap.set('status', 'PAUSED_WAITING_PLAYER');
        }
        gameStateMap.set('orphanHands', [...currentOrphanHands, ...newOrphans]);
      });

      pendingDisconnectsRef.current.clear();
      gracePeriodTimerRef.current = null;
    }, DISCONNECT_GRACE_PERIOD_MS);
  }, []);

  // Clean up grace period timer on unmount only
  useEffect(() => {
    return () => {
      if (gracePeriodTimerRef.current) {
        clearTimeout(gracePeriodTimerRef.current);
      }
    };
  }, []);

  // Detect disconnections and trigger pause (with grace period)
  useEffect(() => {
    if (!isHost) return;
    if (!doc || (status !== 'PLAYING' && status !== 'ROUND_ENDED' && status !== 'PAUSED_WAITING_PLAYER')) {
      // Clear timer and pending disconnects when leaving active statuses
      if (gracePeriodTimerRef.current) {
        clearTimeout(gracePeriodTimerRef.current);
        gracePeriodTimerRef.current = null;
      }
      pendingDisconnectsRef.current.clear();
      return;
    }

    const lockedClientIds = lockedPlayers.map((p) => p.clientId);
    const activeClientIds = activePlayers.map((p) => p.clientId);
    const activeLocked = activeClientIds.filter((id) => lockedClientIds.includes(id));
    const orphanClientIds = orphanHands.map((o) => o.originalClientId);

    // Detect if we've lost locked players (excluding those already tracked as orphans)
    const expectedConnectedCount = lockedPlayers.length - orphanHands.length;

    // Find currently disconnected players
    const disconnectedIds = lockedClientIds.filter(
      (id) => !activeClientIds.includes(id) && !orphanClientIds.includes(id)
    );

    // Check if previously-pending players have returned
    const currentPending = pendingDisconnectsRef.current;
    const returnedPlayers: number[] = [];
    currentPending.forEach((id) => {
      if (activeClientIds.includes(id)) {
        returnedPlayers.push(id);
      }
    });

    // Remove returned players from pending
    if (returnedPlayers.length > 0) {
      console.log('Players returned within grace period:', returnedPlayers);
      returnedPlayers.forEach((id) => currentPending.delete(id));

      // Clear timer if no suspects remain
      if (currentPending.size === 0 && gracePeriodTimerRef.current) {
        clearTimeout(gracePeriodTimerRef.current);
        gracePeriodTimerRef.current = null;
      }
    }

    // Add newly-missing players to pending disconnects
    if (activeLocked.length < expectedConnectedCount && disconnectedIds.length > 0) {
      const newDisconnects = disconnectedIds.filter((id) => !currentPending.has(id));

      if (newDisconnects.length > 0) {
        console.log('Detected potential disconnect (grace period starting):', newDisconnects);
        newDisconnects.forEach((id) => currentPending.add(id));

        // Start grace period timer if not already running
        if (!gracePeriodTimerRef.current) {
          startGracePeriodTimer(doc);
        }
      }
    }

    // Restart timer if pending disconnects exist but timer was cleared by effect re-run
    if (pendingDisconnectsRef.current.size > 0 && !gracePeriodTimerRef.current) {
      startGracePeriodTimer(doc);
    }

    lastActivePlayerCount.current = activeLocked.length;
  }, [doc, status, lockedPlayers, activePlayers, orphanHands, isHost, startGracePeriodTimer]);

  // Handle replacement player joining during pause
  useEffect(() => {
    if (!isHost) return;
    if (!doc || status !== 'PAUSED_WAITING_PLAYER' || orphanHands.length === 0) return;

    const lockedClientIds = lockedPlayers.map((p) => p.clientId);

    // Find new players (not in lockedPlayers)
    const newPlayers = activePlayers.filter((p) => !lockedClientIds.includes(p.clientId));

    if (newPlayers.length === 0) return;

    console.log('Replacement player(s) joined:', newPlayers);

    const gameStateMap = doc.getMap('gameState');
    const dealtHandsMap = doc.getMap('dealtHands');

    doc.transact(() => {
      let updatedOrphans = [...orphanHands];
      let updatedLockedPlayers = [...lockedPlayers];
      let updatedTurnOrder = [...turnOrder];
      let updatedCurrentTurn = currentTurn;
      let updatedCardCounts = { ...playerCardCounts };
      let updatedScores = gameStateMap.get('scores') as Record<number, number> | undefined;

      for (const newPlayer of newPlayers) {
        if (updatedOrphans.length === 0) break;

        // Find closest matching orphan by name similarity
        let closestOrphan = updatedOrphans[0];
        let closestDistance = levenshtein(newPlayer.name.toLowerCase(), closestOrphan.originalName.toLowerCase());

        for (const orphan of updatedOrphans) {
          const distance = levenshtein(newPlayer.name.toLowerCase(), orphan.originalName.toLowerCase());
          if (distance < closestDistance) {
            closestDistance = distance;
            closestOrphan = orphan;
          }
        }

        console.log(`Name matching for ${newPlayer.name}:`);
        console.log(`  Available orphans:`, updatedOrphans.map(o => o.originalName));
        console.log(`  Best match: ${closestOrphan.originalName} (distance: ${closestDistance})`);
        console.log(`  Assigning orphan hand from ${closestOrphan.originalName} to ${newPlayer.name}`);

        // Assign hand to replacement player
        dealtHandsMap.set(String(newPlayer.clientId), closestOrphan.cards);

        // Update lockedPlayers (replace original with new)
        updatedLockedPlayers = updatedLockedPlayers.map((p) =>
          p.clientId === closestOrphan.originalClientId
            ? { clientId: newPlayer.clientId, name: newPlayer.name }
            : p
        );

        // Update turnOrder
        updatedTurnOrder = updatedTurnOrder.map((id) =>
          id === closestOrphan.originalClientId ? newPlayer.clientId : id
        );

        // Update currentTurn if orphan was current turn
        if (updatedCurrentTurn === closestOrphan.originalClientId) {
          updatedCurrentTurn = newPlayer.clientId;
        }

        // Update card counts
        const newCardCounts = { ...updatedCardCounts };
        delete newCardCounts[closestOrphan.originalClientId];
        newCardCounts[newPlayer.clientId] = closestOrphan.cards.length;
        updatedCardCounts = newCardCounts;

        // Inherit cumulative score (if multi-round game)
        if (updatedScores) {
          const inheritedScore = updatedScores[closestOrphan.originalClientId] || 0;
          updatedScores = { ...updatedScores };
          delete updatedScores[closestOrphan.originalClientId];
          updatedScores[newPlayer.clientId] = inheritedScore;
        }

        // Remove this orphan from the list
        updatedOrphans = updatedOrphans.filter((o) => o.originalClientId !== closestOrphan.originalClientId);
      }

      // Write updates to Yjs
      gameStateMap.set('orphanHands', updatedOrphans);
      gameStateMap.set('lockedPlayers', updatedLockedPlayers);
      gameStateMap.set('turnOrder', updatedTurnOrder);
      gameStateMap.set('currentTurn', updatedCurrentTurn);
      gameStateMap.set('playerCardCounts', updatedCardCounts);
      if (updatedScores) {
        gameStateMap.set('scores', updatedScores);
      }

      // If all orphans resolved, resume game
      if (updatedOrphans.length === 0) {
        const statusBefore = gameStateMap.get('statusBeforePause') as GameStatus | null;
        gameStateMap.set('status', statusBefore || 'PLAYING');
        gameStateMap.set('statusBeforePause', null);
        console.log('All orphan hands assigned - resuming game to status:', statusBefore || 'PLAYING');
      }
    });
  }, [doc, status, orphanHands, lockedPlayers, activePlayers, currentTurn, turnOrder, playerCardCounts, isHost]);

  // Continue without a specific player (host action)
  const continueWithout = useCallback((orphanClientId: number) => {
    if (!isHost || !doc) return;

    const orphan = orphanHands.find((o) => o.originalClientId === orphanClientId);
    if (!orphan) return;

    console.log('Continuing without player:', orphan.originalName);

    const gameStateMap = doc.getMap('gameState');

    doc.transact(() => {
      // Reshuffle orphan cards back into deck
      deckRef.current.push(...orphan.cards);
      // Note: We don't shuffle here to avoid disrupting game flow
      // The deck will naturally shuffle on next draw or shuffle action

      // Remove orphan from list
      const updatedOrphans = orphanHands.filter((o) => o.originalClientId !== orphanClientId);
      gameStateMap.set('orphanHands', updatedOrphans);

      // Remove from turn order
      const updatedTurnOrder = turnOrder.filter((id) => id !== orphanClientId);
      gameStateMap.set('turnOrder', updatedTurnOrder);

      // Remove from card counts
      const updatedCardCounts = { ...playerCardCounts };
      delete updatedCardCounts[orphanClientId];
      gameStateMap.set('playerCardCounts', updatedCardCounts);

      // Remove from locked players
      const updatedLockedPlayers = lockedPlayers.filter((p) => p.clientId !== orphanClientId);
      gameStateMap.set('lockedPlayers', updatedLockedPlayers);

      // If removed player was current turn, advance turn
      if (currentTurn === orphanClientId && updatedTurnOrder.length > 0) {
        // Find next player in turn order
        const nextTurn = updatedTurnOrder[0];
        gameStateMap.set('currentTurn', nextTurn);
        console.log('Turn advanced to:', nextTurn);
      }

      // Check for walkover
      if (updatedLockedPlayers.length <= 1) {
        gameStateMap.set('status', 'ENDED');
        gameStateMap.set('winner', updatedLockedPlayers[0]?.clientId ?? null);
        gameStateMap.set('winType', 'WALKOVER');
        console.log('Walkover win after removal:', updatedLockedPlayers[0]?.name);
      } else if (updatedOrphans.length === 0) {
        // All orphans resolved, resume game
        const statusBefore = gameStateMap.get('statusBeforePause') as GameStatus | null;
        gameStateMap.set('status', statusBefore || 'PLAYING');
        gameStateMap.set('statusBeforePause', null);
        console.log('All orphans removed - resuming game to status:', statusBefore || 'PLAYING');
      }
    });
  }, [doc, orphanHands, turnOrder, currentTurn, playerCardCounts, lockedPlayers, deckRef, isHost]);

  return { continueWithout };
};
