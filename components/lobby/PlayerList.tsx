import { Player } from '@/hooks/useRoom';
import { getAvatar } from '@/lib/avatar';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './PlayerList.module.css';

interface PlayerListProps {
  players: Player[];
  myClientId: number | null;
  hostId: number | null;
}

export const PlayerList = ({ players, myClientId, hostId }: PlayerListProps) => {
  if (players.length === 0) {
    return (
      <div className="col-span-full text-center p-8 text-(--cream-dark) opacity-60 animate-pulse">
        Waiting for peers to connect...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full pt-6">
      {players.map((player) => {
        const isMe = player.clientId === myClientId;
        const isHost = player.clientId === hostId;
        
        return (
          <div 
            key={player.clientId}
            className={cn(
              styles.card,
              "group flex flex-col items-center justify-center p-6 transition-all",
              isHost && isMe && styles.hostMe,
              isHost && !isMe && styles.hostGlow,
              isMe && !isHost && styles.highlighted
            )}
          >
            {/* Host Crown in Circle */}
            {isHost && (
              <div className={styles.crownCircle}>
                <Crown className="w-5 h-5 text-amber-700 fill-current" />
              </div>
            )}

            {/* Avatar */}
            <div className={cn(
              "text-4xl mb-3 transition-transform group-hover:scale-110",
              isHost && "mt-2"
            )}>
              {player.avatar || getAvatar(player.clientId)}
            </div>

            {/* Name - Show "(Host)" suffix when viewing host from others' perspective */}
            <div className="font-bold text-lg truncate max-w-full">
              {player.name}
              {isHost && !isMe && (
                <span className="text-yellow-600 text-sm ml-1">(Host)</span>
              )}
            </div>

            {/* Status Badge */}
            <div className="mt-2 text-xs uppercase tracking-wider font-bold">
              {isMe ? (
                <span className="text-blue-600">You</span>
              ) : (
                <span className="opacity-50">Connected</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
