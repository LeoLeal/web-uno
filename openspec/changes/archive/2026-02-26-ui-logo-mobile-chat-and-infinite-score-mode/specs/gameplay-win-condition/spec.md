## MODIFIED Requirements

### Requirement: Win by empty hand
The system SHALL detect when a player empties their hand and either end the game (single-round), end the round (multi-round), or continue endlessly depending on score mode.

#### Scenario: Player plays last card in single-round game
- **WHEN** a player plays a card and their hand becomes empty
- **AND** `scoreLimit` is `null`
- **THEN** the game status transitions to `ENDED`
- **AND** `winner` in `gameStateMap` is set to that player's `clientId`
- **AND** no further turn advancement occurs

#### Scenario: Player plays last card in multi-round game — score limit not reached
- **WHEN** a player plays a card and their hand becomes empty
- **AND** the player's updated cumulative score is less than `scoreLimit`
- **THEN** the game status transitions to `ROUND_ENDED`
- **AND** `winner` in `gameStateMap` is set to that player's `clientId`
- **AND** no further turn advancement occurs

#### Scenario: Player plays last card in multi-round game — score limit reached
- **WHEN** a player plays a card and their hand becomes empty
- **AND** the player's updated cumulative score is greater than or equal to `scoreLimit`
- **THEN** the game status transitions to `ENDED`
- **AND** `winner` in `gameStateMap` is set to that player's `clientId`
- **AND** `endType` is set to `WIN`
- **AND** no further turn advancement occurs

#### Scenario: Player plays last card in multi-round game with Infinity limit
- **WHEN** a player plays a card and their hand becomes empty
- **AND** `scoreLimit` is positive infinity
- **AND** the same numeric threshold comparison logic is used (`newScore >= scoreLimit`)
- **THEN** the game status transitions to `ROUND_ENDED`
- **AND** `winner` in `gameStateMap` is set to that player's `clientId`
- **AND** `endType` is NOT set to score-threshold victory for this round outcome
- **AND** no further turn advancement occurs

#### Scenario: Win check timing
- **WHEN** the host executes a `PLAY_CARD` action
- **THEN** the host checks the player's remaining card count after removing the played card
- **AND** if the count is 0, the win condition is triggered before turn advancement
