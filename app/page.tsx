'use client';

import Link from 'next/link';
import { SubmitEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gamepad2, Users } from 'lucide-react';
import { normalizeRoomId } from '@/lib/room-code';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const handleJoin: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      const normalizedCode = normalizeRoomId(roomCode);
      router.push(`/room/${normalizedCode}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-900 text-white">
      <div className="z-10 max-w-md w-full items-center justify-between text-sm flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
            WEB UNO
          </h1>
          <p className="text-slate-400 text-lg">
            Peer-to-Peer • Serverless • Open Source
          </p>
        </div>

        {/* Actions Card */}
        <div className="w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 space-y-6">
          
          {/* Create Game */}
          <Link 
            href="/create" 
            className="group w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold text-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Gamepad2 className="w-6 h-6" />
            Create New Game
          </Link>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-500 font-bold">Or Join Room</span>
            </div>
          </div>

          {/* Join Game Input */}
          <form onSubmit={handleJoin} className="flex gap-2">
            <input 
              type="text" 
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="e.g., Happy-Lions-42" 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <button 
              type="submit"
              disabled={!roomCode.trim()}
              className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              <Users className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-slate-500 text-center">
            Tip: You can type with spaces or dashes
          </p>
        </div>

      </div>
    </main>
  )
}
