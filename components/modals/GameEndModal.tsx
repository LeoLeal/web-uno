'use client';
import { EndType } from '@/lib/game/constants';

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
  /** The type of game end (WIN or INSUFFICIENT_PLAYERS) */
  endType: EndType | null;
  /** Final standings for multi-round games (sorted by score descending) */
  standings?: PlayerStanding[];
  /** Whether this is a multi-round game */
  isMultiRound?: boolean;
}

/**
 * Modal shown when the game ends - either by win or insufficient players.
 */
export const GameEndModal = ({
  isOpen,
  isWinner,
  endType,
  standings,
  isMultiRound = false,
}: GameEndModalProps) => {
  if (!isOpen) return null;

  // Handle insufficient players (game abandoned)
  if (endType === 'INSUFFICIENT_PLAYERS') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="panel-felt p-8 max-w-md mx-4 text-center">
          {/* Icon */}
          <div className="text-6xl mb-4">👥</div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-(--cream) mb-2">
            Game Ended
          </h2>

          {/* Message */}
          <p className="text-(--cream-dark) opacity-70 mb-6">
            Not enough players to continue
          </p>

          {/* Note */}
          <div className="mb-6 p-4 bg-(--felt-dark) border border-(--copper-border) rounded-lg">
            <p className="text-sm text-(--cream-dark) opacity-60">
              Too many players disconnected. The game cannot continue with fewer than 3 players.
            </p>
          </div>

          {/* Back to lobby button */}
          <a href="/" className="btn-copper">
            ← Back to Lobby
          </a>
        </div>
      </div>
    );
  }

  // Handle normal win
  const getTitle = () => {
    if (isWinner) {
      return 'You Win! 🎉';
    }
    return 'Game Over';
  };

  const getMessage = () => {
    if (isMultiRound) {
      if (isWinner) {
        return 'You reached the score limit first!';
      }
      return 'Someone reached the score limit!';
    }
    if (isWinner) {
      return 'Congratulations! You got rid of all your cards!';
    }
    return 'Better luck next time!';
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

        {/* Celebration */}
        {isWinner && !isMultiRound && (
          <div className="mb-6 p-4 bg-(--felt-dark) border border-(--copper-border) rounded-lg">
            <p className="text-sm text-(--cream-dark) opacity-60">
              Well played! 🎊
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
          </div>
        )}

        {/* Back to lobby button */}
        <a href="/" className="btn-copper">
          ← Back to Lobby
        </a>
      </div>
    </div>
  );
};
