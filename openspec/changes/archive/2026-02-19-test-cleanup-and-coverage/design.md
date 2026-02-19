## Context

The test suite has 39 test files. Analysis revealed three categories of problems:

1. **Self-referential tests** (~5 files, ~800 lines): Tests that create local variables and assert on them without importing or executing application code. E.g., `const x = 'PLAYING'; expect(x).toBe('PLAYING')`.
2. **Mixed-quality files** (~8 files): Valid tests alongside self-referential filler, duplicate assertions, or placeholder `expect(true).toBe(true)`.
3. **Coverage gaps** (3 critical, 8 important): Core modules like `cards.ts` predicates, `usePlayerHand`, and `GameProvider` have no tests at all.

No application code changes are needed. This is purely a test quality improvement.

## Goals / Non-Goals

**Goals:**
- Remove all test cases that don't exercise application code
- Fix broken/meaningless assertions (assertion-less tests, tests that don't verify their inputs)
- Add unit tests for critical untested pure functions and hooks
- Every remaining test must import and exercise real application code

**Non-Goals:**
- Refactoring application code
- Adding integration or E2E tests
- Achieving a specific coverage percentage target
- Testing trivial wrappers (cn(), getAvatar()) or pure-presentational components

## Decisions

### 1. Delete entire files vs. surgical cleanup

**Decision**: Delete files that are 100% self-referential. Surgically clean files that mix good and bad tests.

**Rationale**: Files like `useGameState.test.ts` have zero salvageable tests — every assertion is on a local variable. But files like `useGameEngine.test.ts` have legitimate dealing tests alongside junk. Preserving the good tests avoids re-implementing them.

### 2. New test file scope — CRITICAL and IMPORTANT only

**Decision**: Add tests for CRITICAL gaps (`cards.ts`, `usePlayerHand`, `GameProvider`) and selected IMPORTANT gaps (`getSettingsSummary`, `canPlayCard`, `generateRoomId`). Skip LOW priority items.

**Rationale**: The critical files are foundational — `isNumberCard` uses `Number()` coercion with subtle edge cases, `usePlayerHand` is how players see their cards, `GameProvider` is the root context. The important files add meaningful regression protection. LOW items (utils.ts, avatar.ts, breakpoint hook) are trivial wrappers where unit tests add more maintenance than protection.

### 3. Test `canPlayCard` by extracting or importing it directly

**Decision**: The existing `useGamePlay.test.ts` re-implements `canPlayCard` locally instead of importing it. The replacement tests must import the real function from the hook module.

**Rationale**: The whole point of the cleanup — test the real code, not a copy. If `canPlayCard` isn't exported directly, the test should use `renderHook` to access it through the hook.

### 4. Test patterns for Yjs-dependent hooks

**Decision**: Follow the pattern established by `useGameSettings.test.ts` — create a real `Y.Doc` instance, mock only the `GameProvider` context to supply it, and test hook behavior against real Yjs operations.

**Rationale**: This pattern is already proven in the codebase and provides genuine integration with Yjs without needing WebRTC. Over-mocking (as in the deleted files) is exactly what we're eliminating.

## Risks / Trade-offs

- **[Risk] Deleted tests may have been covering edge cases we don't realize** → Mitigated by thorough analysis showing every deleted test asserts only on local variables, never on application code output.
- **[Risk] Test count drops before new tests are added** → Acceptable. Fewer honest tests are better than more fake ones. The change should be implemented atomically (cleanup + new tests in the same branch).
- **[Risk] `canPlayCard` may not be directly exportable from the hook** → If so, test via `renderHook` with the full hook, or extract it to a utility module. Both approaches test the real function.
