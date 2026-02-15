## Why

The game currently supports only single-round play (scoreLimit defaults to null). The `scoreLimit` setting already exists in the type system (100, 200, 300, 500) but is not wired up. Implementing multi-round scoring completes the core Uno experience — players compete across rounds, accumulating points until someone reaches the configured score limit.

## What Changes

- Add a `ROUND_ENDED` game status for the transition between rounds in multi-round games
- Calculate points from opponents' remaining hands when a player wins a round (number cards = face value, Skip/Reverse/Draw Two = 20, Wild/Wild Draw Four = 50)
- Track cumulative scores per player in `gameStateMap`
- Track current round number and rotate starting player each round (`+1` modulo player count)
- Reset deck, hands, discard pile, direction, and card counts between rounds while preserving scores and player roster
- Host triggers next round via a "Next Round" button on the round-end screen
- Display cumulative scores next to each opponent's avatar and in the player's own header area
- Show round results (winner, points gained, standings) in a round-end modal
- Show final game results when score limit is reached
- **BREAKING**: Add `ROUND_ENDED` to `GameStatus` union — components switching on status need updating
- Track `statusBeforePause` so pause/resume correctly restores `ROUND_ENDED` (not just `PLAYING`)
- Replacement players inherit the cumulative score of the seat they take over
- Walkover in multi-round games ends the entire game (not just the round)
- Single-round games (`scoreLimit = null`) remain unchanged — same flow as today

## Capabilities

### New Capabilities
- `scoring`: Point calculation from card values, cumulative score tracking across rounds, round lifecycle (end → score → reset → next), and score-limit win condition detection

### Modified Capabilities
- `gameplay-win-condition`: Branch between single-round (`ENDED`) and multi-round (`ROUND_ENDED`) on hand empty; add score-limit-reached as a game-ending condition
- `game-engine`: Add round reset logic — reshuffle deck, re-deal hands, rotate starting player, reset direction and discard pile; apply first-card effects on each round start
- `game-session`: Track `statusBeforePause` for correct pause/resume to either `PLAYING` or `ROUND_ENDED`; replacement players inherit cumulative score; walkover during multi-round ends the game
- `game-board-ui`: Display cumulative scores on opponent indicators and player header; round-end modal with results and "Next Round" button; updated game-end modal with final standings

## Impact

- **Yjs shared state**: New fields in `gameStateMap` — `scores` (Record<number, number>), `currentRound` (number), `statusBeforePause` (GameStatus | null)
- **Type changes**: `GameStatus` union gains `ROUND_ENDED`; downstream components and hooks that match on status need updating
- **Hooks**: `useGameEngine` gains round-reset logic; `useGameState` exposes scores and round number; `useSessionResilience` stores/restores `statusBeforePause` and passes score during handover
- **Components**: `OpponentIndicator` shows score; `PlayerHand` area shows player score; `GameEndModal` splits into round-end and game-end views (or a new `RoundEndModal`); `WaitingForPlayerModal` unchanged
- **Pure functions**: New `calculateHandPoints(cards: Card[]): number` utility
- **No new dependencies**
