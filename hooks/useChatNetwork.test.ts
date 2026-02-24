import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChatNetwork } from './useChatNetwork';
import * as playback from '@/lib/audio/playback';

vi.mock('@/lib/audio/playback', () => ({
  playSound: vi.fn().mockResolvedValue(undefined),
}));

// Capture the message handler via mock implementation of ChatNetwork
type MessageHandler = (msg: { id: string; clientId: number; text: string; timestamp: number }) => void;

let capturedHandler: MessageHandler | null = null;
const mockConnect = vi.fn();
const mockDisconnect = vi.fn();

vi.mock('@/lib/websocket/ChatNetwork', () => {
  return {
    ChatNetwork: class MockChatNetwork {
      constructor(_roomId: string, _clientId: number, handler: MessageHandler) {
        capturedHandler = handler;
      }
      connect = mockConnect;
      disconnect = mockDisconnect;
      sendMessage = vi.fn();
    },
  };
});

describe('useChatNetwork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    capturedHandler = null;
  });

  const mockPlayer = { clientId: 99, name: 'Bob', avatar: '🎮', isHost: false };

  const mockMessage = (overrides: Partial<{ id: string; clientId: number; text: string; timestamp: number }> = {}) => ({
    id: 'msg-1',
    clientId: 99,
    text: 'hello!',
    timestamp: Date.now(),
    ...overrides,
  });

  it('plays chat-pop sound when a message arrives from another player', async () => {
    renderHook(() =>
      useChatNetwork('room-1', 1, true, [mockPlayer], false)
    );

    await act(async () => {
      capturedHandler?.(mockMessage({ clientId: 99 }));
    });

    expect(playback.playSound).toHaveBeenCalledWith('/sounds/chat-pop.mp3');
  });

  it('does not play sound for own messages', async () => {
    renderHook(() =>
      useChatNetwork('room-1', 1, true, [mockPlayer], false)
    );

    await act(async () => {
      // Own message: clientId === gameClientId (1)
      capturedHandler?.(mockMessage({ clientId: 1 }));
    });

    expect(playback.playSound).not.toHaveBeenCalled();
  });

  it('does not play sound when muted', async () => {
    renderHook(() =>
      useChatNetwork('room-1', 1, true, [mockPlayer], true)
    );

    await act(async () => {
      capturedHandler?.(mockMessage({ clientId: 99 }));
    });

    expect(playback.playSound).not.toHaveBeenCalled();
  });

  it('respects isMuted changes without reconnecting', async () => {
    let muted = false;
    const { rerender } = renderHook(
      ({ isMuted }: { isMuted: boolean }) =>
        useChatNetwork('room-1', 1, true, [mockPlayer], isMuted),
      { initialProps: { isMuted: false } }
    );

    // First message unmuted — should play
    await act(async () => {
      capturedHandler?.(mockMessage({ id: 'msg-1', clientId: 99 }));
    });
    expect(playback.playSound).toHaveBeenCalledTimes(1);

    // Change to muted
    muted = true;
    rerender({ isMuted: muted });

    // Second message muted — should not play
    await act(async () => {
      capturedHandler?.(mockMessage({ id: 'msg-2', clientId: 99 }));
    });
    expect(playback.playSound).toHaveBeenCalledTimes(1); // still just 1
  });
});
