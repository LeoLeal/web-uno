'use client';

import { cn } from '@/lib/utils';
import { UnoCard } from '@/components/ui/UnoCard';

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
            'relative w-14 h-14 rounded-full flex items-center justify-center text-2xl',
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
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-(--felt) flex items-center justify-center">
              <span className="text-xs">⚠️</span>
            </div>
          )}
        </div>
      </div>

      {/* Player name */}
      <span
        className={cn(
          'text-xs font-medium truncate max-w-[80px] text-center',
          isDisconnected && 'opacity-40',
          isCurrentTurn ? 'text-yellow-400' : 'text-(--cream-dark) opacity-70'
        )}
      >
        {name}
      </span>

      {/* Card count indicator — small card backs */}
      <div className="flex items-center gap-0.5">
        {cardCount <= 5 ? (
          // Show individual card backs for small counts
          Array.from({ length: cardCount }).map((_, i) => (
            <UnoCard
              key={i}
              symbol="back"
              size="sm"
              style={{
                width: 16,
                height: 24,
                marginLeft: i > 0 ? -8 : 0,
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
              }}
            />
          ))
        ) : (
          // Show count badge for larger hands
          <div className="flex items-center gap-1">
            <UnoCard
              symbol="back"
              size="sm"
              style={{
                width: 16,
                height: 24,
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
              }}
            />
            <span className="text-xs font-mono text-(--cream-dark)">×{cardCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};
