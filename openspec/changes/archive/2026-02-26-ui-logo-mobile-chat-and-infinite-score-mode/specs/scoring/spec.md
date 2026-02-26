## MODIFIED Requirements

### Requirement: Cumulative score tracking

The system SHALL track cumulative scores per player across rounds in Yjs shared state.

#### Scenario: Scores initialized on game start
- **WHEN** the host starts a multi-round game (`scoreLimit` is a finite number or positive infinity)
- **THEN** `gameStateMap.scores` is initialized as a `Record<number, number>` with all players' clientIds set to `0`

#### Scenario: Scores not initialized for single-round games
- **WHEN** the host starts a single-round game (`scoreLimit === null`)
- **THEN** `gameStateMap.scores` is NOT set (field absent from gameStateMap)

#### Scenario: Scores accumulate across rounds
- **WHEN** a round ends and the winner's score is calculated
- **THEN** the new points are added to the winner's existing cumulative score
- **AND** other players' cumulative scores remain unchanged
- **AND** the updated `scores` map is written to `gameStateMap` in the same transaction as the status change

### Requirement: Score limit win condition

The system SHALL end the game when a player's cumulative score reaches or exceeds the configured numeric score limit in multi-round mode.

#### Scenario: Numeric score limit reached
- **WHEN** a round ends in a multi-round game
- **AND** the round winner's updated cumulative score is greater than or equal to `scoreLimit`
- **THEN** `gameStateMap.status` is set to `ENDED`
- **AND** `gameStateMap.winner` is set to the winning player's `clientId`
- **AND** `gameStateMap.endType` is set to `WIN`

#### Scenario: Numeric score limit not reached
- **WHEN** a round ends in a multi-round game
- **AND** no player's cumulative score has reached the `scoreLimit`
- **THEN** `gameStateMap.status` is set to `ROUND_ENDED`
- **AND** `gameStateMap.winner` is set to the round winner's `clientId`
- **AND** the game awaits the host to trigger the next round

#### Scenario: Infinity score limit behaves as endless using same comparison path
- **WHEN** a round ends in a multi-round game with `scoreLimit = Infinity`
- **THEN** the same numeric threshold comparison logic is used (`newScore >= scoreLimit`)
- **AND** the game remains in `ROUND_ENDED` after each round because the threshold is not reached
