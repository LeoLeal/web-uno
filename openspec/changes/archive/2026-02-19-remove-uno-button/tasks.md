## 1. Remove UNO Button UI and Wiring

- [x] 1.1 Remove UNO button rendering from player-hand/game-board components.
- [x] 1.2 Remove UNO-button-specific props, callbacks, and local state paths from affected components/hooks.
- [x] 1.3 Remove UNO-button-only styling/classes/assets that are no longer referenced.

## 2. Preserve Board Behavior Without UNO Button

- [x] 2.1 Verify card play and deck draw controls remain the only hand-area gameplay controls.
- [x] 2.2 Ensure player-hand layout remains stable after removing UNO button spacing/placement assumptions.
- [x] 2.3 Keep opponent UNO chat balloon behavior intact in board UI (appearance, disappearance, positioning).

## 3. Test and Documentation Cleanup

- [x] 3.1 Update/remove tests that assert UNO button visibility, styling, or interaction.
- [x] 3.2 Add/adjust tests to assert no UNO button control is rendered in player hand during gameplay.
- [x] 3.3 Run targeted suites and full checks (`npm run test`, `npm run lint`, `tsc --noEmit`) and fix regressions.
