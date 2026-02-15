## 1. Create Constants File

- [x] 1.1 Create `lib/game/constants.ts` with MIN_PLAYERS and MAX_PLAYERS
- [x] 1.2 Export player limit messages/helper functions

## 2. Update Game Engine

- [x] 2.1 Import constants in `hooks/useGameEngine.ts`
- [x] 2.2 Replace hardcoded `players.length < 2` with `players.length < MIN_PLAYERS`
- [x] 2.3 Replace hardcoded `turnOrder.length < 2` with `turnOrder.length < MIN_PLAYERS`
- [x] 2.4 Add defensive check for MAX_PLAYERS (warn/throw if exceeded)

## 3. Update Start Game Button

- [x] 3.1 Import constants in `components/lobby/StartGameButton.tsx`
- [x] 3.2 Update `canStart` logic to check both MIN and MAX
- [x] 3.3 Update button text for three states: too few, ready, too many
- [x] 3.4 Add visual distinction for "too many players" state

## 4. Update Room Management (Network Layer)

- [x] 4.1 Import constants in `hooks/useRoom.ts`
- [x] 4.2 Add check in awareness change handler for MAX_PLAYERS
- [x] 4.3 Reject new peers when at capacity (don't add to player list)
- [x] 4.4 Add exception for replacement players during PAUSED_WAITING_PLAYER status
- [x] 4.5 **FIX**: Reject NEW players during PLAYING/ROUND_ENDED/ENDED status
- [x] 4.6 **FIX**: Only allow lockedPlayers during gameplay (no new joins)

## 5. Update Join Game Modal (UI Layer)

- [x] 5.1 Import constants and players prop in `components/modals/JoinGameModal.tsx`
- [x] 5.2 Add player count check on mount
- [x] 5.3 Show "Game Full" state when at MAX_PLAYERS
- [x] 5.4 Ensure "Game Already Started" takes precedence over "Game Full"
- [x] 5.5 **FIX**: Add `isGameFull` state to useRoom to detect when we're rejected
- [x] 5.6 **FIX**: Show Game Full modal with redirect button for 11th player
- [x] 5.7 **FIX**: Prevent 11th player from appearing in player list

## 6. Update Game Session Handling

- [x] 6.1 Import constants in `hooks/useSessionResilience.ts`
- [x] 6.2 Modify `continueWithoutPlayer` to check remaining player count
- [x] 6.3 Add logic to end game when removal would drop below MIN_PLAYERS
- [x] 6.4 Set `gameState.endType` to "INSUFFICIENT_PLAYERS"
- [x] 6.5 Add UI handling for insufficient players end state
- [x] 6.6 **REMOVE** walkover victory logic (unreachable with MIN_PLAYERS=3)
- [x] 6.7 **REMOVE** `winType` = "WALKOVER" handling from session resilience

## 7. Refactor winType to endType

- [x] 7.1 In `hooks/useGameState.ts`: Rename `WinType` type to `EndType`
- [x] 7.2 In `hooks/useGameState.ts`: Change type values from `'LEGITIMATE' | 'WALKOVER'` to `'WIN' | 'INSUFFICIENT_PLAYERS'`
- [x] 7.3 In `hooks/useGameState.ts`: Rename `winType` state variable to `endType`
- [x] 7.4 In `hooks/useGameState.ts`: Update return object key from `winType` to `endType`
- [x] 7.5 In `hooks/useGameEngine.ts`: Replace `gameStateMap.set('winType', ...)` with `gameStateMap.set('endType', ...)`
- [x] 7.6 In `hooks/useGameEngine.ts`: Change `'LEGITIMATE'` to `'WIN'`
- [x] 7.7 In `hooks/useSessionResilience.ts`: Replace `gameStateMap.set('winType', 'WALKOVER')` with end game logic using `'INSUFFICIENT_PLAYERS'`
- [x] 7.8 In `app/room/[id]/page.tsx`: Update destructuring from `winType` to `endType`
- [x] 7.9 In `app/room/[id]/page.tsx`: Update prop passed to GameEndModal from `isWalkover` to `endType`
- [x] 7.10 Update `components/modals/GameEndModal.tsx` prop from `isWalkover` to `endType: EndType | null`
- [x] 7.11 Update `components/modals/GameEndModal.tsx` to handle both 'WIN' and 'INSUFFICIENT_PLAYERS' states
- [x] 7.12 Remove walkover-specific UI from `components/modals/GameEndModal.tsx`
- [x] 7.13 Update `lib/game/scoring-integration.test.ts` to use `endType` and `'WIN'` instead of `winType` and `'LEGITIMATE'`
- [x] 7.14 Search and update any other test files using `winType` or `'LEGITIMATE'` or `'WALKOVER'`

## 8. Update Tests

- [x] 8.1 Update `Accessibility.test.tsx` - change hardcoded "3" to use MIN_PLAYERS constant
- [x] 8.2 Add tests for MAX_PLAYERS button state
- [x] 8.3 Update `useGameEngine.test.ts` - add player limit validation tests
- [x] 8.4 Add tests for engine validation with player limits
- [x] 8.5 Add tests for insufficient players scenario in session resilience
- [x] 8.6 Remove/update any 2-player game tests (none found requiring changes)
- [x] 8.7 **REMOVE** walkover-related tests from test files (updated to insufficient players)
- [x] 8.8 Search codebase for "walkover" references and remove/update

## 9. Update UI Components

- [x] 9.1 Add player count indicator to `PlayerList.tsx` (show "X/10")
- [x] 9.2 Update `GameEndModal.tsx` to handle `endType` field
- [x] 9.3 **REMOVE** `winType` = "WALKOVER" logic from `GameEndModal.tsx`
- [x] 9.4 Update `GameEndModal.tsx` to show winner when `endType` = "WIN"
- [x] 9.5 Add "INSUFFICIENT_PLAYERS" view to `GameEndModal.tsx` (no winner, game abandoned)
- [x] 9.6 Add proper messaging for abandoned games ("Not enough players to continue")
- [x] 9.7 **REMOVE** `WinByWalkoverModal.tsx` component (unreachable code)
- [x] 9.8 **REMOVE** `WinByWalkoverModal.test.tsx` (unreachable code)
- [x] 9.9 Update any parent components that conditionally render WinByWalkoverModal

## 10. Verify and Validate

- [x] 10.1 Run all tests: `npm test` (415 tests pass)
- [x] 10.2 Run type check: `tsc --noEmit` (pre-existing test type errors only)
- [x] 10.3 Run lint: `npm run lint` (passes)
- [x] 10.4 Manual test: Try to start game with 2 players (should be blocked)
- [x] 10.5 Manual test: Try to join full game (should show "Game Full")
- [x] 10.6 Manual test: Remove player until below minimum (should end game)
