## Context

The current P2P Uno implementation lacks resilience against player disconnections. If a player closes their tab or loses network connectivity, the game enters a "zombie" state where turns cannot proceed. We need a robust mechanism to pause the game, handle disconnections, and allow players to rejoin or be removed by the host.

## Goals / Non-Goals

**Goals:**

- Detect player disconnection using Yjs Awareness and pause the game.
- Allow disconnected players to rejoin and reclaim their hand (session recovery).
- Empower the host to remove permanently disconnected players and continue the game.
- Handle "win by walkover" scenarios.

**Non-Goals:**

- Long-term persistence (saving game to database/local storage for later resumption).
- Spectator mode (non-playing observers).
- Complex voting systems for pausing/resuming (host authority is sufficient).

## Decisions

### 1. State Management Changes

We will extend the Yjs `GameState` structure to support the new flows.

- **New Status**: Add `PAUSED_WAITING_PLAYER` to the `GameStatus` enum.
- **Orphan Hands**: Create a new Yjs Array `orphanHands` to temporarily store the cards of disconnected players.
  - Structure: `{ originalClientId: string, name: string, cards: Card[] }`
- **Disconnection Source of Truth**: Disconnections will be derived by comparing the persistent `lockedPlayers` list (in Yjs doc) against the ephemeral Yjs `awareness` states.
  - `disconnectedPlayers = lockedPlayers.filter(p => !awareness.has(p.id))`

### 2. Disconnection & Pause Logic

- **Trigger**: A `useEffect` hook in `useGameEngine` will monitor `awareness` changes.
- **Condition**: If `gameStatus === PLAYING` AND `connectedPlayers < lockedPlayers`, trigger disconnection flow.
- **Action**:
  - Set status to `PAUSED_WAITING_PLAYER`.
  - Move disconnected player's cards to `orphanHands`.
  - Display `WaitingForPlayerModal`.

### 3. Reconnection Strategy (Handover)

- When a new peer connects while status is `PAUSED_WAITING_PLAYER`:
  - Check if their `name` matches any entry in `orphanHands` (Exact match initially).
  - **Match Found**:
    - Auto-assign the orphan hand to the new player.
    - Update `lockedPlayers`: specific index receives new `clientId` but keeps other metadata.
    - Remove from `orphanHands`.
    - If `orphanHands` is empty and all players are back, resume `PLAYING`.

### 4. Host Constraints

- Only the Host (peer who initialized the game/room) can execute "Continue Without Player".
- **Action**:
  - Validates `orphanHands` entry exists.
  - Adds unrelated cards back to the `deck` (reshuffle implementation).
  - Removes player from `lockedPlayers`.
  - Adjusts `turnIndex` if necessary (e.g., if the removed player was current or previous).
  - Resumes game.

## Risks / Trade-offs

- **Identity Spoofing**: Since we rely on "Name" for reconnection matching, a malicious user could potentially "steal" a spot by joining with the same name.
  - _Mitigation_: Low risk for casual P2P games. Can be improved later with local storage tokens if needed.
- **Awareness Latency**: Yjs awareness can track "ghost" users briefly.
  - _Mitigation_: Add a small debounce (e.g., 2-3s) before triggering "Pause" to avoid flickering on minor network hiccups.
- **Host Disconnection**: The game session is terminated if the host disconnects.
  - _Mitigation_: Current implementation relies on the lobby host's presence.
  - _Decision_: Host migration/handover is out of scope for this change and will be a future feature.
