## Context

The game currently supports only single-round play. When a player empties their hand, the game transitions directly to `ENDED`. The `scoreLimit` setting already exists in the type system (`100 | 200 | 300 | 500 | null`) with `null` as the default (single round), but the multi-round scoring loop is not implemented.

Key constraints:
- **Host-authoritative**: Only the host reads all hands and computes scores. Scores are written to Yjs for all peers to read.
- **Yjs CRDT sync**: All shared state flows through `gameStateMap`. New fields must follow the same pattern — host writes, peers observe.
- **Backward compatibility**: Single-round games (`scoreLimit = null`) must behave exactly as they do today — no new statuses, no score calculation.

## Goals / Non-Goals

**Goals:**
- Multi-round games where players accumulate points until a score limit is reached
- Correct pause/resume across both `PLAYING` and `ROUND_ENDED` statuses
- Score visibility during gameplay (opponent avatars, player header)
- Clean round transitions with host-triggered "Next Round"

**Non-Goals:**
- Per-round score history or breakdown storage
- Undo/replay of previous rounds
- Spectator mode or late-join score catch-up
- Animated score transitions or elaborate UI effects (can be added later)

## Decisions

### Decision 1: New `ROUND_ENDED` game status

**Choice**: Add `ROUND_ENDED` to the `GameStatus` union.

**Why**: The state machine needs an explicit resting state between rounds. Reusing `ENDED` with a sub-flag would conflate "game over" with "round over" and leak conditional logic into every component that checks status.

**Alternatives considered**:
- *Reuse `ENDED` + `isGameOver` boolean*: Muddies the status semantics. Every `status === 'ENDED'` check would need an additional condition.
- *Auto-advance to next round without a pause state*: Removes host agency, no time to show round results.

**Status flow**:
```
Single-round (scoreLimit = null):
  PLAYING → ENDED                            (unchanged from today)

Multi-round (scoreLimit = number):
  PLAYING → ROUND_ENDED → PLAYING → ...      (loop until limit reached)
  PLAYING → ROUND_ENDED → ENDED              (when score limit reached)
```

### Decision 2: Score calculation as a pure function

**Choice**: Create `calculateHandPoints(cards: Card[]): number` in `lib/game/scoring.ts`.

**Why**: Scoring is deterministic and side-effect-free. A pure function is trivially testable and reusable (host calculation, UI display of point values, etc.).

**Point values**:
| Symbol | Points |
|--------|--------|
| `0`-`9` | Face value (parseInt) |
| `skip`, `reverse`, `draw2` | 20 |
| `wild`, `wild-draw4` | 50 |

The host calls this for every opponent's remaining hand when a round ends, sums the results, and credits the round winner.

### Decision 3: Minimal Yjs state additions

**Choice**: Add three fields to `gameStateMap`:

| Field | Type | Purpose |
|-------|------|---------|
| `scores` | `Record<number, number>` | clientId → cumulative points |
| `currentRound` | `number` | 1-indexed round counter |
| `statusBeforePause` | `GameStatus \| null` | Tracks pre-pause status for correct resume |

**Why**: This is the minimum state needed. No round history, no per-round breakdown. Scores accumulate in place. `currentRound` drives starting-player rotation and display. `statusBeforePause` ensures correct resume to either `PLAYING` or `ROUND_ENDED`.

**Alternatives considered**:
- *Store full round history*: User explicitly excluded this — cumulative only.
- *Derive `statusBeforePause` from other signals*: Fragile. An explicit field is unambiguous.

### Decision 4: Round reset via `initializeRound` in `useGameEngine`

**Choice**: Extract the deck-creation/deal/first-card-effects logic from `initializeGame` into a shared helper, then add `initializeRound` that calls it while preserving multi-round state.

**Why**: `initializeGame` and `initializeRound` share ~80% of their logic (create deck, shuffle, deal, flip first card, apply effects). The difference is:

| | `initializeGame` | `initializeRound` |
|---|---|---|
| `turnOrder` | Built from player list | Preserved |
| `lockedPlayers` | Built from player list | Preserved |
| `scores` | Initialized to `{}` | Preserved (not touched) |
| `currentRound` | Set to `1` | Incremented |
| Starting player | `turnOrder[0]` | `turnOrder[(currentRound - 1) % turnOrder.length]` |
| `orphanHands` | N/A | Cleared |
| `status` | → `PLAYING` | → `PLAYING` |

The host calls `initializeRound` when the "Next Round" button is clicked during `ROUND_ENDED`.

### Decision 5: Win detection branching point

**Choice**: Branch at the existing win-detection site in the action observer (`useGameEngine.ts:278-285`).

**Current code**:
```typescript
if (newHand.length === 0) {
  gameStateMap.set('status', 'ENDED');
  gameStateMap.set('winner', clientId);
  gameStateMap.set('winType', 'LEGITIMATE');
  // ...
}
```

**New logic**:
```
if hand is empty:
  if scoreLimit is null:
    → status = ENDED (single-round, same as today)
  else:
    calculate round points from all opponents' remaining hands
    add to winner's cumulative score
    if winner's score >= scoreLimit:
      → status = ENDED (game over)
    else:
      → status = ROUND_ENDED (show results, await next round)
```

The host reads all hands from `dealtHandsMap` at this point — it already has access since it manages all hand mutations.

### Decision 6: `statusBeforePause` for pause/resume fidelity

**Choice**: When transitioning to `PAUSED_WAITING_PLAYER`, store the current status in `statusBeforePause`. On resume, restore from `statusBeforePause` instead of hardcoding `PLAYING`.

**Affected code in `useSessionResilience.ts`**:
- **Pause trigger** (line ~190): Store `statusBeforePause` before setting `PAUSED_WAITING_PLAYER`
- **Auto-resume after handover** (line ~297): Restore from `statusBeforePause`
- **Resume after "continue without"** (line ~353): Restore from `statusBeforePause`
- **Walkover** (line ~346): No change — walkover always sets `ENDED`

This handles the scenario where a disconnect occurs during `ROUND_ENDED` — the game pauses, then correctly resumes to the round-end screen (not back to `PLAYING`).

### Decision 7: Replacement player inherits cumulative score

**Choice**: In the handover logic of `useSessionResilience`, copy the `scores[originalClientId]` entry to `scores[newClientId]` and delete the old entry.

**Why**: The replacement is taking over a "seat" in the game. The seat carries its hand and its score. This is consistent with how `turnOrder`, `lockedPlayers`, and `playerCardCounts` already map old→new clientId.

### Decision 8: Score display locations

**Choice**: Two display locations during gameplay, plus modals for round/game end.

**During gameplay**:
1. **OpponentIndicator**: Show cumulative score below the player name (e.g., "42 pts"). Only visible when `scoreLimit !== null`.
2. **Player header area**: Show the player's own score near the turn indicator in `PlayerHand`. Only visible when `scoreLimit !== null`.

**Round end** (`ROUND_ENDED`):
- Modal showing: round winner, points gained this round, current standings, "Next Round" button (host only)
- Non-host players see standings but no action button

**Game end** (`ENDED` with `scoreLimit !== null`):
- Enhanced `GameEndModal` showing: final winner, final standings with scores, "Back to Lobby" button
- When `scoreLimit === null`: existing modal behavior unchanged

### Decision 9: Starting player rotation

**Choice**: `turnOrder[(currentRound - 1) % turnOrder.length]` with direction always reset to `1` (clockwise).

**Why**: Simple, deterministic, fair. Each player gets an equal share of starting positions across rounds. Direction always resets to clockwise per standard Uno rules — the first card's effects can still modify it (e.g., Reverse as first card).

## Risks / Trade-offs

**[Host crash loses scores]** → Scores live in Yjs shared state, so they survive host migration if implemented later. Currently, host crash ends the game regardless — this is an existing limitation, not new.

**[ROUND_ENDED is a new status all components must handle]** → Components that switch on `GameStatus` need updating. Most can treat `ROUND_ENDED` like `ENDED` for display purposes (e.g., disable card play). The risk is a missed switch case. Mitigation: TypeScript exhaustive checks where possible.

**[Score calculation reads all hands — timing matters]** → The host must read all remaining hands *before* any cleanup or reset. Since this happens inside the same `doc.transact()` as the win detection, and the host is the sole writer, there's no race condition.

**[Orphan hands in multi-round scoring]** → If a player is disconnected when a round ends, their orphan hand's points still count toward the winner's score (the host can read orphan cards from `orphanHands` entries). This is fair — disconnecting doesn't erase your cards.
