## Context

We are building a P2P Uno game. The core challenge is synchronizing game state while preventing cheating (e.g., inspecting browser memory to see the deck). We have chosen a "Serverless" approach where one peer acts as the Host.

## Goals / Non-Goals

**Goals:**
- Enable users to create a room and share a link.
- Synchronize public game state (players, turn, top card) automatically.
- Establish a secure channel for private game state (hand contents).

**Non-Goals:**
- Host migration (if host leaves, game ends).
- Public lobby listing (rooms are private/link-only).
- Account system (ephemeral identity only).

## Decisions

### Topology: Host-Authoritative P2P
- **Decision**: Use a star topology (logically) where one peer is the "Host" and holds the authoritative state (Deck).
- **Rationale**: Prevents cheating. If the deck is shared in Yjs, anyone can peek. By keeping it in Host memory, guests literally do not have the data.
- **Alternatives**: Pure P2P with encryption (too complex), Authoritative Server (costs money/maintenance).

### State Synchronization: Hybrid (Yjs + WebRTC Data Channels)
- **Decision**: Use `y-webrtc` for *Public State* (Scoreboard, Discard Pile) and direct WebRTC messages for *Private Actions* (Draw Card, Play Card).
- **Rationale**: `y-webrtc` handles the hard work of eventually consistent state for UI. Direct messages allow us to implement the "Trusted Dealer" pattern for secrets.

### Discovery: URL Routing
- **Decision**: Room ID is part of the URL hash or path. `y-webrtc` uses this ID as the signaling "room" name.
- **Rationale**: Zero-config. No database needed to map "Room Name" to "IP".

### UI & UX Strategy
- **Decision**: Mobile-First, Dark Mode, Centered Grid.
- **Theme**: Dark background (Slate-900). Vibrant Uno colors for cards/actions.
- **Responsiveness**:
  - **Lobby**: Responsive Grid (1 col mobile, 2-3 col desktop).
  - **Avatars**: Deterministic "Random Animals" (e.g., 🦁, 🦊) based on User ID.
- **Rationale**: The game is P2P but likely played on phones while physically together (or remotely). Must look good on both vertical phone screens and horizontal desktop monitors.

## Risks / Trade-offs

- **Host Dependence**: If Host disconnects, the game state (Deck) is lost.
  - *Mitigation*: Accept this for V1; reliable enough for casual play.
- **Signaling Reliability**: `y-webrtc` relies on public signaling servers by default.
  - *Mitigation*: We will use the default public ones for dev, but plan to host a simple `y-webrtc-signaling` instance for production if needed.
