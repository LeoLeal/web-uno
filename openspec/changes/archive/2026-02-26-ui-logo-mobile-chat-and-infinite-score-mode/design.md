## Context

This change bundles three UX and gameplay-semantic updates across UI and host game logic:

1. Home logo typography should match the room header style (Nunito) for consistent branding.
2. Mobile in-game chat currently retracts the drawer after send, but the virtual keyboard can remain open because the chat input keeps focus.
3. Score-mode semantics currently overload `∞` as single-round (`scoreLimit = null`). We need explicit `Single Round` and explicit `Infinite` (endless multi-round with no auto-end threshold).

Current implementation characteristics:

- `scoreLimit === null` means single-round in settings, scoring, and win-condition logic.
- Any non-null numeric score limit is treated as multi-round with cumulative score and threshold-based end.
- Chat input submit always clears and re-focuses the input, which is desirable on desktop but problematic for the mobile drawer flow.

## Goals / Non-Goals

**Goals:**

- Align home logo text styling with Nunito used by room header/body typography.
- Ensure mobile drawer chat submit both retracts drawer and dismisses the virtual keyboard.
- Make score mode explicit in UI:
  - `Single Round` maps to `scoreLimit = null`
  - Numeric values map to threshold-based multi-round mode
  - `Infinite` maps to `scoreLimit = Infinity` (endless multi-round)
- Keep cumulative scoring active in `Infinite` mode while preventing score-threshold auto-end.

**Non-Goals:**

- Reworking full branding system beyond home logo text.
- Changing desktop chat behavior.
- Adding new game-end controls for manually ending endless games.
- Refactoring unrelated game settings or house-rule mechanics.

## Decisions

### Decision 1: Keep `null` for single-round; use numeric `Infinity` for endless mode

- **Choice**: Represent endless mode with `scoreLimit = Infinity`.
- **Why**: This minimizes schema churn while preserving existing single-round behavior (`null`) and existing finite threshold behavior (numbers).
- **Alternatives considered**:
  - Add `matchMode` enum (`single-round|score-limit|infinite`) plus optional limit: clearer model but larger migration and broader surface changes.
  - Add string sentinel (`'infinite'`): explicit, but expands type complexity and branching without clear benefit over numeric infinity in current architecture.

### Decision 2: Keep one numeric multi-round path (no Infinity-specific branch)

- **Choice**: Keep existing multi-round threshold comparison as `newScore >= scoreLimit` for all numeric score limits, including `Infinity`.
- **Why**: `Infinity` is a numeric value and naturally never satisfies the threshold in practice, so endless behavior is achieved without adding separate branching logic.
- **Alternatives considered**:
  - Add `Number.isFinite(scoreLimit)` guard: explicit but introduces unnecessary mode-specific branching.

### Decision 3: Add mobile-only keyboard-dismiss behavior through input focus policy

- **Choice**: Add submit focus-policy support in chat input so mobile drawer path blurs after send while desktop behavior remains unchanged.
- **Why**: Solves keyboard issue without introducing viewport-dependent behavior into generic input internals.
- **Alternatives considered**:
  - Force global blur after every send: would degrade desktop rapid chat sending.
  - Blur in parent only: less reliable if child immediately re-focuses.

### Decision 4: Update labels, summaries, and tooltip semantics together

- **Choice**: Rename existing single-round option to `Single Round`, add explicit `∞`/`Infinite`, and update descriptive copy.
- **Why**: Prevents mental-model mismatch between modal labels and engine behavior.
- **Alternatives considered**:
  - Label-only update without semantic updates: rejected due to ambiguity and incorrect expectations.

## Risks / Trade-offs

- **[Risk] `Infinity` in serialization paths** -> **Mitigation**: Keep runtime storage in Yjs numeric values; avoid JSON serialization of raw settings values where possible or normalize display values before serializing.
- **[Risk] UI copy inconsistency across modal, summary, and tooltip** -> **Mitigation**: Update all score-mode-facing strings in a single change and validate with focused tests.
- **[Risk] Mobile keyboard behavior differs by browser** -> **Mitigation**: use explicit blur on mobile drawer submit and verify behavior in mobile viewport test coverage where practical.
- **[Trade-off] Keeping `scoreLimit` overloaded (`null`, finite number, infinity)** -> **Mitigation**: codify semantics in specs and helper labels, and preserve a single numeric multi-round execution path.
