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
  const hasClaimedHost = useRef(false);

  // Function to update local player state
  // Defined early so we can use it inside effects if needed (though usually driven by UI)
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

    // Immediate Host Claim: If we're the only peer, claim host immediately
    // This fixes the issue where room creators weren't becoming hosts
    const checkAndClaimHost = () => {
      if (hasClaimedHost.current) return;
      
      const states = awareness.getStates();
      const peerCount = states.size;
      
      // Check if any existing peer is already host
      let existingHost = false;
      states.forEach((state, clientId) => {
        if (clientId !== awareness.clientID && state.user?.isHost) {
          existingHost = true;
        }
      });

      if (!existingHost && peerCount <= 1) {
        // We're alone or first - claim host!
        console.log("Claiming Host Status (immediate)");
        awareness.setLocalStateField('user', {
           name: 'Host',
           isHost: true,
           color: '#ff0000'
        });
        hasClaimedHost.current = true;
      }
    };

    // Claim host immediately upon connection
    checkAndClaimHost();

    newProvider.on('synced', (synced: boolean) => {
      setIsSynced(synced);
      
      // Backup host claim for late joiners (in case we missed it)
      if (synced && !hasClaimedHost.current) {
        checkAndClaimHost();
      }
    });

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
      // Sort: Host first, then by ClientID
      activePlayers.sort((a, b) => (a.isHost ? -1 : b.isHost ? 1 : 0));
      setPlayers(activePlayers);
    };

    awareness.on('change', handleAwarenessChange);
    setProvider(newProvider);

    // Initial check
    handleAwarenessChange();

    return () => {
      awareness.off('change', handleAwarenessChange);
      newProvider.destroy();
      hasClaimedHost.current = false;
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
