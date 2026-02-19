import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeckPile } from './DeckPile';

describe('DeckPile', () => {
  describe('Deck Click Behavior', () => {
    it('should call onClick when deck is clicked during player\'s turn', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();

      const { container } = render(
        <DeckPile isMyTurn={true} onClick={mockOnClick} />
      );

      const deck = container.firstChild as HTMLElement;
      await user.click(deck);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when deck is clicked and not player\'s turn', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();

      const { container } = render(
        <DeckPile isMyTurn={false} onClick={mockOnClick} />
      );

      const deck = container.firstChild as HTMLElement;
      await user.click(deck);

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when onClick is not provided', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <DeckPile isMyTurn={true} />
      );

      const deck = container.firstChild as HTMLElement;
      // Should not throw error when clicking without onClick handler
      await user.click(deck);
    });
  });

  describe('Cursor Styling', () => {
    it('should show cursor-pointer when it is player\'s turn and onClick is provided', () => {
      const { container } = render(
        <DeckPile isMyTurn={true} onClick={vi.fn()} />
      );

      const deck = container.firstChild as HTMLElement;
      expect(deck.className).toContain('cursor-pointer');
    });

    it('should show cursor-default when it is not player\'s turn', () => {
      const { container } = render(
        <DeckPile isMyTurn={false} onClick={vi.fn()} />
      );

      const deck = container.firstChild as HTMLElement;
      expect(deck.className).toContain('cursor-default');
    });

    it('should show cursor-default when onClick is not provided', () => {
      const { container } = render(
        <DeckPile isMyTurn={true} />
      );

      const deck = container.firstChild as HTMLElement;
      expect(deck.className).toContain('cursor-default');
    });
  });

  describe('Hover Effects', () => {
    it('should have hover effects when clickable', () => {
      const { container } = render(
        <DeckPile isMyTurn={true} onClick={vi.fn()} />
      );

      const deck = container.firstChild as HTMLElement;
      expect(deck.className).toContain('hover:scale-105');
    });

    it('should not have hover effects when not clickable', () => {
      const { container } = render(
        <DeckPile isMyTurn={false} onClick={vi.fn()} />
      );

      const deck = container.firstChild as HTMLElement;
      expect(deck.className).not.toContain('hover:scale-105');
    });
  });
});
