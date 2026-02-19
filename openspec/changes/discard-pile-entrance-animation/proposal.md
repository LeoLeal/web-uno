## Why

When cards are played, they appear instantly on the discard pile with no visual feedback for where they came from. This makes the game feel static and disconnects players from the action. Adding entrance animations based on card provenance (who played it) will make gameplay feel more dynamic and help players track the flow of the game.

## What Changes

- Add CSS-only entrance animation to the `DiscardPile` component for newly played cards
- Cards played by the current player animate from the **bottom** of the viewport (their hand position)
- Cards played by opponents animate from the **top** of the viewport (opponent area)
- Add `lastPlayedBy` state tracking to `useGameState` hook to determine card provenance
- Trigger animation only when the discard pile top-card ID changes **after mount**
- Do not animate on initial render or on re-renders where discard top-card ID is unchanged (including `DRAW_CARD`)
- Keep visible discard history bounded by a named constant (default `3`) so depth can be tuned later
- Use CSS `transform` animations only (no reflow, performance-friendly)

### Animation Keyframes

The entrance animation uses CSS keyframes with CSS variables for dynamic values:

**Rotation:**
- `from`: Random rotation between -420° and 420° (set via CSS variable `--entrance-rotation-start`, generated in JS)
- `to`: Final rotation value from `transformsById` (set via CSS variable `--final-rotation`)

**Translation (position):**
- `from`: 
  - Opponent card: `translateY(-30vh)` (from top/opponent area)
  - Current player card: `translateY(40vh)` (from bottom/player hand)
- `to`: `translate(offsetX, offsetY)` using values from `transformsById`

**Opacity:**
- Opponent card (`enterFromTop`): `0` at start, `1` at 50% frame, remains `1` to end
- Current player card (`enterFromBottom`): Always `1` (no opacity animation)

The animation applies only to the **top card** (most recently played). Previous cards in the pile remain static.

**Timing:** `600ms ease-out` (prone to adjustment for stronger ease-out curve)

## Capabilities

### New Capabilities

(None - all changes are modifications to existing capabilities)

### Modified Capabilities

- `game-board-ui`: Adding entrance animation requirements to the discard pile display behavior

## Impact

**Code affected:**
- `hooks/useGameState.ts` - Already modified to add `lastPlayedBy` tracking
- `components/game/DiscardPile.tsx` - Add animation classes and provenance detection
- `components/game/DiscardPile.module.css` - New file for CSS keyframes
- `components/game/TableCenter.tsx` or `GameBoard.tsx` - Pass `lastPlayedBy` to DiscardPile

**Dependencies:**
- No new external dependencies (CSS-only approach)

**Performance:**
- CSS `transform` animations avoid layout reflow
- Animation runs only on the top card (most recent play)
