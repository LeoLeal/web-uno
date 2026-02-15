## 1. Types & Pure Functions

- [x] 1.1 Add `ROUND_ENDED` to the `GameStatus` type union in `hooks/useGameState.ts`
- [x] 1.2 Create `lib/game/scoring.ts` with `calculateHandPoints(cards: Card[]): number` — maps card symbols to point values (number = face value, skip/reverse/draw2 = 20, wild/wild-draw4 = 50) and returns the sum
- [x] 1.3 Write tests for `calculateHandPoints` in `lib/game/scoring.test.ts` — cover number cards, action cards, wild cards, mixed hands, empty hand returning 0

## 2. Game State Hook

- [x] 2.1 Add `scores`, `currentRound`, and `statusBeforePause` state fields to `useGameState` — read from `gameStateMap` in the observer, expose in the return object
- [x] 2.2 Add `scores` type as `Record<number, number>`, `currentRound` as `number`, `statusBeforePause` as `GameStatus | null` with appropriate defaults (`{}`, `0`, `null`)

## 3. Game Engine — Win Detection & Scoring

- [x] 3.1 Modify the win-detection block in `useGameEngine` action observer (currently lines 278-285) to branch on `scoreLimit`: when `null`, set `ENDED` (unchanged); when a number, calculate round scores and set `ROUND_ENDED` or `ENDED` based on whether the score limit is reached
- [x] 3.2 In the multi-round branch: read all opponents' hands from `dealtHandsMap`, call `calculateHandPoints` for each, sum results, update `gameStateMap.scores` with the winner's new cumulative total — all within the existing `doc.transact()`
- [x] 3.3 Include orphan hands in the score calculation — read cards from `gameStateMap.orphanHands` entries and add their points to the winner's round score
- [x] 3.4 Add `ROUND_ENDED` to the status guard at the top of the action observer so actions are not processed during round-end state

## 4. Game Engine — Round Initialization

- [x] 4.1 Pass `scoreLimit` into `useGameEngine` options (from `useGameSettings`)
- [x] 4.2 Create `initializeRound` callback in `useGameEngine` — creates new deck, shuffles, deals hands to all `lockedPlayers`, flips first card with effects, rotates starting player via `turnOrder[(currentRound) % turnOrder.length]`, increments `currentRound`, clears `orphanHands` and `actionsMap`, sets status to `PLAYING` — all in a single `doc.transact()`
- [x] 4.3 On `initializeGame` for multi-round games: also set `gameStateMap.scores` (all players to 0) and `gameStateMap.currentRound` to 1
- [x] 4.4 Return `initializeRound` from the `useGameEngine` hook

## 5. Session Resilience — Pause/Resume

- [x] 5.1 In the disconnect detection effect of `useSessionResilience` (pause trigger): store `statusBeforePause` in `gameStateMap` before setting `PAUSED_WAITING_PLAYER` — handle both `PLAYING` and `ROUND_ENDED` as source statuses
- [x] 5.2 In the replacement player handover effect: restore `gameStateMap.status` from `statusBeforePause` (instead of hardcoded `PLAYING`) when all orphans are assigned, and set `statusBeforePause` to `null`
- [x] 5.3 In `continueWithout`: restore `gameStateMap.status` from `statusBeforePause` (instead of hardcoded `PLAYING`) when all orphans are removed and more than one player remains, and set `statusBeforePause` to `null`
- [x] 5.4 In the replacement player handover: when `gameStateMap.scores` exists, copy `scores[originalClientId]` to `scores[newClientId]` and delete the old entry
- [x] 5.5 Add `ROUND_ENDED` to the disconnect detection effect's status check (currently only runs for `PLAYING` and `PAUSED_WAITING_PLAYER`)

## 6. UI — Score Display During Gameplay

- [x] 6.1 Add `score` prop to `OpponentIndicator` — display cumulative score below the player name when `scoreLimit !== null`, formatted as "N pts"
- [x] 6.2 Pass scores from `useGameState` through `OpponentRow` to each `OpponentIndicator`, looking up by clientId
- [x] 6.3 Add player's own score display in the `PlayerHand` component area — show near the turn indicator, formatted as "N pts", only when `scoreLimit !== null`

## 7. UI — Round End & Game End Modals

- [x] 7.1 Create `RoundEndModal` component — displays round winner name, points gained this round, current standings (all players sorted by score descending), score limit target, "Next Round" button (host only), "Waiting for host..." message (guests)
- [x] 7.2 Update `GameEndModal` to accept and display final standings with cumulative scores when `scoreLimit !== null` — show winner, sorted player list with scores, "Back to Lobby" action
- [x] 7.3 Update `GameEndModal` to handle walkover in multi-round games — show walkover message plus current cumulative scores
- [x] 7.4 Wire `RoundEndModal` into the game board — show when `status === 'ROUND_ENDED'`, pass `initializeRound` to the "Next Round" button's onClick handler
- [x] 7.5 Ensure `GameEndModal` and `RoundEndModal` do not show simultaneously — `ROUND_ENDED` shows round modal, `ENDED` shows game end modal

## 8. Integration & Wiring

- [x] 8.1 Update the room page component to pass `scoreLimit` from `useGameSettings` to `useGameEngine`
- [x] 8.2 Update any components that switch on `GameStatus` to handle `ROUND_ENDED` — verify no unhandled cases (check GameBoard, modals, any conditional rendering on status)
- [x] 8.3 Ensure single-round games (`scoreLimit = null`) have zero behavioral changes — no scores initialized, no ROUND_ENDED, same modal flow

## 9. Tests

- [x] 9.1 Test win-detection branching: single-round → ENDED, multi-round below limit → ROUND_ENDED, multi-round at limit → ENDED
- [x] 9.2 Test round score calculation: winner gets sum of all opponents' hand points including orphan hands
- [x] 9.3 Test `initializeRound`: preserves scores/turnOrder/lockedPlayers, resets deck/hands/direction/discard, increments currentRound, rotates starting player
- [x] 9.4 Test `statusBeforePause` flow: pause from PLAYING restores to PLAYING, pause from ROUND_ENDED restores to ROUND_ENDED
- [x] 9.5 Test replacement player score inheritance: new clientId gets old clientId's score entry
- [x] 9.6 Test UI components: OpponentIndicator shows/hides score based on scoreLimit, RoundEndModal displays correct standings, GameEndModal shows final scores in multi-round
