import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChatNetwork } from './ChatNetwork';
import * as configSignaling from '@/lib/config/signaling';

describe('ChatNetwork', () => {
  let mockWebSocket: { readyState: number; send: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn>; onopen?: () => void };

  beforeEach(() => {
    vi.spyOn(configSignaling, 'getSignalingUrl').mockReturnValue('ws://localhost:1234');
    
    // Polyfill crypto if not present
    if (typeof globalThis.crypto === 'undefined') {
      vi.stubGlobal('crypto', { randomUUID: () => 'mock-uuid' });
    } else if (!globalThis.crypto.randomUUID) {
      vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-0000-0000-000000000000');
    }
    
    mockWebSocket = {
      readyState: 1, // WebSocket.OPEN
      send: vi.fn(),
      close: vi.fn(),
    };
    
    vi.stubGlobal('WebSocket', vi.fn().mockImplementation(function() {
      const ws = mockWebSocket;
      setTimeout(() => {
        if (ws.onopen) ws.onopen();
      }, 0);
      return ws;
    }));
    // Also stub the OPEN constant on the WebSocket constructor if needed
    (globalThis.WebSocket as { OPEN: number }).OPEN = 1;
    (globalThis.WebSocket as { CONNECTING: number }).CONNECTING = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('connects and subscribes to room topic', async () => {
    const network = new ChatNetwork('room1', 1, vi.fn());
    network.connect();
    
    // wait for onopen
    await new Promise(r => setTimeout(r, 10));
    
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({
      type: 'subscribe',
      topics: ['room1-chat']
    }));
  });

  it('publishes messages and calls onMessage locally', async () => {
    const handleMessage = vi.fn();
    const network = new ChatNetwork('room1', 1, handleMessage);
    network.connect();
    
    await new Promise(r => setTimeout(r, 10));
    
    network.sendMessage('hello');
    
    expect(mockWebSocket.send).toHaveBeenCalledWith(expect.stringContaining('"text":"hello"'));
    expect(handleMessage).toHaveBeenCalledWith(expect.objectContaining({ text: 'hello' }));
  });

  it('unsubscribes during disconnect', async () => {
    const network = new ChatNetwork('room1', 1, vi.fn());
    network.connect();
    
    await new Promise(r => setTimeout(r, 10));
    
    network.disconnect();
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({
      type: 'unsubscribe',
      topics: ['room1-chat']
    }));
    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
