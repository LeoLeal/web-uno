import { useState } from 'react';
import { Users } from 'lucide-react';

interface JoinGameModalProps {
  isOpen: boolean;
  onJoin: (name: string) => void;
}

export const JoinGameModal = ({ isOpen, onJoin }: JoinGameModalProps) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="panel-felt w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-(--cream)">Join the Game</h2>
          <p className="text-(--cream-dark) opacity-70">Enter your name to join the lobby.</p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onJoin(name.trim());
          }}
          className="space-y-4"
        >
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name (e.g. Alex)"
            className="input-copper w-full text-center font-bold text-lg"
            maxLength={12}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-copper w-full"
          >
            <Users className="w-5 h-5" />
            Join Lobby
          </button>
        </form>
      </div>
    </div>
  );
};
