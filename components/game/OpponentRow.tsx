'use client';

import { useEffect, useRef } from 'react';
import { OpponentIndicator } from './OpponentIndicator';
import { cn } from '@/lib/utils';
import { getOpponentsWithUnoBubbleAppearance } from '@/lib/game/audioFeedback';
import { speakText } from '@/lib/audio/playback';
import type { ChatMessage } from '@/lib/websocket/ChatNetwork';

interface Opponent {
  clientId: number;
  name: string;
  avatar: string;
  cardCount: number;
  playerNumber?: number;
  isHost: boolean;
  isDisconnected?: boolean;
  score?: number;
}

interface OpponentRowProps {
  opponents: Opponent[];
  currentTurn: number | null;
  scores?: Record<number, number>;
  scoreLimit?: number | null;
  isMuted?: boolean;
  chatMessages?: ChatMessage[];
  className?: string;
}

/**
 * Horizontal row of opponents positioned evenly at the top of the game area.
 */
export const OpponentRow = ({
  opponents,
  currentTurn,
  scores,
  scoreLimit,
  isMuted = false,
  chatMessages = [],
  className,
}: OpponentRowProps) => {
  const showScore = scoreLimit !== null && scoreLimit !== undefined;
  const previousUnoVisibleByOpponentRef = useRef<Map<number, boolean>>(new Map());

  useEffect(() => {
    const appearances = getOpponentsWithUnoBubbleAppearance(opponents, previousUnoVisibleByOpponentRef.current);
    if (isMuted || appearances.length === 0) return;

    speakText('Uno!');
  }, [opponents, isMuted]);

  return (
    <div
      className={cn(
        'flex items-start basis-1/3 justify-center gap-12 gap-y-6 md:gap-10 flex-wrap',
        className
      )}
    >
      {opponents.map((opponent) => (
        <OpponentIndicator
          key={opponent.clientId}
          clientId={opponent.clientId}
          name={opponent.name}
          avatar={opponent.avatar}
          cardCount={opponent.cardCount}
          playerNumber={opponent.playerNumber}
          isCurrentTurn={currentTurn === opponent.clientId}
          isHost={opponent.isHost}
          isDisconnected={opponent.isDisconnected}
          score={scores?.[opponent.clientId]}
          showScore={showScore}
          chatMessages={chatMessages.filter(m => m.clientId === opponent.clientId)}
        />
      ))}
    </div>
  );
};
