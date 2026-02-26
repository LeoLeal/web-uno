## 1. Home and mobile chat UX updates

- [x] 1.1 Update home logo text styling to use Nunito consistently with room header typography.
- [x] 1.2 Extend `ChatInput` submit behavior with a configurable focus policy (keep focus vs blur) and keep desktop default unchanged.
- [x] 1.3 Wire mobile drawer chat submit path to use blur-on-send so virtual keyboard dismisses after sending.
- [x] 1.4 Add/adjust tests for mobile drawer send behavior to verify drawer retract + keyboard-dismiss intent (input blur) on mobile path.

## 2. Score settings semantics and labels

- [x] 2.1 Update score limit option definitions to include explicit `Single Round` (`null`) and explicit `Infinite` (`Infinity`) alongside numeric limits.
- [x] 2.2 Update settings modal labels/tooltips so single-round and infinite semantics are unambiguous.
- [x] 2.3 Update game settings summary text to render `Single Round` and `∞`/`Infinite` correctly.
- [x] 2.4 Add/adjust tests for settings option rendering and mapping (`null`, finite numbers, `Infinity`).

## 3. Engine behavior for infinite mode

- [x] 3.1 Update game initialization logic so infinite mode is treated as multi-round with cumulative scores initialized.
- [x] 3.2 Keep a single numeric multi-round threshold path (`newScore >= scoreLimit`) so `Infinity` works without mode-specific branching.
- [x] 3.3 Ensure `scoreLimit = Infinity` rounds always transition to `ROUND_ENDED` and never auto-end by threshold reach.
- [x] 3.4 Add/adjust engine/scoring/win-condition tests covering finite limit, single round, and infinite mode branches.

## 4. Validation and regression checks

- [x] 4.1 Run targeted tests for chat input, settings modal/panel, and game engine scoring/win transitions.
- [x] 4.2 Run full test suite and lint to confirm no regressions.
- [x] 4.3 Manually verify responsive behavior in room gameplay mobile breakpoint: send message, drawer closes, keyboard dismisses.
