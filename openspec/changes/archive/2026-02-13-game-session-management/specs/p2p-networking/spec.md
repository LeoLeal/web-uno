## MODIFIED Requirements

### Requirement: Public Game State Sync

The system SHALL sync public game state (discard pile, turn, card counts, orphan hands) via Yjs shared document.

#### Scenario: Public state fields

- **WHEN** the game state is updated
- **THEN** the following are synced via Yjs `gameState` map:
  - `currentTurn`: clientId of whose turn it is
  - `direction`: play direction (1 or -1)
  - `discardPile`: array of visible discard cards
  - `playerCardCounts`: map of clientId to card count
  - `turnOrder`: ordered array of player clientIds
  - `orphanHands`: array of `{ originalClientId, originalName, cards }` for disconnected players

#### Scenario: All peers see same state

- **WHEN** any peer reads the public game state
- **THEN** they see the same discard pile top card
- **AND** they see the same current turn indicator
- **AND** they see correct card counts for all players
- **AND** they see the same orphan hand data (if any)

### Requirement: Lobby Lock

The system SHALL lock the player list when the game starts and reject late joiners, except during a pause when replacement players are allowed.

#### Scenario: Lock player list on game start

- **WHEN** the host starts the game
- **THEN** the system stores `lockedPlayers` array in Yjs shared state
- **AND** each entry contains `{ clientId, name }` for all current players
- **AND** the locked player count is the length of this array

#### Scenario: Late joiner detection

- **WHEN** a new peer connects to the room
- **AND** the game status is `PLAYING`
- **AND** the peer's clientId is NOT in `lockedPlayers`
- **THEN** the peer is considered a "late joiner"

#### Scenario: Late joiner rejection

- **WHEN** a late joiner is detected
- **AND** the game status is `PLAYING` (not paused)
- **THEN** the late joiner sees a modal: "Game Already Started - You cannot join this game"
- **AND** the modal has a button to return to the home page
- **AND** the late joiner is NOT added to the game

#### Scenario: Replacement player during pause

- **WHEN** a new peer connects to the room
- **AND** the game status is `PAUSED_WAITING_PLAYER`
- **AND** the peer's clientId is NOT in `lockedPlayers`
- **AND** there are unassigned orphan hands
- **THEN** the peer is treated as a potential replacement player
- **AND** the host assigns them an orphan hand

## ADDED Requirements

### Requirement: Extended Game Status

The system SHALL support the `PAUSED_WAITING_PLAYER` game status in addition to existing statuses (`LOBBY`, `PLAYING`, `ENDED`).

#### Scenario: Status type definition

- **WHEN** the system defines `GameStatus`
- **THEN** the type SHALL be `'LOBBY' | 'PLAYING' | 'PAUSED_WAITING_PLAYER' | 'ENDED'`

#### Scenario: Peers observe pause status

- **WHEN** the host sets `gameState.status` to `PAUSED_WAITING_PLAYER`
- **THEN** all peers observe the status change via Yjs
- **AND** all peers react to the paused state (freeze UI, show modal)
