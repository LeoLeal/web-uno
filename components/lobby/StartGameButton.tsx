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
      <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 bg-(--felt-dark)/90 md:bg-transparent border-t border-(--copper-border) md:border-0 backdrop-blur-md md:backdrop-blur-none text-center">
        <p className="text-(--cream-dark) opacity-60 font-mono text-sm animate-pulse">
          Waiting for host to start...
        </p>
      </div>
    );
  }

  const canStart = playerCount >= 3;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 bg-(--felt-dark)/90 md:bg-transparent border-t border-(--copper-border) md:border-0 backdrop-blur-md md:backdrop-blur-none z-40">
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
    </div>
  );
};
