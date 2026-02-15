## MODIFIED Requirements

### Requirement: Win by empty hand
The system SHALL detect when a player empties their hand and either end the game (single-round) or end the round (multi-round).

#### Scenario: Player plays last card in single-round game
- **WHEN** a player plays a card and their hand becomes empty
- **AND** `scoreLimit` is `null`
- **THEN** the game status transitions to `ENDED`
- **AND** `winner` in `gameStateMap` is set to that player's `clientId`
- **AND** no further turn advancement occurs

#### Scenario: Player plays last card in multi-round game — score limit not reached
- **WHEN** a player plays a card and their hand becomes empty
- **AND** `scoreLimit` is a number
- **AND** the player's updated cumulative score is less than `scoreLimit`
- **THEN** the game status transitions to `ROUND_ENDED`
- **AND** `winner` in `gameStateMap` is set to that player's `clientId`
- **AND** no further turn advancement occurs

#### Scenario: Player plays last card in multi-round game — score limit reached
- **WHEN** a player plays a card and their hand becomes empty
- **AND** `scoreLimit` is a number
- **AND** the player's updated cumulative score is greater than or equal to `scoreLimit`
- **THEN** the game status transitions to `ENDED`
- **AND** `winner` in `gameStateMap` is set to that player's `clientId`
- **AND** `winType` is set to `LEGITIMATE`
- **AND** no further turn advancement occurs

#### Scenario: Win check timing
- **WHEN** the host executes a `PLAY_CARD` action
- **THEN** the host checks the player's remaining card count after removing the played card
- **AND** if the count is 0, the win condition is triggered before turn advancement

### Requirement: Game end state
The system SHALL maintain a clean end state when the game ends.

#### Scenario: Game state on normal win (single-round)
- **WHEN** a player wins by emptying their hand in a single-round game
- **THEN** `gameStateMap.status` is `ENDED`
- **AND** `gameStateMap.winner` is the winning player's `clientId`
- **AND** `gameStateMap.currentTurn` remains on the winning player (last to act)
- **AND** the discard pile includes the winning card as the top card

#### Scenario: Game state on round win (multi-round, not final)
- **WHEN** a player wins a round in a multi-round game and the score limit is not reached
- **THEN** `gameStateMap.status` is `ROUND_ENDED`
- **AND** `gameStateMap.winner` is the round winner's `clientId`
- **AND** `gameStateMap.scores` reflects the updated cumulative scores
- **AND** the discard pile includes the winning card as the top card

#### Scenario: Game state on final win (multi-round, score limit reached)
- **WHEN** a player wins a round and their cumulative score reaches or exceeds the score limit
- **THEN** `gameStateMap.status` is `ENDED`
- **AND** `gameStateMap.winner` is the winning player's `clientId`
- **AND** `gameStateMap.winType` is `LEGITIMATE`
- **AND** `gameStateMap.scores` reflects the final cumulative scores

#### Scenario: No actions processed after game end
- **WHEN** the game status is `ENDED`
- **THEN** the host does not process any actions from `actionsMap`
- **AND** all submitted actions are cleared without execution

#### Scenario: No actions processed after round end
- **WHEN** the game status is `ROUND_ENDED`
- **THEN** the host does not process any actions from `actionsMap`

### Requirement: Win detection for action cards
The system SHALL allow a player to win by playing an action card as their last card.

#### Scenario: Last card is a Skip
- **WHEN** a player plays a Skip card as their last card
- **THEN** the Skip effect is applied (next player skipped)
- **AND** the player wins immediately after effects are applied

#### Scenario: Last card is a Reverse
- **WHEN** a player plays a Reverse card as their last card
- **THEN** the Reverse effect is applied (direction flips)
- **AND** the player wins immediately after effects are applied

#### Scenario: Last card is a Draw Two
- **WHEN** a player plays a Draw Two as their last card
- **THEN** the Draw Two effect is applied (next player draws 2)
- **AND** the player wins immediately after effects are applied

#### Scenario: Last card is a wild
- **WHEN** a player plays a wild card as their last card
- **THEN** the wild card color is assigned
- **AND** the player wins immediately (effects applied if Wild Draw Four)
