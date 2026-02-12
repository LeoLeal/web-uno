## ADDED Requirements

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
- **AND** the game status returns to `PLAYING`
- **THEN** the modal closes automatically
- **AND** normal gameplay UI is restored

### Requirement: Win by Walkover Modal

The system SHALL display a victory modal when a player wins by walkover.

#### Scenario: Winner sees walkover modal

- **WHEN** all other players disconnect and the game ends as a walkover
- **THEN** the remaining player sees a modal: "You win! All other players disconnected."
- **AND** the modal has a "Back to Lobby" or "Return Home" action

#### Scenario: Walkover visual distinction

- **WHEN** displaying the walkover win modal
- **THEN** the modal visually distinguishes a walkover from a normal win (e.g., different icon or message)

### Requirement: Disconnected Player Indicator

The system SHALL visually indicate disconnected opponents on the game board.

#### Scenario: Opponent disconnect indicator

- **WHEN** a locked opponent loses their awareness connection
- **AND** the game is in `PAUSED_WAITING_PLAYER` status
- **THEN** the opponent's avatar is dimmed or greyed out
- **AND** a disconnection icon (e.g., a broken link or X) is overlaid on their avatar

#### Scenario: Reconnected/replaced player indicator

- **WHEN** a replacement player takes over an orphaned hand
- **THEN** the avatar updates to show the new player's name and avatar
- **AND** the dimming/disconnect indicator is removed
