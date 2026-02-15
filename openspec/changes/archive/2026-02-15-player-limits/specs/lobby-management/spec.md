## MODIFIED Requirements

### Requirement: Game Start Conditions

The system SHALL allow the Host to start the game ONLY when the number of connected players is between MIN_PLAYERS (3) and MAX_PLAYERS (10) inclusive. The StartGameButton SHALL display appropriate messaging for all states.

#### Scenario: Host attempts start with insufficient players

- **WHEN** fewer than MIN_PLAYERS (3) are connected
- **THEN** the "Start Game" button is disabled
- **AND** a message "Waiting for players (X/3)" is displayed

#### Scenario: Host starts with valid player count

- **WHEN** between MIN_PLAYERS (3) and MAX_PLAYERS (10) players are connected
- **THEN** the "Start Game" button is enabled
- **WHEN** the Host clicks "Start Game"
- **THEN** the game status changes to `PLAYING` for all connected peers

#### Scenario: Host attempts start with too many players

- **WHEN** more than MAX_PLAYERS (10) are connected
- **THEN** the "Start Game" button is disabled
- **AND** a message "Too many players (X/10 max)" is displayed

## ADDED Requirements

### Requirement: Room Capacity

The system SHALL prevent new players from joining a lobby that has reached MAX_PLAYERS capacity, except for replacement players joining during a pause. The system SHALL display an appropriate message to users attempting to join a full room.

#### Scenario: New player attempts to join full room

- **WHEN** a user navigates to a room with MAX_PLAYERS (10) already connected
- **AND** the game is in LOBBY status
- **THEN** the JoinGameModal displays "This game is full (10/10 players)"
- **AND** the name input and join button are hidden
- **AND** a message "Try creating a new game" is shown

#### Scenario: Replacement player joins during pause

- **WHEN** a room has MAX_PLAYERS (10) in lockedPlayers
- **AND** one player has disconnected (creating an orphan hand)
- **AND** the game is in PAUSED_WAITING_PLAYER status
- **THEN** a new player CAN join to fill the orphan slot
- **AND** they are matched to the orphan hand via name similarity
- **AND** the total lockedPlayers count remains at 10

#### Scenario: Game already started takes precedence

- **WHEN** a user navigates to a room with an active game in PLAYING, ROUND_ENDED, or ENDED status
- **AND** the room also happens to be at MAX_PLAYERS capacity
- **THEN** the GameAlreadyStartedModal is displayed
- **AND** the "Game Full" message is NOT shown (game status takes precedence)
