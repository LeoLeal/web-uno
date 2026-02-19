## Why

The test suite has significant quality issues: ~5 test files are entirely self-referential (asserting on local variables, never importing application code), ~8 more contain a mix of valid and useless tests, and several critical source files (card predicates, player hand hook, game provider) have zero test coverage. This creates false confidence — the suite "passes" but doesn't catch regressions in core game logic.

## What Changes

- **Delete 5 test files** that test zero application code (useGameState, useGamePlay, useSessionResilience, late-joiner, page.test.ts)
- **Clean up 8 test files** by removing self-referential test cases, duplicate assertions, and placeholder `expect(true).toBe(true)` lines
- **Fix broken tests** — assertion-less tests that always pass (WildColorModal backdrop), weak assertions that don't verify prop values (RoundEndModal edge cases)
- **Add test coverage** for critical untested code: `lib/game/cards.ts` predicates, `hooks/usePlayerHand.ts`, `components/providers/GameProvider.tsx`
- **Add test coverage** for important untested code: `getSettingsSummary()`, `canPlayCard()` (testing the real function), `generateRoomId()`

## Capabilities

### New Capabilities

_None — this change improves test quality, not application capabilities._

### Modified Capabilities

_No spec-level requirement changes. This is a test-only change._

## Impact

- **Test files**: 5 deleted, 8 cleaned up, ~6 new test files added
- **Source code**: No application code changes
- **CI**: Test count will decrease (removing fake tests) then increase (adding real ones). All remaining tests will exercise actual application code.
- **Coverage**: Critical gaps in `cards.ts`, `usePlayerHand`, and `GameProvider` will be closed
