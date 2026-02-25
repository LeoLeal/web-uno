'use client';

import { cn } from '@/lib/utils';
import { CardCountFan } from '@/components/ui/CardCountFan';
import { ChatBalloon } from './ChatBalloon';
import type { ChatMessage } from '@/lib/websocket/ChatNetwork';

interface OpponentIndicatorProps {
  clientId: number;
  name: string;
  avatar: string;
  cardCount: number;
  playerNumber?: number;
  isCurrentTurn: boolean;
  isHost?: boolean;
  isDisconnected?: boolean;
  score?: number;
  showScore?: boolean;
  chatMessages?: ChatMessage[];
  className?: string;
}

/**
 * Circular avatar with card count for an opponent.
 * Highlighted with golden glow when it's their turn.
 * Shows a crown icon above the avatar for the host.
 */
export const OpponentIndicator = ({
  clientId,
  name,
  avatar,
  cardCount,
  playerNumber,
  isCurrentTurn,
  isHost = false,
  isDisconnected = false,
  score,
  showScore = false,
  chatMessages = [],
  className,
}: OpponentIndicatorProps) => {
  const anchorName = `--opponent-avatar-${clientId}`;

  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      {/* Avatar circle with optional crown */}
      <div className="relative">
        {/* Crown icon for host */}
        {isHost && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg z-10">
            👑
          </div>
        )}

        <div
          className={cn(
            'relative w-16 md:w-20 h-16 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl',
            'bg-(--felt-dark) border-2 transition-all duration-300',
            isDisconnected && 'opacity-40 grayscale',
            isCurrentTurn
              ? 'border-yellow-400 ring-4 ring-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.6)]'
              : 'border-(--copper-border)'
          )}
          style={{ anchorName } as React.CSSProperties}
        >
          {typeof playerNumber === 'number' && playerNumber > 0 && (
            <div
              className={cn(
                'absolute -top-2 -left-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-extrabold',
                isCurrentTurn
                  ? 'border-yellow-400 bg-yellow-400 text-(--felt-dark) shadow-[0_0_14px_rgba(250,204,21,0.65)]'
                  : 'border-(--copper-border) bg-(--felt-dark) text-(--cream-dark)'
              )}
            >
              {playerNumber}
            </div>
          )}

          {avatar}

          {/* Disconnect indicator overlay */}
          {isDisconnected && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500 border-2 border-(--felt) flex items-center justify-center">
              <span className="text-sm">⚠️</span>
            </div>
          )}
        </div>

        {/* UNO! indicator overlay - shown when player has 1 card */}
        {cardCount === 1 && (
          <div className="absolute top-2 inset-0 flex items-center justify-center pointer-events-none z-30 animate-bounce">
            <span className="text-white font-black text-lg tracking-widest uppercase" style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.5))' }}>
              UNO!
            </span>
          </div>
        )}

        {/* Chat Balloon */}
        <ChatBalloon messages={chatMessages} anchorName={anchorName} />
      </div>

      {/* Player name - positioned to overlap with avatar bottom */}
      <div
        className={cn(
          '-mt-5 px-2 py-0.5 rounded-lg border border-(--copper-border) bg-(--felt-dark) z-20',
          isDisconnected && 'opacity-40',
          isCurrentTurn ? 'border-yellow-400/70' : ''
        )}
      >
        <span
          className={cn(
            'text-xs font-medium truncate block max-w-[80px] text-center',
            isCurrentTurn ? 'text-yellow-400' : 'text-(--cream-dark) opacity-70'
          )}
        >
          {name}
        </span>
      </div>

      {/* Score display (multi-round games only) */}
      {showScore && (
        <div className="text-xs text-(--cream-dark) opacity-60 font-medium">
          {score ?? 0} pts
        </div>
      )}

      {/* Card count indicator — fan of card backs */}
      <CardCountFan cardCount={cardCount} />
    </div>
  );
};
