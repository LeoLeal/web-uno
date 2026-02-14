import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
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
});
