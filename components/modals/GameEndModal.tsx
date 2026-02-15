'use client';

import Link from 'next/link';

interface PlayerStanding {
  clientId: number;
  name: string;
  score: number;
}

interface GameEndModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Whether the current user is the winner */
  isWinner: boolean;
  /** Whether the win was by walkover (all others disconnected) */
  isWalkover?: boolean;
  /** Final standings for multi-round games (sorted by score descending) */
  standings?: PlayerStanding[];
  /** Whether this is a multi-round game */
  isMultiRound?: boolean;
}

/**
 * Modal shown when the game ends - either by legitimate win or walkover.
 */
export const GameEndModal = ({
  isOpen,
  isWinner,
  isWalkover = false,
  standings,
  isMultiRound = false,
}: GameEndModalProps) => {
  if (!isOpen) return null;

  const getTitle = () => {
    if (isWinner) {
      return isWalkover ? 'Victory by Walkover!' : 'You Win! 🎉';
    }
    return isWalkover ? 'Game Ended' : 'Game Over';
  };

  const getMessage = () => {
    if (isMultiRound && !isWalkover) {
      if (isWinner) {
        return 'You reached the score limit first!';
      }
      return 'Someone reached the score limit!';
    }
    if (isWinner) {
      return isWalkover
        ? 'All other players disconnected. You win by default!'
        : 'Congratulations! You got rid of all your cards!';
    }
    return isWalkover
      ? 'All players disconnected. The game has ended.'
      : 'Better luck next time!';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="panel-felt p-8 max-w-md mx-4 text-center">
        {/* Icon */}
        <div className="text-6xl mb-4">
          {isWinner ? '🏆' : '😔'}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-(--cream) mb-2">
          {getTitle()}
        </h2>

        {/* Message */}
        <p className="text-(--cream-dark) opacity-70 mb-6">
          {getMessage()}
        </p>

        {/* Celebration or note */}
        {isWinner && !isMultiRound && (
          <div className="mb-6 p-4 bg-(--felt-dark) border border-(--copper-border) rounded-lg">
            <p className="text-sm text-(--cream-dark) opacity-60">
              {isWalkover
                ? 'Not the most exciting win, but a win is a win! 🎉'
                : 'Well played! 🎊'}
            </p>
          </div>
        )}

        {/* Final standings for multi-round games */}
        {isMultiRound && standings && standings.length > 0 && (
          <div className="mb-6 p-4 bg-(--felt-dark) border border-(--copper-border) rounded-lg">
            <h3 className="text-sm font-bold text-(--cream) uppercase tracking-wide mb-3">
              Final Standings
            </h3>
            <div className="space-y-2">
              {standings.map((player, index) => (
                <div
                  key={player.clientId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-(--cream-dark) opacity-70">
                    {index + 1}. {player.name}
                  </span>
                  <span className="font-bold text-(--cream)">
                    {player.score} pts
                  </span>
                </div>
              ))}
            </div>
            {isWalkover && (
              <div className="mt-3 pt-3 border-t border-(--copper-border)">
                <p className="text-xs text-(--cream-dark) opacity-60">
                  Game ended early due to walkover
                </p>
              </div>
            )}
          </div>
        )}

        {/* Back to lobby button */}
        <Link
          href="/"
          className="btn-copper"
        >
          ← Back to Lobby
        </Link>
      </div>
    </div>
  );
};
