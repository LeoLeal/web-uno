import { useEffect, useState, useCallback, useRef } from 'react';
import { WebrtcProvider } from 'y-webrtc';
import { useGame } from '@/components/providers/GameProvider';
import { MAX_PLAYERS } from '@/lib/game/constants';

export interface Player {
  clientId: number;
  name: string;
  isHost: boolean;
  color?: string;
  avatar?: string;
}

export const useRoom = (roomId: string) => {
  const { doc } = useGame();
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myClientId, setMyClientId] = useState<number | null>(null);
  const [hostId, setHostId] = useState<number | null>(null);
  const [isHostConnected, setIsHostConnected] = useState<boolean | null>(null);
  const [isGameFull, setIsGameFull] = useState(false);
  const hasAttemptedClaim = useRef(false);
  const isExplicitCreator = useRef(false);

  // Check for creation intent flag (sessionStorage) on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for room-creator sessionStorage entry
      const creatorRoomId = sessionStorage.getItem('room-creator');
      
      if (creatorRoomId === roomId) {
        isExplicitCreator.current = true;
        // Clear the sessionStorage entry to prevent re-claiming on reload
        sessionStorage.removeItem('room-creator');
        console.log('Creation intent detected via sessionStorage: Marking as explicit creator');
      }
    }
  }, [roomId]);

  // Function to update local player state
  const updateMyState = useCallback((state: Partial<Omit<Player, 'clientId'>>) => {
    if (!provider) return;
    const current = provider.awareness.getLocalState() as { user?: Partial<Omit<Player, 'clientId'>> } | null;
    provider.awareness.setLocalStateField('user', {
      ...current?.user,
      ...state
    });
  }, [provider]);

  useEffect(() => {
    if (!doc || !roomId) return;

    const signalingUrl = process.env.NEXT_PUBLIC_SIGNALING_URL || 'ws://localhost:4444';

    const newProvider = new WebrtcProvider(roomId, doc, {
      signaling: [signalingUrl],
    });

    const awareness = newProvider.awareness;
    const gameState = doc.getMap('gameState');
    const myId = awareness.clientID;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing state from external WebRTC provider
    setMyClientId(myId);

    // Host claiming - only called once per session
    // Claims host if:
    // 1. We explicitly created the room (sessionStorage flag)
    // 2. OR: No existing host AND we're the only peer (legacy/fallback)
    const claimHostIfEligible = () => {
      if (hasAttemptedClaim.current) return;
      
      const currentHostId = gameState.get('hostId');
      const peerCount = awareness.getStates().size;
      const isCreator = isExplicitCreator.current;
      
      const shouldClaim = isCreator || ((currentHostId === undefined || currentHostId === null) && peerCount <= 1);

      if (shouldClaim) {
        console.log(`Claiming host (Creator: ${isCreator}, hostId was ${currentHostId}, peerCount: ${peerCount})`);
        gameState.set('hostId', myId);
        setIsHostConnected(true); // Immediate update to prevent disconnect modal flash
        hasAttemptedClaim.current = true;
      } else {
        console.log(`Not claiming host (Creator: ${isCreator}, hostId: ${currentHostId}, peerCount: ${peerCount})`);
        // Only mark attempted if we successfully decided NOT to claim because someone else is host
        // If we are just waiting (e.g. not synced yet), maybe don't mark attempted?
        // Actually, for "race condition" fix, if we are NOT creator, we should be very conservative.
        // We mark attempted=true so we don't try again and again.
        hasAttemptedClaim.current = true;
      }
    };

    // Watch for hostId changes in shared state
    const handleGameStateChange = () => {
      const currentHostId = gameState.get('hostId') as number | null;
      setHostId(currentHostId);
      
      // Check if host is still connected
      if (currentHostId !== null) {
        const states = awareness.getStates();
        const hostConnected = currentHostId === myId || states.has(currentHostId);
        setIsHostConnected(hostConnected);
      }
    };

    // Handle Awareness Changes (for player list and host presence)
    const handleAwarenessChange = () => {
      const states = awareness.getStates();
      const activePlayers: Player[] = [];
      const status = gameState.get('status') as string | undefined;
      const isLobby = status === 'LOBBY' || !status;
      const isPausedWaiting = status === 'PAUSED_WAITING_PLAYER';
      const isPlaying = status === 'PLAYING' || status === 'ROUND_ENDED' || status === 'ENDED';
      const lockedPlayersList = (gameState.get('lockedPlayers') as Array<{ clientId: number; name: string }>) || [];
      const lockedClientIds = new Set(lockedPlayersList.map(p => p.clientId));
      let myStateWasRejected = false;

      // Convert states to array to maintain insertion order
      const stateEntries = Array.from(states.entries());
      
      stateEntries.forEach(([clientId, state]) => {
        if (state.user) {
          // During gameplay, only allow locked players (no new joins)
          if (isPlaying && !lockedClientIds.has(clientId)) {
            console.log(`Rejecting player ${clientId}: new joins not allowed during ${status}`);
            if (clientId === myId) {
              myStateWasRejected = true;
            }
            return;
          }

          // Check if we're at capacity (only relevant in lobby or paused)
          const currentPlayerCount = activePlayers.length;
          const wouldExceedMax = currentPlayerCount >= MAX_PLAYERS;
          
          // Allow if:
          // 1. In lobby and not at capacity
          // 2. Paused waiting for replacements (to fill orphan hands)
          if (isLobby && !wouldExceedMax) {
            activePlayers.push({
              clientId,
              name: state.user.name || `Player ${clientId}`,
              isHost: state.user.isHost || false,
              color: state.user.color,
              avatar: state.user.avatar,
            });
          } else if (isPausedWaiting) {
            // During pause, allow if not at capacity OR if replacing an orphan
            activePlayers.push({
              clientId,
              name: state.user.name || `Player ${clientId}`,
              isHost: state.user.isHost || false,
              color: state.user.color,
              avatar: state.user.avatar,
            });
          } else if (isPlaying && lockedClientIds.has(clientId)) {
            // During gameplay, only existing locked players
            activePlayers.push({
              clientId,
              name: state.user.name || `Player ${clientId}`,
              isHost: state.user.isHost || false,
              color: state.user.color,
              avatar: state.user.avatar,
            });
          } else if (!isPlaying && !isLobby && !isPausedWaiting) {
            // Unknown state - reject to be safe
            console.log(`Rejecting player ${clientId}: unknown game status ${status}`);
            if (clientId === myId) {
              myStateWasRejected = true;
            }
          } else {
            console.log(`Rejecting player ${clientId}: game at capacity (${MAX_PLAYERS}/${MAX_PLAYERS}) or invalid state`);
            if (clientId === myId) {
              myStateWasRejected = true;
            }
          }
        }
      });

      // If we were rejected, mark game as full
      if (myStateWasRejected) {
        setIsGameFull(true);
      }

      // Sort: Host first, then alphabetically by name
      const currentHostId = gameState.get('hostId') as number | null;
      activePlayers.sort((a, b) => {
        if (a.clientId === currentHostId) return -1;
        if (b.clientId === currentHostId) return 1;
        return a.name.localeCompare(b.name);
      });
      setPlayers(activePlayers);
      
      // Check host presence on every awareness change
      if (currentHostId !== null) {
        const hostConnected = currentHostId === myId || states.has(currentHostId);
        setIsHostConnected(hostConnected);
      }
    };

    // Track if we've seen any other peers connect
    // This is the reliable signal that we're NOT the first peer
    let hasSeenOtherPeers = false;
    
    // Listen for peer connection events
    // If we see other peers BEFORE claiming, we're a joiner
    newProvider.on('peers', ({ webrtcPeers, bcPeers }: { webrtcPeers: string[], bcPeers: string[] }) => {
      const totalPeers = webrtcPeers.length + bcPeers.length;
      if (totalPeers > 0) {
        hasSeenOtherPeers = true;
      }
    });

    // Handle sync event - fires when we've synced with peers
    newProvider.on('synced', ({ synced }: { synced: boolean }) => {
      setIsSynced(synced);
      // After sync completes, attempt to claim host
      // The claim logic will check if conditions are met
      if (synced) {
        claimHostIfEligible();
      }
    });
    
    // For solo rooms: if after connecting to signaling we have no peers,
    // we need to set synced=true and claim host.
    // We do this by checking after the provider has had a chance to discover peers.
    // The 'status' event fires when signaling connection status changes.
    newProvider.on('status', ({ connected }: { connected: boolean }) => {
      if (connected && !hasSeenOtherPeers && !hasAttemptedClaim.current) {
        // If we are explicitly the creator, we can confidently claim being first.
        if (isExplicitCreator.current) {
          setIsSynced(true);
          claimHostIfEligible();
        }
        // If we are NOT the creator (e.g. joined by URL), we should NOT assume we are first.
        // We wait for 'peers' or 'synced' events.
        // Note: Manual URL creators will not auto-claim host here, preventing race conditions.
        
        // Guest UI Fix: We set isSynced(true) so the UI unlocks (Join Modal shows).
        // They remain guests until state syncs or host is claimed by someone else.
        if (!isExplicitCreator.current) {
           setIsSynced(true);
        }
      }
    });

    // Subscribe to changes
    gameState.observe(handleGameStateChange);
    awareness.on('change', handleAwarenessChange);
    setProvider(newProvider);

    // Initial state reads
    handleGameStateChange();
    handleAwarenessChange();

    // Immediate claim for explicit creators (optimistic write)
    if (isExplicitCreator.current) {
      setIsSynced(true); // Force sync state for creator to unblock UI
      claimHostIfEligible();
    }

    return () => {
      gameState.unobserve(handleGameStateChange);
      awareness.off('change', handleAwarenessChange);
      newProvider.disconnect();
      newProvider.destroy();
      hasAttemptedClaim.current = false;
    };
  }, [doc, roomId]);

  // Determine if I'm host by comparing hostId with my clientId
  const amIHost = myClientId !== null && hostId !== null && hostId === myClientId;

  return { 
    provider, 
    isSynced, 
    players, 
    myClientId,
    hostId,
    amIHost,
    isHostConnected,
    isGameFull,
    updateMyState 
  };
};
