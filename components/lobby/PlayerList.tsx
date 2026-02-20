import { Player } from '@/hooks/useRoom';
import { getAvatar } from '@/lib/avatar';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatBalloon } from '@/components/game/ChatBalloon';
import type { ChatMessage } from '@/lib/websocket/ChatNetwork';
import styles from './PlayerList.module.css';

interface PlayerListProps {
  players: Player[];
  myClientId: number | null;
  hostId: number | null | undefined;
  chatMessages?: ChatMessage[];
}

export const PlayerList = ({ players, myClientId, hostId, chatMessages = [] }: PlayerListProps) => {
  if (players.length === 0) {
    return (
      <div className="col-span-full text-center p-8 text-(--cream-dark) opacity-60 animate-pulse">
        Waiting for peers to connect...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 w-full pt-6">
      {players.map((player) => {
        const isMe = player.clientId === myClientId;
        const isHost = player.clientId === hostId;
        const playerMessages = chatMessages.filter(m => m.clientId === player.clientId);
        const anchorName = `--lobby-player-${player.clientId}`;
        
        return (
          <div 
            key={player.clientId}
            className={cn(
              styles.card,
              "group flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 transition-all",
              isHost && isMe && styles.hostMe,
              isHost && !isMe && styles.hostGlow,
              isMe && !isHost && styles.highlighted
            )}
            style={{ anchorName } as React.CSSProperties}
          >
            {/* Host Crown in Circle */}
            {isHost && (
              <div className={styles.crownCircle}>
                <Crown className="w-5 h-5 text-amber-700 fill-current" />
              </div>
            )}

            {/* Avatar */}
            <div className={cn(
              "text-3xl sm:text-4xl mb-2 sm:mb-3 transition-transform group-hover:scale-110",
              isHost && "mt-2"
            )}>
              {player.avatar || getAvatar(player.clientId)}
            </div>

            {/* Name - Show "(Host)" suffix when viewing host from others' perspective */}
            <div className="font-bold text-sm sm:text-base md:text-lg truncate max-w-full text-center">
              {player.name}
              {isHost && !isMe && (
                <span className="text-yellow-600 text-xs sm:text-sm ml-1 block sm:inline">(Host)</span>
              )}
            </div>

            {/* Status Badge */}
            <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-wider font-bold">
              {isMe ? (
                <span className="text-blue-600">You</span>
              ) : (
                <span className="opacity-50">Connected</span>
              )}
            </div>

            <ChatBalloon messages={playerMessages} anchorName={anchorName} />
          </div>
        );
      })}
    </div>
  );
};
