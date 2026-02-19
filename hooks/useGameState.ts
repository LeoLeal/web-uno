import { useEffect, useState, useCallback } from 'react';
import { useGame } from '@/components/providers/GameProvider';
import { Card } from '@/lib/game/cards';
import { EndType } from '@/lib/game/constants';

export type GameStatus = 'LOBBY' | 'PLAYING' | 'PAUSED_WAITING_PLAYER' | 'ROUND_ENDED' | 'ENDED';
export type { EndType };

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
  const [endType, setEndType] = useState<EndType | null>(null);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [lastRoundPoints, setLastRoundPoints] = useState<number>(0);
  const [statusBeforePause, setStatusBeforePause] = useState<GameStatus | null>(null);
  const [lastPlayedBy, setLastPlayedBy] = useState<number | null>(null);

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

      const gameEndType = gameStateMap.get('endType') as EndType | undefined;
      setEndType(gameEndType ?? null);

      const gameScores = gameStateMap.get('scores') as Record<number, number> | undefined;
      setScores(gameScores ?? {});

      const round = gameStateMap.get('currentRound') as number | undefined;
      setCurrentRound(round ?? 0);

      const lrp = gameStateMap.get('lastRoundPoints') as number | undefined;
      setLastRoundPoints(lrp ?? 0);

      const statusBefore = gameStateMap.get('statusBeforePause') as GameStatus | null | undefined;
      setStatusBeforePause(statusBefore ?? null);

      const lastPlayed = gameStateMap.get('lastPlayedBy') as number | undefined;
      setLastPlayedBy(lastPlayed ?? null);
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
    endType,
    scores,
    currentRound,
    lastRoundPoints,
    statusBeforePause,
    lastPlayedBy,
    startGame,
    initGame,
  };
};
