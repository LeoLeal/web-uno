## MODIFIED Requirements

### Requirement: Game Pause on Disconnection
The system SHALL pause the game when a locked player disconnects, setting status to `PAUSED_WAITING_PLAYER` and storing the previous status for later restoration.

#### Scenario: Transition to paused state from PLAYING
- **WHEN** the host detects a locked player disconnect during `PLAYING` status
- **THEN** the host sets `gameStateMap.statusBeforePause` to `PLAYING`
- **AND** the host sets `gameStateMap.status` to `PAUSED_WAITING_PLAYER`
- **AND** no turns progress while paused
- **AND** all players see the paused state

#### Scenario: Transition to paused state from ROUND_ENDED
- **WHEN** the host detects a locked player disconnect during `ROUND_ENDED` status
- **THEN** the host sets `gameStateMap.statusBeforePause` to `ROUND_ENDED`
- **AND** the host sets `gameStateMap.status` to `PAUSED_WAITING_PLAYER`

#### Scenario: Turn frozen during pause
- **WHEN** the disconnected player was the current turn holder
- **THEN** `currentTurn` remains set to the disconnected player's clientId
- **AND** no other player can take a turn

#### Scenario: Already paused when another disconnects
- **WHEN** the game is already in `PAUSED_WAITING_PLAYER` status
- **AND** an additional locked player disconnects
- **AND** the player is not already tracked in `orphanHands`
- **THEN** the new disconnect is added to orphan tracking
- **AND** the game remains paused
- **AND** `statusBeforePause` is not overwritten (preserves the original pre-pause status)

### Requirement: Player Replacement via Hand Handover
The system SHALL allow a new player joining during a pause to receive an orphaned hand, matched by name similarity. In multi-round games, the replacement player also inherits the original player's cumulative score.

#### Scenario: Replacement player joins during pause
- **WHEN** a new player joins the room while status is `PAUSED_WAITING_PLAYER`
- **AND** there are unassigned orphan hands
- **THEN** the host matches the new player to the closest orphan hand by Levenshtein name distance
- **AND** the orphan's cards are written to the new player's `dealtHands` entry
- **AND** the new player is added to `lockedPlayers` replacing the original player
- **AND** `turnOrder` is updated to replace the original clientId with the new clientId
- **AND** the orphan entry is removed from `orphanHands`

#### Scenario: Replacement player inherits cumulative score
- **WHEN** a replacement player takes over an orphaned seat in a multi-round game
- **AND** `gameStateMap.scores` exists
- **THEN** the host copies `scores[originalClientId]` to `scores[newClientId]`
- **AND** the host deletes `scores[originalClientId]`
- **AND** the updated scores map is written to `gameStateMap`

#### Scenario: All orphan hands assigned
- **WHEN** the last orphan hand is assigned to a replacement player
- **THEN** the host sets `gameState.status` to the value stored in `gameStateMap.statusBeforePause`
- **AND** `gameStateMap.statusBeforePause` is set to `null`
- **AND** gameplay or round-end state is restored

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
- **THEN** the host sets `gameState.status` to the value stored in `gameStateMap.statusBeforePause`
- **AND** `gameStateMap.statusBeforePause` is set to `null`

### Requirement: Win by Walkover
The system SHALL declare a winner by walkover only when the host explicitly removes all opponents via "Continue without". In multi-round games, walkover ends the entire game, not just the current round.

#### Scenario: Walkover via host removal
- **WHEN** the host removes disconnected players via "Continue without"
- **AND** only one player remains after removal
- **THEN** the host sets `gameState.status` to `ENDED`
- **AND** the remaining player is recorded as the winner
- **AND** a walkover victory is indicated

#### Scenario: Walkover in multi-round game
- **WHEN** a walkover occurs during a multi-round game
- **THEN** the game status is set to `ENDED` (not `ROUND_ENDED`)
- **AND** the game is over regardless of current scores

#### Scenario: All opponents disconnect (no auto-walkover)
- **WHEN** all locked players except one have disconnected
- **THEN** the game remains in `PAUSED_WAITING_PLAYER` status
- **AND** the host sees "Continue without" buttons for each disconnected player
- **AND** disconnected players may still rejoin and reclaim their hands
- **AND** walkover is NOT automatically triggered
