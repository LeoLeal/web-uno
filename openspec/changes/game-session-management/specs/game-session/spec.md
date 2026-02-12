## ADDED Requirements

### Requirement: Player Disconnection Detection

The system SHALL detect player disconnections during gameplay by comparing active Yjs awareness states against the `lockedPlayers` list. Detection SHALL be performed by the host only.

#### Scenario: Single player disconnects

- **WHEN** a player's awareness state disappears during `PLAYING` status
- **AND** the number of active awareness peers with clientIds in `lockedPlayers` drops below `lockedPlayers.length`
- **THEN** the host identifies the missing player by diffing awareness against `lockedPlayers`
- **AND** the host triggers the game pause flow

#### Scenario: Multiple players disconnect simultaneously

- **WHEN** two or more locked players lose awareness at the same time
- **THEN** the host detects all missing players in a single awareness change event
- **AND** all disconnected players are tracked as orphans

#### Scenario: Non-locked player disconnects

- **WHEN** a peer who is NOT in `lockedPlayers` loses awareness (e.g., a late joiner observer)
- **THEN** no pause is triggered
- **AND** the game continues normally

### Requirement: Game Pause on Disconnection

The system SHALL pause the game when a locked player disconnects, setting status to `PAUSED_WAITING_PLAYER`.

#### Scenario: Transition to paused state

- **WHEN** the host detects a locked player disconnect during `PLAYING` status
- **THEN** the host sets `gameState.status` to `PAUSED_WAITING_PLAYER`
- **AND** no turns progress while paused
- **AND** all players see the paused state

#### Scenario: Turn frozen during pause

- **WHEN** the disconnected player was the current turn holder
- **THEN** `currentTurn` remains set to the disconnected player's clientId
- **AND** no other player can take a turn

#### Scenario: Already paused when another disconnects

- **WHEN** the game is already in `PAUSED_WAITING_PLAYER` status
- **AND** an additional locked player disconnects
- **THEN** the new disconnect is added to orphan tracking
- **AND** the game remains paused

### Requirement: Orphan Hand Tracking

The system SHALL store disconnected players' hands as orphan hands in the Yjs `gameState` map for handover or removal.

#### Scenario: Orphan hand creation

- **WHEN** the host detects a player disconnect
- **THEN** the host reads the disconnected player's cards from the `dealtHands` Y.Map
- **AND** the host writes an entry to `orphanHands` in `gameState`: `{ originalClientId, originalName, cards }`
- **AND** the orphan hand is available for assignment to a replacement player

#### Scenario: Multiple orphan hands

- **WHEN** multiple players disconnect
- **THEN** each disconnected player has a separate entry in `orphanHands`
- **AND** entries are ordered by disconnection time

### Requirement: Player Replacement via Hand Handover

The system SHALL allow a new player joining during a pause to receive an orphaned hand, matched by name similarity.

#### Scenario: Replacement player joins during pause

- **WHEN** a new player joins the room while status is `PAUSED_WAITING_PLAYER`
- **AND** there are unassigned orphan hands
- **THEN** the host matches the new player to the closest orphan hand by Levenshtein name distance
- **AND** the orphan's cards are written to the new player's `dealtHands` entry
- **AND** the new player is added to `lockedPlayers` replacing the original player
- **AND** `turnOrder` is updated to replace the original clientId with the new clientId
- **AND** the orphan entry is removed from `orphanHands`

#### Scenario: All orphan hands assigned

- **WHEN** the last orphan hand is assigned to a replacement player
- **THEN** the host sets `gameState.status` back to `PLAYING`
- **AND** normal gameplay resumes

#### Scenario: Replacement inherits current turn

- **WHEN** the orphan being replaced was the current turn holder
- **AND** a replacement player takes over that hand
- **THEN** `currentTurn` is updated to the replacement player's clientId

### Requirement: Host Continue Without Player

The system SHALL allow the host to remove a disconnected player and continue the game without them.

#### Scenario: Host removes disconnected player

- **WHEN** the host clicks "Continue without [player]" for an orphan hand
- **THEN** the orphan's cards are reshuffled into the host's deck
- **AND** the orphan entry is removed from `orphanHands`
- **AND** `playerCardCounts` is updated to remove the disconnected player
- **AND** the disconnected player's clientId is removed from `turnOrder`

#### Scenario: Removed player was current turn

- **WHEN** the removed player was the current turn holder
- **THEN** `currentTurn` advances to the next player in `turnOrder`

#### Scenario: All orphans resolved via removal

- **WHEN** the last orphan hand is removed (not replaced)
- **AND** more than one player remains
- **THEN** the host sets `gameState.status` back to `PLAYING`
- **AND** normal gameplay resumes

### Requirement: Win by Walkover

The system SHALL declare a winner when all other players disconnect, awarding a win by walkover (W/O).

#### Scenario: Last player standing

- **WHEN** all locked players except one have disconnected or been removed
- **THEN** the host sets `gameState.status` to `ENDED`
- **AND** the remaining player is recorded as the winner
- **AND** a walkover victory is indicated

#### Scenario: Walkover during pause resolution

- **WHEN** the host removes disconnected players via "Continue without"
- **AND** only one player remains after removal
- **THEN** the game ends immediately as a walkover win for the remaining player
