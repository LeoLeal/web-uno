import { getSignalingUrl } from '@/lib/config/signaling';

export interface ChatMessage {
  id: string;
  clientId: number;
  text: string;
  timestamp: number;
}

export class ChatNetwork {
  private ws: WebSocket | null = null;
  private readonly roomId: string;
  private readonly topicName: string;
  private readonly gameClientId: number;
  private readonly onMessage: (msg: ChatMessage) => void;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionalDisconnect = false;

  constructor(roomId: string, gameClientId: number, onMessage: (msg: ChatMessage) => void) {
    this.roomId = roomId;
    this.topicName = `${roomId}-chat`;
    this.gameClientId = gameClientId;
    this.onMessage = onMessage;
  }

  connect() {
    this.isIntentionalDisconnect = false;
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) return;

    try {
      const url = getSignalingUrl();
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.subscribe();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'publish' && data.topic === this.topicName) {
            if (data.clientId !== undefined && typeof data.text === 'string') {
              this.onMessage({
                id: data.id || crypto.randomUUID(),
                clientId: data.clientId,
                text: data.text,
                timestamp: data.timestamp || Date.now()
              });
            }
          }
        } catch (_e) {
          // Ignore string parsing errors
        }
      };

      this.ws.onclose = () => {
        this.ws = null;
        if (!this.isIntentionalDisconnect) {
          this.reconnectTimer = setTimeout(() => this.connect(), 2000);
        }
      };
    } catch (_e) {
      console.error('Failed to connect ChatNetwork WebSocket:', _e);
    }
  }

  private subscribe() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        topics: [this.topicName]
      }));
    }
  }

  sendMessage(text: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const msgId = crypto.randomUUID();
      const timestamp = Date.now();
      
      const payload = {
        type: 'publish',
        topic: this.topicName,
        clientId: this.gameClientId,
        text,
        id: msgId,
        timestamp
      };
      
      this.ws.send(JSON.stringify(payload));
      
      // Also trigger locally so the sender sees their own message
      this.onMessage({
        clientId: this.gameClientId,
        text,
        id: msgId,
        timestamp
      });
    } else {
      console.warn("Cannot send message, WebSocket is not open.");
    }
  }

  disconnect() {
    this.isIntentionalDisconnect = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'unsubscribe',
          topics: [this.topicName]
        }));
      }
      this.ws.close();
      this.ws = null;
    }
  }
}
