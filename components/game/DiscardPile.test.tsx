import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
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

describe('DiscardPile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders discard placeholder when pile is empty', () => {
    const { getByText } = render(<DiscardPile cards={[]} />);
    expect(getByText('Discard')).toBeInTheDocument();
  });

  it('keeps transform values for cards that remain visible across new plays', () => {
    let call = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      call += 1;
      return (call % 10) / 10;
    });

    const { container, rerender } = render(<DiscardPile cards={cards.slice(0, 3)} />);
    const firstRenderLayers = container.querySelectorAll('.absolute.inset-0');

    const card2TransformBefore = (firstRenderLayers[1] as HTMLElement).style.transform;
    const card3TransformBefore = (firstRenderLayers[2] as HTMLElement).style.transform;

    rerender(<DiscardPile cards={cards.slice(0, 4)} />);
    const secondRenderLayers = container.querySelectorAll('.absolute.inset-0');

    const card2TransformAfter = (secondRenderLayers[0] as HTMLElement).style.transform;
    const card3TransformAfter = (secondRenderLayers[1] as HTMLElement).style.transform;

    expect(card2TransformAfter).toBe(card2TransformBefore);
    expect(card3TransformAfter).toBe(card3TransformBefore);
  });

  it('generates transforms only for newly visible cards when appending', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => 0.5);

    const { rerender } = render(<DiscardPile cards={cards.slice(0, 3)} />);
    const callsAfterFirstRender = randomSpy.mock.calls.length;

    rerender(<DiscardPile cards={cards.slice(0, 4)} />);
    const callsAfterSecondRender = randomSpy.mock.calls.length;

    expect(callsAfterFirstRender).toBe(9);
    expect(callsAfterSecondRender - callsAfterFirstRender).toBe(3);
  });

  it('generates a new transform when a card re-enters visibility after being pruned', () => {
    let call = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      call += 1;
      return (call % 10) / 10;
    });

    const { container, rerender } = render(<DiscardPile cards={cards.slice(0, 3)} />);
    const firstRenderLayers = container.querySelectorAll('.absolute.inset-0');
    const card2FirstTransform = (firstRenderLayers[1] as HTMLElement).style.transform;

    rerender(<DiscardPile cards={cards.slice(0, 4)} />);
    rerender(<DiscardPile cards={cards.slice(0, 5)} />);

    rerender(<DiscardPile cards={[cards[0], cards[1], cards[2]]} />);
    const reentryLayers = container.querySelectorAll('.absolute.inset-0');
    const card2ReentryTransform = (reentryLayers[1] as HTMLElement).style.transform;

    expect(card2ReentryTransform).not.toBe(card2FirstTransform);
  });
});
