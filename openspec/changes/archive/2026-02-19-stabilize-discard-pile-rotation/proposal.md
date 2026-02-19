## Why

The discard pile currently re-randomizes card rotations when new cards are played, which makes the stack jitter and reduces visual continuity. Stabilizing rotations for visible cards improves readability and polish without changing any gameplay behavior.

## What Changes

- Keep per-card visual transforms stable while a card remains in the visible discard stack.
- Generate random rotation/offset only when a card first enters the visible discard subset.
- Use visible-only pruning so cards that leave and later re-enter visibility receive new random transforms.
- Preserve existing game rules and action processing (no changes to turn logic, action resolution, or shared game state).

## Capabilities

### New Capabilities
- (none)

### Modified Capabilities
- `game-board-ui`: Update discard pile visual requirements to specify stable transforms for currently visible history cards and new random transform assignment when cards newly enter visible range.

## Impact

- Affected code: `components/game/DiscardPile.tsx` and related discard pile UI tests.
- APIs/protocols: no external API or network protocol changes.
- State/systems: no Yjs game-state schema changes; transformation history remains UI-local only.
