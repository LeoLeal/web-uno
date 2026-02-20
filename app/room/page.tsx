'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut, Users, Volume2, VolumeX } from 'lucide-react';
import { useRoom } from '@/hooks/useRoom';
import { useGameState } from '@/hooks/useGameState';
import { useGameSettings } from '@/hooks/useGameSettings';
import { usePlayerHand } from '@/hooks/usePlayerHand';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useSessionResilience } from '@/hooks/useSessionResilience';
import { useGamePlay } from '@/hooks/useGamePlay';
import { useGameAudioFeedback } from '@/hooks/useGameAudioFeedback';
import { useChatNetwork } from '@/hooks/useChatNetwork';
import { CardColor } from '@/lib/game/cards';
import { MAX_PLAYERS } from '@/lib/game/constants';
import { PlayerList } from '@/components/lobby/PlayerList';
import { JoinGameModal } from '@/components/modals/JoinGameModal';
import { StartGameButton } from '@/components/lobby/StartGameButton';
import { HostDisconnectModal } from '@/components/modals/HostDisconnectModal';
import { GameAlreadyStartedModal } from '@/components/modals/GameAlreadyStartedModal';
import { WaitingForPlayerModal } from '@/components/modals/WaitingForPlayerModal';
import { GameEndModal } from '@/components/modals/GameEndModal';
import { RoundEndModal } from '@/components/modals/RoundEndModal';
import { GameSettingsPanel } from '@/components/lobby/GameSettingsPanel';
import { ChatInput } from '@/components/game/ChatInput';
import { GameBoard } from '@/components/game/GameBoard';
import { getAvatar } from '@/lib/avatar';
import { formatRoomId } from '@/lib/room-code';
import { GameProvider } from '@/components/providers/GameProvider';

const RoomPageContent = ({ id }: { id: string }) => {
  const navigate = useNavigate();

  const { players, isSynced, updateMyState, myClientId, amIHost, hostId, isHostConnected, isGameFull } = useRoom(id);
  const { status, currentTurn, discardPile, playerCardCounts, turnOrder, lockedPlayers, orphanHands, winner, endType, scores, lastRoundPoints, lastPlayedBy, initGame } = useGameState();
  const { settings } = useGameSettings();
  const { hand } = usePlayerHand({ myClientId });
  const [hasJoined, setHasJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Chat Network
  const { messages: chatMessages, sendMessage } = useChatNetwork(id, myClientId, isSynced, players);

  // Game engine — host-only deck management and dealing (hands delivered via Yjs)
  const { initializeGame, initializeRound, deckRef } = useGameEngine({
    players,
    myClientId,
    startingHandSize: settings.startingHandSize,
    isHost: amIHost,
    scoreLimit: settings.scoreLimit,
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
    isHost: amIHost,
  });

  // Gameplay — action submission and validation
  const { submitAction, canPlayCard } = useGamePlay(myClientId);

  useGameAudioFeedback({
    status,
    myClientId,
    currentTurn,
    discardPile,
    playerCardCounts,
    isMuted,
  });

  // Initialize Game State
  useEffect(() => {
    if (isSynced) {
      initGame();
    }
  }, [isSynced, initGame]);

  // Compute game full state declaratively
  const showGameFullModal = isSynced && !hasJoined && status === 'LOBBY' && (players.length >= MAX_PLAYERS || isGameFull);

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

  // Gameplay action handlers
  const handlePlayCard = (cardId: string, chosenColor?: CardColor) => {
    submitAction({ type: 'PLAY_CARD', cardId, chosenColor });
  };

  const handleDrawCard = () => {
    submitAction({ type: 'DRAW_CARD' });
  };

  // Late joiner detection: game is playing but I'm not in locked players list
  // Allow joins during PAUSED_WAITING_PLAYER (replacement players)
  const isLateJoiner =
    status === 'PLAYING' &&
    lockedPlayers.length > 0 &&
    myClientId !== null &&
    !lockedPlayers.some((p) => p.clientId === myClientId);

  // Prepare standings for round-end and game-end modals
  const standings = lockedPlayers
    .map((player) => ({
      clientId: player.clientId,
      name: player.name,
      score: scores[player.clientId] || 0,
    }))
    .sort((a, b) => b.score - a.score);

  const winnerName = winner !== null ? lockedPlayers.find((p) => p.clientId === winner)?.name || 'Player' : 'Player';

  const roundPoints = lastRoundPoints;

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
            <button
              onClick={() => setIsMuted((current) => !current)}
              className="p-2 text-(--cream-dark) border border-(--copper-border) rounded-lg hover:text-(--cream) hover:border-(--copper-light) hover:bg-(--copper-light)/10 transition-all"
              aria-label={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
              title={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-400 border border-red-400/50 rounded-lg hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex flex-col min-h-0 pb-52 md:pb-0">
          {status === 'LOBBY' ? (
            <>
              <div className="mb-6 mt-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-(--cream)">Lobby <span className="text-(--cream-dark) opacity-60 text-sm ml-2 align-middle inline-flex items-center justify-center gap-1"><Users className="w-4 h-4" /> {players.length}/{MAX_PLAYERS} players</span></h2>
                {amIHost && <span className="text-xs text-yellow-500 uppercase font-bold tracking-widest border border-yellow-500/30 px-2 py-1 rounded">You are Host</span>}
              </div>
              <PlayerList players={players} myClientId={myClientId} hostId={hostId} chatMessages={chatMessages} />
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
              scores={scores}
              scoreLimit={settings.scoreLimit}
              orphanHands={orphanHands}
              isFrozen={status === 'PAUSED_WAITING_PLAYER' || status === 'ROUND_ENDED'}
              isMuted={isMuted}
              lastPlayedBy={lastPlayedBy}
              onPlayCard={handlePlayCard}
              onDrawCard={handleDrawCard}
              canPlayCard={canPlayCard}
              chatMessages={chatMessages}
              onSendMessage={sendMessage}
            />
          )}
        </div>

        {/* Game Settings & Action Bar */}
        {status === 'LOBBY' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 md:static md:p-0 bg-(--felt-dark)/90 md:bg-transparent border-t border-(--copper-border) md:border-0 backdrop-blur-md md:backdrop-blur-none z-40">
            <div className="space-y-4 max-w-md mx-auto md:max-w-none md:mx-0 w-full">
              
              <div className="w-full">
                <ChatInput onSendMessage={sendMessage} placeholder="Chat in lobby..." />
              </div>

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
        <JoinGameModal isOpen={isSynced && !hasJoined && isHostConnected !== false && !showGameFullModal} onJoin={handleJoin} />
        
        {/* Game Full Modal - shown when room is at capacity */}
        {showGameFullModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="panel-felt p-8 max-w-md mx-4 text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-(--cream) mb-2">
                Game Full
              </h2>
              <p className="text-(--cream-dark) opacity-70 mb-2">
                This game already has {MAX_PLAYERS} players.
              </p>
              <p className="text-(--cream-dark) opacity-50 text-sm mb-6">
                Please create a new game or join a different room.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="btn-copper"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}
        {isHostConnected === false && <HostDisconnectModal />}
        <GameAlreadyStartedModal isOpen={isLateJoiner} />
        <WaitingForPlayerModal
          isOpen={status === 'PAUSED_WAITING_PLAYER'}
          orphanHands={orphanHands}
          isHost={amIHost}
          onContinueWithout={amIHost ? continueWithout : undefined}
        />
        <RoundEndModal
          isOpen={status === 'ROUND_ENDED'}
          winnerName={winnerName}
          roundPoints={roundPoints}
          standings={standings}
          scoreLimit={settings.scoreLimit || 0}
          isHost={amIHost}
          onNextRound={amIHost ? initializeRound : undefined}
        />
        <GameEndModal
          isOpen={status === 'ENDED'}
          isWinner={winner !== null && myClientId === winner}
          endType={endType}
          standings={settings.scoreLimit !== null ? standings : undefined}
          isMultiRound={settings.scoreLimit !== null}
        />

      </div>
    </main>
  );
};

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <GameProvider>
      <RoomPageContent id={id} />
    </GameProvider>
  );
}
