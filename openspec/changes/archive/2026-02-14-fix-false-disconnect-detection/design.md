## Context

`useSessionResilience` detects player disconnections by comparing `activePlayers` (from Yjs awareness) against `lockedPlayers` (snapshot from game start). Two bugs cause false-positive pauses:

1. **No host guard**: The disconnect detection effect (line 83) and replacement player effect (line 134) run on every peer. Different peers have different awareness snapshots at any moment — any peer seeing a transient mismatch writes `PAUSED_WAITING_PLAYER` to Yjs, pausing the game for everyone.

2. **No grace period**: A single effect evaluation where `activeLocked.length < expectedConnectedCount` immediately triggers the pause. Awareness heartbeats refresh every 15s with a 30s timeout checked every 3s — browser tab throttling, network jitter, or GC pauses can easily cause momentary gaps.

## Goals / Non-Goals

**Goals:**
- Eliminate false-positive disconnect detection that pauses the game when all players are connected
- Enforce host-only disconnect detection as the spec requires
- Add a grace period so transient awareness flickers don't trigger pauses

**Non-Goals:**
- Changing the awareness timeout configuration (that's in y-protocols internals)
- Modifying the replacement player or continue-without flows (those work correctly)
- Adding a reconnection/resume mechanism (separate concern)

## Decisions

### 1. Add `isHost` param and early-return guard

Add `isHost: boolean` to `UseSessionResilienceOptions`. Both the disconnect detection effect (line 83) and replacement player effect (line 134) will early-return when `!isHost`.

The `continueWithout` callback is already host-only by UI gating (only the host sees the button), but we'll add an `!isHost` guard there too for defense in depth.

**Why not conditionally call the hook?** React hooks can't be called conditionally. We could split into two hooks, but that adds complexity for no benefit — an early-return is simpler and keeps all session resilience logic together.

### 2. Grace period via `setTimeout` + ref tracking

When the disconnect detection effect detects missing players, instead of immediately writing to Yjs:

1. Store the set of suspected-disconnected clientIds in a `useRef<Set<number>>` (`pendingDisconnects`)
2. Start a `setTimeout` (grace period duration) stored in a `useRef<NodeJS.Timeout>`
3. When the timer fires, re-check: compare the **current** `activePlayers` (via a ref that tracks the latest value) against `lockedPlayers`. If the players are still missing, execute the pause.
4. If a subsequent effect run sees the missing player has returned (now present in `activePlayers`), remove them from `pendingDisconnects` and clear the timeout if no suspects remain.

```
Effect runs, detects Player X missing
  → add X to pendingDisconnectsRef
  → start gracePeriodTimer (5s)
  → ...

Effect runs again (awareness update), Player X is back
  → remove X from pendingDisconnectsRef
  → clear timer (no suspects left)
  → no pause triggered ✓

-- OR --

Timer fires, Player X still missing
  → write PAUSED_WAITING_PLAYER + orphanHands
  → clear pendingDisconnectsRef
```

**Why 5 seconds?** The awareness check interval is 3s and refresh is 15s. A 5-second window covers at least one full check cycle plus buffer for network delays, while still being short enough that a genuine disconnect is caught promptly. This is a constant, not configurable — we can revisit if needed.

**Why refs instead of state?** The timer callback needs access to the latest `activePlayers` without causing re-renders or stale closures. A `useRef` that syncs with `activePlayers` on each render gives the callback fresh data. Using `useState` would cause unnecessary re-renders and the timer callback would still close over stale state.

**Alternative considered: Debounce with consecutive misses** — require N consecutive effect evaluations to see the player missing. Rejected because the effect firing rate is unpredictable (depends on awareness event frequency), making it hard to reason about the actual time window.

### 3. Cleanup timer on unmount and status change

The grace period timer must be cleared:
- On component unmount (effect cleanup)
- When status leaves `PLAYING` / `PAUSED_WAITING_PLAYER` (e.g., game ends)
- When pending players reappear

This prevents stale timers from firing after the game state has moved on.

## Risks / Trade-offs

**5-second delay on genuine disconnects** → Acceptable. The game pauses 5s later than before. Players won't notice since they're still playing during the grace window — the disconnected player simply can't take their turn. If it's the disconnected player's turn, the 5s delay is negligible compared to waiting for them to rejoin anyway.

**Race between timer firing and Yjs sync** → Low risk. The timer callback reads from refs (latest awareness state) and writes to Yjs transactionally. Even if two effects fire close together, the Yjs transaction ensures atomic state updates. The `pendingDisconnectsRef` prevents duplicate orphan creation.

**Awareness flicker longer than 5s** → Would correctly trigger a pause. This is intentional — a 5s+ absence is a meaningful signal. The player can still rejoin and reclaim their hand via the existing replacement flow.
