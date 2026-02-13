import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const canStart = playerCount >= 3;

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
      {canStart ? "Start Game" : `Waiting for players (${playerCount}/3)`}
    </button>
  );
};
