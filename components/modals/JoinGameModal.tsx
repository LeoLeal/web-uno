'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface JoinGameModalProps {
  isOpen: boolean;
  onJoin: (name: string) => void;
}

export const JoinGameModal = ({ isOpen, onJoin }: JoinGameModalProps) => {
  const [name, setName] = useState('');

  return (
    <Modal isOpen={isOpen} aria-labelledby="join-modal-title">
      <div className="text-center space-y-2 mb-6">
        <h2 id="join-modal-title" className="text-2xl font-bold text-(--cream)">
          Join the Game
        </h2>
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
          aria-label="Your name"
        />
        <button type="submit" disabled={!name.trim()} className="btn-copper w-full">
          <Users className="w-5 h-5" />
          Join Lobby
        </button>
      </form>
    </Modal>
  );
};
