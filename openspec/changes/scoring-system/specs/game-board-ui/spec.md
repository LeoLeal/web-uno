## ADDED Requirements

### Requirement: Opponent score display
The system SHALL display each opponent's cumulative score next to their avatar during multi-round games.

#### Scenario: Score shown below opponent name
- **WHEN** the game is a multi-round game (`scoreLimit !== null`)
- **AND** an opponent's score is available in `gameStateMap.scores`
- **THEN** the opponent's cumulative score is displayed below their name in the `OpponentIndicator` component
- **AND** the score is formatted as a number followed by "pts" (e.g., "42 pts")

#### Scenario: Score hidden in single-round games
- **WHEN** the game is a single-round game (`scoreLimit === null`)
- **THEN** no score is displayed on opponent indicators

#### Scenario: Score of zero
- **WHEN** a multi-round game has just started (round 1, no rounds completed)
- **THEN** opponent scores display "0 pts"

### Requirement: Player score display
The system SHALL display the current player's own cumulative score in their hand area during multi-round games.

#### Scenario: Player score in header area
- **WHEN** the game is a multi-round game (`scoreLimit !== null`)
- **THEN** the player's cumulative score is displayed near the turn indicator in the `PlayerHand` area
- **AND** the score is formatted consistently with opponent scores (e.g., "42 pts")

#### Scenario: Player score hidden in single-round games
- **WHEN** the game is a single-round game (`scoreLimit === null`)
- **THEN** no score is displayed in the player's hand area

### Requirement: Round end modal
The system SHALL display a modal when a round ends in a multi-round game, showing round results and standings.

#### Scenario: Round end modal appears
- **WHEN** the game status changes to `ROUND_ENDED`
- **THEN** all players see a modal displaying round results
- **AND** the game board is visible but non-interactive behind the modal

#### Scenario: Round end modal content
- **WHEN** the round end modal is displayed
- **THEN** it shows the round winner's name
- **AND** it shows the points gained this round by the winner
- **AND** it shows the current standings (all players sorted by cumulative score, descending)
- **AND** it shows the configured score limit target

#### Scenario: Host controls in round end modal
- **WHEN** the host views the round end modal
- **THEN** a "Next Round" button is displayed
- **AND** clicking the button triggers the round initialization flow

#### Scenario: Guest view of round end modal
- **WHEN** a non-host player views the round end modal
- **THEN** they see the round results and standings
- **AND** they do NOT see the "Next Round" button
- **AND** they see a message indicating the host will start the next round

### Requirement: Game end modal with standings
The system SHALL display final standings in the game end modal for multi-round games.

#### Scenario: Multi-round game end modal
- **WHEN** the game status changes to `ENDED` in a multi-round game
- **AND** a player has reached the score limit
- **THEN** the modal shows the overall winner's name
- **AND** the modal shows final standings with all players' cumulative scores sorted descending
- **AND** the modal includes a "Back to Lobby" action

#### Scenario: Single-round game end modal unchanged
- **WHEN** the game status changes to `ENDED` in a single-round game (`scoreLimit === null`)
- **THEN** the existing game end modal behavior is preserved (win/loss message, no scores)

#### Scenario: Walkover game end modal in multi-round
- **WHEN** the game ends as a walkover during a multi-round game
- **THEN** the modal indicates a walkover victory
- **AND** the modal shows current cumulative scores at the time of walkover

## MODIFIED Requirements

### Requirement: Waiting for Player Modal
The system SHALL display a modal overlay when the game is paused due to player disconnection.

#### Scenario: Modal appears on pause
- **WHEN** the game status changes to `PAUSED_WAITING_PLAYER`
- **THEN** all players see a modal: "Game paused — waiting for a player to rejoin"
- **AND** the modal displays the name(s) and avatar(s) of disconnected player(s)
- **AND** the game board is visible but non-interactive behind the modal

#### Scenario: Host controls in modal
- **WHEN** the host views the Waiting for Player modal
- **THEN** a "Continue without [player name]" button is shown for each disconnected player
- **AND** clicking the button triggers the orphan hand removal flow

#### Scenario: Guest view of modal
- **WHEN** a non-host player views the Waiting for Player modal
- **THEN** they see the disconnected player information
- **AND** they do NOT see the "Continue without" buttons
- **AND** they see a message indicating the host will resolve the situation

#### Scenario: Modal dismisses on resume
- **WHEN** all orphan hands are resolved (replaced or removed)
- **AND** the game status returns to `PLAYING` or `ROUND_ENDED` (restored from `statusBeforePause`)
- **THEN** the modal closes automatically
- **AND** the appropriate UI is restored (gameplay or round-end modal)
