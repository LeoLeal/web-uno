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

    // Host Claim via Shared State - Atomic Check-and-Set
    // If hostId is null/undefined, set it to my ID
    const claimHostIfEmpty = () => {
      if (hasAttemptedClaim.current) return;
      
      const currentHostId = gameState.get('hostId');
      
      if (currentHostId === undefined || currentHostId === null) {
        console.log(`Claiming host (hostId was ${currentHostId})`);
        gameState.set('hostId', myId);
      } else {
        console.log(`Host already exists: ${currentHostId}`);
      }
      hasAttemptedClaim.current = true;
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

      // Sort: Host first, then by ClientID
      const currentHostId = gameState.get('hostId') as number | null;
      activePlayers.sort((a, b) => {
        if (a.clientId === currentHostId) return -1;
        if (b.clientId === currentHostId) return 1;
        return 0;
      });
      setPlayers(activePlayers);
      
      // Check host presence on every awareness change
      if (currentHostId !== null) {
        const hostConnected = states.has(currentHostId);
        setIsHostConnected(hostConnected);
      }
    };

    // For solo rooms (first peer), we're immediately "synced"
    const initialStates = awareness.getStates();
    if (initialStates.size <= 1) {
      setIsSynced(true);
    }

    newProvider.on('synced', ({ synced }: { synced: boolean }) => {
      setIsSynced(synced);
    });

    // Subscribe to changes
    gameState.observe(handleGameStateChange);
    awareness.on('change', handleAwarenessChange);
    setProvider(newProvider);

    // Initial checks
    handleGameStateChange();
    handleAwarenessChange();
    
    // Claim host if empty - runs immediately, no setTimeout needed
    // Yjs handles concurrent writes atomically
    claimHostIfEmpty();

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
