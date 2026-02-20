## Why

Players need a way to communicate and socialize while playing Uno. Currently, there is no way for participants to talk to each other inside a game room. We are introducing a chat system now to increase game engagement. The chat must be purely ephemeral without preserving history, avoiding unnecessary CRDT bloat in the Yjs game document. Additionally, by establishing this chat system over a parallel WebRTC network, we lay the critical architectural foundation required to support live voice and video streaming in the future.

## What Changes

- Add a centered text input above the player's hand for sending messages.
- Repurpose the existing "UNO!" balloon UI element to display incoming opponent chat messages as fading balloons above their avatars.
- Establish a new WebSocket connection to the existing signaling server specifically dedicated to chat messages (`[room-id]-chat` topic).
- Implement an identity verification mechanism to securely map incoming WebSocket chat messages to the verified players present in the Yjs game state (`clientId`).
- Manage the local, ephemeral state of chat messages within the React lifecycle for active players, including 10-second fade-out timers for balloons.

## Capabilities

### New Capabilities

- `room-chat`: Text-based, real-time ephemeral communication between players within a game room, operating over a WebSocket pub/sub channel.

### Modified Capabilities

- `game-board-ui`: Repurpose the "UNO!" balloon for general chat display with 10-second message fade-outs, and remap the "UNO!" alert to overlay directly on the avatar.
- `lobby-management`: Implement chat functionality in the lobby, with a fixed input above the Game Settings panel, chat bubbles over player cards in the PlayerList, and a responsive 3-per-row mobile layout for player cards.

## Impact

- **UI/UX**: Requires a centered textarea above the player's hand during games, and a fixed input above Game Settings in the lobby. Opponent messages will be displayed using the chat balloon component over avatars (in-game) or player cards (in lobby). Chat balloons need dynamic text, 10-second fade-outs, and 10-second append windows. Lobby player cards must be updated to support a 3-per-row mobile grid layout.
- **Networking**: Requires a secondary WebSocket connection to the signaling server for pub/sub messaging.
- **Core Hooks**: Requires a new custom hook (e.g., `useChatNetwork`) running alongside `useRoom` to handle the lifecycle and identity binding of the secondary WebSocket connection.
