import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

// Recreate the HTTP handler from signaling.ts for isolated testing
const httpHandler = (req: IncomingMessage, res: ServerResponse): void => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404);
  res.end();
};

const TEST_PORT = 4556;
let server: ReturnType<typeof createServer>;
let wss: WebSocketServer;

beforeAll(async () => {
  server = createServer(httpHandler);
  wss = new WebSocketServer({ server });

  // Store subscriptions: topic -> Set of clients
  const topics = new Map<string, Set<WebSocket>>();

  wss.on('connection', (ws) => {
    const subscribedTopics = new Set<string>();

    ws.on('message', (message) => {
      let msg: { type?: string; topics?: string[]; topic?: string };
      try {
        msg = JSON.parse(message.toString());
      } catch (_e) {
        return;
      }

      if (!msg || !msg.type) return;

      switch (msg.type) {
        case 'subscribe':
          (msg.topics || []).forEach((topicName: string) => {
            subscribedTopics.add(topicName);
            if (!topics.has(topicName)) {
              topics.set(topicName, new Set());
            }
            topics.get(topicName)?.add(ws);
          });
          break;

        case 'publish':
          if (msg.topic) {
            const receivers = topics.get(msg.topic);
            if (receivers) {
              receivers.forEach(receiver => {
                if (receiver !== ws && receiver.readyState === WebSocket.OPEN) {
                  receiver.send(message.toString());
                }
              });
            }
          }
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
      }
    });

    ws.on('close', () => {
      subscribedTopics.forEach(topicName => {
        topics.get(topicName)?.delete(ws);
        if (topics.get(topicName)?.size === 0) {
          topics.delete(topicName);
        }
      });
    });
  });

  await new Promise<void>((resolve) => server.listen(TEST_PORT, resolve));
});

afterAll(async () => {
  wss.close();
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve()))
  );
});

function fetchHealth(path: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = require('http').get(`http://localhost:${TEST_PORT}${path}`, (res: IncomingMessage) => {
      let body = '';
      res.on('data', (chunk: Buffer) => (body += chunk.toString()));
      res.on('end', () => resolve({ status: res.statusCode!, body }));
    });
    req.on('error', reject);
  });
}

function connectWs(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://localhost:${TEST_PORT}`);
    ws.on('open', () => resolve(ws));
    ws.on('error', reject);
  });
}

function waitForMessage(ws: WebSocket): Promise<string> {
  return new Promise((resolve) => {
    ws.once('message', (data) => resolve(data.toString()));
  });
}

describe('Signaling Server - HTTP Health Endpoint', () => {
  it('GET /health returns 200 with JSON status', async () => {
    const res = await fetchHealth('/health');
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ status: 'ok' });
  });

  it('GET /unknown returns 404', async () => {
    const res = await fetchHealth('/unknown');
    expect(res.status).toBe(404);
  });

  it('GET / returns 404', async () => {
    const res = await fetchHealth('/');
    expect(res.status).toBe(404);
  });
});

describe('Signaling Server - WebSocket Behavior', () => {
  it('accepts WebSocket connections', async () => {
    const ws = await connectWs();
    expect(ws.readyState).toBe(WebSocket.OPEN);
    ws.close();
  });

  it('responds to ping with pong', async () => {
    const ws = await connectWs();
    const msgPromise = waitForMessage(ws);
    ws.send(JSON.stringify({ type: 'ping' }));
    const response = await msgPromise;
    expect(JSON.parse(response)).toEqual({ type: 'pong' });
    ws.close();
  });

  it('routes published messages to subscribers', async () => {
    const sender = await connectWs();
    const receiver = await connectWs();

    // Subscribe receiver to a topic
    receiver.send(JSON.stringify({ type: 'subscribe', topics: ['test-room'] }));
    // Small delay for subscription to register
    await new Promise((r) => setTimeout(r, 50));

    const msgPromise = waitForMessage(receiver);
    sender.send(JSON.stringify({ type: 'publish', topic: 'test-room' }));
    const received = await msgPromise;
    expect(JSON.parse(received)).toMatchObject({ type: 'publish', topic: 'test-room' });

    sender.close();
    receiver.close();
  });
});
