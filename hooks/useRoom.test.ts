import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as Y from 'yjs';
import { useRoom } from './useRoom';

type AwarenessState = { user?: Record<string, unknown> };

class MockAwareness {
  clientID = 100;
  private states = new Map<number, AwarenessState>([[100, { user: { name: 'Me' } }]]);
  private changeListeners = new Set<() => void>();

  getStates = (): Map<number, AwarenessState> => this.states;

  setLocalStateField = (field: string, value: unknown): void => {
    const current = this.states.get(this.clientID) || {};
    this.states.set(this.clientID, {
      ...current,
      [field]: value,
    });
    this.emitChange();
  };

  on = (event: string, listener: () => void): void => {
    if (event === 'change') {
      this.changeListeners.add(listener);
    }
  };

  off = (event: string, listener: () => void): void => {
    if (event === 'change') {
      this.changeListeners.delete(listener);
    }
  };

  setPeerState = (clientId: number, state: AwarenessState | null): void => {
    if (state === null) {
      this.states.delete(clientId);
    } else {
      this.states.set(clientId, state);
    }
    this.emitChange();
  };

  private emitChange = (): void => {
    this.changeListeners.forEach((listener) => listener());
  };
}

class MockWebrtcProvider {
  awareness = new MockAwareness();
  private listeners = new Map<string, Set<(payload: unknown) => void>>();

  on = (event: string, listener: (payload: unknown) => void): void => {
    const set = this.listeners.get(event) || new Set();
    set.add(listener);
    this.listeners.set(event, set);
  };

  disconnect = (): void => {};

  destroy = (): void => {};

  emit = (event: string, payload: unknown): void => {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  };
}

let lastProvider: MockWebrtcProvider | null = null;
let mockDoc: Y.Doc;

vi.mock('y-webrtc', () => ({
  WebrtcProvider: class {
    awareness;
    private provider: MockWebrtcProvider;

    constructor() {
      this.provider = new MockWebrtcProvider();
      this.awareness = this.provider.awareness;
      lastProvider = this.provider;
    }

    on = (event: string, listener: (payload: unknown) => void): void => {
      this.provider.on(event, listener);
    };

    disconnect = (): void => {
      this.provider.disconnect();
    };

    destroy = (): void => {
      this.provider.destroy();
    };
  },
}));

vi.mock('@/components/providers/GameProvider', () => ({
  useGame: () => ({ doc: mockDoc }),
}));

describe('useRoom host bootstrap behavior', () => {
  beforeEach(() => {
    vi.useRealTimers();
    mockDoc = new Y.Doc();
    mockDoc.getMap('gameState').clear();
    sessionStorage.clear();
    lastProvider = null;
  });

  it('keeps host connection unresolved when host identity is unknown', async () => {
    const { result } = renderHook(() => useRoom('test-room'));

    await waitFor(() => {
      expect(lastProvider).not.toBeNull();
    });

    expect(result.current.hostId).toBeUndefined();
    expect(result.current.isHostConnected).toBeNull();
  });

  it('marks host as connected when known host is present in awareness', async () => {
    const { result } = renderHook(() => useRoom('test-room'));

    await waitFor(() => {
      expect(lastProvider).not.toBeNull();
    });

    act(() => {
      lastProvider?.awareness.setPeerState(42, { user: { name: 'Host' } });
      mockDoc.getMap('gameState').set('hostId', 42);
    });

    await waitFor(() => {
      expect(result.current.hostId).toBe(42);
      expect(result.current.isHostConnected).toBe(true);
    });
  });

  it('marks host as disconnected when known host is absent from awareness', async () => {
    const { result } = renderHook(() => useRoom('test-room'));

    await waitFor(() => {
      expect(lastProvider).not.toBeNull();
    });

    act(() => {
      mockDoc.getMap('gameState').set('hostId', 42);
      lastProvider?.awareness.setPeerState(42, null);
    });

    await waitFor(() => {
      expect(result.current.hostId).toBe(42);
      expect(result.current.isHostConnected).toBe(false);
    });
  });

  it('keeps disconnected state when host identity becomes unknown again', async () => {
    const { result } = renderHook(() => useRoom('test-room'));

    await waitFor(() => {
      expect(lastProvider).not.toBeNull();
    });

    act(() => {
      mockDoc.getMap('gameState').set('hostId', 42);
      lastProvider?.awareness.setPeerState(42, null);
    });

    await waitFor(() => {
      expect(result.current.isHostConnected).toBe(false);
    });

    act(() => {
      mockDoc.getMap('gameState').delete('hostId');
    });

    await waitFor(() => {
      expect(result.current.hostId).toBeUndefined();
      expect(result.current.isHostConnected).toBe(false);
    });
  });

  it('marks host as disconnected when host is unresolved for 3 seconds', async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useRoom('test-room'));

    expect(lastProvider).not.toBeNull();

    expect(result.current.hostId).toBeUndefined();
    expect(result.current.isHostConnected).toBeNull();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.isHostConnected).toBe(false);
  });
});
