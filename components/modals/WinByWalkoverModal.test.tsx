import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WinByWalkoverModal } from './WinByWalkoverModal';

describe('WinByWalkoverModal', () => {
  describe('Rendering', () => {
    it('should not render when closed', () => {
      render(<WinByWalkoverModal isOpen={false} isWinner={true} />);

      expect(screen.queryByText(/Victory by Walkover/i)).not.toBeInTheDocument();
    });

    it('should render when open', () => {
      render(<WinByWalkoverModal isOpen={true} isWinner={true} />);

      expect(screen.getByText(/Victory by Walkover/i)).toBeInTheDocument();
    });
  });

  describe('Winner View', () => {
    it('should show victory message when user is winner', () => {
      render(<WinByWalkoverModal isOpen={true} isWinner={true} />);

      expect(screen.getByText(/Victory by Walkover!/i)).toBeInTheDocument();
      expect(
        screen.getByText(/All other players disconnected. You win by default!/i)
      ).toBeInTheDocument();
    });

    it('should show trophy icon for winner', () => {
      render(<WinByWalkoverModal isOpen={true} isWinner={true} />);

      expect(screen.getByText('🏆')).toBeInTheDocument();
    });

    it('should show celebratory message for winner', () => {
      render(<WinByWalkoverModal isOpen={true} isWinner={true} />);

      expect(
        screen.getByText(/Not the most exciting win, but a win is a win!/i)
      ).toBeInTheDocument();
    });
  });

  describe('Non-Winner View', () => {
    it('should show game ended message when user is not winner', () => {
      render(<WinByWalkoverModal isOpen={true} isWinner={false} />);

      expect(screen.getByText(/Game Ended/i)).toBeInTheDocument();
      expect(
        screen.getByText(/All players disconnected. The game has ended./i)
      ).toBeInTheDocument();
    });

    it('should show sad icon for non-winner', () => {
      render(<WinByWalkoverModal isOpen={true} isWinner={false} />);

      expect(screen.getByText('😔')).toBeInTheDocument();
    });

    it('should not show celebratory message for non-winner', () => {
      render(<WinByWalkoverModal isOpen={true} isWinner={false} />);

      expect(
        screen.queryByText(/Not the most exciting win/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('should provide link back to lobby', () => {
      render(<WinByWalkoverModal isOpen={true} isWinner={true} />);

      const link = screen.getByRole('link', { name: /Back to Lobby/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });
  });
});
