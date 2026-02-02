import { Player } from '@/hooks/useRoom';
import { getAvatar } from '@/lib/avatar';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerListProps {
  players: Player[];
  myClientId: number | null;
}

export const PlayerList = ({ players, myClientId }: PlayerListProps) => {
  if (players.length === 0) {
    return (
      <div className="col-span-full text-center p-8 text-slate-500 animate-pulse">
        Waiting for peers to connect...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {players.map((player) => {
        const isMe = player.clientId === myClientId;
        
        return (
          <div 
            key={player.clientId}
            className={cn(
              "relative group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all",
              "bg-slate-800",
              isMe ? "border-blue-500 shadow-lg shadow-blue-500/20" : "border-slate-700",
              player.isHost && !isMe ? "border-yellow-500/50" : ""
            )}
          >
            {/* Host Crown */}
            {player.isHost && (
              <div className="absolute -top-3 bg-slate-900 px-2 text-yellow-500">
                <Crown className="w-6 h-6 fill-current" />
              </div>
            )}

            {/* Avatar */}
            <div className="text-4xl mb-3 transition-transform group-hover:scale-110">
              {player.avatar || getAvatar(player.clientId)}
            </div>

            {/* Name - Show "(Host)" suffix when viewing host from others' perspective */}
            <div className="font-bold text-lg text-white truncate max-w-full">
              {player.name}
              {player.isHost && !isMe && (
                <span className="text-yellow-500 text-sm ml-1">(Host)</span>
              )}
            </div>

            {/* Status Badge */}
            <div className="mt-2 text-xs uppercase tracking-wider font-bold">
              {isMe ? (
                <span className="text-blue-400">You</span>
              ) : (
                <span className="text-slate-500">Connected</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
