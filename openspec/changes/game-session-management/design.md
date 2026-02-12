## Context

The P2P Uno game currently has no resilience for player disconnections. Game state is synchronized via Yjs (CRDT) over WebRTC. The `useRoom` hook tracks player presence through Yjs awareness, and `useGameState` reads game status from a shared `gameState` Y.Map. When a player disconnects, their awareness state disappears but the game continues with a broken player list—there's no pause, no recovery, and no way to continue.

This design adds session resilience: detecting disconnects, pausing the game, enabling hand handover or removal, and handling walkover wins.

### Current Architecture

- **`GameProvider`** — provides a `Y.Doc` via React context
- **`useRoom`** — manages WebRTC provider, awareness, player list, host claiming
- **`useGameState`** — reads `gameState` Y.Map fields (`status`, `currentTurn`, `direction`, `discardPile`, `playerCardCounts`, `turnOrder`, `lockedPlayers`)
- **`useGameEngine`** — host-only; creates deck, deals hands, initializes game via Yjs transaction
- **Awareness** — each connected peer has an awareness state with `{ user: { name, isHost, color, avatar } }`

### Key Constraints

- Yjs awareness fires change events when peers disconnect — this is the detection mechanism
- The host is already tracked via `gameState.get('hostId')` and awareness checks
- `lockedPlayers` (set at game start) provides the reference list of expected players
- Deck lives only in host memory (`deckRef`) — reshuffling orphan cards requires host action

## Goals / Non-Goals

**Goals:**

- Detect player disconnection during gameplay by comparing awareness to `lockedPlayers`
- Pause the game automatically when a player disconnects
- Allow replacement players to take over orphaned hands
- Allow the host to remove disconnected players and continue
- Award a win-by-walkover when all opponents disconnect
- Keep all state changes in Yjs for peer consistency

**Non-Goals:**

- Save/restore game state across browser sessions (persistence)
- Spectator mode
- Vote-to-pause/resume mechanics
- Reconnection of the _same_ player (awareness generates new clientIds per session)

## Decisions

### 1. Extend `GameStatus` union type

Add `'PAUSED_WAITING_PLAYER'` to the existing `GameStatus` type. The status enum becomes `'LOBBY' | 'PLAYING' | 'PAUSED_WAITING_PLAYER' | 'ENDED'`.

**Rationale:** Keeps the single-source-of-truth pattern in `gameState.status`. All peers observe the same status and react accordingly (show modal, freeze turns).

**Alternative considered:** Using a separate `isPaused` boolean — rejected because it creates ambiguous compound states and complicates conditional rendering.

### 2. Store orphan hands in the Yjs `gameState` map

Add an `orphanHands` field: `Array<{ originalClientId: number; originalName: string; cards: Card[] }>`.

**Rationale:** Orphan data must be visible to all peers so any joining player can receive a hand. Using the existing `gameState` map avoids creating new Yjs structures and stays consistent with current patterns.

**Alternative considered:** Using a separate Y.Map for orphans — rejected as over-engineering for a simple array structure.

### 3. New `useSessionResilience` hook (host-only)

Create a dedicated hook that:

1. Watches awareness changes during `PLAYING` status
2. Compares active awareness clientIds against `lockedPlayers`
3. When a disconnect is detected: transitions to `PAUSED_WAITING_PLAYER`, reads the disconnected player's hand from `dealtHands` map, writes it to `orphanHands`
4. Handles hand assignment to replacement players
5. Handles "continue without" by reshuffling orphan cards into the deck

**Rationale:** Isolating session logic in its own hook follows the existing pattern (`useGameEngine` for game init, `useGameState` for reading state). Host-only keeps it simple — only one peer makes decisions.

**Alternative considered:** Extending `useGameEngine` — rejected because game engine handles initialization, not runtime session management. Separation of concerns is cleaner.

### 4. Hand handover via name similarity

When a new player joins during a pause, match them to an orphan hand using Levenshtein distance (closest name match). Use a simple inline implementation (< 20 lines) rather than adding a dependency.

**Rationale:** Players reconnecting will likely use the same or similar name. Automatic matching reduces friction. A lightweight string distance function avoids adding external dependencies for a minor feature.

**Alternative considered:** Manual host assignment — rejected as it adds UI complexity and slows recovery. Could be added later as an override.

### 5. Walkover detection in the same hook

If `lockedPlayers.length - orphanHands.length <= 1` (only one player remaining connected), immediately set `status = 'ENDED'` and record the remaining player as winner.

**Rationale:** This is a natural extension of the disconnect detection logic. No separate hook needed.

### 6. UI components: modals for pause and walkover

- **`WaitingForPlayerModal`** — shown to all peers when status is `PAUSED_WAITING_PLAYER`. Displays disconnected player names/avatars. Host sees a "Continue without [player]" button per orphan.
- **`WinByWalkoverModal`** — shown when a player wins by walkover. Displays victory message and a "Back to Lobby" action.

**Rationale:** Modals match the existing UI pattern (see `GameAlreadyStartedModal`, `JoinGameModal`). They overlay the game board without disrupting layout.

### 7. Turn handling on disconnect

If the disconnected player was the current turn holder (`currentTurn === disconnectedClientId`):

- During pause: turn stays on them (frozen)
- On "continue without": advance to next player in `turnOrder`, skipping removed players
- On handover: new player inherits the turn

**Rationale:** Freezing the turn during pause prevents game state corruption. The host handles advancement as part of the "continue without" action, keeping it atomic.

## Risks / Trade-offs

**Awareness delay** — WebRTC awareness has a configurable timeout (default ~30s) before a peer is considered disconnected. Brief network blips could trigger false pauses.
→ Mitigation: Accept false pauses for now; they auto-resolve when the player reconnects. A future improvement could add a grace period before pausing.

**Host disconnect** — If the host disconnects, no peer can execute session management logic (orphan creation, continue-without, etc.).
→ Mitigation: The existing `isHostConnected` tracking in `useRoom` already shows a "host disconnected" modal. Host migration is out of scope but the hook architecture supports adding it later.

**Deck in host memory** — Reshuffling orphan cards requires the host to still have their `deckRef`. If the host refreshed, the deck is lost.
→ Mitigation: This is a pre-existing limitation. The "continue without" action pushes orphan cards back and reshuffles — this works as long as the host's `deckRef` is intact. Full deck persistence is out of scope.

**Name matching accuracy** — Levenshtein matching could assign hands incorrectly if players rejoin with very different names.
→ Mitigation: Acceptable for MVP. The host could manually reassign in a future iteration.

**New player joining during active game** — A player joining mid-game who wasn't in `lockedPlayers` should not automatically receive an orphan hand unless the game is paused.
→ Mitigation: Only assign orphan hands when status is `PAUSED_WAITING_PLAYER`. Ignore joins during normal `PLAYING` status.
