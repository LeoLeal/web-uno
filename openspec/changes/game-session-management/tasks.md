## 1. Type Definitions and Constants

- [ ] 1.1 Extend `GameStatus` type to include `PAUSED_WAITING_PLAYER`
- [ ] 1.2 Create `OrphanHand` type: `{ slotIndex: number; originalName: string; cards: Card[] }`
- [ ] 1.3 Update `WinReason` type to include `"walkover"`
- [ ] 1.4 Verify all type changes are backward compatible

## 2. Utility Functions

- [ ] 2.1 Implement `calculateStringSimilarity(a: string, b: string): number` using Levenshtein distance
- [ ] 2.2 Implement `findBestMatchingOrphan(name: string, orphans: OrphanHand[]): OrphanHand | null` with 75% threshold
- [ ] 2.3 Add unit tests for string similarity utilities

## 3. Game State Hook Updates (useGameState.ts)

- [ ] 3.1 Update status checks to handle `PAUSED_WAITING_PLAYER`
- [ ] 3.2 Ensure `lockedPlayers` is available from game-start-flow dependency
- [ ] 3.3 Add helper function `isGamePaused(): boolean` for UI checks

## 4. Game Session Hook (useGameSession.ts) - New File

- [ ] 4.1 Create `useGameSession` hook with host-only orphan hand state
- [ ] 4.2 Implement `detectDisconnectedPlayers(awareness: Awareness, lockedPlayers: LockedPlayer[]): LockedPlayer[]`
- [ ] 4.3 Implement `pauseGame(orphanHands: OrphanHand[])` - sets status to `PAUSED_WAITING_PLAYER`
- [ ] 4.4 Implement `resumeGame()` - sets status to `PLAYING`
- [ ] 4.5 Implement `assignOrphanHandToPlayer(playerName: string, playerSlot: number): OrphanHand | null`
- [ ] 4.6 Implement `continueWithoutPlayer(slotIndex: number)` - reshuffles hand to deck
- [ ] 4.7 Implement `handleReplacementPlayer(newPlayer: Player, slotIndex: number)` - uses name matching
- [ ] 4.8 Implement `checkWinByWalkover(connectedPlayers: number): boolean`
- [ ] 4.9 Add unit tests for all game session logic

## 5. Game Engine Updates (useGameEngine.ts)

- [ ] 5.1 Add awareness state monitoring for disconnection detection
- [ ] 5.2 Integrate `useGameSession` hook for host disconnection handling
- [ ] 5.3 Implement turn freezing when game is paused
- [ ] 5.4 Implement turn advancement when host removes disconnected current player
- [ ] 5.5 Add host disconnection detection and game end logic

## 6. Player Hand Hook Updates (usePlayerHand.ts)

- [ ] 6.1 Ensure hand display works when receiving orphan hand assignment
- [ ] 6.2 Add handling for slot index changes (replacement player scenario)

## 7. UI Components

### 7.1 WaitingForPlayerModal Component

- [ ] 7.1.1 Create `WaitingForPlayerModal.tsx` component
- [ ] 7.1.2 Implement modal with title "Game Paused"
- [ ] 7.1.3 Display disconnected players list with avatars (grayed out)
- [ ] 7.1.4 Implement host view with "Continue without [player name]" buttons
- [ ] 7.1.5 Implement non-host view with "Waiting for host to continue..." message
- [ ] 7.1.6 Add prop types and TypeScript interfaces
- [ ] 7.1.7 Add component tests

### 7.2 WalkoverWinModal Component

- [ ] 7.2.1 Create `WalkoverWinModal.tsx` component
- [ ] 7.2.2 Display message: "You win! All other players disconnected."
- [ ] 7.2.3 Include "Return to Home" button
- [ ] 7.2.4 Reuse existing win modal styling
- [ ] 7.2.5 Add component tests

### 7.3 Opponent Disconnection Indicator

- [ ] 7.3.1 Update opponent avatar component to show disconnected state
- [ ] 7.3.2 Add gray overlay or offline icon for disconnected players
- [ ] 7.3.3 Ensure card count still displays for disconnected players

## 8. P2P Networking Integration

- [ ] 8.1 Update late joiner detection to handle `PAUSED_WAITING_PLAYER` status
- [ ] 8.2 Implement replacement player acceptance flow in connection handler
- [ ] 8.3 Ensure status transitions are atomic via Yjs transactions
- [ ] 8.4 Update `PublicGameState` type to include new status

## 9. Game Board Integration

- [ ] 9.1 Integrate `WaitingForPlayerModal` into game board
- [ ] 9.2 Add disconnection indicators to opponent displays
- [ ] 9.3 Integrate `WalkoverWinModal` into game end flow
- [ ] 9.4 Update game board to freeze interactions when paused

## 10. Testing

- [ ] 10.1 Write integration test: Single player disconnects → game pauses
- [ ] 10.2 Write integration test: Multiple players disconnect → all detected
- [ ] 10.3 Write integration test: Replacement player joins with matching name
- [ ] 10.4 Write integration test: Replacement player joins without matching name
- [ ] 10.5 Write integration test: Host continues without player
- [ ] 10.6 Write integration test: Host removes current turn player → turn advances
- [ ] 10.7 Write integration test: Win by walkover detection
- [ ] 10.8 Write integration test: Host disconnect → game ends
- [ ] 10.9 Run full test suite and fix any regressions

## 11. Documentation

- [ ] 11.1 Update component README with new modals
- [ ] 11.2 Document `useGameSession` hook API
- [ ] 11.3 Add comments explaining host-only orphan hand architecture
