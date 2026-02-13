'use client';

import { OpponentIndicator } from './OpponentIndicator';
import { cn } from '@/lib/utils';

interface Opponent {
  clientId: number;
  name: string;
  avatar: string;
  cardCount: number;
  isHost: boolean;
  isDisconnected?: boolean;
}

interface OpponentRowProps {
  opponents: Opponent[];
  currentTurn: number | null;
  className?: string;
}

/**
 * Horizontal row of opponents positioned evenly at the top of the game area.
 */
export const OpponentRow = ({ opponents, currentTurn, className }: OpponentRowProps) => {
  return (
    <div
      className={cn(
        'flex items-start justify-center gap-6 md:gap-10 flex-wrap',
        className
      )}
    >
      {opponents.map((opponent) => (
        <OpponentIndicator
          key={opponent.clientId}
          name={opponent.name}
          avatar={opponent.avatar}
          cardCount={opponent.cardCount}
          isCurrentTurn={currentTurn === opponent.clientId}
          isHost={opponent.isHost}
          isDisconnected={opponent.isDisconnected}
        />
      ))}
    </div>
  );
};
