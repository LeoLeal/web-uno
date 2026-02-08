'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { useRoom } from '@/hooks/useRoom';
import { useGameState } from '@/hooks/useGameState';
import { PlayerList } from '@/components/lobby/PlayerList';
import { JoinGameModal } from '@/components/lobby/JoinGameModal';
import { StartGameButton } from '@/components/lobby/StartGameButton';
import { HostDisconnectModal } from '@/components/lobby/HostDisconnectModal';
import { GameSettingsPanel } from '@/components/lobby/GameSettingsPanel';
import { getAvatar } from '@/lib/avatar';
import { formatRoomId } from '@/lib/room-code';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { players, isSynced, updateMyState, myClientId, amIHost, hostId, isHostConnected } = useRoom(id);
  const { status, startGame, initGame } = useGameState();
  const [hasJoined, setHasJoined] = useState(false);

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

  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center p-4 pb-24 md:pb-4">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-(--copper-border) pb-4 mt-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-(--cream)">P2P Uno</span>
              <span className="text-xs bg-(--felt-dark) px-2 py-1 rounded text-(--cream-dark) font-mono border border-(--copper-border)">BETA</span>
            </h1>
             <div className="text-xs text-(--cream-dark) opacity-70 font-mono mt-1 select-all cursor-pointer hover:opacity-100 transition-opacity"
                 onClick={() => navigator.clipboard.writeText(window.location.href)}>
                Room: {formatRoomId(id)} (Click to copy room URL)
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
        <div>
            {status === 'LOBBY' ? (
                <>
                   <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-(--cream)">Lobby <span className="text-(--cream-dark) opacity-60 text-sm ml-2">({players.length} Players)</span></h2>
                      {amIHost && <span className="text-xs text-yellow-500 uppercase font-bold tracking-widest border border-yellow-500/30 px-2 py-1 rounded">You are Host</span>}
                   </div>
                   <PlayerList players={players} myClientId={myClientId} hostId={hostId} />
                </>
            ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-(--copper-border) rounded-xl bg-(--felt-dark)/50">
                    <div className="text-center space-y-2">
                        <div className="text-4xl">🎮</div>
                        <h2 className="text-2xl font-bold text-(--cream)">Game Started!</h2>
                        <p className="text-(--cream-dark) opacity-70">The game engine is loading...</p>
                    </div>
                </div>
            )}
        </div>

        {/* Game Settings & Action Bar */}
        {status === 'LOBBY' && (
            <div className="space-y-4">
                <GameSettingsPanel isHost={amIHost} />
                <StartGameButton 
                    isHost={amIHost} 
                    playerCount={players.length} 
                    onStart={startGame} 
                />
            </div>
        )}

        {/* Modals - Show if synced and hasn't joined yet (works for both host and guests) */}
        {/* Only show Join Modal if host is NOT disconnected (null or true) */}
        <JoinGameModal isOpen={isSynced && !hasJoined && isHostConnected !== false} onJoin={handleJoin} />
        
        {/* Host Disconnect Modal - Shows when host disconnects */}
        <HostDisconnectModal isOpen={isHostConnected === false} />

      </div>
    </main>
  );
}
