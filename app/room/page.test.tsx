import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const useRoomMock = vi.fn();

vi.mock('@/hooks/useRoom', () => ({
  useRoom: (...args: unknown[]) => useRoomMock(...args),
}));

vi.mock('@/hooks/useGameState', () => ({
  useGameState: () => ({
    status: 'LOBBY',
    currentTurn: null,
    discardPile: [],
    playerCardCounts: {},
    turnOrder: [],
    lockedPlayers: [],
    orphanHands: [],
    winner: null,
    endType: null,
    scores: {},
    lastRoundPoints: 0,
    initGame: vi.fn(),
  }),
}));

vi.mock('@/hooks/useGameSettings', () => ({
  useGameSettings: () => ({
    settings: { startingHandSize: 7, scoreLimit: null },
  }),
}));

vi.mock('@/hooks/usePlayerHand', () => ({
  usePlayerHand: () => ({ hand: [] }),
}));

vi.mock('@/hooks/useGameEngine', () => ({
  useGameEngine: () => ({
    initializeGame: vi.fn(),
    initializeRound: vi.fn(),
    deckRef: { current: [] },
  }),
}));

vi.mock('@/hooks/useSessionResilience', () => ({
  useSessionResilience: () => ({ continueWithout: vi.fn() }),
}));

vi.mock('@/hooks/useGamePlay', () => ({
  useGamePlay: () => ({ submitAction: vi.fn(), canPlayCard: vi.fn(() => false) }),
}));

vi.mock('@/hooks/useGameAudioFeedback', () => ({
  useGameAudioFeedback: () => undefined,
}));

vi.mock('@/components/providers/GameProvider', () => ({
  GameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import RoomPage from './page';

const renderRoomPage = () => {
  return render(
    <MemoryRouter initialEntries={['/room/test-room']}>
      <Routes>
        <Route path="/room/:id" element={<RoomPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('room page modal gating', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function showModal(this: HTMLDialogElement) {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function close(this: HTMLDialogElement) {
      this.open = false;
    });

    useRoomMock.mockReturnValue({
      players: [],
      isSynced: true,
      updateMyState: vi.fn(),
      myClientId: 10,
      amIHost: false,
      hostId: undefined,
      isHostConnected: null,
      isGameFull: false,
    });
  });

  it('shows join modal while host identity is unresolved', () => {
    renderRoomPage();

    expect(screen.getByText(/join the game/i)).toBeInTheDocument();
    expect(screen.queryByText(/host disconnected/i)).not.toBeInTheDocument();
  });

  it('shows host disconnect modal when host is confirmed disconnected', () => {
    useRoomMock.mockReturnValue({
      players: [],
      isSynced: true,
      updateMyState: vi.fn(),
      myClientId: 10,
      amIHost: false,
      hostId: 42,
      isHostConnected: false,
      isGameFull: false,
    });

    renderRoomPage();

    const hostHeading = screen.getByText(/host disconnected/i);
    const joinHeading = screen.getByText(/join the game/i);

    expect(hostHeading).toBeInTheDocument();
    expect(hostHeading.closest('dialog')).toHaveAttribute('open');
    expect(joinHeading.closest('dialog')).not.toHaveAttribute('open');
  });
});
