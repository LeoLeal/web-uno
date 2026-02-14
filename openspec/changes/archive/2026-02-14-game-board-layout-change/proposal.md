# Proposal: game-board-layout-change

## Why

The current game board table center (draw and discard piles) uses a fixed card size (`md`: 80x120px) across all breakpoints. On larger screens, the piles appear undersized relative to the available space, reducing visual prominence. Increasing the card size and adjusting vertical positioning on desktop will improve visual hierarchy and make the table center more prominent.

## What Changes

- **Modify**: Table center layout to use responsive card sizing
  - Keep mobile behavior unchanged (card size 80x120)
  - Desktop (≥768px): Change card size to ~60% larger (130x195) and add 200px bottom padding

## Capabilities

### New Capabilities
(None - this is a layout adjustment to existing UI)

### Modified Capabilities
- **game-board-ui**: Update "Table Center Display" and "Responsive Layout" requirements to specify larger card size (`lg`) and adjusted positioning for desktop breakpoints.

## Impact

- **Affected Code**:
  - `components/game/DeckPile.tsx` - Update UnoCard size prop with responsive breakpoint
  - `components/game/DiscardPile.tsx` - Update UnoCard size prop with responsive breakpoint
  - `components/game/TableCenter.tsx` - Add vertical offset for desktop layout
- **Dependencies**: None (using existing UnoCard component size options)
- **No breaking changes**: Mobile layout remains identical
