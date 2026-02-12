## 1. Extend Game State Types & Yjs Fields

- [ ] 1.1 Add `'PAUSED_WAITING_PLAYER'` to `GameStatus` type in `hooks/useGameState.ts`
- [ ] 1.2 Define `OrphanHand` interface: `{ originalClientId: number; originalName: string; cards: Card[] }`
- [ ] 1.3 Add `orphanHands` state to `useGameState` hook (read from `gameState` Y.Map)
- [ ] 1.4 Add `winner` state to `useGameState` hook (read from `gameState` Y.Map, for walkover tracking)
- [ ] 1.5 Write unit tests for `useGameState` reading the new fields (`orphanHands`, extended status, winner)

## 2. Implement `useSessionResilience` Hook (Host-Only)

- [ ] 2.1 Create `hooks/useSessionResilience.ts` with disconnect detection logic (compare awareness vs `lockedPlayers`)
- [ ] 2.2 Implement pause transition: set `status` to `PAUSED_WAITING_PLAYER`, create `orphanHands` entries from `dealtHands`
- [ ] 2.3 Implement "continue without" logic: reshuffle orphan cards into deck, remove from `turnOrder`/`playerCardCounts`, advance turn if needed
- [ ] 2.4 Implement hand handover logic: Levenshtein name matching, assign orphan hand to replacement player, update `lockedPlayers`/`turnOrder`
- [ ] 2.5 Implement resume logic: set status back to `PLAYING` when all orphans resolved
- [ ] 2.6 Implement walkover detection: if only one player remains, set status to `ENDED` and record winner
- [ ] 2.7 Write unit tests for disconnect detection (single, multiple, non-locked player)
- [ ] 2.8 Write unit tests for pause/resume transitions
- [ ] 2.9 Write unit tests for continue-without (turn advancement, card reshuffle, player removal)
- [ ] 2.10 Write unit tests for hand handover (name matching, lockedPlayers update)
- [ ] 2.11 Write unit tests for walkover detection

## 3. Modify Lobby Lock for Replacement Players

- [ ] 3.1 Update late joiner detection in `GameBoard.tsx` (or relevant component) to allow joins when status is `PAUSED_WAITING_PLAYER`
- [ ] 3.2 Write test for replacement player joining during pause (not rejected)
- [ ] 3.3 Write test for late joiner still rejected during `PLAYING` status

## 4. Waiting for Player Modal

- [ ] 4.1 Create `components/modals/WaitingForPlayerModal.tsx` — shows disconnected player names/avatars
- [ ] 4.2 Add host-only "Continue without [player]" button per orphan hand
- [ ] 4.3 Add guest view (info only, no action buttons)
- [ ] 4.4 Wire modal to show when `status === 'PAUSED_WAITING_PLAYER'` and dismiss on resume
- [ ] 4.5 Write component tests for modal rendering (host vs guest view, dismiss on resume)

## 5. Win by Walkover Modal

- [ ] 5.1 Create `components/modals/WinByWalkoverModal.tsx` — victory message with "Back to Lobby" action
- [ ] 5.2 Wire modal to show when game ends via walkover
- [ ] 5.3 Write component test for walkover modal rendering

## 6. Disconnected Player Indicators

- [ ] 6.1 Update opponent avatar display in `components/game/GameBoard.tsx` to dim/grey out disconnected players
- [ ] 6.2 Add disconnect icon overlay on disconnected opponent avatars
- [ ] 6.3 Update avatar display when replacement player takes over (restore normal appearance)
- [ ] 6.4 Write component tests for disconnect indicator rendering

## 7. Integration & Wiring

- [ ] 7.1 Wire `useSessionResilience` into the game page (host-only activation)
- [ ] 7.2 Pass `continueWithout` callback from hook to `WaitingForPlayerModal`
- [ ] 7.3 Ensure `GameBoard` freezes interaction during `PAUSED_WAITING_PLAYER` status
- [ ] 7.4 Run full lint pass (`npm run lint`) and fix any issues
- [ ] 7.5 Run full test suite (`npm run test`) and confirm no regressions
