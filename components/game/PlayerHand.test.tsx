import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlayerHand } from './PlayerHand';
import { Card } from '@/lib/game/cards';

describe('PlayerHand', () => {
  const mockCards: Card[] = [
    { id: 'card-1', color: 'red', symbol: '5' },
    { id: 'card-2', color: 'blue', symbol: '7' },
    { id: 'card-3', symbol: 'wild' },
  ];

  describe('Card Click Behavior', () => {
    it('should call onCardClick when playable card is clicked during player\'s turn', async () => {
      const user = userEvent.setup();
      const mockOnCardClick = vi.fn();
      const mockCanPlayCard = vi.fn(() => true);

      const { container } = render(
        <PlayerHand
          cards={mockCards}
          isMyTurn={true}
          onCardClick={mockOnCardClick}
          canPlayCard={mockCanPlayCard}
        />
      );

      // Click the first card wrapper
      const cardWrappers = container.querySelectorAll('[class*="transition-transform"]');
      await user.click(cardWrappers[0] as HTMLElement);

      expect(mockOnCardClick).toHaveBeenCalledWith(mockCards[0]);
      expect(mockOnCardClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onCardClick when unplayable card is clicked during player\'s turn', async () => {
      const user = userEvent.setup();
      const mockOnCardClick = vi.fn();
      const mockCanPlayCard = vi.fn(() => false);

      const { container } = render(
        <PlayerHand
          cards={mockCards}
          isMyTurn={true}
          onCardClick={mockOnCardClick}
          canPlayCard={mockCanPlayCard}
        />
      );

      const cardWrappers = container.querySelectorAll('[class*="transition-transform"]');
      await user.click(cardWrappers[0] as HTMLElement);

      expect(mockOnCardClick).not.toHaveBeenCalled();
    });

    it('should not call onCardClick when card is clicked and not player\'s turn', async () => {
      const user = userEvent.setup();
      const mockOnCardClick = vi.fn();
      const mockCanPlayCard = vi.fn(() => true);

      const { container } = render(
        <PlayerHand
          cards={mockCards}
          isMyTurn={false}
          onCardClick={mockOnCardClick}
          canPlayCard={mockCanPlayCard}
        />
      );

      const cardWrappers = container.querySelectorAll('[class*="transition-transform"]');
      await user.click(cardWrappers[0] as HTMLElement);

      expect(mockOnCardClick).not.toHaveBeenCalled();
    });

    it('should handle wild card clicks', async () => {
      const user = userEvent.setup();
      const mockOnCardClick = vi.fn();
      const mockCanPlayCard = vi.fn(() => true);

      const { container } = render(
        <PlayerHand
          cards={mockCards}
          isMyTurn={true}
          onCardClick={mockOnCardClick}
          canPlayCard={mockCanPlayCard}
        />
      );

      // Click the wild card (third card)
      const cardWrappers = container.querySelectorAll('[class*="transition-transform"]');
      await user.click(cardWrappers[2] as HTMLElement);

      expect(mockOnCardClick).toHaveBeenCalledWith(mockCards[2]);
    });
  });

  describe('Card Styling', () => {
    it('should show cursor-pointer on playable cards during player\'s turn', () => {
      const mockCanPlayCard = vi.fn(() => true);

      const { container } = render(
        <PlayerHand
          cards={mockCards}
          isMyTurn={true}
          onCardClick={vi.fn()}
          canPlayCard={mockCanPlayCard}
        />
      );

      const cardWrapper = container.querySelector('[class*="cursor-pointer"]');
      expect(cardWrapper).toBeInTheDocument();
    });

    it('should show cursor-not-allowed on unplayable cards during player\'s turn', () => {
      const mockCanPlayCard = vi.fn((card) => card.id !== 'card-1');

      const { container } = render(
        <PlayerHand
          cards={mockCards}
          isMyTurn={true}
          onCardClick={vi.fn()}
          canPlayCard={mockCanPlayCard}
        />
      );

      const notAllowedCursor = container.querySelector('[class*="cursor-not-allowed"]');
      expect(notAllowedCursor).toBeInTheDocument();
    });

    it('should show cursor-default when not player\'s turn', () => {
      const { container } = render(
        <PlayerHand
          cards={mockCards}
          isMyTurn={false}
        />
      );

      const defaultCursor = container.querySelector('[class*="cursor-default"]');
      expect(defaultCursor).toBeInTheDocument();
    });
  });

  describe('Score Display (Multi-round)', () => {
    it('should show score when showScore is true', () => {
      render(
        <PlayerHand
          cards={mockCards}
          score={150}
          showScore={true}
        />
      );

      expect(screen.getByText('150 pts')).toBeInTheDocument();
    });

    it('should not show score when showScore is false', () => {
      render(
        <PlayerHand
          cards={mockCards}
          score={150}
          showScore={false}
        />
      );

      expect(screen.queryByText('150 pts')).not.toBeInTheDocument();
    });

    it('should show score of 0', () => {
      render(
        <PlayerHand
          cards={mockCards}
          score={0}
          showScore={true}
        />
      );

      expect(screen.getByText('0 pts')).toBeInTheDocument();
    });

    it('should show high score values correctly', () => {
      render(
        <PlayerHand
          cards={mockCards}
          score={999}
          showScore={true}
        />
      );

      expect(screen.getByText('999 pts')).toBeInTheDocument();
    });

    it('should show score when score prop is undefined (defaults to 0)', () => {
      render(
        <PlayerHand
          cards={mockCards}
          showScore={true}
        />
      );

      // When showScore is true, score defaults to 0
      expect(screen.getByText('0 pts')).toBeInTheDocument();
    });

    it('should show score without rendering an UNO button', () => {
      render(
        <PlayerHand
          cards={[mockCards[0], mockCards[1]]} // 2 cards to enable UNO
          score={250}
          showScore={true}
        />
      );

      expect(screen.getByText('250 pts')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Call UNO/i })).not.toBeInTheDocument();
    });

  });

  describe('Player Number Label', () => {
    it('shows the player number label when playerNumber is provided', () => {
      render(
        <PlayerHand
          cards={mockCards}
          playerNumber={4}
        />
      );

      expect(screen.getByText(/you are player number/i)).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('does not show the player number label when playerNumber is missing', () => {
      render(<PlayerHand cards={mockCards} />);

      expect(screen.queryByText(/you are player number/i)).not.toBeInTheDocument();
    });
  });
});
