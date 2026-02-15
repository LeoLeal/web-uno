'use client';

import { useState } from 'react';
import { Users, UsersRound } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { MAX_PLAYERS, PLAYER_LIMIT_MESSAGES } from '@/lib/game/constants';

interface JoinGameModalProps {
  isOpen: boolean;
  onJoin: (name: string) => void;
  playerCount?: number;
}

export const JoinGameModal = ({ isOpen, onJoin, playerCount = 0 }: JoinGameModalProps) => {
  const [name, setName] = useState('');
  const isGameFull = playerCount >= MAX_PLAYERS;

  if (isGameFull) {
    return (
      <Modal isOpen={isOpen} aria-labelledby="join-modal-title">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <UsersRound className="w-16 h-16 text-(--cream-dark) opacity-50" />
          </div>
          <h2 id="join-modal-title" className="text-2xl font-bold text-(--cream)">
            Game Full
          </h2>
          <p className="text-(--cream-dark) opacity-70">
            {PLAYER_LIMIT_MESSAGES.gameFull}
          </p>
          <p className="text-(--cream-dark) opacity-50 text-sm">
            {PLAYER_LIMIT_MESSAGES.tryNewGame}
          </p>
        </div>
      </Modal>
    );
  }

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
