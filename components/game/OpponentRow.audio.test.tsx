import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { OpponentRow } from './OpponentRow';

const speakTextMock = vi.fn();

vi.mock('@/lib/audio/playback', () => ({
  speakText: (...args: unknown[]) => speakTextMock(...args),
}));

describe('OpponentRow audio behavior', () => {
  beforeEach(() => {
    speakTextMock.mockReset();
  });

  const baseOpponent = {
    clientId: 2,
    name: 'Bob',
    avatar: '🐶',
    cardCount: 2,
    isHost: false,
  };

  it('speaks Uno once when opponent UNO bubble appears', () => {
    const { rerender } = render(
      <OpponentRow opponents={[baseOpponent]} currentTurn={null} isMuted={false} />
    );

    rerender(
      <OpponentRow
        opponents={[{ ...baseOpponent, cardCount: 1 }]}
        currentTurn={null}
        isMuted={false}
      />
    );

    expect(speakTextMock).toHaveBeenCalledTimes(1);
    expect(speakTextMock).toHaveBeenCalledWith('Uno!');

    rerender(
      <OpponentRow
        opponents={[{ ...baseOpponent, cardCount: 1 }]}
        currentTurn={null}
        isMuted={false}
      />
    );

    expect(speakTextMock).toHaveBeenCalledTimes(1);
  });

  it('does not speak Uno while muted', () => {
    const { rerender } = render(
      <OpponentRow opponents={[baseOpponent]} currentTurn={null} isMuted={true} />
    );

    rerender(
      <OpponentRow
        opponents={[{ ...baseOpponent, cardCount: 1 }]}
        currentTurn={null}
        isMuted={true}
      />
    );

    expect(speakTextMock).not.toHaveBeenCalled();
  });

  it('speaks only once when multiple opponent UNO bubbles appear together', () => {
    const { rerender } = render(
      <OpponentRow
        opponents={[
          { ...baseOpponent, clientId: 2, cardCount: 2 },
          { ...baseOpponent, clientId: 3, cardCount: 2, name: 'Carol' },
        ]}
        currentTurn={null}
        isMuted={false}
      />
    );

    rerender(
      <OpponentRow
        opponents={[
          { ...baseOpponent, clientId: 2, cardCount: 1 },
          { ...baseOpponent, clientId: 3, cardCount: 1, name: 'Carol' },
        ]}
        currentTurn={null}
        isMuted={false}
      />
    );

    expect(speakTextMock).toHaveBeenCalledTimes(1);
    expect(speakTextMock).toHaveBeenCalledWith('Uno!');
  });
});
