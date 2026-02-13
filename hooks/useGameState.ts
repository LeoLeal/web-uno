import { useEffect, useState, useCallback } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import { Card } from '@/lib/game/cards';

export type GameStatus = 'LOBBY' | 'PLAYING' | 'PAUSED_WAITING_PLAYER' | 'ENDED';

export interface LockedPlayer {
  clientId: number;
  name: string;
}

export interface OrphanHand {
  originalClientId: number;
  originalName: string;
  cards: Card[];
}

export const useGameState = () => {
  const { doc } = useGame();
  const [status, setStatus] = useState<GameStatus>('LOBBY');
  const [currentTurn, setCurrentTurn] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [playerCardCounts, setPlayerCardCounts] = useState<Record<number, number>>({});
  const [turnOrder, setTurnOrder] = useState<number[]>([]);
  const [lockedPlayers, setLockedPlayers] = useState<LockedPlayer[]>([]);
  const [orphanHands, setOrphanHands] = useState<OrphanHand[]>([]);
  const [winner, setWinner] = useState<number | null>(null);

  useEffect(() => {
    if (!doc) return;

    const gameStateMap = doc.getMap('gameState');

    const handleChange = () => {
      const currentStatus = gameStateMap.get('status') as GameStatus;
      if (currentStatus) {
        setStatus(currentStatus);
      } else {
        if (!gameStateMap.has('status')) {
          setStatus('LOBBY');
        }
      }

      // Read game fields (only relevant when PLAYING)
      const turn = gameStateMap.get('currentTurn') as number | undefined;
      setCurrentTurn(turn ?? null);

      const dir = gameStateMap.get('direction') as 1 | -1 | undefined;
      setDirection(dir ?? 1);

      const discard = gameStateMap.get('discardPile') as Card[] | undefined;
      setDiscardPile(discard ?? []);

      const counts = gameStateMap.get('playerCardCounts') as Record<number, number> | undefined;
      setPlayerCardCounts(counts ?? {});

      const order = gameStateMap.get('turnOrder') as number[] | undefined;
      setTurnOrder(order ?? []);

      const locked = gameStateMap.get('lockedPlayers') as LockedPlayer[] | undefined;
      setLockedPlayers(locked ?? []);

      const orphans = gameStateMap.get('orphanHands') as OrphanHand[] | undefined;
      setOrphanHands(orphans ?? []);

      const gameWinner = gameStateMap.get('winner') as number | undefined;
      setWinner(gameWinner ?? null);
    };

    gameStateMap.observe(handleChange);
    handleChange();

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

  return {
    status,
    currentTurn,
    direction,
    discardPile,
    playerCardCounts,
    turnOrder,
    lockedPlayers,
    orphanHands,
    winner,
    startGame,
    initGame,
  };
};
