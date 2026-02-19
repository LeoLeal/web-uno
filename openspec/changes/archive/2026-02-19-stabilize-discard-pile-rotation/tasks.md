## 1. Stabilize Discard Transform History

- [x] 1.1 Refactor `components/game/DiscardPile.tsx` to maintain transform values keyed by `card.id` for currently visible discard cards.
- [x] 1.2 Ensure transform values are generated only when a card first enters the visible subset and reused while it remains visible.
- [x] 1.3 Implement visible-only pruning so cards leaving visibility are removed from transform history.

## 2. Apply Updated Visual Behavior Constraints

- [x] 2.1 Update rotation randomness range to `+/-30` degrees for discard transforms.
- [x] 2.2 Preserve existing offset behavior and card sizing behavior for mobile/desktop table center display.
- [x] 2.3 Confirm no game-rule paths were changed (no edits to shared game state shape, turn/action processing, or playability logic).

## 3. Test and Validate

- [x] 3.1 Add/update discard pile tests to verify visible cards keep stable transforms across new plays while still visible.
- [x] 3.2 Add/update tests to verify cards that re-enter visibility receive newly generated transforms after prior pruning.
- [x] 3.3 Run verification checks (`npm run test`, `npm run lint`, `npx tsc --noEmit`) and resolve regressions.
