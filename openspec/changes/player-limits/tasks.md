## 1. Create Constants File

- [ ] 1.1 Create `lib/game/constants.ts` with MIN_PLAYERS and MAX_PLAYERS
- [ ] 1.2 Export player limit messages/helper functions

## 2. Update Game Engine

- [ ] 2.1 Import constants in `hooks/useGameEngine.ts`
- [ ] 2.2 Replace hardcoded `players.length < 2` with `players.length < MIN_PLAYERS`
- [ ] 2.3 Replace hardcoded `turnOrder.length < 2` with `turnOrder.length < MIN_PLAYERS`
- [ ] 2.4 Add defensive check for MAX_PLAYERS (warn/throw if exceeded)

## 3. Update Start Game Button

- [ ] 3.1 Import constants in `components/lobby/StartGameButton.tsx`
- [ ] 3.2 Update `canStart` logic to check both MIN and MAX
- [ ] 3.3 Update button text for three states: too few, ready, too many
- [ ] 3.4 Add visual distinction for "too many players" state

## 4. Update Room Management (Network Layer)

- [ ] 4.1 Import constants in `hooks/useRoom.ts`
- [ ] 4.2 Add check in awareness change handler for MAX_PLAYERS
- [ ] 4.3 Reject new peers when at capacity (don't add to player list)
- [ ] 4.4 Add exception for replacement players during PAUSED_WAITING_PLAYER status

## 5. Update Join Game Modal (UI Layer)

- [ ] 5.1 Import constants and players prop in `components/modals/JoinGameModal.tsx`
- [ ] 5.2 Add player count check on mount
- [ ] 5.3 Show "Game Full" state when at MAX_PLAYERS
- [ ] 5.4 Ensure "Game Already Started" takes precedence over "Game Full"

## 6. Update Game Session Handling

- [ ] 6.1 Import constants in `hooks/useSessionResilience.ts`
- [ ] 6.2 Modify `continueWithoutPlayer` to check remaining player count
- [ ] 6.3 Add logic to end game when removal would drop below MIN_PLAYERS
- [ ] 6.4 Set `gameState.endReason` to "INSUFFICIENT_PLAYERS"
- [ ] 6.5 Add UI handling for insufficient players end state
- [ ] 6.6 **REMOVE** walkover victory logic (unreachable with MIN_PLAYERS=3)
- [ ] 6.7 **REMOVE** `winType` = "WALKOVER" handling from session resilience

## 7. Refactor winType to endType

- [ ] 7.1 In `hooks/useGameState.ts`: Rename `WinType` type to `EndType`
- [ ] 7.2 In `hooks/useGameState.ts`: Change type values from `'LEGITIMATE' | 'WALKOVER'` to `'WIN' | 'INSUFFICIENT_PLAYERS'`
- [ ] 7.3 In `hooks/useGameState.ts`: Rename `winType` state variable to `endType`
- [ ] 7.4 In `hooks/useGameState.ts`: Update return object key from `winType` to `endType`
- [ ] 7.5 In `hooks/useGameEngine.ts`: Replace `gameStateMap.set('winType', ...)` with `gameStateMap.set('endType', ...)`
- [ ] 7.6 In `hooks/useGameEngine.ts`: Change `'LEGITIMATE'` to `'WIN'`
- [ ] 7.7 In `hooks/useSessionResilience.ts`: Replace `gameStateMap.set('winType', 'WALKOVER')` with end game logic using `'INSUFFICIENT_PLAYERS'`
- [ ] 7.8 In `app/room/[id]/page.tsx`: Update destructuring from `winType` to `endType`
- [ ] 7.9 In `app/room/[id]/page.tsx`: Update prop passed to GameEndModal from `isWalkover` to `endType`
- [ ] 7.10 Update `components/modals/GameEndModal.tsx` prop from `isWalkover` to `endType: EndType | null`
- [ ] 7.11 Update `components/modals/GameEndModal.tsx` to handle both 'WIN' and 'INSUFFICIENT_PLAYERS' states
- [ ] 7.12 Remove walkover-specific UI from `components/modals/GameEndModal.tsx`
- [ ] 7.13 Update `lib/game/scoring-integration.test.ts` to use `endType` and `'WIN'` instead of `winType` and `'LEGITIMATE'`
- [ ] 7.14 Search and update any other test files using `winType` or `'LEGITIMATE'` or `'WALKOVER'`

## 8. Update Tests

- [ ] 8.1 Update `StartGameButton.test.tsx` - change hardcoded "3" to use constant
- [ ] 8.2 Add tests for MAX_PLAYERS button state
- [ ] 8.3 Update `useGameEngine.test.ts` - change player count mocks to MIN_PLAYERS
- [ ] 8.4 Add tests for engine validation with player limits
- [ ] 8.5 Add tests for insufficient players scenario in session resilience
- [ ] 8.6 Remove/update any 2-player game tests
- [ ] 8.7 **REMOVE** walkover-related tests from test files
- [ ] 8.8 Search codebase for "walkover" references and remove/update

## 9. Update UI Components

- [ ] 9.1 Add player count indicator to `PlayerList.tsx` (optional: show "X/10")
- [ ] 9.2 Update `GameEndModal.tsx` to handle `endReason` field (NEW FIELD)
- [ ] 9.3 **REMOVE** `winType` = "WALKOVER" logic from `GameEndModal.tsx`
- [ ] 9.4 Update `GameEndModal.tsx` to show winner when `endReason` = "WIN"
- [ ] 9.5 Add "INSUFFICIENT_PLAYERS" view to `GameEndModal.tsx` (no winner, game abandoned)
- [ ] 9.6 Add proper messaging for abandoned games ("Not enough players to continue")
- [ ] 9.7 **REMOVE** `WinByWalkoverModal.tsx` component (unreachable code)
- [ ] 9.8 **REMOVE** `WinByWalkoverModal.test.tsx` (unreachable code)
- [ ] 9.9 Update any parent components that conditionally render WinByWalkoverModal

## 10. Verify and Validate

- [ ] 10.1 Run all tests: `npm test`
- [ ] 10.2 Run type check: `tsc --noEmit`
- [ ] 10.3 Run lint: `npm run lint`
- [ ] 10.4 Manual test: Try to start game with 2 players (should be blocked)
- [ ] 10.5 Manual test: Try to join full game (should show "Game Full")
- [ ] 10.6 Manual test: Remove player until below minimum (should end game)
