import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { useGameAudioFeedback } from '@/hooks/useGameAudioFeedback';
import { Card } from '@/lib/game/cards';

const speakTextMock = vi.fn();
const playSoundMock = vi.fn().mockResolvedValue(undefined);

vi.mock('@/lib/audio/playback', () => ({
  speakText: (...args: unknown[]) => speakTextMock(...args),
  playSound: (...args: unknown[]) => playSoundMock(...args),
}));

interface HarnessProps {
  status?: 'LOBBY' | 'PLAYING' | 'PAUSED_WAITING_PLAYER' | 'ROUND_ENDED' | 'ENDED';
  myClientId?: number | null;
  currentTurn?: number | null;
  discardPile?: Card[];
  playerCardCounts?: Record<number, number>;
  isMuted?: boolean;
}

const HookHarness = ({
  status = 'PLAYING',
  myClientId = 1,
  currentTurn = null,
  discardPile = [],
  playerCardCounts = {},
  isMuted = false,
}: HarnessProps) => {
  useGameAudioFeedback({
    status,
    myClientId,
    currentTurn,
    discardPile,
    playerCardCounts,
    isMuted,
  });

  return null;
};

describe('useGameAudioFeedback', () => {
  beforeEach(() => {
    speakTextMock.mockReset();
    playSoundMock.mockReset();
    playSoundMock.mockResolvedValue(undefined);
  });

  it('speaks Your turn on transition to local turn', () => {
    const { rerender } = render(<HookHarness currentTurn={2} />);
    rerender(<HookHarness currentTurn={1} />);

    expect(speakTextMock).toHaveBeenCalledWith('Your turn!');
  });

  it('suppresses all cues while muted and restores after unmute', () => {
    const discardA: Card = { id: 'd1', color: 'red', symbol: '3' };
    const discardB: Card = { id: 'd2', color: 'blue', symbol: 'skip' };

    const { rerender } = render(
      <HookHarness
        isMuted={true}
        currentTurn={2}
        discardPile={[discardA]}
        playerCardCounts={{ 2: 7 }}
      />
    );

    rerender(
      <HookHarness
        isMuted={true}
        currentTurn={1}
        discardPile={[discardA]}
        playerCardCounts={{ 2: 8 }}
      />
    );

    rerender(
      <HookHarness
        isMuted={true}
        currentTurn={1}
        discardPile={[discardA, discardB]}
        playerCardCounts={{ 2: 8 }}
      />
    );

    expect(speakTextMock).not.toHaveBeenCalled();
    expect(playSoundMock).not.toHaveBeenCalled();

    rerender(
      <HookHarness
        isMuted={false}
        currentTurn={2}
        discardPile={[discardA, discardB]}
        playerCardCounts={{ 2: 8 }}
      />
    );

    rerender(
      <HookHarness
        isMuted={false}
        currentTurn={1}
        discardPile={[discardA, discardB]}
        playerCardCounts={{ 2: 8 }}
      />
    );

    expect(speakTextMock).toHaveBeenCalledWith('Your turn!');
  });
});
