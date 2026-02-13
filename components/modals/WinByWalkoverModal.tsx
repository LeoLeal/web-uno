'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface WinByWalkoverModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Whether the current user is the winner */
  isWinner: boolean;
}

/**
 * Modal shown when a player wins by walkover (all other players disconnected).
 */
export const WinByWalkoverModal = ({
  isOpen,
  isWinner,
}: WinByWalkoverModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-(--felt) border border-(--copper-border) rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        {/* Icon */}
        <div className="text-6xl mb-4">
          {isWinner ? '🏆' : '😔'}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-(--cream) mb-2">
          {isWinner ? 'Victory by Walkover!' : 'Game Ended'}
        </h2>

        {/* Message */}
        <p className="text-(--cream-dark) opacity-70 mb-6">
          {isWinner
            ? 'All other players disconnected. You win by default!'
            : 'All players disconnected. The game has ended.'}
        </p>

        {/* Celebration or condolence */}
        {isWinner && (
          <div className="mb-6 p-4 bg-(--felt-dark) border border-(--copper-border) rounded-lg">
            <p className="text-sm text-(--cream-dark) opacity-60">
              Not the most exciting win, but a win is a win! 🎉
            </p>
          </div>
        )}

        {/* Back to lobby button */}
        <Link
          href="/"
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all',
            'bg-(--copper) text-(--felt) hover:bg-(--copper-light)',
            'shadow-lg hover:shadow-xl'
          )}
        >
          ← Back to Lobby
        </Link>
      </div>
    </div>
  );
};
