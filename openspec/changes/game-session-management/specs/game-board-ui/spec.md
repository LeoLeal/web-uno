## ADDED Requirements

### Requirement: Game Pause Modal

The system SHALL display a modal overlay when the game is paused waiting for disconnected players.

#### Scenario: Pause modal appears

- **WHEN** `gameState.status` changes to `PAUSED_WAITING_PLAYER`
- **THEN** a modal overlay appears covering the game board
- **THEN** the modal prevents interaction with game elements
- **THEN** the modal displays the title: "Game Paused"

#### Scenario: Pause modal content

- **WHEN** the pause modal is displayed
- **THEN** it shows the message: "Waiting for player(s) to rejoin"
- **THEN** it lists all disconnected players with their avatar and name
- **THEN** disconnected players are visually distinguished (e.g., grayed out avatar)

#### Scenario: Host pause modal with actions

- **WHEN** the host views the pause modal
- **THEN** for each disconnected player, a button displays: "Continue without [player name]"
- **THEN** clicking the button removes that player and reshuffles their hand

#### Scenario: Non-host pause modal

- **WHEN** a non-host player views the pause modal
- **THEN** they see the waiting message and disconnected player list
- **THEN** they see a message: "Waiting for host to continue..."
- **THEN** no action buttons are shown

### Requirement: Disconnection Indicators

The system SHALL visually indicate when opponents have disconnected.

#### Scenario: Opponent disconnection indicator

- **WHEN** an opponent disconnects during gameplay
- **THEN** their avatar is visually marked as disconnected (e.g., gray overlay, offline icon)
- **THEN** their card count continues to display
- **THEN** the disconnection indicator persists until the player is removed or replaced

#### Scenario: Current player disconnection awareness

- **WHEN** the current player disconnects and reconnects
- **THEN** upon reconnection, they see the pause modal if the game is still paused
- **THEN** they are treated as a replacement player (new session = new identity)

### Requirement: Walkover Win Modal

The system SHALL display a special win screen when a player wins by walkover.

#### Scenario: Walkover win display

- **WHEN** a player wins because all opponents disconnected
- **THEN** the game ends and shows a win modal
- **THEN** the modal displays: "You win! All other players disconnected."
- **THEN** the modal includes a button to return to the home page

#### Scenario: Walkover win styling

- **WHEN** the walkover win modal is displayed
- **THEN** it uses the same styling as the regular win modal
- **THEN** the message clearly indicates the walkover nature of the win
