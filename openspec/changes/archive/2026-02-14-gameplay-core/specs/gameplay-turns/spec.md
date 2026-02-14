## ADDED Requirements

### Requirement: Turn advancement
The system SHALL advance the turn to the next player after each action is executed.

#### Scenario: Normal turn advancement
- **WHEN** a player plays a number card or draws a card
- **THEN** the turn advances to the next player in `turnOrder` following the current `direction`

#### Scenario: Clockwise direction
- **WHEN** direction is `1` (clockwise)
- **THEN** the next player is the next index in `turnOrder` (wrapping to 0 after the last index)

#### Scenario: Counter-clockwise direction
- **WHEN** direction is `-1` (counter-clockwise)
- **THEN** the next player is the previous index in `turnOrder` (wrapping to the last index from 0)

### Requirement: Skip card effect on turns
The system SHALL skip the next player's turn when a Skip card is played.

#### Scenario: Skip advances past next player
- **WHEN** a player plays a Skip card
- **THEN** the turn advances past the next player in the current direction
- **AND** the skipped player does not get to act

#### Scenario: Skip in two-player game
- **WHEN** a player plays a Skip card in a two-player game
- **THEN** the playing player effectively gets another turn

### Requirement: Reverse card effect on turns
The system SHALL reverse the play direction when a Reverse card is played.

#### Scenario: Reverse changes direction
- **WHEN** a player plays a Reverse card
- **THEN** the direction changes from `1` to `-1` or from `-1` to `1`
- **AND** the turn advances one position in the new direction

#### Scenario: Reverse in two-player game
- **WHEN** a player plays a Reverse card in a two-player game
- **THEN** the Reverse acts as a Skip (the playing player effectively gets another turn)
- **AND** the direction still flips

### Requirement: Draw Two effect on turns
The system SHALL skip the next player's turn when a Draw Two is played.

#### Scenario: Draw Two skips next player
- **WHEN** a player plays a Draw Two card
- **THEN** the next player in the current direction is dealt 2 cards from the deck
- **AND** the next player's turn is skipped
- **AND** the turn advances to the player after the skipped player

### Requirement: Wild Draw Four effect on turns
The system SHALL skip the next player's turn when a Wild Draw Four is played.

#### Scenario: Wild Draw Four skips next player
- **WHEN** a player plays a Wild Draw Four card
- **THEN** the next player in the current direction is dealt 4 cards from the deck
- **AND** the next player's turn is skipped
- **AND** the turn advances to the player after the skipped player

### Requirement: Turn state in game state
The system SHALL track the current turn and direction in the shared game state.

#### Scenario: Current turn identifies active player
- **WHEN** the game is in PLAYING status
- **THEN** `currentTurn` in `gameStateMap` contains the `clientId` of the player who must act

#### Scenario: Direction tracks play order
- **WHEN** the game is in PLAYING status
- **THEN** `direction` in `gameStateMap` is `1` (clockwise) or `-1` (counter-clockwise)

### Requirement: Turn frozen during pause
The system SHALL not advance turns when the game is paused.

#### Scenario: No turn changes while paused
- **WHEN** the game status is `PAUSED_WAITING_PLAYER`
- **THEN** no actions are processed
- **AND** `currentTurn` does not change
