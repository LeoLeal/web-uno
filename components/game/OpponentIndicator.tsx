'use client';

import { cn } from '@/lib/utils';
import { CardCountFan } from '@/components/ui/CardCountFan';

interface OpponentIndicatorProps {
  name: string;
  avatar: string;
  cardCount: number;
  isCurrentTurn: boolean;
  isHost?: boolean;
  isDisconnected?: boolean;
  className?: string;
}

/**
 * Circular avatar with card count for an opponent.
 * Highlighted with golden glow when it's their turn.
 * Shows a crown icon above the avatar for the host.
 */
export const OpponentIndicator = ({
  name,
  avatar,
  cardCount,
  isCurrentTurn,
  isHost = false,
  isDisconnected = false,
  className,
}: OpponentIndicatorProps) => {
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
        >
          {avatar}

          {/* Disconnect indicator overlay */}
          {isDisconnected && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500 border-2 border-(--felt) flex items-center justify-center">
              <span className="text-sm">⚠️</span>
            </div>
          )}
        </div>
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

      {/* Card count indicator — fan of card backs */}
      <CardCountFan cardCount={cardCount} />
    </div>
  );
};
