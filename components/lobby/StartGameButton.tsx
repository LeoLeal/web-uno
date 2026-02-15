import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MIN_PLAYERS, MAX_PLAYERS } from '@/lib/game/constants';

interface StartGameButtonProps {
  isHost: boolean;
  playerCount: number;
  onStart: () => void;
}

export const StartGameButton = ({ isHost, playerCount, onStart }: StartGameButtonProps) => {
  if (!isHost) {
    return (
      <p className="text-(--cream-dark) opacity-60 font-mono text-sm animate-pulse text-center">
        Waiting for host to start...
      </p>
    );
  }

  const canStart = playerCount >= MIN_PLAYERS && playerCount <= MAX_PLAYERS;
  const tooManyPlayers = playerCount > MAX_PLAYERS;

  const getButtonText = () => {
    if (tooManyPlayers) {
      return `Too many players (${playerCount}/${MAX_PLAYERS} max)`;
    }
    if (playerCount < MIN_PLAYERS) {
      return `Waiting for players (${playerCount}/${MIN_PLAYERS})`;
    }
    return "Start Game";
  };

  return (
    <button
      onClick={onStart}
      disabled={!canStart}
      className={cn(
        "btn-copper w-full md:w-auto",
        !canStart && "opacity-50 cursor-not-allowed hover:transform-none"
      )}
    >
      <Play className="w-5 h-5 fill-current" />
      {getButtonText()}
    </button>
  );
};
