## Context

The P2P Uno game currently uses `y-webrtc` to synchronize a Yjs CRDT document between players in a room (`[room-id]`). We want to introduce an ephemeral text chat system. While we could theoretically add a `Y.Array` to the existing Yjs document to store chat messages, doing so would preserve message history forever within the document, slowly bloating the CRDT state over time.

Additionally, while we anticipate adding live voice and video streaming in the future, the immediate priority is delivering a reliable chat experience.

Therefore, we need to design a chat system that is ephemeral and relies on simpler WebSocket pub/sub mechanisms for now.

## Goals / Non-Goals

**Goals:**

- Provide a reliable, ephemeral text-based chat system.
- Ensure chat messages are strictly tied to verified players in the game room.
- Establish a parallel networking architecture using the existing WebSocket signaling server.

**Non-Goals:**

- **Chat History:** We explicitly _do not_ want to persist chat history across page reloads or save it to a server. Chat is only for the current, active session.
- **Audio/Video Implementation:** Not part of the current scope, and the WebRTC mesh requirements for this have been deferred.

## Decisions

### 1. Dedicated WebSocket Connection

**Decision**: Establish a secondary WebSocket connection to the existing signaling server, subscribing to the topic `[room-id]-chat`.
**Rationale**: Keeps the `y-webrtc` CRDT document lightweight. Using the existing signaling server's pub/sub abilities is much lighter than building a secondary WebRTC mesh.

### 2. Identity Verification (Binding)

**Decision**: Use the Yjs `awareness.clientID` to verify and render player identities in the chat UI.
**Rationale**: When a player publishes a chat message to the `[room-id]-chat` topic, the payload must contain their game `clientId`. Receiving clients will look up this ID in the active Yjs game `awareness` state. If the ID exists, the chat UI maps the incoming text message to the respective player's avatar and name. If the ID is invalid or missing from the game room, the message is ignored. This ensures security and UI synchronization without duplicating identity state management.

### 3. Ephemeral React State & Timers

**Decision**: Chat messages will be stored purely in a React `useState` array within the rendering component, coupled with configurable `setTimeout` timers (defined by a constant, defaulting to 10 seconds).
**Rationale**: By not storing messages in Yjs or `localStorage`, we guarantee they are completely ephemeral.

### 4. UI Architecture: Input & Display

**Decision**: Input will be a centered textarea above the player's hand. Display will reuse the `OpponentIndicator` balloon element.
**Rationale**: Instead of a shared chat sidebar, floating balloons above avatars keep the player's eyes on the game board. We will repurpose the existing DOM structure built for the "UNO!" balloon, allowing it to accept dynamic text strings and handle fade-out animations. The "UNO!" state specifically will be modified to render text overlaid on the avatar itself, freeing up the balloon exclusively for chat context. If an opponent sends a message within 10 seconds of their previous message, the text is appended to the existing balloon. Each individual message has its own 10-second fade-out timer; when a message expires, it is removed from the balloon. If a message that will disappear is the only one remaining in the chat balloon, the balloon itself fades-out with the message.

## Risks / Trade-offs

- **Connection Race Conditions:** A player might connect to the chat network and receive messages before they have successfully joined the game network, causing the message validation to fail.
  - _Mitigation:_ The React hook managing the chat network (`useChatNetwork`) should only process incoming messages _after_ `useRoom` has successfully synced the game (`isSynced === true`).
