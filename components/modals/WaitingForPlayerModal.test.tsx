import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WaitingForPlayerModal } from './WaitingForPlayerModal';
import { OrphanHand } from '@/hooks/useGameState';

describe('WaitingForPlayerModal', () => {
  const mockOrphanHands: OrphanHand[] = [
    {
      originalClientId: 10,
      originalName: 'Alice',
      cards: [
        { id: '1', color: 'red', symbol: '5' },
        { id: '2', color: 'blue', symbol: 'skip' },
      ],
    },
    {
      originalClientId: 20,
      originalName: 'Bob',
      cards: [{ id: '3', color: 'green', symbol: '7' }],
    },
  ];

  describe('Rendering', () => {
    it('should not render when closed', () => {
      render(
        <WaitingForPlayerModal
          isOpen={false}
          orphanHands={mockOrphanHands}
          isHost={false}
        />
      );

      expect(screen.queryByText('Game Paused')).not.toBeInTheDocument();
    });

    it('should render when open', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={false}
        />
      );

      expect(screen.getByText('Game Paused')).toBeInTheDocument();
    });

    it('should display all disconnected players', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={false}
        />
      );

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('should display card counts for each player', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={false}
        />
      );

      expect(screen.getByText('2 cards')).toBeInTheDocument();
      expect(screen.getByText('1 card')).toBeInTheDocument();
    });

    it('should show plural message for multiple players', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={false}
        />
      );

      expect(screen.getByText(/Waiting for players to rejoin/i)).toBeInTheDocument();
    });

    it('should show singular message for one player', () => {
      const singleOrphan = [mockOrphanHands[0]];

      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={singleOrphan}
          isHost={false}
        />
      );

      expect(screen.getByText(/Waiting for a player to rejoin/i)).toBeInTheDocument();
    });
  });

  describe('Host View', () => {
    it('should show remove buttons when user is host', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={true}
          onContinueWithout={vi.fn()}
        />
      );

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      expect(removeButtons).toHaveLength(2);
    });

    it('should call onContinueWithout when remove button clicked', async () => {
      const user = userEvent.setup();
      const mockContinueWithout = vi.fn();

      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={true}
          onContinueWithout={mockContinueWithout}
        />
      );

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      expect(mockContinueWithout).toHaveBeenCalledWith(10);
    });

    it('should show host-specific message', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={true}
          onContinueWithout={vi.fn()}
        />
      );

      expect(
        screen.getByText(/You can remove players to continue/i)
      ).toBeInTheDocument();
    });
  });

  describe('Guest View', () => {
    it('should not show remove buttons when user is guest', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={false}
        />
      );

      const removeButtons = screen.queryAllByRole('button', { name: /remove/i });
      expect(removeButtons).toHaveLength(0);
    });

    it('should show guest-specific message', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={mockOrphanHands}
          isHost={false}
        />
      );

      expect(
        screen.getByText(/The host will decide/i)
      ).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should handle empty orphan hands', () => {
      render(
        <WaitingForPlayerModal
          isOpen={true}
          orphanHands={[]}
          isHost={false}
        />
      );

      expect(screen.getByText('Game Paused')).toBeInTheDocument();
      expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    });
  });
});
