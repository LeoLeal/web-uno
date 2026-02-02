'use client';

'use client';

import { useState, useEffect, use } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useGameState } from '@/hooks/useGameState';
import { PlayerList } from '@/components/lobby/PlayerList';
import { JoinGameModal } from '@/components/lobby/JoinGameModal';
import { StartGameButton } from '@/components/lobby/StartGameButton';
import { HostDisconnectModal } from '@/components/lobby/HostDisconnectModal';
import { getAvatar } from '@/lib/avatar';
import { formatRoomId } from '@/lib/room-code';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { players, isSynced, updateMyState, myClientId, amIHost, hostId, isHostConnected } = useRoom(id);
  const { status, startGame, initGame } = useGameState();
  const [hasJoined, setHasJoined] = useState(false);

  // Task 5.1: Initialize Game State
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
    <main className="flex min-h-screen flex-col items-center p-4 bg-slate-900 text-white pb-24 md:pb-4">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mt-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-300 flex items-center gap-2">
              <span className="text-white">Web Uno</span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono border border-slate-700">BETA</span>
            </h1>
             <div className="text-xs text-slate-500 font-mono mt-1 select-all cursor-pointer hover:text-white transition-colors"
                 onClick={() => navigator.clipboard.writeText(window.location.href)}>
                Room: {formatRoomId(id)} (Click to Copy)
             </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className={`w-3 h-3 rounded-full ${isSynced ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'} transition-colors`} />
             <span className="text-sm font-mono text-slate-400 hidden sm:inline">
               {isSynced ? 'Connected' : 'Connecting...'}
             </span>
          </div>
        </div>
        
        {/* Game Area */}
        <div className="min-h-[60vh]">
            {status === 'LOBBY' ? (
                <>
                   <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Lobby <span className="text-slate-500 text-sm ml-2">({players.length} Players)</span></h2>
                      {amIHost && <span className="text-xs text-yellow-500 uppercase font-bold tracking-widest border border-yellow-500/30 px-2 py-1 rounded">You are Host</span>}
                   </div>
                   <PlayerList players={players} myClientId={myClientId} hostId={hostId} />
                </>
            ) : (
                <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50">
                    <div className="text-center space-y-2">
                        <div className="text-4xl">🎮</div>
                        <h2 className="text-2xl font-bold">Game Started!</h2>
                        <p className="text-slate-400">The game engine is loading...</p>
                    </div>
                </div>
            )}
        </div>

        {/* Action Bar (Host Only) */}
        {status === 'LOBBY' && (
            <StartGameButton 
                isHost={amIHost} 
                playerCount={players.length} 
                onStart={startGame} 
            />
        )}

        {/* Modals - Show if synced and hasn't joined yet (works for both host and guests) */}
        <JoinGameModal isOpen={isSynced && !hasJoined} onJoin={handleJoin} />
        
        {/* Host Disconnect Modal - Shows when host disconnects */}
        <HostDisconnectModal isOpen={isHostConnected === false} />

      </div>
    </main>
  );
}
