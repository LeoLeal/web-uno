import { useEffect, useState, useCallback } from 'react';
import * as Y from 'yjs';
import { useGame } from '@/components/providers/GameProvider';

export type GameStatus = 'LOBBY' | 'PLAYING' | 'ENDED';

export const useGameState = () => {
  const { doc } = useGame();
  const [status, setStatus] = useState<GameStatus>('LOBBY');
  
  // Get the shared map
  // Note: Yjs types are mutable, so we don't put them in state directly usually
  // But we need to subscribe to changes.
  
  useEffect(() => {
    if (!doc) return;

    const gameStateMap = doc.getMap('gameState');

    const handleChange = () => {
      const currentStatus = gameStateMap.get('status') as GameStatus;
      if (currentStatus) {
        setStatus(currentStatus);
      } else {
        // Default to LOBBY if not set
        if (!gameStateMap.has('status')) {
           // We don't set it here to avoid race conditions, 
           // Host initialization logic (Task 5.1) handles the write.
           setStatus('LOBBY');
        }
      }
    };

    gameStateMap.observe(handleChange);
    handleChange(); // Initial check

    return () => {
      gameStateMap.unobserve(handleChange);
    };
  }, [doc]);

  const startGame = useCallback(() => {
    if (!doc) return;
    const gameStateMap = doc.getMap('gameState');
    gameStateMap.set('status', 'PLAYING');
  }, [doc]);

  const initGame = useCallback(() => {
    if (!doc) return;
    const gameStateMap = doc.getMap('gameState');
    if (!gameStateMap.has('status')) {
      console.log("Initializing Game State to LOBBY");
      gameStateMap.set('status', 'LOBBY');
    }
  }, [doc]);

  return { status, startGame, initGame };
};
