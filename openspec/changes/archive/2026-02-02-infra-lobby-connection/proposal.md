## Why

We need a foundational structure for players to connect, create games, and synchronize state in a serverless P2P environment. This change establishes the "Host-as-Server" architecture and the "Lobby" mechanism, enabling the core multiplayer loop without centralized game servers.

## What Changes

- Add dependencies: `yjs`, `y-webrtc`, `simple-peer`.
- Create the "Host" role logic (initializing the game state).
- Implement the "Lobby" UI where players gather before the game starts.
- Implement the URL-based discovery system (`/room/[uuid]`).
- Establish the dual-state architecture: Public (Yjs) and Private (Host Memory).

## Capabilities

### New Capabilities
- `lobby-management`: Handles room creation, joining, player lists, and game start.
- `p2p-networking`: Handles the underlying WebRTC connections, Yjs provider setup, and ephemeral messaging.

### Modified Capabilities
<!-- None yet, this is the first change -->

## Impact

- New dependencies (`yjs`, `y-webrtc`, `simple-peer`).
- New routes (`/` landing page updates, `/room/[id]`).
- Introduction of the "Game Context" provider in React.
