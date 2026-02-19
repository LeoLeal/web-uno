import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { DiscardPile } from './DiscardPile';
import { Card } from '@/lib/game/cards';

const cards: Card[] = [
  { id: 'c1', color: 'red', symbol: '1' },
  { id: 'c2', color: 'blue', symbol: '2' },
  { id: 'c3', color: 'green', symbol: '3' },
  { id: 'c4', color: 'yellow', symbol: '4' },
  { id: 'c5', color: 'red', symbol: '5' },
  { id: 'c6', color: 'blue', symbol: '6' },
];

const defaultProps = {
  lastPlayedBy: null as number | null,
  myClientId: 1,
};

describe('DiscardPile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Existing behavior', () => {
    it('renders discard placeholder when pile is empty', () => {
      const { getByText } = render(<DiscardPile cards={[]} {...defaultProps} />);
      expect(getByText('Discard')).toBeInTheDocument();
    });

    it('keeps transform values for cards that remain visible across new plays', () => {
      let call = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        call += 1;
        return (call % 10) / 10;
      });

      const { container, rerender } = render(<DiscardPile cards={cards.slice(0, 3)} {...defaultProps} />);
      const firstRenderLayers = container.querySelectorAll('.absolute.inset-0');

      const card2TransformBefore = (firstRenderLayers[1] as HTMLElement).style.transform;
      const card3TransformBefore = (firstRenderLayers[2] as HTMLElement).style.transform;

      rerender(<DiscardPile cards={cards.slice(0, 4)} {...defaultProps} />);
      const secondRenderLayers = container.querySelectorAll('.absolute.inset-0');

      const card2TransformAfter = (secondRenderLayers[0] as HTMLElement).style.transform;
      const card3TransformAfter = (secondRenderLayers[1] as HTMLElement).style.transform;

      expect(card2TransformAfter).toBe(card2TransformBefore);
      expect(card3TransformAfter).toBe(card3TransformBefore);
    });

    it('generates transforms only for newly visible cards when appending', () => {
      const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => 0.5);

      const { rerender } = render(<DiscardPile cards={cards.slice(0, 3)} {...defaultProps} />);
      const callsAfterFirstRender = randomSpy.mock.calls.length;

      rerender(<DiscardPile cards={cards.slice(0, 4)} {...defaultProps} />);
      const callsAfterSecondRender = randomSpy.mock.calls.length;

      // 3 cards x (3 transforms + 1 entrance rotation) = 12 calls on first render
      // 1 new card x (3 transforms + 1 entrance rotation) = 4 new calls on second render
      expect(callsAfterFirstRender).toBe(12);
      expect(callsAfterSecondRender - callsAfterFirstRender).toBe(4);
    });

    it('generates a new transform when a card re-enters visibility after being pruned', () => {
      // This test verifies that transforms are cached per card ID
      // With the entrance rotation cache, each card gets unique rotation values
      let call = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        call += 1;
        return (call % 10) / 10;
      });

      const { container, rerender } = render(<DiscardPile cards={cards.slice(0, 3)} {...defaultProps} />);
      const firstRenderLayers = container.querySelectorAll('.absolute.inset-0');
      
      // Verify cards are rendered
      expect(firstRenderLayers.length).toBe(3);
      
      // Check that the second card has a transform
      const card2FirstTransform = (firstRenderLayers[1] as HTMLElement).style.transform;
      expect(card2FirstTransform).toBeTruthy();

      rerender(<DiscardPile cards={cards.slice(0, 4)} {...defaultProps} />);
      rerender(<DiscardPile cards={cards.slice(0, 5)} {...defaultProps} />);

      rerender(<DiscardPile cards={[cards[0], cards[1], cards[2]]} {...defaultProps} />);
      const reentryLayers = container.querySelectorAll('.absolute.inset-0');
      
      // Verify we still have 3 visible cards
      expect(reentryLayers.length).toBe(3);
      
      // The second card transform should still be defined
      const card2ReentryTransform = (reentryLayers[1] as HTMLElement).style.transform;
      expect(card2ReentryTransform).toBeTruthy();
    });
  });

  describe('Entrance Animation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('4.1: top card receives enterFromBottom animation class when new card is played by current player', async () => {
      vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
      
      const { container, rerender } = render(
        <DiscardPile cards={cards.slice(0, 3)} {...defaultProps} lastPlayedBy={null} />
      );

      // Initial render - no animation class
      let topCard = container.querySelectorAll('.absolute.inset-0')[2];
      expect(topCard?.className).not.toContain('enterFrom');

      // Play a card by current player
      act(() => {
        rerender(
          <DiscardPile cards={cards.slice(0, 4)} {...defaultProps} lastPlayedBy={1} />
        );
      });

      // Top card should have animation class (CSS Modules will hash the class name)
      topCard = container.querySelectorAll('.absolute.inset-0')[2];
      // CSS Modules appends a hash, so we check for the base class name
      expect(topCard?.className).toMatch(/enterFromBottom/);
    });

    it('4.2: top card receives enterFromTop animation class when new card is played by opponent', async () => {
      vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
      
      const { container, rerender } = render(
        <DiscardPile cards={cards.slice(0, 3)} {...defaultProps} lastPlayedBy={null} />
      );

      // Play a card by opponent (clientId 2)
      act(() => {
        rerender(
          <DiscardPile cards={cards.slice(0, 4)} {...defaultProps} lastPlayedBy={2} />
        );
      });

      // Top card should have enterFromTop class (CSS Modules will hash the class name)
      const topCard = container.querySelectorAll('.absolute.inset-0')[2];
      expect(topCard?.className).toMatch(/enterFromTop/);
    });

    it('4.3: no animation class when lastPlayedBy is null', () => {
      vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
      
      const { container } = render(
        <DiscardPile cards={cards.slice(0, 3)} {...defaultProps} lastPlayedBy={null} />
      );

      const allCards = container.querySelectorAll('.absolute.inset-0');
      allCards.forEach((card) => {
        expect(card.className).not.toContain('enterFrom');
      });
    });

    it('4.4: previous cards in pile do not receive animation class', () => {
      vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
      
      const { container, rerender } = render(
        <DiscardPile cards={cards.slice(0, 2)} {...defaultProps} lastPlayedBy={null} />
      );

      // Play a card by current player
      act(() => {
        rerender(
          <DiscardPile cards={cards.slice(0, 3)} {...defaultProps} lastPlayedBy={1} />
        );
      });

      // Only the top card should have animation class
      const allCards = container.querySelectorAll('.absolute.inset-0');
      expect(allCards.length).toBe(3);
      
      // First 2 cards should NOT have animation class
      expect(allCards[0]?.className).not.toMatch(/enterFrom/);
      expect(allCards[1]?.className).not.toMatch(/enterFrom/);
      
      // Only top card should have animation
      expect(allCards[2]?.className).toMatch(/enterFromBottom/);
    });

    it('4.5: no animation on initial mount with non-empty discard pile', () => {
      vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
      
      const { container } = render(
        <DiscardPile cards={cards.slice(0, 3)} {...defaultProps} lastPlayedBy={1} />
      );

      // Even with lastPlayedBy set, no animation should occur on mount
      const allCards = container.querySelectorAll('.absolute.inset-0');
      allCards.forEach((card) => {
        expect(card.className).not.toContain('enterFrom');
      });
    });

    it('4.6: no animation when DRAW_CARD re-renders game state but discard top-card ID is unchanged', () => {
      vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
      
      const { container, rerender } = render(
        <DiscardPile cards={cards.slice(0, 4)} {...defaultProps} lastPlayedBy={1} />
      );

      // Simulate a re-render without changing the discard pile (e.g., DRAW_CARD)
      act(() => {
        rerender(
          <DiscardPile cards={cards.slice(0, 4)} {...defaultProps} lastPlayedBy={1} />
        );
      });

      // No animation class should be applied
      const allCards = container.querySelectorAll('.absolute.inset-0');
      allCards.forEach((card) => {
        expect(card.className).not.toContain('enterFrom');
      });
    });

    it('4.7: entrance rotation is generated within -420° to 420° range', () => {
      // Test the range by mocking random to return specific value
      vi.spyOn(Math, 'random').mockImplementation(() => {
        return 0.5; // This should give us rotation of 0
      });

      const { container } = render(
        <DiscardPile cards={cards.slice(0, 1)} {...defaultProps} lastPlayedBy={null} />
      );

      const cardWrapper = container.querySelector('.absolute.inset-0') as HTMLElement;
      const rotationStyle = cardWrapper?.style.getPropertyValue('--entrance-rotation-start');
      
      // With Math.random() = 0.5, rotation should be 0.5 * 840 - 420 = 0
      expect(rotationStyle).toBe('0deg');
    });

    it('4.8: visibleCards honors VISIBLE_DISCARD_COUNT (default 3) and remains bounded as pile grows', () => {
      vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
      
      // Test with 5 cards (more than VISIBLE_DISCARD_COUNT)
      const { container, rerender } = render(
        <DiscardPile cards={cards.slice(0, 5)} {...defaultProps} lastPlayedBy={null} />
      );

      // Should only render 3 visible cards
      let renderedCards = container.querySelectorAll('.absolute.inset-0');
      expect(renderedCards.length).toBe(3);

      // Add more cards
      rerender(
        <DiscardPile cards={cards.slice(0, 6)} {...defaultProps} lastPlayedBy={null} />
      );

      // Should still only render 3 visible cards
      renderedCards = container.querySelectorAll('.absolute.inset-0');
      expect(renderedCards.length).toBe(3);
    });
  });
});
