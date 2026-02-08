'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gamepad2, ArrowRight } from 'lucide-react';
import { generateRoomId, normalizeRoomId } from '@/lib/room-code';
import { Logo } from '@/components/ui/Logo';
import { CardFan } from '@/components/ui/CardFan';

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  // Defensive cleanup: clear stale creator intent on home page load
  useEffect(() => {
    sessionStorage.removeItem('room-creator');
  }, []);

  const handleCreate = () => {
    const id = generateRoomId();
    sessionStorage.setItem('room-creator', id);
    router.push(`/room/${id}`);
  };

  const handleJoin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomCode.trim()) {
      const normalizedCode = normalizeRoomId(roomCode);
      router.push(`/room/${normalizedCode}`);
    }
  };

  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        
        {/* Logo */}
        <Logo />

        {/* Card Fan Decoration */}
        <CardFan className="mt-2" />

        {/* Actions */}
        <div className="w-full flex flex-col items-center gap-6 mt-4">
          
          {/* Create Game Button */}
          <button 
            onClick={handleCreate}
            className="btn-copper w-full max-w-xs"
          >
            <Gamepad2 className="w-5 h-5" />
            Create New Game
          </button>

          {/* Divider */}
          <div className="divider-copper w-full max-w-xs">
            or join
          </div>

          {/* Join Game Form */}
          <div className="w-full max-w-xs">
            <form onSubmit={handleJoin} className="flex gap-2 w-full">
              <input 
                type="text" 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code..." 
                className="input-copper"
                aria-label="Room code"
              />
              <button 
                type="submit"
                disabled={!roomCode.trim()}
                className="btn-copper btn-copper-icon"
                aria-label="Join room"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Hint - aligned with input inner text (1rem padding + 2px border) */}
            <p className="text-xs opacity-50 text-left mt-2" style={{ paddingLeft: 'calc(1rem + 2px)' }}>
              e.g., Happy-Lions-42
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
