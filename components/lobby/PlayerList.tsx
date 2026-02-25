import { Player } from '@/hooks/useRoom';
import { getAvatar } from '@/lib/avatar';
import { Crown, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatBalloon } from '@/components/game/ChatBalloon';
import type { ChatMessage } from '@/lib/websocket/ChatNetwork';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './PlayerList.module.css';

interface PlayerListProps {
  players: Player[];
  myClientId: number | null;
  hostId: number | null | undefined;
  chatMessages?: ChatMessage[];
  amIHost?: boolean;
  onReorder?: (orderedIds: number[]) => void;
}

interface PlayerCardProps {
  player: Player;
  myClientId: number | null;
  hostId: number | null | undefined;
  chatMessages: ChatMessage[];
  draggable: boolean;
}

const PlayerCard = ({ player, myClientId, hostId, chatMessages, draggable }: PlayerCardProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: player.clientId,
    disabled: !draggable,
  });
  const isMe = player.clientId === myClientId;
  const isHost = player.clientId === hostId;
  const playerMessages = chatMessages.filter((message) => message.clientId === player.clientId);
  const anchorName = `--lobby-player-${player.clientId}`;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative',
        isDragging && styles.draggingSlot
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div
        className={cn(
          styles.card,
          'group flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 transition-all',
          isHost && isMe && styles.hostMe,
          isHost && !isMe && styles.hostGlow,
          isMe && !isHost && styles.highlighted,
          isDragging && styles.dragging
        )}
        style={{ anchorName } as React.CSSProperties}
      >
        {draggable && (
          <button
            ref={setActivatorNodeRef}
            type="button"
            className={styles.dragHandle}
            aria-label={`Reorder ${player.name}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}

        {isHost && (
          <div className={styles.crownCircle}>
            <Crown className="w-5 h-5 text-amber-700 fill-current" />
          </div>
        )}

        <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 transition-transform group-hover:scale-110">
          {player.avatar || getAvatar(player.clientId)}
        </div>

        <div className="font-bold text-sm sm:text-base md:text-lg truncate max-w-full text-center">
          {player.name}
          {isHost && !isMe && (
            <span className="text-yellow-600 text-xs sm:text-sm ml-1 block sm:inline">(Host)</span>
          )}
        </div>

        <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-wider font-bold">
          {isMe ? (
            <span className="text-blue-600">You</span>
          ) : (
            <span className="opacity-50">Connected</span>
          )}
        </div>

        <ChatBalloon messages={playerMessages} anchorName={anchorName} />
      </div>
    </div>
  );
};

export const PlayerList = ({
  players,
  myClientId,
  hostId,
  chatMessages = [],
  amIHost = false,
  onReorder,
}: PlayerListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 120,
        tolerance: 8,
      },
    })
  );

  const isSortable = amIHost && typeof onReorder === 'function';
  const playerIds = players.map((player) => player.clientId);

  if (players.length === 0) {
    return (
      <div className="col-span-full text-center p-8 text-(--cream-dark) opacity-60 animate-pulse">
        Waiting for peers to connect...
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isSortable || !event.over || event.active.id === event.over.id || !onReorder) {
      return;
    }

    const oldIndex = playerIds.indexOf(Number(event.active.id));
    const newIndex = playerIds.indexOf(Number(event.over.id));

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const nextOrder = arrayMove(playerIds, oldIndex, newIndex);
    onReorder(nextOrder);
  };

  if (!isSortable) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 w-full pt-6">
        {players.map((player) => (
          <PlayerCard
            key={player.clientId}
            player={player}
            myClientId={myClientId}
            hostId={hostId}
            chatMessages={chatMessages}
            draggable={false}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={playerIds} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 w-full pt-6">
          {players.map((player) => (
            <PlayerCard
              key={player.clientId}
              player={player}
              myClientId={myClientId}
              hostId={hostId}
              chatMessages={chatMessages}
              draggable
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
