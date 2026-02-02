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
  const isHost = useRef(false);
  const checkAttempts = useRef(0);

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
    setMyClientId(awareness.clientID);

    // Host Claim Logic with Race Condition Fix
    // Key insight: we check multiple times with delays to ensure awareness syncs
    const checkAndClaimHost = () => {
      if (isHost.current) return; // Already host
      
      const states = awareness.getStates();
      checkAttempts.current++;
      
      let otherPeers = 0;
      let otherHosts = 0;
      
      states.forEach((state, clientId) => {
        if (clientId !== awareness.clientID) {
          otherPeers++;
          if (state.user?.isHost) {
            otherHosts++;
          }
        }
      });

      console.log(`Host check #${checkAttempts.current}: ${otherPeers} peers, ${otherHosts} hosts`);

      // If another host exists, we definitely should NOT be host
      if (otherHosts > 0) {
        console.log("Another host found, relinquishing host claim");
        // If we previously claimed host, remove it
        const myState = awareness.getLocalState() as any;
        if (myState?.user?.isHost) {
          awareness.setLocalStateField('user', {
            ...myState.user,
            isHost: false
          });
        }
        return;
      }

      // If we see other peers but no host, someone should be host
      // Only claim if we're the lowest client ID (deterministic tie-breaker)
      if (otherPeers > 0 && otherHosts === 0) {
        const myId = awareness.clientID;
        let lowestId = myId;
        
        states.forEach((_, clientId) => {
          if (clientId !== myId && clientId < lowestId) {
            lowestId = clientId;
          }
        });

        if (myId === lowestId) {
          console.log("Lowest client ID, claiming host");
          awareness.setLocalStateField('user', {
            isHost: true,
            color: '#ff0000'
          });
          isHost.current = true;
        }
        return;
      }

      // Solo room - claim host
      if (otherPeers === 0 && checkAttempts.current >= 3) {
        console.log("Solo room confirmed, claiming host");
        awareness.setLocalStateField('user', {
          isHost: true,
          color: '#ff0000'
        });
        isHost.current = true;
      }
    };

    // Handle Awareness Changes
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

      activePlayers.sort((a, b) => (a.isHost ? -1 : b.isHost ? 1 : 0));
      setPlayers(activePlayers);

      // Check host status on every change
      checkAndClaimHost();
    };

    // Run multiple checks with increasing delays
    // This ensures awareness has time to sync before we commit to being host
    const check1 = setTimeout(() => checkAndClaimHost(), 100);
    const check2 = setTimeout(() => checkAndClaimHost(), 500);
    const check3 = setTimeout(() => checkAndClaimHost(), 1000);

    // For solo rooms
    const initialStates = awareness.getStates();
    if (initialStates.size <= 1) {
      setIsSynced(true);
    }

    newProvider.on('synced', (synced: boolean) => {
      setIsSynced(synced);
    });

    awareness.on('change', handleAwarenessChange);
    setProvider(newProvider);

    handleAwarenessChange();

    return () => {
      clearTimeout(check1);
      clearTimeout(check2);
      clearTimeout(check3);
      awareness.off('change', handleAwarenessChange);
      newProvider.destroy();
      isHost.current = false;
      checkAttempts.current = 0;
    };
  }, [doc, roomId]);

  return { 
    provider, 
    isSynced, 
    players, 
    myClientId,
    updateMyState 
  };
};
