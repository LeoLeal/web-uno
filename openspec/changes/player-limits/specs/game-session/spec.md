## MODIFIED Requirements

### Requirement: Player Replacement via Hand Handover

The system SHALL allow a new player joining during a pause to receive an orphaned hand, matched by name similarity. In multi-round games, the replacement player also inherits the original player's cumulative score. Replacement players bypass the MAX_PLAYERS limit because they fill existing orphan slots rather than adding new capacity.

#### Scenario: Replacement player joins during pause

- **WHEN** a new player joins the room while status is `PAUSED_WAITING_PLAYER`
- **AND** there are unassigned orphan hands
- **THEN** the host matches the new player to the closest orphan hand by Levenshtein name distance
- **AND** the orphan's cards are written to the new player's `dealtHands` entry
- **AND** the new player is added to `lockedPlayers` replacing the original player
- **AND** `turnOrder` is updated to replace the original clientId with the new clientId
- **AND** the orphan entry is removed from `orphanHands`
- **AND** this bypasses MAX_PLAYERS validation (filling an orphan slot, not adding capacity)

#### Scenario: Replacement inherits cumulative score

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

## MODIFIED Requirements

### Requirement: Host Continue Without Player

The system SHALL allow the host to remove a disconnected player and continue the game without them. If removing a player would result in fewer than MIN_PLAYERS remaining, the game SHALL end instead with an appropriate message.

#### Scenario: Host removes disconnected player

- **WHEN** the host clicks "Continue without [player]" for an orphan hand
- **AND** more than MIN_PLAYERS would remain after removal
- **THEN** the orphan's cards are reshuffled into the host's deck
- **AND** the orphan entry is removed from `orphanHands`
- **AND** `playerCardCounts` is updated to remove the disconnected player
- **AND** the disconnected player's clientId is removed from `turnOrder`

#### Scenario: Removed player was current turn

- **WHEN** the removed player was the current turn holder
- **THEN** `currentTurn` advances to the next player in `turnOrder`

#### Scenario: All orphans resolved via removal

- **WHEN** the last orphan hand is removed (not replaced)
- **AND** at least MIN_PLAYERS remain
- **THEN** the host sets `gameState.status` to the value stored in `gameStateMap.statusBeforePause`
- **AND** `gameStateMap.statusBeforePause` is set to `null`

#### Scenario: Removal results in insufficient players

- **WHEN** the host removes a disconnected player via "Continue without"
- **AND** fewer than MIN_PLAYERS would remain after removal
- **THEN** the game ends immediately
- **AND** `gameState.status` is set to `ENDED`
- **AND** `gameState.endType` is set to "INSUFFICIENT_PLAYERS"
- **AND** `gameState.winner` is set to `null` (no winner)
- **AND** all players see a "Not enough players to continue" message

## REMOVED Requirements

### Requirement: Win by Walkover

**Reason**: With MIN_PLAYERS set to 3, walkover victory is no longer possible. When removing players would drop below MIN_PLAYERS, the game ends with "INSUFFICIENT_PLAYERS" instead. The game can never reach a state where only one player remains.

**Migration**: Games that drop below minimum player count now end without a winner. Players must start a new game.

#### Scenario: Walkover via host removal (REMOVED)

- **WHEN** the host removes disconnected players via "Continue without"
- **AND** only one player remains after removal
- **THEN** the host sets `gameState.status` to `ENDED`
- **AND** the remaining player is recorded as the winner
- **AND** a walkover victory is indicated

#### Scenario: Walkover in multi-round game (REMOVED)

- **WHEN** a walkover occurs during a multi-round game
- **THEN** the game status is set to `ENDED` (not `ROUND_ENDED`)
- **AND** the game is over regardless of current scores
