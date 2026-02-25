## Why

Players currently appear in the lobby sorted alphabetically, which means the in-game turn order feels arbitrary and disconnected from when players actually joined. The host has no way to influence seating before starting, and during gameplay, players have no visibility into the turn sequence beyond "who's highlighted now."

## What Changes

- **Remove alphabetical sorting** from the lobby player list; players appear in join order (first-come-first-served).
- **Add a `playerOrder` array** in Yjs shared state to track persistent, explicit ordering that survives awareness fluctuations and reconnections.
- **Host can drag-and-drop player cards** in the lobby to reorder seating. A small grip handle (⋮⋮) visible only to the host enables drag on touch devices without conflicting with page scroll.
- **Host can randomize player order** via a "Randomize order" button next to the player count in the lobby header.
- **PlayerList keeps responsive CSS grid** layout while adding drag-and-drop reordering with `@dnd-kit`.
- **During gameplay, each player shows a numbered position badge** (small circle at top-left of opponent avatars, lights up on current turn; "You are player number N" label below the player's hand).
- **New dependency**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.

## Capabilities

### New Capabilities

- `lobby-player-ordering`: Host-managed player order in the lobby (Yjs state, drag-and-drop reorder, randomize, join-order default, reconnection stability).
- `gameplay-player-number`: In-game player number badges on opponent avatars (lit up on current turn) and "You are player number N" label on the player's hand.

### Modified Capabilities

- `lobby-management`: Player list no longer alphabetically sorted; uses explicit `playerOrder` from Yjs. PlayerList layout remains responsive CSS grid.
- `game-board-ui`: OpponentIndicator gains a numbered position badge; PlayerHand gains a "player number" label.

## Impact

- **Hooks**: `useRoom.ts` — remove sort, manage `playerOrder` in Yjs, expose `reorderPlayers` / `randomizePlayers` callbacks.
- **Components**: `PlayerList.tsx` (responsive grid + @dnd-kit sortable + drag handle), `OpponentIndicator.tsx` (number badge), `PlayerHand.tsx` (player number label), `OpponentRow.tsx` / `GameBoard.tsx` (pass player numbers through).
- **Room page**: `app/room/page.tsx` — randomize button in lobby header, new props to PlayerList.
- **Dependencies**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (new npm packages).
- **Existing tests**: `Accessibility.test.tsx` for PlayerList will need updates for new layout/props.
