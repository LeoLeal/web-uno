import { useEffect, useState, useRef, useCallback } from 'react';
import { ChatNetwork, ChatMessage } from '@/lib/websocket/ChatNetwork';
import { Player } from '@/hooks/useRoom';

export function useChatNetwork(roomId: string | undefined, gameClientId: number | null, isSynced: boolean, players: Player[]) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const networkRef = useRef<ChatNetwork | null>(null);

  // Keep latest players list in a ref to check validity without causing reconnects
  const playersRef = useRef<Player[]>(players);
  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  const handleMessage = useCallback((msg: ChatMessage) => {
    // Validate against game presence identities (or if it's our own message)
    const isKnownPlayer = msg.clientId === gameClientId || playersRef.current.some(p => p.clientId === msg.clientId);
    
    if (!isKnownPlayer) {
      console.warn(`[Chat] Ignoring message from unknown clientId: ${msg.clientId}`);
      return;
    }

    setMessages(prev => {
      if (prev.some(m => m.id === msg.id)) return prev; // Avoid duplicates
      return [...prev, msg];
    });
  }, [gameClientId]);

  useEffect(() => {
    if (!roomId || gameClientId === null || !isSynced) {
      return;
    }

    const network = new ChatNetwork(roomId, gameClientId, handleMessage);
    network.connect();
    networkRef.current = network;

    return () => {
      network.disconnect();
      networkRef.current = null;
    };
  }, [roomId, gameClientId, isSynced, handleMessage]);

  const sendMessage = useCallback((text: string) => {
    if (networkRef.current) {
      networkRef.current.sendMessage(text);
    }
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  return {
    messages,
    sendMessage,
    removeMessage
  };
}
