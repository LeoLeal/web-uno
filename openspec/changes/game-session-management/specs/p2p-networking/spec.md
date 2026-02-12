## MODIFIED Requirements

### Requirement: Public Game State Sync

The system SHALL sync public game state (discard pile, turn, card counts) via Yjs shared document.

#### Scenario: Public state fields

- **WHEN** the game state is updated
- **THEN** the following are synced via Yjs `gameState` map:
  - `currentTurn`: clientId of whose turn it is
  - `direction`: play direction (1 or -1)
  - `discardPile`: array of visible discard cards
  - `playerCardCounts`: map of clientId to card count
  - `turnOrder`: ordered array of player clientIds
  - `status`: game status (`WAITING`, `PLAYING`, `PAUSED_WAITING_PLAYER`, `ENDED`)

#### Scenario: All peers see same state

- **WHEN** any peer reads the public game state
- **THEN** they see the same discard pile top card
- **AND** they see the same current turn indicator
- **AND** they see correct card counts for all players
- **AND** they see the same game status

### Requirement: Lobby Lock

The system SHALL lock the player list when the game starts and handle late joiners based on game status.

#### Scenario: Lock player list on game start

- **WHEN** the host starts the game
- **THEN** the system stores `lockedPlayers` array in Yjs shared state
- **AND** each entry contains `{ clientId, name }` for all current players
- **AND** the locked player count is the length of this array

#### Scenario: Late joiner detection during paused game

- **WHEN** a new peer connects to the room
- **AND** the game status is `PAUSED_WAITING_PLAYER`
- **THEN** the peer is considered a "replacement player"
- **THEN** the host evaluates them for orphan hand assignment

#### Scenario: Late joiner rejection during active game

- **WHEN** a new peer connects to the room
- **AND** the game status is `PLAYING`
- **AND** the peer's clientId is NOT in `lockedPlayers`
- **THEN** the peer is considered a "late joiner"

#### Scenario: Late joiner rejection

- **WHEN** a late joiner is detected
- **THEN** the late joiner sees a modal: "Game Already Started - You cannot join this game"
- **AND** the modal has a button to return to the home page
- **AND** the late joiner is NOT added to the game

## ADDED Requirements

### Requirement: Game Status Values

The system SHALL support extended game status values in the `gameState.status` field.

#### Scenario: Status enum values

- **WHEN** the game state is initialized
- **THEN** the `status` field supports the following values:
  - `WAITING`: Lobby phase, waiting for players
  - `PLAYING`: Active gameplay
  - `PAUSED_WAITING_PLAYER`: Game paused due to player disconnect, waiting for replacement
  - `ENDED`: Game has concluded

#### Scenario: Status transitions

- **WHEN** the game transitions between states
- **THEN** the status update is atomic via Yjs transaction
- **THEN** all peers receive the status change

### Requirement: Replacement Player Acceptance

The system SHALL accept replacement players when the game is paused.

#### Scenario: Replacement player joins paused game

- **WHEN** a new peer connects while `status` is `PAUSED_WAITING_PLAYER`
- **THEN** the system accepts the connection
- **THEN** the host receives awareness of the new peer
- **THEN** the host can assign an orphan hand to the replacement player
