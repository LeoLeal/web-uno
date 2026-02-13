'use client';

import { OrphanHand } from '@/hooks/useGameState';
import { cn } from '@/lib/utils';

interface WaitingForPlayerModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Orphan hands (disconnected players) */
  orphanHands: OrphanHand[];
  /** Whether the current user is the host */
  isHost: boolean;
  /** Callback to continue without a specific player (host-only) */
  onContinueWithout?: (orphanClientId: number) => void;
}

/**
 * Modal shown when the game is paused due to player disconnection.
 * Displays disconnected players and allows host to continue without them.
 */
export const WaitingForPlayerModal = ({
  isOpen,
  orphanHands,
  isHost,
  onContinueWithout,
}: WaitingForPlayerModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-(--felt) border border-(--copper-border) rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        {/* Icon */}
        <div className="text-6xl mb-4">⏸️</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-(--cream) mb-2">
          Game Paused
        </h2>

        {/* Message */}
        <p className="text-(--cream-dark) opacity-70 mb-4">
          Waiting for {orphanHands.length === 1 ? 'a player' : 'players'} to rejoin
        </p>

        {/* Disconnected players list */}
        <div className="space-y-3 mb-6">
          {orphanHands.map((orphan) => (
            <div
              key={orphan.originalClientId}
              className="bg-(--felt-dark) border border-(--copper-border) rounded-lg p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl opacity-50">👤</div>
                  <div className="text-left">
                    <div className="font-semibold text-(--cream)">
                      {orphan.originalName}
                    </div>
                    <div className="text-xs text-(--cream-dark) opacity-60">
                      {orphan.cards.length} {orphan.cards.length === 1 ? 'card' : 'cards'}
                    </div>
                  </div>
                </div>

                {/* Host-only action */}
                {isHost && onContinueWithout && (
                  <button
                    onClick={() => onContinueWithout(orphan.originalClientId)}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg font-medium transition-all',
                      'bg-red-500/20 text-red-400 border border-red-400/50',
                      'hover:bg-red-500/30 hover:border-red-400'
                    )}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info text */}
        {!isHost && (
          <p className="text-xs text-(--cream-dark) opacity-50">
            The host will decide whether to wait or continue without the disconnected {orphanHands.length === 1 ? 'player' : 'players'}.
          </p>
        )}

        {isHost && (
          <p className="text-xs text-(--cream-dark) opacity-50">
            You can remove players to continue, or wait for them to rejoin.
          </p>
        )}
      </div>
    </div>
  );
};
