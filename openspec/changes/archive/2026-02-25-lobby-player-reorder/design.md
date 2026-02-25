## Context

The lobby player list is currently sorted alphabetically by name (with host forced to first) on every awareness change. This ordering is ephemeral — it's recomputed on every render from awareness state. When the host clicks "Start Game," the `players` array order becomes the `turnOrder` for the entire game session.

Players have no way to understand or influence turn sequence. The host cannot set up seating arrangements, and during gameplay, players see opponents but have no indication of their position in the turn cycle.

**Current data flow:**

- Awareness changes → `handleAwarenessChange()` → alphabetical sort → `players[]` state
- `initializeGame()` → `turnOrder = players.map(p => p.clientId)` → Yjs `gameState`

## Goals / Non-Goals

**Goals:**

- Persistent, explicit player ordering stored in Yjs shared state (`playerOrder: number[]`)
- Host-only drag-and-drop reordering in the lobby via `@dnd-kit`
- Host-only randomize button to shuffle the order
- Join-order default (first-come-first-served) replacing alphabetical sort
- Reconnection stability: returning players keep their position
- In-game player number visibility (badges on opponents, label on own hand)

**Non-Goals:**

- Player self-reordering (only host can reorder)
- Turn order changes during gameplay (order is locked at game start)
- Animated transitions for reorder in the lobby (standard @dnd-kit drag animation is sufficient)

## Decisions

### 1. Player order state in Yjs `gameState` map

**Decision:** Store `playerOrder` as a `number[]` (array of clientIds) in the Yjs `gameState` map.

**Rationale:** The order needs to be visible to all peers and persist through awareness fluctuations. Yjs shared state is already the source of truth for game configuration. Using a simple array (rather than a Yjs Y.Array) keeps it consistent with how `turnOrder` and `lockedPlayers` are stored — as plain values set atomically via `gameState.set()`.

**Alternatives considered:**

- Awareness-level ordering (each peer stores their own position): Rejected because ordering is a global concern managed by the host, not per-peer.
- Yjs Y.Array: Rejected because the array is small (≤10 players), replaced atomically, and doesn't benefit from CRDT merge semantics (only the host modifies it).

### 2. Order management in `useRoom` hook

**Decision:** The `playerOrder` management logic lives in `useRoom.ts`. The hook:

1. On awareness change: builds `activePlayers` list, then sorts by `playerOrder` position (instead of alphabetically).
2. On new player join (not in `playerOrder`): host appends their clientId to `playerOrder` in Yjs.
3. On player leave (in `playerOrder` but not in awareness): host schedules removal after a short grace period (currently 5s) and only removes if the player is still absent.
4. On reconnection (clientId already in `playerOrder`): no change — they keep their position.
5. Exposes `reorderPlayers(orderedIds: number[])` and `randomizePlayers()` as host-only callbacks.

**Rationale:** `useRoom` already manages the player list and awareness. Adding order management here keeps the concern co-located.

**Implementation note:** The grace period prevents awareness flicker from unintentionally reordering host-defined seating.

### 3. @dnd-kit for drag-and-drop

**Decision:** Use `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities` for the sortable player cards in the lobby.

**Rationale:** `@dnd-kit` is the de facto standard for React sortable interfaces. It supports:

- Touch and pointer events with configurable sensors
- Grid/wrap layouts via `rectSortingStrategy`
- Drag handles (restrict drag initiation to the handle element)
- Accessibility (keyboard sorting, ARIA)

### 4. Drag handle placement

**Decision:** A small `GripVertical` (⋮⋮) icon at the top-right corner of each player card, visible only to the host. Non-host players see no handle.

**Rationale:** Top-right avoids collision with the crown icon (top-center) on host cards. The handle enables touch drag without conflicting with page scroll (using `@dnd-kit`'s `useSensor(TouchSensor)` with activation constraints).

### 5. PlayerList layout: keep CSS grid for sortable lobby

**Decision:** Keep `PlayerList` as a responsive CSS grid (`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5`) while integrating sortable drag-and-drop.

**Rationale:** `@dnd-kit/sortable` supports grid layouts, so we can preserve the existing responsive structure and avoid unnecessary layout churn.

### 6. Player number badge in gameplay

**Decision:** Add a small numbered circle (e.g., `①`) at the top-left of each `OpponentIndicator` avatar, and a centered "You are player number N" label below the card fan in `PlayerHand`.

The badge uses two visual states:

- **Default:** `bg-(--felt-dark) border-(--copper-border) text-(--cream-dark)` — subtle, unobtrusive
- **Current turn:** `bg-yellow-400 border-yellow-400 text-(--felt-dark) shadow-glow` — lights up with the existing turn highlight

**Rationale:** The number gives all players visibility into the turn sequence. The "lit up" state reinforces the turn indicator that already exists (golden ring on avatar) with positional context.

### 7. Player number computation

**Decision:** Compute player numbers from `turnOrder` in `GameBoard`. Each player's number is `turnOrder.indexOf(clientId) + 1`. Pass as props through `OpponentRow` → `OpponentIndicator` and directly to `PlayerHand`.

**Rationale:** `turnOrder` is the locked game-time order. Computing from it ensures numbers are stable throughout gameplay (including after handovers, since replacement players inherit the original position in `turnOrder`).

## Risks / Trade-offs

**[Risk] `playerOrder` can diverge from awareness** → The host is the single writer of `playerOrder` in shared state. Non-host peers only read it. The `useRoom` hook reconciles `playerOrder` with awareness on every change and uses a leave grace period to avoid transient disconnect churn.

**[Risk] Host disconnect during reorder** → If the host disconnects mid-drag, the `playerOrder` remains in its last-committed state (Yjs durability). The HostDisconnectModal handles this scenario already.

**[Risk] @dnd-kit bundle size** → `@dnd-kit` is modular. Core + sortable + utilities adds ~15-20KB gzipped. Acceptable for the functionality gained.

**[Trade-off] Grid drag behavior** → Grid sortable interactions are supported, but require careful drag target handling to keep movement predictable at different breakpoints.
