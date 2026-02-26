'use client';

interface PlayerStanding {
  clientId: number;
  name: string;
  score: number;
}

interface RoundEndModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Winner's name for this round */
  winnerName: string;
  /** Points gained this round */
  roundPoints: number;
  /** Current standings sorted by score descending */
  standings: PlayerStanding[];
  /** Score limit target */
  scoreLimit: number;
  /** Whether the current user is the host */
  isHost: boolean;
  /** Handler for host clicking "Next Round" */
  onNextRound?: () => void;
}

/**
 * Modal shown when a round ends in a multi-round game.
 * Displays round results, current standings, and "Next Round" button (host only).
 */
export const RoundEndModal = ({
  isOpen,
  winnerName,
  roundPoints,
  standings,
  scoreLimit,
  isHost,
  onNextRound,
}: RoundEndModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="panel-felt p-8 max-w-lg mx-4 text-center">
        {/* Trophy icon */}
        <div className="text-6xl mb-4">
          🏆
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-(--cream) mb-2">
          Round Complete!
        </h2>

        {/* Round result */}
        <p className="text-(--cream-dark) opacity-90 mb-4">
          <span className="font-bold text-(--cream)">{winnerName}</span> wins this round
          and gains <span className="font-bold text-yellow-400">{roundPoints} points</span>!
        </p>

        {/* Current standings */}
        <div className="mb-6 p-4 bg-(--felt-dark) border border-(--copper-border) rounded-lg">
          <h3 className="text-sm font-bold text-(--cream) uppercase tracking-wide mb-3">
            Standings
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
          <div className="mt-3 pt-3 border-t border-(--copper-border) opacity-50">
            <p className="text-xs text-(--cream-dark)">
              Playing to {scoreLimit === Infinity ? '∞' : scoreLimit} points
            </p>
          </div>
        </div>

        {/* Action button */}
        {isHost ? (
          <button
            onClick={onNextRound}
            className="btn-copper w-full"
          >
            Next Round →
          </button>
        ) : (
          <p className="text-sm text-(--cream-dark) opacity-60">
            Waiting for host to start next round...
          </p>
        )}
      </div>
    </div>
  );
};
