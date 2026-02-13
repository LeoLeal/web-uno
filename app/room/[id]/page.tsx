'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useRoom } from '@/hooks/useRoom';
import { useGameState } from '@/hooks/useGameState';
import { useGameSettings } from '@/hooks/useGameSettings';
import { usePlayerHand } from '@/hooks/usePlayerHand';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useSessionResilience } from '@/hooks/useSessionResilience';
import { PlayerList } from '@/components/lobby/PlayerList';
import { JoinGameModal } from '@/components/modals/JoinGameModal';
import { StartGameButton } from '@/components/lobby/StartGameButton';
import { HostDisconnectModal } from '@/components/modals/HostDisconnectModal';
import { GameAlreadyStartedModal } from '@/components/modals/GameAlreadyStartedModal';
import { WaitingForPlayerModal } from '@/components/modals/WaitingForPlayerModal';
import { WinByWalkoverModal } from '@/components/modals/WinByWalkoverModal';
import { GameSettingsPanel } from '@/components/lobby/GameSettingsPanel';
import { GameBoard } from '@/components/game/GameBoard';
import { getAvatar } from '@/lib/avatar';
import { formatRoomId } from '@/lib/room-code';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { players, isSynced, updateMyState, myClientId, amIHost, hostId, isHostConnected } = useRoom(id);
  const { status, currentTurn, discardPile, playerCardCounts, turnOrder, lockedPlayers, orphanHands, winner, initGame } = useGameState();
  const { settings } = useGameSettings();
  const { hand } = usePlayerHand({ myClientId });
  const [hasJoined, setHasJoined] = useState(false);

  // Game engine — host-only deck management and dealing (hands delivered via Yjs)
  const { initializeGame, deckRef } = useGameEngine({
    players,
    myClientId,
    startingHandSize: settings.startingHandSize,
  });

  // Session resilience — host-only disconnect handling and pause management
  const { continueWithout } = useSessionResilience({
    status,
    lockedPlayers,
    orphanHands,
    currentTurn,
    turnOrder,
    playerCardCounts,
    activePlayers: players,
    deckRef,
  });

  // Initialize Game State
  useEffect(() => {
    if (isSynced) {
      initGame();
    }
  }, [isSynced, initGame]);

  const handleJoin = (name: string) => {
    updateMyState({ name, avatar: getAvatar(myClientId || 0) });
    setHasJoined(true);
  };

  // Start game handler — host triggers initializeGame
  const handleStartGame = () => {
    if (amIHost) {
      initializeGame();
    }
  };

  // Late joiner detection: game is playing but I'm not in locked players list
  // Allow joins during PAUSED_WAITING_PLAYER (replacement players)
  const isLateJoiner =
    status === 'PLAYING' &&
    lockedPlayers.length > 0 &&
    myClientId !== null &&
    !lockedPlayers.some((p) => p.clientId === myClientId);

  return (
    <main className="relative z-10 flex flex-col h-screen items-center p-4 pb-8 md:pb-4">
      <div className="w-full max-w-6xl flex-1 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-(--copper-border) pb-4 mt-4 flex-shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-(--cream)">P2P Uno</span>
              <span className="text-xs bg-(--felt-dark) px-2 py-1 rounded text-(--cream-dark) font-mono border border-(--copper-border)">BETA</span>
            </h1>
            <div className="text-xs text-(--cream-dark) opacity-70 font-mono mt-1 select-none cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => navigator.clipboard.writeText(window.location.href)}>
              Room: {formatRoomId(id)} (Click to copy URL)
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isSynced ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'} transition-colors`} />
              <span className="text-sm font-mono text-(--cream-dark) opacity-70 hidden sm:inline">
                {isSynced ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 border border-red-400/50 rounded-lg hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Leave</span>
            </Link>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col min-h-0 pb-52 md:pb-0">
          {status === 'LOBBY' ? (
            <>
              <div className="mb-6 mt-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-(--cream)">Lobby <span className="text-(--cream-dark) opacity-60 text-sm ml-2">({players.length} Players)</span></h2>
                {amIHost && <span className="text-xs text-yellow-500 uppercase font-bold tracking-widest border border-yellow-500/30 px-2 py-1 rounded">You are Host</span>}
              </div>
              <PlayerList players={players} myClientId={myClientId} hostId={hostId} />
            </>
          ) : (
            <GameBoard
              players={players}
              myClientId={myClientId}
              hostId={hostId}
              currentTurn={currentTurn}
              hand={hand}
              discardPile={discardPile}
              playerCardCounts={playerCardCounts}
              orphanHands={orphanHands}
              isFrozen={status === 'PAUSED_WAITING_PLAYER'}
            />
          )}
        </div>

        {/* Game Settings & Action Bar */}
        {status === 'LOBBY' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 bg-(--felt-dark)/90 md:bg-transparent border-t border-(--copper-border) md:border-0 backdrop-blur-md md:backdrop-blur-none z-40">
            <div className="space-y-4 max-w-md mx-auto md:max-w-none md:mx-0">
              <GameSettingsPanel isHost={amIHost} />
              <StartGameButton
                isHost={amIHost}
                playerCount={players.length}
                onStart={handleStartGame}
              />
            </div>
          </div>
        )}

        {/* Modals */}
        <JoinGameModal isOpen={isSynced && !hasJoined && isHostConnected !== false} onJoin={handleJoin} />
        {isHostConnected === false && <HostDisconnectModal />}
        <GameAlreadyStartedModal isOpen={isLateJoiner} />
        <WaitingForPlayerModal
          isOpen={status === 'PAUSED_WAITING_PLAYER'}
          orphanHands={orphanHands}
          isHost={amIHost}
          onContinueWithout={amIHost ? continueWithout : undefined}
        />
        <WinByWalkoverModal
          isOpen={status === 'ENDED' && winner !== null}
          isWinner={myClientId === winner}
        />

      </div>
    </main>
  );
}

