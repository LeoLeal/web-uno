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
      <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 bg-slate-900/90 md:bg-transparent border-t border-slate-800 md:border-0 backdrop-blur-md md:backdrop-blur-none text-center">
        <p className="text-slate-500 font-mono text-sm animate-pulse">
          Waiting for host to start...
        </p>
      </div>
    );
  }

  const canStart = playerCount >= 3;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 bg-slate-900/90 md:bg-transparent border-t border-slate-800 md:border-0 backdrop-blur-md md:backdrop-blur-none z-40">
      <button
        onClick={onStart}
        disabled={!canStart}
        className={cn(
          "w-full md:w-auto flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-bold text-lg shadow-xl transition-all",
          canStart 
            ? "bg-green-600 hover:bg-green-500 hover:scale-105 text-white" 
            : "bg-slate-700 text-slate-400 cursor-not-allowed"
        )}
      >
        <Play className="w-5 h-5 fill-current" />
        {canStart ? "Start Game" : `Waiting for players (${playerCount}/3)`}
      </button>
    </div>
  );
};
