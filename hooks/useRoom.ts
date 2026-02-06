import { useEffect, useState, useCallback, useRef } from 'react';
import { WebrtcProvider } from 'y-webrtc';
import { useGame } from '@/components/providers/GameProvider';

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
  const hasAttemptedClaim = useRef(false);

  // Function to update local player state
  const updateMyState = useCallback((state: Partial<Omit<Player, 'clientId'>>) => {
    if (!provider) return;
    const current = provider.awareness.getLocalState() as any;
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
    setMyClientId(myId);

    // Host claiming - only called once per session
    // Claims host only when: no existing host AND we're the only peer
    const claimHostIfEligible = () => {
      if (hasAttemptedClaim.current) return;
      hasAttemptedClaim.current = true;
      
      const currentHostId = gameState.get('hostId');
      const peerCount = awareness.getStates().size;
      
      if ((currentHostId === undefined || currentHostId === null) && peerCount <= 1) {
        console.log(`Claiming host (hostId was ${currentHostId}, peerCount: ${peerCount})`);
        gameState.set('hostId', myId);
      } else {
        console.log(`Not claiming host (hostId: ${currentHostId}, peerCount: ${peerCount})`);
      }
    };

    // Watch for hostId changes in shared state
    const handleGameStateChange = () => {
      const currentHostId = gameState.get('hostId') as number | null;
      setHostId(currentHostId);
      
      // Check if host is still connected
      if (currentHostId !== null) {
        const states = awareness.getStates();
        const hostConnected = states.has(currentHostId);
        setIsHostConnected(hostConnected);
      }
    };

    // Handle Awareness Changes (for player list and host presence)
    const handleAwarenessChange = () => {
      const states = awareness.getStates();
      const activePlayers: Player[] = [];

      states.forEach((state, clientId) => {
        if (state.user) {
          activePlayers.push({
            clientId,
            name: state.user.name || `Player ${clientId}`,
            isHost: state.user.isHost || false,
            color: state.user.color,
            avatar: state.user.avatar,
          });
        }
      });

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
        const hostConnected = states.has(currentHostId);
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
        // Connected to signaling but no peers found - we're first
        setIsSynced(true);
        claimHostIfEligible();
      }
    });

    // Subscribe to changes
    gameState.observe(handleGameStateChange);
    awareness.on('change', handleAwarenessChange);
    setProvider(newProvider);

    // Initial state reads
    handleGameStateChange();
    handleAwarenessChange();

    return () => {
      gameState.unobserve(handleGameStateChange);
      awareness.off('change', handleAwarenessChange);
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
    updateMyState 
  };
};
