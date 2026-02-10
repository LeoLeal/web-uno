'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GameAlreadyStartedModalProps {
  isOpen: boolean;
}

/**
 * Modal shown to late joiners when a game is already in progress.
 */
export const GameAlreadyStartedModal = ({ isOpen }: GameAlreadyStartedModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-(--felt) border border-(--copper-border) rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        {/* Icon */}
        <div className="text-6xl mb-4">🚫</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-(--cream) mb-2">
          Game Already Started
        </h2>

        {/* Message */}
        <p className="text-(--cream-dark) opacity-70 mb-6">
          This game is already in progress. You cannot join a game that has already started.
        </p>

        {/* Home button */}
        <Link
          href="/"
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all',
            'bg-(--copper) text-(--felt) hover:bg-(--copper-light)',
            'shadow-lg hover:shadow-xl'
          )}
        >
          ← Return to Home
        </Link>
      </div>
    </div>
  );
};
