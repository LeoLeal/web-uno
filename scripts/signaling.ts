import { WebSocketServer, WebSocket } from 'ws';

const port = process.env.PORT ? parseInt(process.env.PORT) : 4444;

const wss = new WebSocketServer({ port });

// Store subscriptions: topic -> Set of clients
const topics = new Map<string, Set<WebSocket>>();

console.log(`✅ Signaling server running at ws://localhost:${port}`);

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

      case 'unsubscribe':
        (msg.topics || []).forEach((topicName: string) => {
          subscribedTopics.delete(topicName);
          topics.get(topicName)?.delete(ws);
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
      // Clean up empty topics
      if (topics.get(topicName)?.size === 0) {
        topics.delete(topicName);
      }
    });
  });
});
