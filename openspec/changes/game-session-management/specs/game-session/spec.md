## ADDED Requirements

### Requirement: Player Disconnection Detection

The system SHALL detect when a player disconnects by comparing current WebRTC awareness state against the `lockedPlayers` array.

#### Scenario: Single player disconnects

- **WHEN** a player's awareness state disappears from the WebRTC mesh
- **AND** the current connected player count is less than `lockedPlayers.length`
- **THEN** the system identifies the disconnected player by finding which `lockedPlayers` entry has no matching awareness state
- **THEN** the disconnected player's hand is flagged as orphaned

#### Scenario: Multiple players disconnect simultaneously

- **WHEN** multiple players' awareness states disappear simultaneously
- **THEN** the system identifies all disconnected players
- **THEN** each disconnected player's hand is flagged as orphaned

### Requirement: Game Pause State

The system SHALL pause the game when players disconnect and store the orphaned hands for potential handover.

#### Scenario: Game pauses on disconnect

- **WHEN** one or more players disconnect during a `PLAYING` game
- **THEN** the host sets `gameState.status` to `PAUSED_WAITING_PLAYER`
- **THEN** the host stores orphaned hands in local state: `{ slotIndex, originalName, cards }[]`
- **THEN** game turns are frozen (no turn progression occurs)

#### Scenario: Turn preservation during pause

- **WHEN** the disconnected player was the current turn holder
- **THEN** the `currentTurn` pointer remains on that player's slot
- **THEN** no timeout or turn skipping occurs until the situation is resolved

### Requirement: Waiting for Player Modal

The system SHALL display a modal to all players when the game is paused waiting for disconnected players.

#### Scenario: Modal displays for all players

- **WHEN** `gameState.status` is `PAUSED_WAITING_PLAYER`
- **THEN** all connected players see a modal overlay
- **THEN** the modal displays: "Game paused - waiting for player(s) to rejoin"
- **THEN** the modal shows the disconnected player(s) name and avatar

#### Scenario: Host sees continue option

- **WHEN** the current player is the host
- **AND** the game is paused waiting for players
- **THEN** the host sees a button for each disconnected player: "Continue without [player name]"

#### Scenario: Non-host sees waiting state

- **WHEN** a non-host player views the paused game
- **THEN** they see the waiting message without the "Continue without" buttons
- **THEN** they see a message: "Waiting for host to continue..."

### Requirement: Player Replacement via Name Matching

The system SHALL automatically assign orphaned hands to replacement players based on name similarity.

#### Scenario: Replacement player joins with matching name

- **WHEN** a new player connects to a paused game
- **AND** the host calculates name similarity between the new player's name and each orphaned hand's `originalName`
- **AND** the similarity ratio is at least 75% (using Levenshtein distance / max length)
- **THEN** the host assigns the matching orphan hand to the new player's slot
- **THEN** the host removes the entry from local `orphanHands` state

#### Scenario: Replacement player joins without matching name

- **WHEN** a new player connects to a paused game
- **AND** no orphan hand has a name similarity of at least 75%
- **THEN** the host assigns the first available orphan hand to the new player's slot
- **THEN** the host removes the entry from local `orphanHands` state

#### Scenario: Game resumes when all orphans assigned

- **WHEN** the last orphan hand is assigned to a replacement player
- **THEN** the host sets `gameState.status` to `PLAYING`
- **THEN** the game resumes normal turn progression

### Requirement: Host Continue Without Option

The system SHALL allow the host to remove disconnected players and continue the game without them.

#### Scenario: Host continues without disconnected player

- **WHEN** the host clicks "Continue without [player name]"
- **THEN** the orphan hand for that player is reshuffled into the deck
- **THEN** the deck count is updated accordingly
- **THEN** the entry is removed from local `orphanHands` state

#### Scenario: Skip turn when removing current player

- **WHEN** the host removes a disconnected player
- **AND** that player was the current turn holder
- **THEN** the turn advances to the next player in turn order
- **THEN** the removed player's slot is removed from `turnOrder`

#### Scenario: Game resumes after host removal

- **WHEN** the host removes the last disconnected player (or all are removed)
- **THEN** the host sets `gameState.status` to `PLAYING`
- **THEN** the game resumes with remaining players

### Requirement: Win by Walkover

The system SHALL declare a winner immediately if all other players disconnect.

#### Scenario: Single player remains

- **WHEN** all players except one have disconnected
- **AND** the game status is `PLAYING`
- **THEN** the game status is set to `ENDED`
- **THEN** the remaining player is declared the winner
- **THEN** the win reason is recorded as "walkover"

#### Scenario: Walkover winner display

- **WHEN** a player wins by walkover
- **THEN** they see a special win screen: "You win! All other players disconnected."
- **THEN** the win is recorded in game history

### Requirement: Host Disconnection Ends Game

The system SHALL end the game immediately if the host disconnects.

#### Scenario: Host disconnects during paused game

- **WHEN** the host disconnects while the game is paused
- **THEN** the game ends for all remaining players
- **THEN** remaining players see: "Game ended - host disconnected"
- **THEN** no host migration occurs (architectural constraint)
