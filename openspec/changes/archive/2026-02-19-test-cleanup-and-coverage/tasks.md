## 1. Delete Entirely Useless Test Files

- [x] 1.1 Delete `hooks/useGameState.test.ts` (100% self-referential, imports only types)
- [x] 1.2 Delete `hooks/useGamePlay.test.ts` (tests a local copy of canPlayCard, not the real function)
- [x] 1.3 Delete `hooks/useSessionResilience.test.ts` (493 lines, hook never imported, tests Array.filter/Set.add)
- [x] 1.4 Delete `app/room/late-joiner.test.ts` (re-implements page logic inline, tests boolean algebra)
- [x] 1.5 Delete `app/room/page.test.ts` (single `toBeTypeOf('function')` assertion)

## 2. Clean Up Mixed-Quality Test Files

- [x] 2.1 `hooks/useGameEngine.test.ts` — Remove self-referential sections: "First Card Effects" (except wild-draw4 test), "Turn Order", "Locked Players", and non-dealing "Player Limits" tests. Keep "Dealing", first-card-flip wild-draw4 check, and dealing player-limit tests.
- [x] 2.2 `lib/game/scoring-integration.test.ts` — Remove "Win-detection branching", "Round initialization state", "StatusBeforePause flow", and "Replacement player score inheritance" sections. Keep "Round score calculation" section.
- [x] 2.3 `components/modals/RoundEndModal.test.tsx` — Remove duplicate "should display points gained this round" test (identical to winner name test). Fix or remove weak edge case tests that only assert `getByText(/Round Complete/)` without verifying the prop values under test.
- [x] 2.4 `components/ui/Accessibility.test.tsx` — Remove redundant color-contrast specific axe test (axe runs it by default). Remove UnoCard alt text test that duplicates `UnoCard.test.tsx`.
- [x] 2.5 `components/lobby/Accessibility.test.tsx` — Remove GameSettingsPanel tests that duplicate the dedicated test file. Remove redundant color-contrast subsection. Remove duplicate keyboard form submission test.
- [x] 2.6 `components/ui/InfoTooltip.test.tsx` — Remove duplicate "aria-hidden state" describe block (lines 134-150, already covered by click/tap interaction tests).
- [x] 2.7 `components/game/OpponentIndicator.test.tsx` — Remove duplicate "should show crown for host" test in "Host Indicator" describe. Remove redundant "should not show score when showScore is false even if score is provided" test.
- [x] 2.8 `components/game/PlayerHand.test.tsx` — Remove redundant score tests: "should show score during player turn" and "should show score when not player turn" (isMyTurn doesn't affect score display).

## 3. Fix Broken/Meaningless Assertions

- [x] 3.1 `components/game/DeckPile.test.tsx` — Replace `expect(true).toBe(true)` (line 47) with meaningful assertion or remove the no-op line
- [x] 3.2 `components/game/WildColorModal.test.tsx` — Fix backdrop click test (lines 137-157): add `expect(mockOnCancel).toHaveBeenCalled()` assertion, or delete the assertion-less test
- [x] 3.3 `hooks/useGameEngine.test.ts` — Remove `expect(true).toBe(true)` placeholder in wild-draw-four first card test

## 4. Add Critical Test Coverage

- [x] 4.1 Create `lib/game/cards.test.ts` — Test `isWildCard`, `isWildDrawFour`, `isActionCard`, `isNumberCard` with all card types. Pay special attention to `isNumberCard`'s `Number()` coercion edge cases (empty string, wild symbols, etc.)
- [x] 4.2 Create `hooks/usePlayerHand.test.ts` — Test hook reads dealt hand from Yjs map, updates when hand changes, handles missing/empty hands. Follow `useGameSettings.test.ts` pattern (real Y.Doc, mock GameProvider context).
- [x] 4.3 Create `components/providers/GameProvider.test.tsx` — Test that `useGame()` throws outside provider, provides a Y.Doc instance inside, and cleans up doc on unmount.

## 5. Add Important Test Coverage

- [x] 5.1 Create `lib/game/settings.test.ts` — Test `getSettingsSummary()` with default settings, all rules enabled, various score limits including null, and single-rule combinations.
- [x] 5.2 Add real `canPlayCard` tests — Import and test the actual function from `hooks/useGamePlay.ts` (via renderHook or direct export). Cover: matching color, matching symbol, wild cards, wild-draw-4, no match.
- [x] 5.3 Create `lib/room-code.test.ts` — Test `generateRoomId()` returns correct format (adjective-noun-number), number is 2 digits (10-99), and multiple calls produce varying results.

## 6. Verify

- [x] 6.1 Run full test suite (`npm run test`) — all tests pass
- [x] 6.2 Run type check (`tsc --noEmit`) — no type errors
- [x] 6.3 Confirm no test imports only types without testing real code (spot-check)
