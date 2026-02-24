import { useEffect, useState, useRef, useCallback } from 'react';
import { ChatNetwork, ChatMessage } from '@/lib/websocket/ChatNetwork';
import { Player } from '@/hooks/useRoom';
import { playSound } from '@/lib/audio/playback';

export function useChatNetwork(
  roomId: string | undefined,
  gameClientId: number | null,
  isSynced: boolean,
  players: Player[],
  isMuted: boolean = false,
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const networkRef = useRef<ChatNetwork | null>(null);

  // Keep latest players list in a ref to check validity without causing reconnects
  const playersRef = useRef<Player[]>(players);
  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  // Keep isMuted in a ref to avoid re-creating handleMessage on every mute toggle
  const isMutedRef = useRef<boolean>(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

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

    // Play chat-pop sound for messages from other players (not our own)
    if (msg.clientId !== gameClientId && !isMutedRef.current) {
      void playSound('/sounds/chat-pop.mp3');
    }
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
