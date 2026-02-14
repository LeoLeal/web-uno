## ADDED Requirements

### Requirement: Card point values
The system SHALL assign point values to cards based on their symbol for scoring purposes.

#### Scenario: Number card points
- **WHEN** calculating points for a number card (symbols `0` through `9`)
- **THEN** the point value equals the numeric face value of the card (e.g., `7` = 7 points, `0` = 0 points)

#### Scenario: Action card points
- **WHEN** calculating points for a Skip, Reverse, or Draw Two card
- **THEN** the point value is 20 points

#### Scenario: Wild card points
- **WHEN** calculating points for a Wild or Wild Draw Four card
- **THEN** the point value is 50 points

### Requirement: Hand point calculation
The system SHALL calculate the total point value of a player's remaining hand.

#### Scenario: Sum of card points
- **WHEN** `calculateHandPoints(cards)` is called with a hand of cards
- **THEN** the function returns the sum of individual card point values
- **AND** the function is pure (no side effects, deterministic)

#### Scenario: Empty hand
- **WHEN** `calculateHandPoints(cards)` is called with an empty array
- **THEN** the function returns 0

### Requirement: Round score calculation
The system SHALL calculate and credit the round winner's score from all opponents' remaining hands when a round ends.

#### Scenario: Winner gains points from opponents
- **WHEN** a player empties their hand in a multi-round game (`scoreLimit !== null`)
- **THEN** the host reads every other player's remaining hand from `dealtHandsMap`
- **AND** the host calculates `calculateHandPoints()` for each opponent's hand
- **AND** the host sums all opponents' hand points
- **AND** the sum is added to the winner's cumulative score in `gameStateMap.scores`

#### Scenario: Orphan hands count toward score
- **WHEN** a round ends and there are orphan hands (disconnected players)
- **THEN** the orphan hands' card points are included in the winner's score calculation
- **AND** orphan cards are treated identically to connected opponents' cards

### Requirement: Cumulative score tracking
The system SHALL track cumulative scores per player across rounds in Yjs shared state.

#### Scenario: Scores initialized on game start
- **WHEN** the host starts a multi-round game (`scoreLimit !== null`)
- **THEN** `gameStateMap.scores` is initialized as a `Record<number, number>` with all players' clientIds set to `0`

#### Scenario: Scores not initialized for single-round games
- **WHEN** the host starts a single-round game (`scoreLimit === null`)
- **THEN** `gameStateMap.scores` is NOT set (field absent from gameStateMap)

#### Scenario: Scores accumulate across rounds
- **WHEN** a round ends and the winner's score is calculated
- **THEN** the new points are added to the winner's existing cumulative score
- **AND** other players' cumulative scores remain unchanged
- **AND** the updated `scores` map is written to `gameStateMap` in the same transaction as the status change

### Requirement: Round number tracking
The system SHALL track the current round number in multi-round games.

#### Scenario: Round number initialized
- **WHEN** the host starts a multi-round game
- **THEN** `gameStateMap.currentRound` is set to `1`

#### Scenario: Round number incremented
- **WHEN** the host starts a new round (after `ROUND_ENDED`)
- **THEN** `gameStateMap.currentRound` is incremented by 1

### Requirement: Score limit win condition
The system SHALL end the game when a player's cumulative score reaches or exceeds the configured score limit.

#### Scenario: Score limit reached
- **WHEN** a round ends in a multi-round game
- **AND** the round winner's updated cumulative score is greater than or equal to `scoreLimit`
- **THEN** `gameStateMap.status` is set to `ENDED`
- **AND** `gameStateMap.winner` is set to the winning player's `clientId`
- **AND** `gameStateMap.winType` is set to `LEGITIMATE`

#### Scenario: Score limit not reached
- **WHEN** a round ends in a multi-round game
- **AND** no player's cumulative score has reached the `scoreLimit`
- **THEN** `gameStateMap.status` is set to `ROUND_ENDED`
- **AND** `gameStateMap.winner` is set to the round winner's `clientId`
- **AND** the game awaits the host to trigger the next round

### Requirement: Starting player rotation
The system SHALL rotate the starting player each round in a multi-round game.

#### Scenario: Starting player for round N
- **WHEN** the host initializes round N
- **THEN** the starting player is `turnOrder[(N - 1) % turnOrder.length]`
- **AND** the play direction is reset to clockwise (`1`)

#### Scenario: First card effects still apply
- **WHEN** a new round starts and the first card is flipped
- **THEN** first-card effects (Skip, Reverse, Draw Two, Wild) are applied as in the first round
- **AND** these effects may modify the starting player or direction for that round
