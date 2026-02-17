import { createServer, IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const port = process.env.PORT ? parseInt(process.env.PORT) : 4444;

// HTTP request handler for health checks
const httpHandler = (req: IncomingMessage, res: ServerResponse): void => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404);
  res.end();
};

const server = createServer(httpHandler);
const wss = new WebSocketServer({ server });

// Store subscriptions: topic -> Set of clients
const topics = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws) => {
  const subscribedTopics = new Set<string>();
  console.log('Client connected');

  ws.on('message', (message) => {
    let msg: { type?: string; topics?: string[]; topic?: string };
    console.log('Received message:', message.toString());
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

      case 'unsubscribe':
        (msg.topics || []).forEach((topicName: string) => {
          subscribedTopics.delete(topicName);
          topics.get(topicName)?.delete(ws);
          if (topics.get(topicName)?.size === 0) {
            console.log('Removing empty topic:', topicName);
            topics.delete(topicName);
          }
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

  ws.on('close', (code) => {
    console.log('Client disconnected (code):', code);
    subscribedTopics.forEach(topicName => {
      topics.get(topicName)?.delete(ws);
      // Clean up empty topics
      if (topics.get(topicName)?.size === 0) {
        console.log('Removing empty topic:', topicName);
        topics.delete(topicName);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`✅ Signaling server running at http://localhost:${port}`);
  console.log(`   Health check: http://localhost:${port}/health`);
  console.log(`   WebSocket:    ws://localhost:${port}`);
});
